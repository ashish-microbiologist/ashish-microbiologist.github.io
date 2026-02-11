#!/bin/bash

# ============================================
# FRP BYPASS BY ASHISH - GitHub Pages Deploy Script
# Version: 4.0.0
# Author: ASHISH
# Date: 2026
# ============================================

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Script Version
VERSION="4.0.0"

# ============================================
# PRINT BANNER
# ============================================
print_banner() {
    clear
    echo -e "${BLUE}┌─────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│                                             │${NC}"
    echo -e "${BLUE}│  ${CYAN}██████╗ ██████╗ ██████╗                 ${BLUE}│${NC}"
    echo -e "${BLUE}│  ${CYAN}██╔══██╗██╔══██╗██╔══██╗                ${BLUE}│${NC}"
    echo -e "${BLUE}│  ${CYAN}██████╔╝██████╔╝██████╔╝                ${BLUE}│${NC}"
    echo -e "${BLUE}│  ${CYAN}██╔══██╗██╔══██╗██╔═══╝                ${BLUE}│${NC}"
    echo -e "${BLUE}│  ${CYAN}██║  ██║██║  ██║██║                    ${BLUE}│${NC}"
    echo -e "${BLUE}│  ${CYAN}╚═╝  ╚═╝╚═╝  ╚═╝╚═╝                    ${BLUE}│${NC}"
    echo -e "${BLUE}│                                             │${NC}"
    echo -e "${BLUE}│  ${WHITE}FRP BYPASS - GitHub Pages Deploy Tool   ${BLUE}│${NC}"
    echo -e "${BLUE}│  ${YELLOW}ASHISH GOOGLE BYPASS ACCOUNT 2026      ${BLUE}│${NC}"
    echo -e "${BLUE}│                                             │${NC}"
    echo -e "${BLUE}└─────────────────────────────────────────────┘${NC}"
    echo ""
}

# ============================================
# CHECK DEPENDENCIES
# ============================================
check_dependencies() {
    echo -e "${YELLOW}🔍 Checking dependencies...${NC}"
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is not installed!${NC}"
        echo -e "Please install Git first: https://git-scm.com/downloads"
        exit 1
    else
        echo -e "${GREEN}✅ Git: $(git --version)${NC}"
    fi
    
    # Check if repository exists
    if [ ! -d .git ]; then
        echo -e "${RED}❌ Not a git repository!${NC}"
        echo -e "Please run: git init"
        exit 1
    fi
    
    echo ""
}

# ============================================
# CHECK REQUIRED FILES
# ============================================
check_files() {
    echo -e "${YELLOW}📁 Checking required files...${NC}"
    
    # Required files array
    REQUIRED_FILES=(
        "index.html"
        "404.html"
        "robots.txt"
        "_config.yml"
        ".nojekyll"
        "css/admin-style.css"
        "js/admin-core.js"
        "js/admin-apps.js"
        "js/admin-files.js"
        "js/admin-settings.js"
        "js/admin-backup.js"
        "js/script.min.js"
    )
    
    MISSING_FILES=0
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            echo -e "${RED}❌ Missing: $file${NC}"
            MISSING_FILES=$((MISSING_FILES + 1))
        else
            echo -e "${GREEN}✅ Found: $file${NC}"
        fi
    done
    
    if [ $MISSING_FILES -gt 0 ]; then
        echo -e "${RED}❌ $MISSING_FILES required files are missing!${NC}"
        echo -e "${YELLOW}Please add missing files before deploying.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All required files present!${NC}"
    echo ""
}

# ============================================
# CREATE .NOJEYKLL (CRITICAL FOR GITHUB PAGES)
# ============================================
create_nojekyll() {
    echo -e "${YELLOW}🔧 Creating .nojekyll file...${NC}"
    
    if [ ! -f ".nojekyll" ]; then
        touch .nojekyll
        echo "# Disable Jekyll processing for GitHub Pages" > .nojekyll
        echo -e "${GREEN}✅ .nojekyll created${NC}"
    else
        echo -e "${GREEN}✅ .nojekyll already exists${NC}"
    fi
    
    echo ""
}

