// ====== ADMIN APPS MANAGEMENT ======
// Full CRUD Operations for Apps

// ====== LOAD ADMIN APPS LIST ======
function loadAdminAppsList() {
    const adminAppsList = document.getElementById('adminAppsFullList');
    if (!adminAppsList) return;
    
    adminAppsList.innerHTML = '';
    
    apps.sort((a, b) => (a.number || a.id) - (b.number || b.id)).forEach((app, index) => {
        const appItem = document.createElement('div');
        appItem.className = 'admin-item-full';
        appItem.id = `app-${app.id}`;
        
        appItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-title">
                    <span>${app.name}</span>
                    <span class="admin-badge ${app.color}">${app.category || 'App'}</span>
                    <span class="admin-badge primary">ID: ${app.id}</span>
                </div>
                <div class="admin-item-meta">
                    <span><i class="fas fa-link"></i> ${app.url.substring(0, 50)}${app.url.length > 50 ? '...' : ''}</span>
                    <span><i class="fas fa-tag"></i> ${app.desc || 'No description'}</span>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-action-btn edit-btn" onclick="editApp(${app.id})" title="Edit App">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-action-btn rename-btn" onclick="renameApp(${app.id})" title="Rename">
                    <i class="fas fa-i-cursor"></i>
                </button>
                <button class="admin-action-btn replace-btn" onclick="replaceApp(${app.id})" title="Replace URL">
                    <i class="fas fa-exchange-alt"></i>
                </button>
                <button class="admin-action-btn delete-btn" onclick="deleteApp(${app.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        adminAppsList.appendChild(appItem);
    });
}

// ====== ADD NEW APP ======
window.addNewApp = function() {
    const name = document.getElementById('newAppName').value.trim();
    const icon = document.getElementById('newAppIcon').value.trim() || 'fas fa-mobile-alt';
    const color = document.getElementById('newAppColor').value;
    const category = document.getElementById('newAppCategory').value.trim() || 'Custom';
    const desc = document.getElementById('newAppDesc').value.trim() || `Open ${name}`;
    const url = document.getElementById('newAppUrl').value.trim();
    
    if (!name || !url) {
        alert('❌ App Name and URL are required!');
        return;
    }
    
    const newApp = {
        id: apps.length > 0 ? Math.max(...apps.map(a => a.id)) + 1 : 1,
        number: apps.length + 1,
        name: name,
        icon: icon,
        color: color,
        url: url,
        desc: desc,
        category: category
    };
    
    apps.push(newApp);
    saveApps();
    loadAdminAppsList();
    clearAppForm();
    
    showNotification('✅ App added successfully!', 'success');
};

// ====== EDIT APP ======
window.editApp = function(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    
    const newName = prompt('Edit App Name:', app.name);
    if (newName && newName.trim() !== '') {
        app.name = newName.trim();
    }
    
    const newDesc = prompt('Edit Description:', app.desc);
    if (newDesc && newDesc.trim() !== '') {
        app.desc = newDesc.trim();
    }
    
    const newUrl = prompt('Edit URL/Intent:', app.url);
    if (newUrl && newUrl.trim() !== '') {
        app.url = newUrl.trim();
    }
    
    saveApps();
    loadAdminAppsList();
    showNotification('✅ App updated successfully!', 'success');
};

// ====== RENAME APP ======
window.renameApp = function(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    
    const newName = prompt('Enter new name for app:', app.name);
    if (newName && newName.trim() !== '') {
        app.name = newName.trim();
        saveApps();
        loadAdminAppsList();
        showNotification('✅ App renamed successfully!', 'success');
    }
};

// ====== REPLACE APP URL ======
window.replaceApp = function(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    
    const newUrl = prompt('Enter new URL/Intent:', app.url);
    if (newUrl && newUrl.trim() !== '') {
        app.url = newUrl.trim();
        saveApps();
        loadAdminAppsList();
        showNotification('✅ App URL replaced successfully!', 'success');
    }
};

// ====== DELETE APP ======
window.deleteApp = function(appId) {
    if (confirm('⚠️ Are you sure you want to delete this app? This action cannot be undone!')) {
        const index = apps.findIndex(a => a.id === appId);
        if (index !== -1) {
            apps.splice(index, 1);
            saveApps();
            loadAdminAppsList();
            showNotification('✅ App deleted successfully!', 'warning');
        }
    }
};

// ====== SEARCH APPS ======
window.searchApps = function() {
    const searchTerm = document.getElementById('appSearchInput').value.toLowerCase();
    const adminAppsList = document.getElementById('adminAppsFullList');
    
    if (!adminAppsList) return;
    
    const filteredApps = apps.filter(app => 
        app.name.toLowerCase().includes(searchTerm) || 
        (app.desc && app.desc.toLowerCase().includes(searchTerm)) ||
        (app.category && app.category.toLowerCase().includes(searchTerm))
    );
    
    adminAppsList.innerHTML = '';
    
    filteredApps.forEach(app => {
        const appItem = document.createElement('div');
        appItem.className = 'admin-item-full';
        appItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-title">
                    <span>${app.name}</span>
                    <span class="admin-badge">${app.category || 'App'}</span>
                </div>
                <div class="admin-item-meta">
                    <span>${app.desc || ''}</span>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-action-btn edit-btn" onclick="editApp(${app.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-action-btn delete-btn" onclick="deleteApp(${app.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        adminAppsList.appendChild(appItem);
    });
};

// ====== SORT APPS ======
window.sortApps = function(type) {
    if (type === 'name') {
        apps.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === 'number') {
        apps.sort((a, b) => (a.number || a.id) - (b.number || b.id));
    }
    
    saveApps();
    loadAdminAppsList();
    showNotification(`✅ Apps sorted by ${type}!`, 'info');
};

// ====== RESET APPS TO DEFAULT ======
window.resetAppsToDefault = function() {
    if (confirm('⚠️ This will reset ALL apps to default settings! Continue?')) {
        localStorage.removeItem('frp_apps_complete');
        loadInitialData();
        saveApps();
        loadAdminAppsList();
        showNotification('✅ Apps reset to default!', 'warning');
    }
};

// ====== EXPORT APPS JSON ======
window.exportAppsJSON = function() {
    const dataStr = JSON.stringify(apps, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `frp_apps_backup_${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('✅ Apps exported successfully!', 'success');
};

// ====== CLEAR APP FORM ======
window.clearAppForm = function() {
    document.getElementById('newAppName').value = '';
    document.getElementById('newAppIcon').value = 'fas fa-mobile-alt';
    document.getElementById('newAppCategory').value = '';
    document.getElementById('newAppDesc').value = '';
    document.getElementById('newAppUrl').value = '';
};