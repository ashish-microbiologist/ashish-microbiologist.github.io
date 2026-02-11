// ====== ADMIN SETTINGS & BACKUP ======
// Full Control Settings

// ====== SHOW NOTIFICATION ======
function showNotification(message, type = 'info') {
    const statusTitle = document.getElementById('statusTitle');
    if (statusTitle) {
        statusTitle.innerText = message;
        statusTitle.style.color = type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6';
        
        setTimeout(() => {
            statusTitle.innerText = 'FRP TOOLS READY';
            statusTitle.style.color = 'white';
        }, 3000);
    }
}

// ====== CHANGE ADMIN CREDENTIALS ======
window.changeAdminCredentials = function() {
    const newUser = document.getElementById('newAdminUser').value.trim();
    const newPass = document.getElementById('newAdminPass').value;
    const confirmPass = document.getElementById('confirmAdminPass').value;
    
    if (!newUser || !newPass) {
        alert('❌ Username and password cannot be empty!');
        return;
    }
    
    if (newPass !== confirmPass) {
        alert('❌ Passwords do not match!');
        return;
    }
    
    ADMIN_CREDENTIALS.username = newUser;
    ADMIN_CREDENTIALS.password = newPass;
    
    localStorage.setItem('admin_username', newUser);
    localStorage.setItem('admin_password', newPass);
    
    showNotification('✅ Admin credentials updated successfully!', 'success');
    
    document.getElementById('newAdminUser').value = '';
    document.getElementById('newAdminPass').value = '';
    document.getElementById('confirmAdminPass').value = '';
};

// ====== UPDATE WEBSITE SETTINGS ======
window.updateWebsiteSettings = function() {
    const siteTitle = document.getElementById('siteTitle').value;
    const statusMessage = document.getElementById('statusMessage').value;
    
    if (siteTitle) {
        document.querySelector('.header-text h1').innerText = siteTitle;
        localStorage.setItem('site_title', siteTitle);
    }
    
    if (statusMessage) {
        document.getElementById('statusTitle').innerText = statusMessage;
        localStorage.setItem('status_message', statusMessage);
    }
    
    showNotification('✅ Website settings updated!', 'success');
};

// ====== RESET ALL DATA ======
window.resetAllData = function() {
    if (confirm('⚠️⚠️⚠️\n\nDANGER: This will DELETE ALL APPS and FILES!\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?')) {
        const doubleConfirm = prompt('Type "RESET" to confirm:');
        
        if (doubleConfirm === 'RESET') {
            localStorage.removeItem('frp_apps_complete');
            localStorage.removeItem('frp_files_complete');
            
            loadInitialData();
            saveApps();
            saveFiles();
            loadAdminAppsList();
            loadAdminFilesList();
            
            showNotification('⚠️ All data has been reset to default!', 'warning');
        }
    }
};

// ====== CLEAR ALL STORAGE ======
window.clearAllStorage = function() {
    if (confirm('⚠️ Clear all localStorage? This will reset all custom data!')) {
        localStorage.clear();
        location.reload();
    }
};

// ====== EXPORT ALL DATA ======
window.exportAllData = function() {
    const fullData = {
        apps: apps,
        files: files,
        settings: {
            admin_username: ADMIN_CREDENTIALS.username,
            site_title: localStorage.getItem('site_title') || 'ASHISH BYPASS GOOGLE ACCOUNT 2026',
            export_date: new Date().toISOString(),
            version: '4.0.0'
        }
    };
    
    const dataStr = JSON.stringify(fullData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `frp_complete_backup_${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('✅ Complete backup exported!', 'success');
};

// ====== IMPORT ALL DATA ======
window.importAllData = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.apps && Array.isArray(importedData.apps)) {
                    apps = importedData.apps;
                    saveApps();
                }
                
                if (importedData.files && Array.isArray(importedData.files)) {
                    files = importedData.files;
                    saveFiles();
                }
                
                loadAdminAppsList();
                loadAdminFilesList();
                
                showNotification('✅ Data imported successfully!', 'success');
            } catch(error) {
                alert('❌ Invalid backup file!');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

// ====== CREATE BACKUP ======
window.createBackup = function() {
    const timestamp = new Date().toLocaleString();
    const backup = {
        id: Date.now(),
        timestamp: timestamp,
        apps_count: apps.length,
        files_count: files.length,
        data: {
            apps: apps,
            files: files
        }
    };
    
    const backups = JSON.parse(localStorage.getItem('frp_backups') || '[]');
    backups.push(backup);
    localStorage.setItem('frp_backups', JSON.stringify(backups));
    
    loadBackupList();
    showNotification('✅ Backup created successfully!', 'success');
};

// ====== RESTORE BACKUP ======
window.restoreBackup = function() {
    const backups = JSON.parse(localStorage.getItem('frp_backups') || '[]');
    
    if (backups.length === 0) {
        alert('❌ No backups found!');
        return;
    }
    
    const latestBackup = backups[backups.length - 1];
    
    if (confirm(`Restore backup from ${latestBackup.timestamp}?`)) {
        apps = latestBackup.data.apps;
        files = latestBackup.data.files;
        
        saveApps();
        saveFiles();
        loadAdminAppsList();
        loadAdminFilesList();
        
        showNotification('✅ Backup restored successfully!', 'success');
    }
};

// ====== DOWNLOAD BACKUP ======
window.downloadBackup = function() {
    const backups = JSON.parse(localStorage.getItem('frp_backups') || '[]');
    
    if (backups.length === 0) {
        alert('❌ No backups found!');
        return;
    }
    
    const latestBackup = backups[backups.length - 1];
    
    const dataStr = JSON.stringify(latestBackup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `frp_backup_${latestBackup.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('✅ Backup downloaded!', 'success');
};

// ====== LOAD BACKUP LIST ======
function loadBackupList() {
    const backupList = document.getElementById('backupList');
    if (!backupList) return;
    
    const backups = JSON.parse(localStorage.getItem('frp_backups') || '[]');
    
    backupList.innerHTML = '';
    
    backups.slice(-5).reverse().forEach(backup => {
        const backupItem = document.createElement('div');
        backupItem.className = 'admin-item';
        backupItem.innerHTML = `
            <div>
                <span style="font-weight: 700;">${backup.timestamp}</span>
                <small>${backup.apps_count} Apps • ${backup.files_count} Files</small>
            </div>
            <i class="fas fa-check-circle" style="color: #10b981;"></i>
        `;
        backupList.appendChild(backupItem);
    });
}

// ====== APPLY SAVED SETTINGS ======
function applySavedSettings() {
    const savedTitle = localStorage.getItem('site_title');
    if (savedTitle) {
        document.querySelector('.header-text h1').innerText = savedTitle;
    }
    
    const savedStatus = localStorage.getItem('status_message');
    if (savedStatus) {
        document.getElementById('statusTitle').innerText = savedStatus;
    }
}

// Apply settings on load
document.addEventListener('DOMContentLoaded', function() {
    applySavedSettings();
});