# ============================================
# SETUP GIT REMOTE
# ============================================
setup_remote() {
    echo -e "${YELLOW}🌍 Checking git remote...${NC}"
    
    # Check if remote exists
    if ! git remote -v | grep -q "origin"; then
        echo -e "${YELLOW}⚠️ No remote repository configured!${NC}"
        
        # Get GitHub username
        read -p "Enter your GitHub username: " GITHUB_USER
        
        # Get repository name
        read -p "Enter repository name (default: frp-bypass-ashish): " REPO_NAME
        REPO_NAME=${REPO_NAME:-frp-bypass-ashish}
        
        # Add remote
        git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
        echo -e "${GREEN}✅ Remote added: https://github.com/$GITHUB_USER/$REPO_NAME.git${NC}"
    else
        echo -e "${GREEN}✅ Git remote configured:${NC}"
        git remote -v | grep "origin" | head -n1
    fi
    
    echo ""
}

# ============================================
# VERIFY GIT CONFIGURATION
# ============================================
verify_git_config() {
    echo -e "${YELLOW}🔧 Verifying git configuration...${NC}"
    
    # Check git user.name
    if [ -z "$(git config user.name)" ]; then
        read -p "Enter your git username: " GIT_USER
        git config user.name "$GIT_USER"
        echo -e "${GREEN}✅ Git username set: $GIT_USER${NC}"
    else
        echo -e "${GREEN}✅ Git username: $(git config user.name)${NC}"
    fi
    
    # Check git user.email
    if [ -z "$(git config user.email)" ]; then
        read -p "Enter your git email: " GIT_EMAIL
        git config user.email "$GIT_EMAIL"
        echo -e "${GREEN}✅ Git email set: $GIT_EMAIL${NC}"
    else
        echo -e "${GREEN}✅ Git email: $(git config user.email)${NC}"
    fi
    
    echo ""
}

# ============================================
# CLEAN BUILD FILES
# ============================================
clean_build() {
    echo -e "${YELLOW}🧹 Cleaning build files...${NC}"
    
    # Remove temporary files
    rm -rf .jekyll-cache/ 2>/dev/null
    rm -rf _site/ 2>/dev/null
    rm -rf .sass-cache/ 2>/dev/null
    
    echo -e "${GREEN}✅ Build cleaned${NC}"
    echo ""
}

# ============================================
# CREATE COMMIT
# ============================================
create_commit() {
    echo -e "${YELLOW}📦 Creating commit...${NC}"
    
    # Get commit message
    CURRENT_TIME=$(date +"%Y-%m-%d %H:%M:%S")
    DEFAULT_MSG="Deploy FRP Bypass v$VERSION - $CURRENT_TIME"
    
    read -p "Enter commit message (default: $DEFAULT_MSG): " COMMIT_MSG
    COMMIT_MSG=${COMMIT_MSG:-$DEFAULT_MSG}
    
    # Add all files
    echo -e "${YELLOW}📎 Adding files...${NC}"
    git add .
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        echo -e "${YELLOW}⚠️ No changes to commit!${NC}"
    else
        # Commit changes
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
    
    echo ""
}

# ============================================
# PUSH TO GITHUB
# ============================================
push_to_github() {
    echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    
    if [ -z "$CURRENT_BRANCH" ]; then
        CURRENT_BRANCH="main"
    fi
    
    # Push to remote
    echo -e "${YELLOW}📤 Pushing to origin/$CURRENT_BRANCH...${NC}"
    
    if git push -u origin "$CURRENT_BRANCH"; then
        echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    else
        echo -e "${RED}❌ Push failed!${NC}"
        echo -e "${YELLOW}Possible issues:${NC}"
        echo -e "  1. No internet connection"
        echo -e "  2. Invalid credentials"
        echo -e "  3. Repository doesn't exist"
        echo -e "  4. Branch protection rules"
        echo ""
        exit 1
    fi
    
    echo ""
}

