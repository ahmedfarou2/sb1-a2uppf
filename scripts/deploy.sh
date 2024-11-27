#!/bin/bash

# Exit on error
set -e

echo "Starting deployment..."

# Build the application
echo "Building application..."
npm run build

# Create deployment package
echo "Creating deployment package..."
tar -czf deploy.tar.gz dist/ server/ package.json package-lock.json ecosystem.config.js .env.production nginx.conf

# Copy to server
echo "Copying files to server..."
scp deploy.tar.gz root@64.227.107.155:/tmp/

# Deploy on server
echo "Deploying on server..."
ssh root@64.227.107.155 "
  # Create app directory if it doesn't exist
  mkdir -p /var/www/auditunity

  # Extract files
  cd /var/www/auditunity
  tar xzf /tmp/deploy.tar.gz
  rm /tmp/deploy.tar.gz

  # Install dependencies
  npm install --production

  # Start/reload application
  pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
  pm2 save

  # Set permissions
  chown -R www-data:www-data /var/www/auditunity
  chmod -R 755 /var/www/auditunity
  chmod -R 775 /var/www/auditunity/uploads

  # Configure Nginx
  ln -sf /var/www/auditunity/nginx.conf /etc/nginx/sites-available/auditunity.conf
  ln -sf /etc/nginx/sites-available/auditunity.conf /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default

  # Reload Nginx
  nginx -t && systemctl reload nginx
"

echo "Deployment completed successfully!"
echo "Your application is now live at https://www.auditunity.com"