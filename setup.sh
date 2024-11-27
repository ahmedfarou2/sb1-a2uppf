#!/bin/bash

# Exit on error
set -e

# Create project directory
mkdir -p /var/www/auditunity/{dist,uploads,logs}

# Update system packages
apt update && apt upgrade -y

# Install required packages
apt install -y nginx mysql-server certbot python3-certbot-nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2

# Setup MySQL
mysql -e "CREATE DATABASE IF NOT EXISTS audit_platform;"
mysql -e "CREATE USER IF NOT EXISTS 'audit_user'@'localhost' IDENTIFIED BY 'your-secure-password';"
mysql -e "GRANT ALL PRIVILEGES ON audit_platform.* TO 'audit_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Create Nginx configuration
cat > /etc/nginx/sites-available/auditunity.conf << 'EOL'
server {
    listen 80;
    server_name auditunity.com www.auditunity.com;

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
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/auditunity/uploads;
    }
}
EOL

# Enable site configuration
ln -sf /etc/nginx/sites-available/auditunity.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx

# Setup SSL certificate
certbot --nginx -d auditunity.com -d www.auditunity.com --non-interactive --agree-tos --email acc.farouk@yahoo.com

echo "Server setup completed successfully!"