# ============================================
# GENERATE GITHUB PAGES URL
# ============================================
generate_url() {
    echo -e "${YELLOW}🔗 Generating GitHub Pages URL...${NC}"
    
    # Get remote URL
    REMOTE_URL=$(git remote get-url origin 2>/dev/null)
    
    if [[ $REMOTE_URL == *"github.com"* ]]; then
        # Extract username and repo
        if [[ $REMOTE_URL == *"git@github.com:"* ]]; then
            # SSH URL
            REPO_PATH=$(echo $REMOTE_URL | sed 's/git@github.com://' | sed 's/\.git$//')
        else
            # HTTPS URL
            REPO_PATH=$(echo $REMOTE_URL | sed 's/https:\/\/github.com\///' | sed 's/\.git$//')
        fi
        
        GITHUB_USER=$(echo $REPO_PATH | cut -d'/' -f1)
        REPO_NAME=$(echo $REPO_PATH | cut -d'/' -f2)
        
        GITHUB_URL="https://$GITHUB_USER.github.io/$REPO_NAME"
        
        echo -e "${GREEN}✅ GitHub Pages URL generated!${NC}"
        echo -e "${CYAN}🌐 $GITHUB_URL${NC}"
    else
        echo -e "${RED}❌ Could not generate URL${NC}"
        GITHUB_URL="https://[your-username].github.io/frp-bypass-ashish"
        echo -e "${CYAN}🌐 $GITHUB_URL${NC}"
    fi
    
    echo ""
}

# ============================================
# OPEN GITHUB PAGES SETTINGS
# ============================================
open_pages_settings() {
    echo -e "${YELLOW}⚙️ Opening GitHub Pages settings...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$GITHUB_URL/settings/pages" 2>/dev/null || \
        open "https://github.com/$REPO_PATH/settings/pages" 2>/dev/null
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open "$GITHUB_URL/settings/pages" 2>/dev/null || \
        xdg-open "https://github.com/$REPO_PATH/settings/pages" 2>/dev/null
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        start "$GITHUB_URL/settings/pages" 2>/dev/null || \
        start "https://github.com/$REPO_PATH/settings/pages" 2>/dev/null
    fi
    
    echo ""
}

# ============================================
# SHOW DEPLOYMENT SUMMARY
# ============================================
show_summary() {
    echo -e "${BLUE}┌─────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│${GREEN}         ✅ DEPLOYMENT COMPLETE!              ${BLUE}│${NC}"
    echo -e "${BLUE}├─────────────────────────────────────────────┤${NC}"
    echo -e "${BLUE}│${NC}  📅 Date:        $(date +"%Y-%m-%d %H:%M:%S")   ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC}  📦 Version:     v$VERSION                     ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC}  🔧 Git Branch:  $(git branch --show-current)              ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC}  📁 Files:       $(git ls-files | wc -l | tr -d ' ') files                 ${BLUE}│${NC}"
    echo -e "${BLUE}├─────────────────────────────────────────────┤${NC}"
    echo -e "${BLUE}│${CYAN}  🌐 Website URL:                               ${BLUE}│${NC}"
    echo -e "${BLUE}│${WHITE}  $GITHUB_URL ${BLUE}│${NC}"
    echo -e "${BLUE}├─────────────────────────────────────────────┤${NC}"
    echo -e "${BLUE}│${YELLOW}  🔐 Admin Login:                              ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC}     Username: opashishyt                    ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC}     Password: Ashish@2006                  ${BLUE}│${NC}"
    echo -e "${BLUE}├─────────────────────────────────────────────┤${NC}"
    echo -e "${BLUE}│${NC}  ⏳ GitHub Pages takes 2-3 minutes to deploy  ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC}  🔄 Refresh page after 3 minutes             ${BLUE}│${NC}"
    echo -e "${BLUE}└─────────────────────────────────────────────┘${NC}"
    echo ""
}

