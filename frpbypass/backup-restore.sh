#!/bin/bash

# FRP Bypass - Backup & Restore Script
echo "==================================="
echo "  FRP BYPASS - Backup/Restore Tool"
echo "==================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create backup directory
BACKUP_DIR="backups"
mkdir -p $BACKUP_DIR

# Timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/frp_backup_$TIMESTAMP.tar.gz"

# Function to create backup
create_backup() {
    echo -e "${YELLOW}📦 Creating backup...${NC}"
    
    tar -czf $BACKUP_FILE \
        index.html \
        404.html \
        robots.txt \
        _config.yml \
        .nojekyll \
        css/ \
        js/ \
        data/ \
        assets/ 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
    else
        echo -e "${RED}❌ Backup failed${NC}"
    fi
}

# Function to restore backup
restore_backup() {
    echo -e "${YELLOW}📂 Available backups:${NC}"
    ls -lh $BACKUP_DIR | grep .tar.gz
    
    echo ""
    read -p "Enter backup filename to restore: " filename
    
    if [ -f "$BACKUP_DIR/$filename" ]; then
        echo -e "${YELLOW}🔄 Restoring backup...${NC}"
        tar -xzf "$BACKUP_DIR/$filename"
        echo -e "${GREEN}✅ Backup restored successfully${NC}"
    else
        echo -e "${RED}❌ Backup file not found${NC}"
    fi
}

# Menu
echo ""
echo "1) Create Backup"
echo "2) Restore Backup"
echo "3) List Backups"
echo "4) Exit"
echo ""

read -p "Select option [1-4]: " option

case $option in
    1) create_backup ;;
    2) restore_backup ;;
    3) ls -lh $BACKUP_DIR | grep .tar.gz ;;
    4) exit 0 ;;
    *) echo -e "${RED}Invalid option${NC}" ;;
esac