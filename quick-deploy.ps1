# SiKesKoja Quick Deploy Script
$ErrorActionPreference = "Continue"

$SSH_HOST = "sikeskoja"
$REMOTE_DIR = "/var/www/sikeskoja"
$DOMAIN = "sikeskoja.portnumbay.id"
$DB_NAME = "sikeskoja_db"
$DB_USER = "sikeskoja_user"
$DB_PASSWORD = "Sikeskoja2025DB"
$JWT_SECRET = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SiKesKoja VPS Deployment" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Create .env.production
Write-Host "[Step 1] Creating .env.production..." -ForegroundColor Yellow
@"
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public
DB_HOST=localhost
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
WHATSAPP_DEVICE_ID=59087f966f4f8cc3385569ef6481cc29
OTP_EXPIRES_IN=5
OTP_LENGTH=6
REDIS_URL=redis://localhost:6379
API_BASE_URL=https://${DOMAIN}/api
CLIENT_URL=https://${DOMAIN}
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
"@ | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "✓ Done`n" -ForegroundColor Green

# Install Prerequisites
Write-Host "[Step 2] Installing Prerequisites on Server..." -ForegroundColor Yellow
ssh $SSH_HOST @"
export DEBIAN_FRONTEND=noninteractive
echo 'Installing Node.js...'
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi
echo 'Installing PostgreSQL...'
if ! command -v psql &> /dev/null; then
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
fi
echo 'Installing Nginx...'
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
fi
echo 'Installing PM2...'
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
echo 'Done!'
"@
Write-Host "✓ Done`n" -ForegroundColor Green

# Setup Database
Write-Host "[Step 3] Setting up PostgreSQL Database..." -ForegroundColor Yellow
ssh $SSH_HOST @"
sudo -u postgres psql -tc \"SELECT 1 FROM pg_user WHERE usename = '${DB_USER}'\" | grep -q 1 || sudo -u postgres psql -c \"CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';\"
sudo -u postgres psql -tc \"SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'\" | grep -q 1 || sudo -u postgres psql -c \"CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};\"
sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};\"
sudo -u postgres psql -d ${DB_NAME} -c \"GRANT ALL ON SCHEMA public TO ${DB_USER};\"
echo 'Database setup completed!'
"@
Write-Host "✓ Done`n" -ForegroundColor Green

# Create Remote Directory
Write-Host "[Step 4] Creating Remote Directory..." -ForegroundColor Yellow
ssh $SSH_HOST "mkdir -p $REMOTE_DIR"
Write-Host "✓ Done`n" -ForegroundColor Green

# Upload Files
Write-Host "[Step 5] Uploading Files..." -ForegroundColor Yellow
Write-Host "  - Backend files..." -ForegroundColor Gray
scp -r dist package.json package-lock.json prisma "${SSH_HOST}:${REMOTE_DIR}/"

Write-Host "  - Frontend build..." -ForegroundColor Gray
ssh $SSH_HOST "mkdir -p ${REMOTE_DIR}/client"
scp -r client/build "${SSH_HOST}:${REMOTE_DIR}/client/"

Write-Host "  - Environment config..." -ForegroundColor Gray
scp .env.production "${SSH_HOST}:${REMOTE_DIR}/.env"

ssh $SSH_HOST "mkdir -p ${REMOTE_DIR}/uploads ${REMOTE_DIR}/logs"
Write-Host "✓ Done`n" -ForegroundColor Green

# Install Dependencies & Migrate
Write-Host "[Step 6] Installing Dependencies & Running Migrations..." -ForegroundColor Yellow
ssh $SSH_HOST @"
cd ${REMOTE_DIR}
npm ci --production
npx prisma generate
npx prisma migrate deploy
echo 'Setup completed!'
"@
Write-Host "✓ Done`n" -ForegroundColor Green

# Configure Nginx
Write-Host "[Step 7] Configuring Nginx..." -ForegroundColor Yellow
ssh $SSH_HOST @"
cat > /etc/nginx/sites-available/sikeskoja << 'NGINXEOF'
server {
    listen 8080;
    server_name ${DOMAIN};

    location / {
        root ${REMOTE_DIR}/client/build;
        try_files \`$uri \`$uri/ /index.html;
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)`$ {
            expires 1y;
            add_header Cache-Control \"public, immutable\";
        }
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \`$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \`$host;
        proxy_set_header X-Real-IP \`$remote_addr;
        proxy_set_header X-Forwarded-For \`$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \`$scheme;
        proxy_cache_bypass \`$http_upgrade;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }

    location /uploads {
        alias ${REMOTE_DIR}/uploads;
        access_log off;
        expires 30d;
    }

    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
NGINXEOF
ln -sf /etc/nginx/sites-available/sikeskoja /etc/nginx/sites-enabled/sikeskoja
nginx -t && systemctl reload nginx
"@
Write-Host "✓ Done`n" -ForegroundColor Green

# Start with PM2
Write-Host "[Step 8] Starting Application with PM2..." -ForegroundColor Yellow
ssh $SSH_HOST @"
cd ${REMOTE_DIR}
cat > ecosystem.config.json << 'PM2EOF'
{
  \"apps\": [{
    \"name\": \"sikeskoja\",
    \"script\": \"dist/server.js\",
    \"cwd\": \"${REMOTE_DIR}\",
    \"instances\": 2,
    \"exec_mode\": \"cluster\",
    \"env\": {
      \"NODE_ENV\": \"production\"
    },
    \"error_file\": \"${REMOTE_DIR}/logs/error.log\",
    \"out_file\": \"${REMOTE_DIR}/logs/access.log\",
    \"log_date_format\": \"YYYY-MM-DD HH:mm:ss Z\",
    \"merge_logs\": true,
    \"autorestart\": true,
    \"max_restarts\": 10,
    \"min_uptime\": \"10s\"
  }]
}
PM2EOF
pm2 delete sikeskoja 2>/dev/null || true
pm2 start ecosystem.config.json
pm2 save
pm2 startup systemd -u root --hp /root | tail -n 1 | bash 2>/dev/null || true
"@
Write-Host "✓ Done`n" -ForegroundColor Green

# Status Check
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Deployment Status" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

ssh $SSH_HOST "pm2 status"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✓ Deployment Completed!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Application URL: " -NoNewline; Write-Host "http://${DOMAIN}:8080" -ForegroundColor Cyan
Write-Host "API URL: " -NoNewline; Write-Host "http://${DOMAIN}:8080/api" -ForegroundColor Cyan
Write-Host "`nUseful Commands:" -ForegroundColor Yellow
Write-Host "  ssh $SSH_HOST 'pm2 status'" -ForegroundColor White
Write-Host "  ssh $SSH_HOST 'pm2 logs sikeskoja'" -ForegroundColor White
Write-Host "  ssh $SSH_HOST 'pm2 restart sikeskoja'" -ForegroundColor White
Write-Host "`nNote: Nginx is running on port 8080 (Apache is on port 80)`n" -ForegroundColor Gray
