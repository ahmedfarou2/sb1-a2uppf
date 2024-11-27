#!/bin/bash

# Exit on error
set -e

# Load environment variables and utilities
if [ ! -f /root/config/env.sh ]; then
    echo "Error: Missing environment configuration"
    exit 1
fi

source /root/config/env.sh
source /root/config/utils.sh

# Validate environment and system requirements
validate_env || exit 1
check_system_requirements || exit 1

log_info "Starting deployment setup..."

# Create backup before proceeding
create_backup

# Update system packages
log_info "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
log_info "Installing required packages..."
apt install -y nginx mysql-server certbot python3-certbot-nginx expect

# Install Node.js if not present
if ! command_exists node; then
    log_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install PM2 globally if not present
if ! command_exists pm2; then
    log_info "Installing PM2..."
    npm install -g pm2
fi

# Create application directories
log_info "Creating application directories..."
mkdir -p $APP_DIR/{dist,uploads,logs}

# Set up database
source /root/config/setup-db.sh
setup_database

# Configure Nginx
log_info "Configuring Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME.conf << 'EOL'
server {
    listen 80;
    server_name auditunity.com www.auditunity.com;
    return 301 https://www.$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.auditunity.com;

    root /var/www/auditunity/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/auditunity/uploads;
    }
}
EOL

# Enable Nginx configuration
log_info "Enabling Nginx configuration..."
ln -sf /etc/nginx/sites-available/$APP_NAME.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t && systemctl restart nginx

# Install SSL certificate
log_info "Installing SSL certificate..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $ADMIN_EMAIL

# Set file permissions
log_info "Setting file permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod -R 775 $APP_DIR/uploads

# Set up log rotation
cat > /etc/logrotate.d/$APP_NAME << EOL
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 \$(cat /var/run/nginx.pid)
    endscript
}
EOL

log_success "Deployment setup completed successfully!"