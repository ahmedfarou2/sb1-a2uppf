#!/bin/bash

# Exit on error
set -e

# Build the application locally
echo "Building application..."
npm run build

# Deploy to server
echo "Deploying to server..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.env' \
  --exclude 'database.sqlite' \
  dist/ server/ package.json ecosystem.config.js .env.production nginx.conf \
  root@64.227.107.155:/var/www/auditunity/

# Connect to server and run deployment tasks
ssh root@64.227.107.155 "cd /var/www/auditunity && \
  npm install --production && \
  pm2 reload ecosystem.config.js --env production && \
  pm2 save && \
  systemctl reload nginx"

echo "Deployment completed successfully!"