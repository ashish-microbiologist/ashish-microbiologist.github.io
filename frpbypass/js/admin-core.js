// ====== ADMIN CORE - MASTER CONTROL ======
// Version: 4.0.0
// Full Admin Control Panel

// ====== ADMIN CREDENTIALS ======
let ADMIN_CREDENTIALS = {
    username: localStorage.getItem('admin_username') || 'opashishyt',
    password: localStorage.getItem('admin_password') || 'Ashish@2006'
};

// ====== GLOBAL APP DATA ======
let apps = [];
let files = [];

// ====== LOAD INITIAL DATA ======
function loadInitialData() {
    // Try to load from localStorage first
    const savedApps = localStorage.getItem('frp_apps_complete');
    const savedFiles = localStorage.getItem('frp_files_complete');
    
    if (savedApps) {
        apps = JSON.parse(savedApps);
    } else {
        // Default apps data
        apps = [
            { id: 1, name: 'Galaxy Store', icon: 'fas fa-store', color: 'samsung', url: 'intent://com.sec.android.app.samsungapps/#Intent;scheme=android-app;end', desc: 'Open Galaxy Store', category: 'Samsung', number: 1 },
            { id: 2, name: 'Google Quick Search Box', icon: 'fab fa-google', color: 'google', url: 'intent://com.google.android.googlequicksearchbox/#Intent;scheme=android-app;end', desc: 'Open Google Quick Search Box', category: 'Google', number: 2 },
            { id: 3, name: 'Setting App', icon: 'fas fa-cog', color: 'system', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'Open Setting App', category: 'System', number: 3 },
            { id: 4, name: 'Qr Scan Activity', icon: 'fas fa-qrcode', color: 'system', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'Open Setting App Qr Scan Activity', category: 'System', number: 4 },
            { id: 5, name: 'Activity Manager', icon: 'fas fa-tasks', color: 'system', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'Open Setting App Activity Manager', category: 'System', number: 5 },
            { id: 6, name: 'Screen Smartlock', icon: 'fas fa-lock', color: 'system', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'Open Screen Smartlock', category: 'Security', number: 6 },
            { id: 7, name: 'Samsung My Files', icon: 'fas fa-folder', color: 'samsung', url: 'intent://com.sec.android.app.myfiles/#Intent;scheme=android-app;end', desc: 'Open Samsung My Files', category: 'Samsung', number: 7 },
            { id: 8, name: 'Youtube', icon: 'fab fa-youtube', color: 'youtube', url: 'intent://com.google.android.youtube/#Intent;scheme=android-app;end', desc: 'Open Youtube', category: 'Google', number: 8 },
            { id: 9, name: 'Chrome', icon: 'fab fa-chrome', color: 'chrome', url: 'intent://com.android.chrome/#Intent;scheme=android-app;end', desc: 'Open Chrome', category: 'Google', number: 9 },
            { id: 10, name: 'Samsung Internet', icon: 'fas fa-globe', color: 'samsung', url: 'intent://com.sec.android.app.sbrowser/#Intent;scheme=android-app;end', desc: 'Open Samsung Internet', category: 'Samsung', number: 10 },
            { id: 11, name: 'Calculator', icon: 'fas fa-calculator', color: 'calculator', url: 'intent://com.google.android.calculator/#Intent;scheme=android-app;end', desc: 'Open Calculator', category: 'Tools', number: 11 },
            { id: 12, name: 'Alliance Shield', icon: 'fas fa-shield-alt', color: 'shield', url: 'https://galaxystore.samsung.com', desc: 'Open Alliance Shield', category: 'Security', number: 12 },
            { id: 13, name: 'Android Hidden Settings', icon: 'fas fa-user-secret', color: 'system', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'Open Android Hidden Settings', category: 'System', number: 13 },
            { id: 14, name: 'Login Account', icon: 'fas fa-user-circle', color: 'system', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'Open Login Account', category: 'System', number: 14 },
            { id: 15, name: 'Home Launcher', icon: 'fas fa-home', color: 'home', url: 'https://play.google.com/store/search?q=launcher&c=apps', desc: 'Open Home Launcher', category: 'Launcher', number: 15 },
            { id: 16, name: '*#0*#', icon: 'fas fa-code', color: 'code', url: 'tel:*#0*#', desc: 'Enable adb Tecno/Infinix', category: 'Service', number: 16 },
            { id: 17, name: 'Alliance Shield (Store)', icon: 'fas fa-shield-alt', color: 'shield', url: 'https://galaxystore.samsung.com', desc: 'Alliance Shield on Galaxy Store', category: 'Security', number: 17 },
            { id: 18, name: 'Files Shortcut', icon: 'fas fa-folder', color: 'samsung', url: 'intent://com.sec.android.app.myfiles/#Intent;scheme=android-app;end', desc: 'Files Shortcut on Galaxy Store', category: 'Samsung', number: 18 },
            { id: 19, name: 'ADB Settings', icon: 'fas fa-terminal', color: 'terminal', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'Enable ADB Mode', category: 'Developer', number: 19 },
            { id: 20, name: 'USB Settings', icon: 'fas fa-usb', color: 'usb', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'USB Debugging', category: 'System', number: 20 },
            { id: 21, name: 'Google Maps', icon: 'fas fa-map', color: 'google', url: 'intent://com.google.android.apps.maps/#Intent;scheme=android-app;end', desc: 'Open Google Maps', category: 'Google', number: 21 },
            { id: 22, name: 'Google Assistant', icon: 'fas fa-microphone', color: 'google', url: 'intent://com.google.android.googlequicksearchbox/#Intent;scheme=android-app;end', desc: 'Open Google Assistant', category: 'Google', number: 22 },
            { id: 23, name: 'Gmail', icon: 'fas fa-envelope', color: 'google', url: 'intent://com.google.android.gm/#Intent;scheme=android-app;end', desc: 'Open Gmail', category: 'Google', number: 23 },
            { id: 24, name: 'S9 Launcher', icon: 'fas fa-mobile-alt', color: 'system', url: 'https://play.google.com/store/search?q=s9%20launcher&c=apps', desc: 'Samsung S9 Launcher', category: 'Launcher', number: 24 },
            { id: 25, name: 'Samsung Touch ID', icon: 'fas fa-fingerprint', color: 'samsung', url: 'intent://com.android.settings/#Intent;scheme=android-app;end', desc: 'Fingerprint Settings', category: 'Security', number: 25 },
            { id: 26, name: 'Samsung Secure Folder', icon: 'fas fa-lock', color: 'samsung', url: 'intent://com.samsung.knox.securefolder/#Intent;scheme=android-app;end', desc: 'Secure Folder', category: 'Security', number: 26 },
            { id: 27, name: 'Smart Switch', icon: 'fas fa-exchange-alt', color: 'samsung', url: 'intent://com.sec.android.easyMover/#Intent;scheme=android-app;end', desc: 'Smart Switch App', category: 'Samsung', number: 27 },
            { id: 28, name: 'Samsung Dialer', icon: 'fas fa-phone', color: 'samsung', url: 'intent://com.samsung.android.dialer/#Intent;scheme=android-app;end', desc: 'Phone Dialer', category: 'Samsung', number: 28 },
            { id: 29, name: 'Mi File Manager', icon: 'fas fa-folder-open', color: 'system', url: 'intent://com.mi.android.globalFileexplorer/#Intent;scheme=android-app;end', desc: 'Xiaomi File Manager', category: 'Xiaomi', number: 29 },
            { id: 30, name: 'Xiaomi ShareMe', icon: 'fas fa-share-alt', color: 'system', url: 'intent://com.xiaomi.midrop/#Intent;scheme=android-app;end', desc: 'Share Files', category: 'Xiaomi', number: 30 },
            { id: 31, name: 'Vivo EasyShare', icon: 'fas fa-share-square', color: 'system', url: 'intent://com.vivo.easyshare/#Intent;scheme=android-app;end', desc: 'Vivo File Transfer', category: 'Vivo', number: 31 },
            { id: 32, name: 'OPPO Phone Clone', icon: 'fas fa-clone', color: 'system', url: 'intent://com.coloros.backuprestore/#Intent;scheme=android-app;end', desc: 'Clone Phone', category: 'Oppo', number: 32 }
        ];
        saveApps();
    }
    
    if (savedFiles) {
        files = JSON.parse(savedFiles);
    } else {
        // Default files data
        files = [
            { id: 1, name: 'Activity_Launcher.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Activity Launcher Tool', url: '#' },
            { id: 2, name: 'Alliance_Shield.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Alliance Shield X', url: '#' },
            { id: 3, name: 'Notification_Bar.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Notification Tester', url: '#' },
            { id: 4, name: 'Package_Manager.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Package Manager', url: '#' },
            { id: 5, name: 'Package_Disabler_Pro.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Disable Bloatware', url: '#' },
            { id: 6, name: 'Package_Disabler_PDC.apk', icon: 'fas fa-file-archive', desc: 'Backup File || PDC Disabler', url: '#' },
            { id: 7, name: 'Disable_systemUI.xml', icon: 'fas fa-file-code', desc: 'Backup File || SystemUI Disable', url: '#' },
            { id: 8, name: 'Disable_GoogleService.xml', icon: 'fas fa-file-code', desc: 'Backup File || Google Service Disable', url: '#' },
            { id: 9, name: 'Disable_MDM_Knox.xml', icon: 'fas fa-file-code', desc: 'Backup File || MDM Knox Disable', url: '#' },
            { id: 10, name: 'Disable_PlayServices.xml', icon: 'fas fa-file-code', desc: 'Backup File || Play Services Disable', url: '#' },
            { id: 11, name: 'Android_5_GAM.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Android 5 GAM', url: '#' },
            { id: 12, name: 'Android_6_GAM.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Android 6 GAM', url: '#' },
            { id: 13, name: 'Android_8-9-10_GAM.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Android 8/9/10 GAM', url: '#' },
            { id: 14, name: 'Google_Setting.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Google Settings', url: '#' },
            { id: 15, name: 'FRP_Bypass.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Main FRP Bypass', url: '#' },
            { id: 16, name: 'FRP_Android_7.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Android 7 FRP', url: '#' },
            { id: 17, name: 'FRP_addROM.apk', icon: 'fas fa-file-archive', desc: 'Backup File || AddROM FRP', url: '#' },
            { id: 18, name: 'Test_DPC.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Test DPC', url: '#' },
            { id: 19, name: 'QuickShortcutMaker.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Shortcut Maker', url: '#' },
            { id: 20, name: 'Apex_Launcher.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Apex Launcher', url: '#' },
            { id: 21, name: 'Nova_Launcher.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Nova Launcher', url: '#' },
            { id: 22, name: 'Menu_Button.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Menu Button', url: '#' },
            { id: 23, name: 'ES_File_Explorer.apk', icon: 'fas fa-file-archive', desc: 'Backup File || ES File Explorer', url: '#' },
            { id: 24, name: 'Setting.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Settings APK', url: '#' },
            { id: 25, name: 'HushSMS.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Hush SMS', url: '#' },
            { id: 26, name: 'Phone_Clone.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Phone Clone', url: '#' },
            { id: 27, name: 'File_Commander_Manager.apk', icon: 'fas fa-file-archive', desc: 'Backup File || File Commander', url: '#' },
            { id: 28, name: 'Smart_Switch_Mobile.apk', icon: 'fas fa-file-archive', desc: 'Backup File || Smart Switch', url: '#' }
        ];
        saveFiles();
    }
}

