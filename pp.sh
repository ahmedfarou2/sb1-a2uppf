#!/bin/bash

# Exit on error
set -e

# Load environment variables from deploy.sh if they exist
[ -f /root/deploy.sh ] && source /root/deploy.sh

# Set default values if not already set
APP_NAME=${APP_NAME:-"auditunity"}
APP_DIR=${APP_DIR:-"/var/www/$APP_NAME"}

echo "Starting application deployment..."

# Create deployment directory if it doesn't exist
mkdir -p "$APP_DIR"

# Copy application files
cp -r dist/* "$APP_DIR/"
cp -r server "$APP_DIR/"
cp package.json package-lock.json ecosystem.config.js .env.production "$APP_DIR/"

# Install dependencies
cd "$APP_DIR" || exit
npm install --production

# Start/reload application with PM2
pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
pm2 save

# Set permissions
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod -R 775 "$APP_DIR/uploads"

# Reload Nginx
systemctl reload nginx

echo "Deployment completed successfully!"
echo "Your application is now live at https://www.auditunity.com"