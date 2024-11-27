#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env.production

echo "Starting deployment to $DOMAIN..."

# Build the application locally
echo "Building application..."
npm run build

# Create deployment archive
echo "Creating deployment archive..."
tar -czf deploy.tar.gz \
  dist/ \
  server/ \
  package.json \
  package-lock.json \
  ecosystem.config.js \
  .env.production \
  nginx.conf

# Copy files to server
echo "Copying files to server..."
scp deploy.tar.gz root@$SERVER_IP:/tmp/

# Execute deployment on server
echo "Executing deployment on server..."
ssh root@$SERVER_IP bash -c "'
  # Create application directory if it doesn't exist
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

  # Update permissions
  chown -R www-data:www-data /var/www/auditunity
  chmod -R 755 /var/www/auditunity
  chmod -R 775 /var/www/auditunity/uploads

  # Reload Nginx
  nginx -t && systemctl reload nginx
'"

echo "Deployment completed successfully!"
echo "Your application is now live at https://www.$DOMAIN"