// ====== SAVE FUNCTIONS ======
function saveApps() {
    localStorage.setItem('frp_apps_complete', JSON.stringify(apps));
    updateAppCounters();
    renderApps();
}

function saveFiles() {
    localStorage.setItem('frp_files_complete', JSON.stringify(files));
    updateFileCounters();
    renderFiles();
}

// ====== UPDATE COUNTERS ======
function updateAppCounters() {
    document.querySelectorAll('#appCount, #appCountBadge, #adminAppCount').forEach(el => {
        if (el) el.innerText = apps.length;
    });
}

function updateFileCounters() {
    document.querySelectorAll('#fileCount, #fileCountBadge, #adminFileCount').forEach(el => {
        if (el) el.innerText = files.length;
    });
}

// ====== RENDER APPS ======
function renderApps() {
    const appsList = document.getElementById('apps-list');
    if (!appsList) return;
    
    appsList.innerHTML = '';
    
    apps.sort((a, b) => (a.number || a.id) - (b.number || b.id)).forEach((app, index) => {
        const appItem = document.createElement('div');
        appItem.className = 'app-item';
        
        appItem.innerHTML = `
            <div class="app-info">
                <div class="app-icon color-${app.color || 'default'}">
                    <i class="${app.icon}"></i>
                </div>
                <div class="app-details">
                    <div class="app-name">${app.name}</div>
                    <div class="app-desc">${app.desc || 'Open ' + app.name}</div>
                </div>
            </div>
            <button class="btn-open" onclick="launchApp(${index})">
                <i class="fas fa-external-link-alt"></i> OPEN
            </button>
        `;
        
        appsList.appendChild(appItem);
    });
}

