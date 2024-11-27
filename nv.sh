#!/bin/bash

# Application settings
export APP_NAME="auditunity"
export APP_DIR="/var/www/$APP_NAME"
export DOMAIN="auditunity.com"
export ADMIN_EMAIL="acc.farouk@yahoo.com"

# Database settings
export DB_ROOT_PASSWORD="Ah@411984"  # Added root password
export DB_PASSWORD="Ah@411984"
export DB_NAME="audit_platform"
export DB_USER="audit_user"

# Backup settings
export BACKUP_RETENTION_DAYS=7
export BACKUP_DIR="/root/backups"