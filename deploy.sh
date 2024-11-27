#!/bin/bash

# Exit on error
set -e

# Variables
APP_NAME="auditunity"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="auditunity.com"
ADMIN_EMAIL="acc.farouk@yahoo.com"
DB_PASSWORD="Ah@411984"

echo "Starting deployment setup..."

# Update system and install dependencies
apt update && apt upgrade -y
apt install -y nginx mysql-server certbot python3-certbot-nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2

# Create application directories
mkdir -p $APP_DIR/{dist,uploads,logs}

# Configure MySQL
mysql -e "CREATE DATABASE IF NOT EXISTS audit_platform;"
mysql -e "CREATE USER IF NOT EXISTS 'audit_user'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
mysql -e "GRANT ALL PRIVILEGES ON audit_platform.* TO 'audit_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Configure Nginx
cat > /etc/nginx/sites-available/$APP_NAME.conf << EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://www.\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.$DOMAIN;

    root $APP_DIR/dist;
    index index.html;

    # SSL Configuration will be handled by Certbot

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        alias $APP_DIR/uploads;
    }

    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOL

# Enable site configuration
ln -sf /etc/nginx/sites-available/$APP_NAME.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t && systemctl restart nginx

# Install SSL certificate
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $ADMIN_EMAIL

# Set permissions
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod -R 775 $APP_DIR/uploads

echo "Server setup completed successfully!"
echo "Next steps:"
echo "1. Clone your repository to $APP_DIR"
echo "2. Install dependencies with: npm install --production"
echo "3. Build the application with: npm run build"
echo "4. Start the application with: pm2 start ecosystem.config.js"