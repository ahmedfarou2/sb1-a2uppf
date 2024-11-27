#!/bin/bash

# Exit on error
set -e

# Application directory
APP_DIR=/var/www/auditunity

# Create necessary directories if they don't exist
mkdir -p $APP_DIR/{dist,uploads,logs}

# Set ownership to www-data (Nginx user)
chown -R www-data:www-data $APP_DIR

# Set directory permissions
find $APP_DIR -type d -exec chmod 755 {} \;

# Set file permissions
find $APP_DIR -type f -exec chmod 644 {} \;

# Make uploads directory writable
chmod 775 $APP_DIR/uploads

# Make logs directory writable
chmod 775 $APP_DIR/logs

# Set proper SELinux context if SELinux is enabled
if command -v semanage &> /dev/null; then
    semanage fcontext -a -t httpd_sys_content_t "$APP_DIR(/.*)?"
    restorecon -Rv $APP_DIR
fi

echo "Permissions fixed successfully!"