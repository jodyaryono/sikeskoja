#!/bin/bash
# SiKesKoja Deployment Script
# Target: sikeskoja.portnumbay.id (103.185.52.124)

set -e

# Configuration
SSH_HOST="sikeskoja"
REMOTE_DIR="/var/www/sikeskoja"
DOMAIN="sikeskoja.portnumbay.id"
DB_NAME="sikeskoja_db"
DB_USER="sikeskoja_user"
DB_PASSWORD="Sikeskoja@2025#DB"

echo "=================================="
echo "SiKesKoja Deployment Script"
echo "=================================="
echo ""

# Step 1: Build the application locally
echo "[1/8] Building application..."
npm run build
echo "✓ Build completed successfully"
echo ""

# Step 2: Create .env.production
echo "[2/8] Creating production environment file..."
cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
DB_HOST=localhost
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
JWT_EXPIRES_IN=7d

# WhatsApp OTP Configuration
WHATSAPP_DEVICE_ID=59087f966f4f8cc3385569ef6481cc29
OTP_EXPIRES_IN=5
OTP_LENGTH=6

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# Application Configuration
API_BASE_URL=https://${DOMAIN}/api
CLIENT_URL=https://${DOMAIN}

# Pagination Configuration
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
EOF
echo "✓ Environment file created"
echo ""

# Step 3: Check server prerequisites
echo "[3/8] Checking server prerequisites..."
ssh $SSH_HOST << 'ENDSSH'
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
ENDSSH
echo "✓ Server prerequisites checked/installed"
echo ""

# Step 4: Setup PostgreSQL database
echo "[4/8] Setting up PostgreSQL database..."
ssh $SSH_HOST << ENDSSH
#!/bin/bash
set -e

# Create database user if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '${DB_USER}'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"

# Create database if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -d ${DB_NAME} -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"

echo "Database setup completed!"
ENDSSH
echo "✓ PostgreSQL database setup completed"
echo ""

# Step 5: Create remote directory and upload files
echo "[5/8] Uploading files to server..."
ssh $SSH_HOST "mkdir -p $REMOTE_DIR"

echo "Uploading backend files..."
scp -r dist package.json package-lock.json prisma ${SSH_HOST}:${REMOTE_DIR}/

echo "Uploading frontend build..."
ssh $SSH_HOST "mkdir -p ${REMOTE_DIR}/client"
scp -r client/build ${SSH_HOST}:${REMOTE_DIR}/client/

echo "Uploading environment configuration..."
scp .env.production ${SSH_HOST}:${REMOTE_DIR}/.env

ssh $SSH_HOST "mkdir -p ${REMOTE_DIR}/uploads"

echo "✓ Files uploaded successfully"
echo ""

# Step 6: Install dependencies and run migrations
echo "[6/8] Installing dependencies and running migrations..."
ssh $SSH_HOST << ENDSSH
#!/bin/bash
set -e
cd ${REMOTE_DIR}

echo "Installing dependencies..."
npm ci --production

echo "Generating Prisma Client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate deploy

echo "Setup completed!"
ENDSSH
echo "✓ Dependencies installed and migrations completed"
echo ""

# Step 7: Configure Nginx
echo "[7/8] Configuring Nginx..."
ssh $SSH_HOST << ENDSSH
cat > /etc/nginx/sites-available/sikeskoja << 'EOF'
server {
    listen 8080;
    server_name ${DOMAIN};

    # Frontend
    location / {
        root ${REMOTE_DIR}/client/build;
        try_files \$uri \$uri/ /index.html;
        
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
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Increase timeout for long-running requests
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }

    # File uploads
    location /uploads {
        alias ${REMOTE_DIR}/uploads;
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
EOF

ln -sf /etc/nginx/sites-available/sikeskoja /etc/nginx/sites-enabled/sikeskoja
nginx -t && systemctl reload nginx
ENDSSH
echo "✓ Nginx configured successfully (port 8080)"
echo ""

# Step 8: Start application with PM2
echo "[8/8] Starting application with PM2..."
ssh $SSH_HOST << ENDSSH
cat > ${REMOTE_DIR}/ecosystem.config.json << 'EOF'
{
  "apps": [{
    "name": "sikeskoja",
    "script": "dist/server.js",
    "cwd": "${REMOTE_DIR}",
    "instances": 2,
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production"
    },
    "error_file": "${REMOTE_DIR}/logs/error.log",
    "out_file": "${REMOTE_DIR}/logs/access.log",
    "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
    "merge_logs": true,
    "autorestart": true,
    "max_restarts": 10,
    "min_uptime": "10s"
  }]
}
EOF

mkdir -p ${REMOTE_DIR}/logs
cd ${REMOTE_DIR}
pm2 delete sikeskoja 2>/dev/null || true
pm2 start ecosystem.config.json
pm2 save
pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true
ENDSSH
echo "✓ Application started successfully"
echo ""

# Final status check
echo "=================================="
echo "Deployment Status"
echo "=================================="
ssh $SSH_HOST "pm2 status && echo '' && echo 'Application logs:' && pm2 logs sikeskoja --lines 20 --nostream || true"

echo ""
echo "=================================="
echo "✓ Deployment completed successfully!"
echo "=================================="
echo ""
echo "Application URL: http://${DOMAIN}:8080"
echo "API URL: http://${DOMAIN}:8080/api"
echo ""
echo "Useful commands:"
echo "  ssh ${SSH_HOST} 'pm2 status'          - Check application status"
echo "  ssh ${SSH_HOST} 'pm2 logs sikeskoja'  - View application logs"
echo "  ssh ${SSH_HOST} 'pm2 restart sikeskoja' - Restart application"
echo "  ssh ${SSH_HOST} 'pm2 stop sikeskoja'  - Stop application"
echo ""
echo "Note: Nginx is running on port 8080 to avoid conflict with Apache on port 80"
