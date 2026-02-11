// ====== ADMIN BACKUP SYSTEM ======
// Full Backup & Restore Functionality

// ====== BACKUP CONFIGURATION ======
const BACKUP_CONFIG = {
    maxBackups: 10,
    autoBackupInterval: 3600000, // 1 hour
    compressionEnabled: true
};

// ====== BACKUP STORAGE KEY ======
const BACKUP_STORAGE_KEY = 'frp_backup_history';

// ====== INITIALIZE BACKUP SYSTEM ======
function initBackupSystem() {
    // Load backup history
    loadBackupHistory();
    
    // Setup auto backup
    setInterval(() => {
        if (confirmAutoBackup()) {
            createAutoBackup();
        }
    }, BACKUP_CONFIG.autoBackupInterval);
    
    console.log('✅ Backup System Initialized');
}

// ====== CREATE BACKUP ======
window.createBackup = function(backupName = '') {
    try {
        const timestamp = new Date();
        const backupId = Date.now();
        
        // Create backup object
        const backup = {
            id: backupId,
            name: backupName || `Backup_${formatDate(timestamp)}`,
            timestamp: timestamp.toISOString(),
            formattedDate: formatDate(timestamp, true),
            apps: JSON.parse(JSON.stringify(apps)), // Deep copy
            files: JSON.parse(JSON.stringify(files)),
            settings: {
                adminUsername: ADMIN_CREDENTIALS.username,
                siteTitle: localStorage.getItem('site_title') || 'ASHISH BYPASS GOOGLE ACCOUNT 2026',
                statusMessage: localStorage.getItem('status_message') || 'FRP TOOLS READY',
                appCount: apps.length,
                fileCount: files.length
            },
            metadata: {
                version: '4.0.0',
                userAgent: navigator.userAgent,
                platform: navigator.platform
            }
        };
        
        // Save to localStorage
        saveBackup(backup);
        
        // Show success message
        showNotification(`✅ Backup created: ${backup.name}`, 'success');
        
        // Refresh backup list
        loadBackupHistory();
        
        return backup;
    } catch (error) {
        console.error('Backup creation failed:', error);
        showNotification('❌ Backup creation failed', 'error');
        return null;
    }
};

// ====== CREATE AUTO BACKUP ======
function createAutoBackup() {
    const autoBackup = createBackup('Auto_Backup');
    
    // Manage backup limit
    const backups = getBackups();
    if (backups.length > BACKUP_CONFIG.maxBackups) {
        // Remove oldest backup
        const oldestBackup = backups.reduce((oldest, current) => 
            current.id < oldest.id ? current : oldest
        );
        deleteBackup(oldestBackup.id, false);
    }
}

// ====== CONFIRM AUTO BACKUP ======
function confirmAutoBackup() {
    const lastBackup = getLastBackup();
    
    if (!lastBackup) return true;
    
    const lastBackupTime = new Date(lastBackup.timestamp).getTime();
    const currentTime = Date.now();
    const timeDiff = currentTime - lastBackupTime;
    
    return timeDiff >= BACKUP_CONFIG.autoBackupInterval;
}

// ====== GET LAST BACKUP ======
function getLastBackup() {
    const backups = getBackups();
    return backups.length > 0 ? backups[backups.length - 1] : null;
}

// ====== GET ALL BACKUPS ======
function getBackups() {
    const backups = localStorage.getItem(BACKUP_STORAGE_KEY);
    return backups ? JSON.parse(backups) : [];
}

// ====== SAVE BACKUP ======
function saveBackup(backup) {
    let backups = getBackups();
    backups.push(backup);
    
    // Sort by date (newest first)
    backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Limit number of backups
    if (backups.length > BACKUP_CONFIG.maxBackups) {
        backups = backups.slice(0, BACKUP_CONFIG.maxBackups);
    }
    
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backups));
}

// ====== DELETE BACKUP ======
window.deleteBackup = function(backupId, showConfirm = true) {
    if (showConfirm && !confirm('⚠️ Delete this backup permanently?')) {
        return;
    }
    
    let backups = getBackups();
    backups = backups.filter(b => b.id !== backupId);
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backups));
    
    loadBackupHistory();
    showNotification('✅ Backup deleted', 'info');
};

