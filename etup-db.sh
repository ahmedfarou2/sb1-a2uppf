#!/bin/bash

source /root/config/utils.sh

setup_database() {
    log_info "Configuring MySQL database..."

    # Set root password if not already set
    if ! mysql -u root -p"${DB_ROOT_PASSWORD}" -e "SELECT 1" >/dev/null 2>&1; then
        log_info "Setting MySQL root password..."
        mysqladmin -u root password "${DB_ROOT_PASSWORD}"
    fi

    # Create database and user
    mysql -u root -p"${DB_ROOT_PASSWORD}" << EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

    if [ $? -eq 0 ]; then
        log_success "Database setup completed successfully"
    else
        log_error "Database setup failed"
        return 1
    fi

    # Set up backup cron job
    echo "0 2 * * * /root/config/backup-db.sh" | crontab -
}