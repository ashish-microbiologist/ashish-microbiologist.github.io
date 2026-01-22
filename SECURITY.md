# 🔒 Security & Privacy Policy

## Overview
This portfolio website includes security measures to protect sensitive information. Please follow these guidelines when uploading to GitHub.

## Files to NEVER Upload to GitHub

### ❌ **HIGH RISK FILES (NEVER UPLOAD):**
1. **Admin Credentials** (`admin-auth.js` - contains username/password)
2. **Session Data** (any file with session tokens)
3. **Local Storage Backups** (contains user data)
4. **Personal Information** (contact details, emails)
5. **API Keys & Secrets** (any configuration with keys)

### ⚠️ **SENSITIVE FILES (Rename before upload):**
1. `admin-auth.js` → Rename to `admin-auth-sample.js`
2. Any file with real email addresses
3. Any file with real social media links

## Security Features Implemented

### 1. **Admin Authentication**
- Secure login system with encrypted credentials
- Session management with auto-logout
- Failed attempt logging

### 2. **Data Protection**
- Local storage encryption for sensitive data
- XSS protection
- Input validation and sanitization

### 3. **File Security**
- File type restrictions
- Size limits (10MB max)
- Secure file naming conventions

## GitHub Upload Checklist

### ✅ **BEFORE UPLOADING:**
1. [ ] Remove real credentials from `admin-auth.js`
2. [ ] Replace real email with placeholder
3. [ ] Replace real Instagram with placeholder
4. [ ] Remove any personal backup files
5. [ ] Clear localStorage backup files
6. [ ] Remove session data files
7. [ ] Check `.gitignore` is properly configured

### ✅ **AFTER UPLOADING:**
1. [ ] Verify no sensitive data is visible
2. [ ] Test admin login with sample credentials
3. [ ] Check all links work with placeholders
4. [ ] Verify contact form doesn't send real emails

## Placeholder Data for GitHub

### Email:
```javascript
// REAL (remove before upload):
email: "opashishytff@gmail.com"

// GITHUB SAFE (use this):
email: "your-email@example.com"