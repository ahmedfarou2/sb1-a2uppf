#!/bin/bash

source /root/config/env.sh
source /root/config/utils.sh

backup_database() {
    local backup_dir="${BACKUP_DIR}/database"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${backup_dir}/${DB_NAME}_${timestamp}.sql.gz"

    mkdir -p "$backup_dir"

    # Create backup using root credentials
    mysqldump -u root -p"${DB_ROOT_PASSWORD}" \
        --single-transaction \
        --quick \
        --lock-tables=false \
        "${DB_NAME}" | gzip > "$backup_file"

    if [ $? -eq 0 ]; then
        # Keep only last N days of backups
        find "$backup_dir" -name "*.sql.gz" -mtime "+${BACKUP_RETENTION_DAYS}" -delete
        log_success "Database backup created: $backup_file"
    else
        log_error "Database backup failed"
        return 1
    fi
}