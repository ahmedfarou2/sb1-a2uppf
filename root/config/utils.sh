#!/bin/bash

# Logging utilities
log_info() {
    echo -e "\e[34m[INFO]\e[0m $1"
}

log_success() {
    echo -e "\e[32m[SUCCESS]\e[0m $1"
}

log_error() {
    echo -e "\e[31m[ERROR]\e[0m $1" >&2
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Validate environment variables
validate_env() {
    local required_vars=("APP_NAME" "APP_DIR" "DOMAIN" "ADMIN_EMAIL" "DB_PASSWORD" "DB_NAME" "DB_USER")
    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done

    if [[ ${#missing_vars[@]} -ne 0 ]]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        return 1
    fi
}

# Check system requirements
check_system_requirements() {
    local min_memory=1024  # 1GB in MB
    local min_disk=10240   # 10GB in MB

    # Check memory
    local total_memory=$(free -m | awk '/^Mem:/{print $2}')
    if [[ $total_memory -lt $min_memory ]]; then
        log_error "Insufficient memory. Required: ${min_memory}MB, Available: ${total_memory}MB"
        return 1
    fi

    # Check disk space
    local free_disk=$(df -m / | awk 'NR==2 {print $4}')
    if [[ $free_disk -lt $min_disk ]]; then
        log_error "Insufficient disk space. Required: ${min_disk}MB, Available: ${free_disk}MB"
        return 1
    fi
}

# Backup function
create_backup() {
    local backup_dir="/root/backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${backup_dir}/${APP_NAME}_${timestamp}.tar.gz"

    mkdir -p "$backup_dir"
    
    if [[ -d "$APP_DIR" ]]; then
        tar -czf "$backup_file" -C "$APP_DIR" .
        log_success "Backup created: $backup_file"
    fi
}