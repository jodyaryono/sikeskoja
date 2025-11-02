# SiKesKoja Deployment Script
# Target: sikeskoja.portnumbay.id (103.185.52.124)

$ErrorActionPreference = "Stop"

# Configuration
$SSH_HOST = "sikeskoja"
$REMOTE_DIR = "/var/www/sikeskoja"
$DOMAIN = "sikeskoja.portnumbay.id"
$DB_NAME = "sikeskoja_db"
$DB_USER = "sikeskoja_user"
$DB_PASSWORD = "Sikeskoja@2025#DB"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SiKesKoja Deployment Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the application locally
Write-Host "[1/8] Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build completed successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Create deployment package
Write-Host "[2/8] Creating deployment package..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$deployPackage = "sikeskoja_deploy_$timestamp.tar.gz"

# Create list of files to include
$filesToInclude = @(
    "dist/*",
    "client/build/*",
    "prisma/*",
    "package.json",
    "package-lock.json",
    ".env.production",
    "uploads/"
)

# Create .env.production if not exists
if (-not (Test-Path ".env.production")) {
    @"
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"
DB_HOST=localhost
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# JWT Configuration
JWT_SECRET=$(([char[]]([char]'a'..[char]'z') + ([char[]]([char]'A'..[char]'Z')) + 0..9 | Get-Random -Count 32) -join '')
JWT_EXPIRES_IN=7d

# WhatsApp OTP Configuration
WHATSAPP_DEVICE_ID=59087f966f4f8cc3385569ef6481cc29
OTP_EXPIRES_IN=5
OTP_LENGTH=6

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# Application Configuration
API_BASE_URL=https://$DOMAIN/api
CLIENT_URL=https://$DOMAIN

# Pagination Configuration
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
"@ | Out-File -FilePath ".env.production" -Encoding UTF8
}

Write-Host "✓ Deployment package prepared" -ForegroundColor Green
Write-Host ""

# Step 3: Check server prerequisites
Write-Host "[3/8] Checking server prerequisites..." -ForegroundColor Yellow

$checkScript = @"
#!/bin/bash
set -e

echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi
node --version

echo "Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
fi
psql --version

echo "Checking Nginx..."
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
fi
nginx -v

echo "Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi
pm2 --version

echo "All prerequisites installed!"
"@

$checkScript | ssh $SSH_HOST "cat > /tmp/check_prereq.sh && chmod +x /tmp/check_prereq.sh && bash /tmp/check_prereq.sh"
Write-Host "✓ Server prerequisites checked/installed" -ForegroundColor Green
Write-Host ""

# Step 4: Setup PostgreSQL database
Write-Host "[4/8] Setting up PostgreSQL database..." -ForegroundColor Yellow

$dbScript = @"
#!/bin/bash
set -e

# Create database user if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Create database if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"

echo "Database setup completed!"
"@

$dbScript | ssh $SSH_HOST "cat > /tmp/setup_db.sh && chmod +x /tmp/setup_db.sh && bash /tmp/setup_db.sh"
Write-Host "✓ PostgreSQL database setup completed" -ForegroundColor Green
Write-Host ""

# Step 5: Create remote directory and upload files
Write-Host "[5/8] Uploading files to server..." -ForegroundColor Yellow

ssh $SSH_HOST "mkdir -p $REMOTE_DIR"

# Upload files using rsync or scp
Write-Host "Uploading backend files..."
scp -r dist package.json package-lock.json prisma ${SSH_HOST}:${REMOTE_DIR}/

Write-Host "Uploading frontend build..."
scp -r client/build ${SSH_HOST}:${REMOTE_DIR}/client/

Write-Host "Uploading environment configuration..."
scp .env.production ${SSH_HOST}:${REMOTE_DIR}/.env

# Create uploads directory
ssh $SSH_HOST "mkdir -p $REMOTE_DIR/uploads"

Write-Host "✓ Files uploaded successfully" -ForegroundColor Green
Write-Host ""

# Step 6: Install dependencies and run migrations
Write-Host "[6/8] Installing dependencies and running migrations..." -ForegroundColor Yellow

$setupScript = @"
#!/bin/bash
set -e
cd $REMOTE_DIR

echo "Installing dependencies..."
npm ci --production

echo "Generating Prisma Client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate deploy

echo "Setup completed!"
"@

$setupScript | ssh $SSH_HOST "cat > /tmp/setup_app.sh && chmod +x /tmp/setup_app.sh && bash /tmp/setup_app.sh"
Write-Host "✓ Dependencies installed and migrations completed" -ForegroundColor Green
Write-Host ""

# Step 7: Configure Nginx
Write-Host "[7/8] Configuring Nginx..." -ForegroundColor Yellow

$nginxConfig = @"
server {
    listen 8080;
    server_name $DOMAIN;

    # Frontend
    location / {
        root $REMOTE_DIR/client/build;
        try_files `$uri `$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
        
        # Increase timeout for long-running requests
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }

    # File uploads
    location /uploads {
        alias $REMOTE_DIR/uploads;
        access_log off;
        expires 30d;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
"@

$nginxConfig | ssh $SSH_HOST "cat > /etc/nginx/sites-available/sikeskoja"
ssh $SSH_HOST "ln -sf /etc/nginx/sites-available/sikeskoja /etc/nginx/sites-enabled/sikeskoja && nginx -t && systemctl reload nginx"

Write-Host "✓ Nginx configured successfully (port 8080)" -ForegroundColor Green
Write-Host ""

# Step 8: Start application with PM2
Write-Host "[8/8] Starting application with PM2..." -ForegroundColor Yellow

$pm2Config = @"
{
  "name": "sikeskoja",
  "script": "dist/server.js",
  "cwd": "$REMOTE_DIR",
  "instances": 2,
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production"
  },
  "error_file": "$REMOTE_DIR/logs/error.log",
  "out_file": "$REMOTE_DIR/logs/access.log",
  "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
  "merge_logs": true,
  "autorestart": true,
  "max_restarts": 10,
  "min_uptime": "10s"
}
"@

$pm2Config | ssh $SSH_HOST "mkdir -p $REMOTE_DIR/logs && cat > $REMOTE_DIR/ecosystem.config.json"

ssh $SSH_HOST "cd $REMOTE_DIR && pm2 delete sikeskoja 2>/dev/null || true && pm2 start ecosystem.config.json && pm2 save && pm2 startup systemd -u root --hp /root | tail -n 1 | bash"

Write-Host "✓ Application started successfully" -ForegroundColor Green
Write-Host ""

# Final status check
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Deployment Status" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

ssh $SSH_HOST "pm2 status && echo '' && echo 'Application logs:' && pm2 logs sikeskoja --lines 20 --nostream"

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "✓ Deployment completed successfully!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application URL: http://$DOMAIN:8080" -ForegroundColor Cyan
Write-Host "API URL: http://$DOMAIN:8080/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  ssh $SSH_HOST 'pm2 status'          - Check application status" -ForegroundColor White
Write-Host "  ssh $SSH_HOST 'pm2 logs sikeskoja'  - View application logs" -ForegroundColor White
Write-Host "  ssh $SSH_HOST 'pm2 restart sikeskoja' - Restart application" -ForegroundColor White
Write-Host "  ssh $SSH_HOST 'pm2 stop sikeskoja'  - Stop application" -ForegroundColor White
Write-Host ""
Write-Host "Note: Nginx is running on port 8080 to avoid conflict with Apache on port 80" -ForegroundColor Yellow
