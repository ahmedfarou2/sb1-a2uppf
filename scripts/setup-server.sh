#!/bin/bash

# Exit on error
set -e

# Update system packages
apt update && apt upgrade -y

# Install required packages
apt install -y nginx mysql-server certbot python3-certbot-nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2

# Create application directories
mkdir -p /var/www/auditunity/{dist,uploads,logs}

# Setup MySQL
mysql -e "CREATE DATABASE IF NOT EXISTS audit_platform;"
mysql -e "CREATE USER IF NOT EXISTS 'audit_user'@'localhost' IDENTIFIED BY 'Ah@411984';"
mysql -e "GRANT ALL PRIVILEGES ON audit_platform.* TO 'audit_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Configure Nginx
ln -sf /var/www/auditunity/nginx.conf /etc/nginx/sites-available/auditunity.conf
ln -sf /etc/nginx/sites-available/auditunity.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t && systemctl restart nginx

# Setup SSL certificate
certbot --nginx -d auditunity.com -d www.auditunity.com --non-interactive --agree-tos --email acc.farouk@yahoo.com

# Set permissions
chown -R www-data:www-data /var/www/auditunity
chmod -R 755 /var/www/auditunity
chmod -R 775 /var/www/auditunity/uploads

echo "Server setup completed successfully!"