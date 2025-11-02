# SiKesKoja - Deployment Summary

## 🎉 Deployment Berhasil!

Aplikasi SiKesKoja telah berhasil di-deploy ke VPS dengan konfigurasi berikut:

### 📋 Server Information

- **IP Address**: 103.185.52.124
- **Domain**: sikeskoja.portnumbay.id
- **Ports**: 80 (HTTP), 443 (HTTPS), 8080 (Nginx internal), 5000 (Node.js)
- **OS**: Ubuntu 22.04 LTS
- **Node.js**: v22.19.0
- **SSL**: ✅ Let's Encrypt (expires 2026-01-30)

### 🌐 Application URLs

- **Frontend**: https://sikeskoja.portnumbay.id
- **API Base**: https://sikeskoja.portnumbay.id/api
- **Health Check**: https://sikeskoja.portnumbay.id/health
- **HTTP**: Automatically redirects to HTTPS

### 🗄️ Database

- **Type**: PostgreSQL 14
- **Database**: sikeskoja_db
- **User**: sikeskoja_user
- **Status**: ✅ Running with all migrations applied

### ⚙️ Services Status

- **Apache**: ✅ Running on port 80/443 (reverse proxy with SSL)
- **Nginx**: ✅ Running on port 8080 (serves frontend static files)
- **Node.js Backend**: ✅ Running on port 5000 (2 instances with PM2)
- **PM2 Process Manager**: ✅ Active with auto-restart enabled
- **SSL Certificate**: ✅ Let's Encrypt (auto-renewal configured)

### 📁 Application Structure

```
/var/www/sikeskoja/
├── dist/                 # Compiled TypeScript backend
├── client/build/         # React production build
├── prisma/              # Database schema and migrations
├── node_modules/        # Dependencies
├── logs/               # Application logs
├── uploads/            # File uploads directory
└── .env                # Environment configuration
```

### 🔐 SSH Configuration

SSH key authentication telah dikonfigurasi untuk koneksi tanpa password:

```bash
ssh sikeskoja
```

### 🛠️ Useful Commands

#### PM2 Process Management

```bash
# Check status
ssh sikeskoja "pm2 status"

# View logs
ssh sikeskoja "pm2 logs sikeskoja"

# Restart application
ssh sikeskoja "pm2 restart sikeskoja"

# Stop application
ssh sikeskoja "pm2 stop sikeskoja"

# Start application
ssh sikeskoja "pm2 start sikeskoja"
```

#### Nginx Management

```bash
# Check status
ssh sikeskoja "systemctl status nginx"

# Reload configuration
ssh sikeskoja "systemctl reload nginx"

# Restart Nginx
ssh sikeskoja "systemctl restart nginx"

# View error logs
ssh sikeskoja "tail -f /var/log/nginx/error.log"
```

#### Database Management

```bash
# Connect to database
ssh sikeskoja "PGPASSWORD=Sikeskoja2025DB psql -h localhost -U sikeskoja_user -d sikeskoja_db"

# View tables
ssh sikeskoja "PGPASSWORD=Sikeskoja2025DB psql -h localhost -U sikeskoja_user -d sikeskoja_db -c '\dt'"
```

#### Application Updates

```bash
# 1. Build locally
npm run build

# 2. Upload files
scp -r dist sikeskoja:/var/www/sikeskoja/
scp -r client/build sikeskoja:/var/www/sikeskoja/client/

# 3. Restart application
ssh sikeskoja "pm2 restart sikeskoja"
```

### 🎯 API Endpoints Available

- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `GET /api/wilayah/*` - Wilayah (region) data
- `GET/POST /api/questionnaires-ks/*` - Questionnaire endpoints
- `GET /api/reports/*` - Reports endpoints

### 🔒 Security Configuration

- JWT authentication enabled
- CORS configured
- Security headers enabled (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Gzip compression enabled
- Rate limiting (application level)

### 📊 Performance

- **Backend**: 2 Node.js instances in cluster mode (PM2)
- **Auto-restart**: Enabled with max 10 restarts
- **Min uptime**: 10 seconds before considering stable
- **Memory usage**: ~85MB per instance

### ⚠️ Important Notes

1. **Reverse Proxy Architecture**: Apache (port 80/443) → Nginx (port 8080) → Node.js (port 5000)
2. **SSL/HTTPS**: Let's Encrypt certificate installed with auto-renewal
3. **HTTP to HTTPS**: All HTTP traffic automatically redirects to HTTPS
4. **Prisma binaries**: Downloaded manually due to network restrictions on server
5. **File permissions**: Set to 755 for application directory, www-data:www-data for client files
6. **Auto-start**: PM2 is configured to start on system boot
7. **Apache coexistence**: Other Apache sites remain untouched and functional

### 🔧 Environment Variables (Production)

Located at: `/var/www/sikeskoja/.env`

- NODE_ENV=production
- PORT=5000
- DATABASE_URL=postgresql://sikeskoja_user:Sikeskoja2025DB@localhost:5432/sikeskoja_db
- JWT_SECRET=[Generated automatically]
- API_BASE_URL=https://sikeskoja.portnumbay.id/api
- CLIENT_URL=https://sikeskoja.portnumbay.id

### 📝 Deployment Steps Completed

1. ✅ Configured SSH key authentication
2. ✅ Installed Node.js 18.x
3. ✅ Installed PostgreSQL 14
4. ✅ Installed Nginx
5. ✅ Installed PM2 globally
6. ✅ Created database and user
7. ✅ Uploaded application files
8. ✅ Installed dependencies
9. ✅ Applied database migrations
10. ✅ Generated Prisma Client
11. ✅ Configured Nginx for frontend static files
12. ✅ Configured Apache reverse proxy
13. ✅ Installed SSL certificate (Let's Encrypt)
14. ✅ Configured HTTP to HTTPS redirect
15. ✅ Started application with PM2
16. ✅ Configured PM2 auto-start on boot
17. ✅ Fixed file permissions
18. ✅ Verified all services running with SSL

### 🎯 Next Steps (Optional)

1. **SSL Certificate**: Install Let's Encrypt SSL certificate

   ```bash
   ssh sikeskoja "apt install certbot python3-certbot-nginx -y"
   ssh sikeskoja "certbot --nginx -d sikeskoja.portnumbay.id"
   ```

2. **Monitoring**: Set up application monitoring

   ```bash
   ssh sikeskoja "pm2 install pm2-logrotate"
   ```

3. **Backup**: Configure automated database backups

   ```bash
   # Create backup script in /root/backup-sikeskoja.sh
   ```

4. **Domain**: Configure port 80 if Apache can be moved or proxied

### 📞 Support

Untuk troubleshooting atau pertanyaan, check:

- Application logs: `ssh sikeskoja "pm2 logs sikeskoja"`
- Nginx logs: `ssh sikeskoja "tail -f /var/log/nginx/error.log"`
- System logs: `ssh sikeskoja "journalctl -xe"`

---

**Deployment Date**: November 2, 2025
**Deployed By**: GitHub Copilot
**Status**: ✅ Production Ready
