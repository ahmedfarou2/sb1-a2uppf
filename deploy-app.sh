#!/bin/bash

# Exit on error
set -e

# Variables
APP_NAME="auditunity"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/yourusername/$APP_NAME.git"

echo "Starting application deployment..."

# Build the application
echo "Building application..."
npm run build

# Create deployment package
echo "Creating deployment package..."
tar -czf deploy.tar.gz \
    dist/ \
    server/ \
    package.json \
    package-lock.json \
    ecosystem.config.js \
    .env.production

# Copy to server
echo "Copying files to server..."
scp deploy.tar.gz root@64.227.107.155:/tmp/

# Deploy on server
echo "Deploying on server..."
ssh root@64.227.107.155 "
    cd $APP_DIR && \
    tar xzf /tmp/deploy.tar.gz && \
    rm /tmp/deploy.tar.gz && \
    npm install --production && \
    pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production && \
    pm2 save && \
    chown -R www-data:www-data . && \
    chmod -R 755 . && \
    chmod -R 775 uploads && \
    systemctl reload nginx
"

echo "Deployment completed successfully!"
echo "Your application is now live at https://www.auditunity.com"