# ============================================
# CREATE BACKUP
# ============================================
create_backup() {
    echo -e "${YELLOW}💾 Creating backup before deploy...${NC}"
    
    BACKUP_DIR="backups"
    mkdir -p $BACKUP_DIR
    
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/pre_deploy_backup_$TIMESTAMP.tar.gz"
    
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
        echo -e "${YELLOW}⚠️ Backup failed, continuing anyway...${NC}"
    fi
    
    echo ""
}

# ============================================
# CHECK GITHUB PAGES STATUS
# ============================================
check_pages_status() {
    echo -e "${YELLOW}🔍 Checking GitHub Pages status...${NC}"
    
    echo -e "${CYAN}📋 To enable GitHub Pages:${NC}"
    echo -e "  1. Go to: ${WHITE}$GITHUB_URL/settings/pages${NC}"
    echo -e "  2. Under 'Branch', select: ${WHITE}main${NC}"
    echo -e "  3. Select folder: ${WHITE}/ (root)${NC}"
    echo -e "  4. Click: ${WHITE}Save${NC}"
    echo -e "  5. Wait 2-3 minutes${NC}"
    echo ""
    
    read -p "Open GitHub Pages settings now? (y/n): " OPEN_SETTINGS
    
    if [[ $OPEN_SETTINGS == "y" || $OPEN_SETTINGS == "Y" ]]; then
        open_pages_settings
    fi
}

# ============================================
# MAIN DEPLOYMENT FUNCTION
# ============================================
main() {
    print_banner
    check_dependencies
    check_files
    create_nojekyll
    verify_git_config
    setup_remote
    clean_build
    create_backup
    create_commit
    push_to_github
    generate_url
    show_summary
    check_pages_status
    
    echo -e "${GREEN}🎉 Deployment process completed!${NC}"
    echo -e "${YELLOW}⚠️  Remember: GitHub Pages takes 2-3 minutes to update${NC}"
    echo ""
    
    # Ask to open website
    read -p "Open website now? (y/n): " OPEN_SITE
    
    if [[ $OPEN_SITE == "y" || $OPEN_SITE == "Y" ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$GITHUB_URL"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "$GITHUB_URL"
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
            start "$GITHUB_URL"
        fi
    fi
}

# ============================================
# SHOW HELP
# ============================================
show_help() {
    echo -e "${CYAN}FRP Bypass - GitHub Pages Deploy Script${NC}"
    echo -e "${YELLOW}Usage: ./deploy.sh [OPTION]${NC}"
    echo ""
    echo "Options:"
    echo "  -h, --help      Show this help message"
    echo "  -v, --version   Show version information"
    echo "  -c, --check     Check deployment status"
    echo "  -b, --backup    Create backup only"
    echo "  -p, --push      Push to GitHub only"
    echo "  -f, --force     Force deploy (skip confirmations)"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh              Full deployment"
    echo "  ./deploy.sh -b           Create backup"
    echo "  ./deploy.sh -p           Push only"
    echo "  ./deploy.sh -c          Check status"
    echo ""
}

# ============================================
# PROCESS COMMAND LINE ARGUMENTS
# ============================================
case "$1" in
    -h|--help)
        show_help
        exit 0
        ;;
    -v|--version)
        echo "FRP Bypass Deploy Script v$VERSION"
        exit 0
        ;;
    -c|--check)
        check_files
        generate_url
        echo -e "${CYAN}🌐 $GITHUB_URL${NC}"
        exit 0
        ;;
    -b|--backup)
        create_backup
        exit 0
        ;;
    -p|--push)
        create_commit
        push_to_github
        generate_url
        echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
        echo -e "${CYAN}🌐 $GITHUB_URL${NC}"
        exit 0
        ;;
    -f|--force)
        export FORCE_MODE=true
        main
        ;;
    *)
        main
        ;;
esac

# ============================================
# END OF SCRIPT
# ============================================