// ====== RESTORE BACKUP ======
window.restoreBackup = function(backupId) {
    if (!confirm('⚠️ Restore this backup? Current data will be replaced!')) {
        return;
    }
    
    const backups = getBackups();
    const backup = backups.find(b => b.id === backupId);
    
    if (!backup) {
        showNotification('❌ Backup not found', 'error');
        return;
    }
    
    try {
        // Restore apps
        if (backup.apps && Array.isArray(backup.apps)) {
            apps = backup.apps;
            saveApps();
        }
        
        // Restore files
        if (backup.files && Array.isArray(backup.files)) {
            files = backup.files;
            saveFiles();
        }
        
        // Restore settings
        if (backup.settings) {
            if (backup.settings.adminUsername) {
                ADMIN_CREDENTIALS.username = backup.settings.adminUsername;
                localStorage.setItem('admin_username', backup.settings.adminUsername);
            }
            
            if (backup.settings.siteTitle) {
                localStorage.setItem('site_title', backup.settings.siteTitle);
                document.querySelector('.header-text h1').innerText = backup.settings.siteTitle;
            }
            
            if (backup.settings.statusMessage) {
                localStorage.setItem('status_message', backup.settings.statusMessage);
                document.getElementById('statusTitle').innerText = backup.settings.statusMessage;
            }
        }
        
        // Refresh UI
        renderApps();
        renderFiles();
        loadAdminAppsList();
        loadAdminFilesList();
        
        showNotification('✅ Backup restored successfully!', 'success');
    } catch (error) {
        console.error('Restore failed:', error);
        showNotification('❌ Restore failed', 'error');
    }
};

// ====== DOWNLOAD BACKUP ======
window.downloadBackup = function(backupId) {
    const backups = getBackups();
    const backup = backups.find(b => b.id === backupId);
    
    if (!backup) {
        showNotification('❌ Backup not found', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `frp_backup_${backup.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('✅ Backup downloaded', 'success');
};

// ====== UPLOAD BACKUP ======
window.uploadBackup = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const backup = JSON.parse(e.target.result);
                
                // Validate backup format
                if (!backup.id || !backup.apps || !backup.files) {
                    throw new Error('Invalid backup file');
                }
                
                saveBackup(backup);
                loadBackupHistory();
                showNotification('✅ Backup uploaded successfully!', 'success');
            } catch (error) {
                showNotification('❌ Invalid backup file', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

// ====== LOAD BACKUP HISTORY ======
function loadBackupHistory() {
    const backupList = document.getElementById('backupList');
    if (!backupList) return;
    
    const backups = getBackups();
    
    if (backups.length === 0) {
        backupList.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #94a3b8;">
                <i class="fas fa-database" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>No backups found</p>
                <p style="font-size: 13px; margin-top: 8px;">Create your first backup to get started</p>
            </div>
        `;
        return;
    }
    
    backupList.innerHTML = '';
    
    backups.forEach(backup => {
        const backupItem = document.createElement('div');
        backupItem.className = 'admin-item-full';
        backupItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-title">
                    <span><i class="fas fa-database" style="color: #3b82f6;"></i> ${backup.name}</span>
                    <span class="admin-badge">${backup.settings?.appCount || 0} Apps</span>
                    <span class="admin-badge">${backup.settings?.fileCount || 0} Files</span>
                </div>
                <div class="admin-item-meta">
                    <span><i class="fas fa-calendar"></i> ${backup.formattedDate || new Date(backup.timestamp).toLocaleString()}</span>
                    <span><i class="fas fa-id-card"></i> ID: ${backup.id}</span>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-action-btn" style="background: #10b981;" onclick="restoreBackup(${backup.id})" title="Restore Backup">
                    <i class="fas fa-history"></i>
                </button>
                <button class="admin-action-btn" style="background: #3b82f6;" onclick="downloadBackup(${backup.id})" title="Download Backup">
                    <i class="fas fa-download"></i>
                </button>
                <button class="admin-action-btn" style="background: #ef4444;" onclick="deleteBackup(${backup.id})" title="Delete Backup">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        backupList.appendChild(backupItem);
    });
}

// ====== FORMAT DATE ======
function formatDate(date, detailed = false) {
    const d = new Date(date);
    
    if (detailed) {
        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }
    
    return `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}_${d.getHours().toString().padStart(2,'0')}${d.getMinutes().toString().padStart(2,'0')}`;
}

// ====== EXPORT ALL BACKUPS ======
window.exportAllBackups = function() {
    const backups = getBackups();
    
    if (backups.length === 0) {
        showNotification('❌ No backups to export', 'error');
        return;
    }
    
    const exportData = {
        exportedAt: new Date().toISOString(),
        backupCount: backups.length,
        backups: backups
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `frp_all_backups_${Date.now()}.json`);
    linkElement.click();
    
    showNotification('✅ All backups exported', 'success');
};

// ====== CLEAR ALL BACKUPS ======
window.clearAllBackups = function() {
    if (confirm('⚠️⚠️⚠️\n\nDelete ALL backups permanently?\n\nThis action CANNOT be undone!')) {
        localStorage.removeItem(BACKUP_STORAGE_KEY);
        loadBackupHistory();
        showNotification('✅ All backups cleared', 'warning');
    }
};

// Initialize backup system
document.addEventListener('DOMContentLoaded', initBackupSystem);