// ====== RENDER FILES ======
function renderFiles() {
    const filesList = document.getElementById('files-list');
    if (!filesList) return;
    
    filesList.innerHTML = '';
    
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="${file.icon}"></i>
                </div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <span class="file-badge">${file.desc || 'Backup File'}</span>
                </div>
            </div>
            <button class="btn-download" onclick="downloadFile('${file.name}')">
                <i class="fas fa-download"></i> BACKUP
            </button>
        `;
        
        filesList.appendChild(fileItem);
    });
}

// ====== LAUNCH APP ======
window.launchApp = function(index) {
    const app = apps[index];
    document.getElementById('statusTitle').innerText = 'Opening ' + app.name + '...';
    
    try {
        if (app.url.startsWith('intent://') || app.url.startsWith('tel:')) {
            window.location.href = app.url;
        } else if (app.url.startsWith('http')) {
            window.open(app.url, '_blank');
        } else {
            alert('Cannot open ' + app.name);
        }
    } catch(e) {
        alert('Error launching app');
    }
    
    setTimeout(() => {
        document.getElementById('statusTitle').innerText = 'FRP TOOLS READY';
    }, 2000);
};

// ====== DOWNLOAD FILE ======
window.downloadFile = function(filename) {
    const file = files.find(f => f.name === filename);
    document.getElementById('statusTitle').innerText = 'Downloading ' + filename + '...';
    
    if (file && file.url && file.url !== '#') {
        window.open(file.url, '_blank');
    } else {
        alert(`🔐 FRP BYPASS TOOL\n\nFile: ${filename}\n\nDownload link will be updated soon by ASHISH YT.`);
    }
    
    setTimeout(() => {
        document.getElementById('statusTitle').innerText = 'FRP TOOLS READY';
    }, 2000);
};

// ====== SECTION SWITCHING ======
window.showSection = function(section, element) {
    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (element) {
        element.classList.add('active');
    }
    
    document.getElementById('statusDesc').innerText = section.toUpperCase() + ' • ASHISH BYPASS 2026';
};

// ====== ADMIN MODAL ======
window.openAdmin = function() {
    document.getElementById('adminModal').style.display = 'flex';
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    document.getElementById('loginErr').style.display = 'none';
};

window.closeAdmin = function() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminArea').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
};

// ====== LOGIN FUNCTION ======
window.login = function() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    
    if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('adminArea').style.display = 'block';
        document.getElementById('loginErr').style.display = 'none';
        document.getElementById('adminName').innerText = user.toUpperCase();
        loadAdminPanels();
    } else {
        document.getElementById('loginErr').style.display = 'block';
    }
};

// ====== LOAD ADMIN PANELS ======
function loadAdminPanels() {
    loadAdminAppsList();
    loadAdminFilesList();
}

// ====== SWITCH ADMIN TABS ======
window.switchAdminTab = function(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.remove('active');
    });
    
    event.currentTarget.classList.add('active');
    
    document.querySelectorAll('.admin-panel').forEach(p => {
        p.classList.remove('active');
    });
    
    document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}Panel`).classList.add('active');
    
    if (tab === 'apps') loadAdminAppsList();
    if (tab === 'files') loadAdminFilesList();
};

// ====== LOGOUT ======
window.logout = function() {
    document.getElementById('adminArea').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
    closeAdmin();
};

// ====== INITIALIZE ======
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    renderApps();
    renderFiles();
    
    // Generate IDs if not present
    if (apps.length > 0 && !apps[0].id) {
        apps = apps.map((app, index) => ({ ...app, id: index + 1 }));
        saveApps();
    }
    
    if (files.length > 0 && !files[0].id) {
        files = files.map((file, index) => ({ ...file, id: index + 1 }));
        saveFiles();
    }
    
    console.log('FRP BYPASS - Full Admin Control Loaded');
});

// ====== CLOSE MODAL ON OUTSIDE CLICK ======
window.onclick = function(event) {
    const modal = document.getElementById('adminModal');
    if (event.target === modal) {
        closeAdmin();
    }
};