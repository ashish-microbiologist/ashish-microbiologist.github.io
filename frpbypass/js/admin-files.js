// ====== ADMIN FILES MANAGEMENT ======
// Full CRUD Operations for Files

// ====== LOAD ADMIN FILES LIST ======
function loadAdminFilesList() {
    const adminFilesList = document.getElementById('adminFilesFullList');
    if (!adminFilesList) return;
    
    adminFilesList.innerHTML = '';
    
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'admin-item-full';
        fileItem.id = `file-${file.id}`;
        
        fileItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-title">
                    <span>${file.name}</span>
                    <span class="admin-badge">${file.desc ? file.desc.substring(0, 20) : 'APK'}</span>
                    <span class="admin-badge primary">ID: ${file.id}</span>
                </div>
                <div class="admin-item-meta">
                    <span><i class="fas fa-link"></i> ${file.url || '#'}</span>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-action-btn edit-btn" onclick="editFile(${file.id})" title="Edit File">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-action-btn rename-btn" onclick="renameFile(${file.id})" title="Rename">
                    <i class="fas fa-i-cursor"></i>
                </button>
                <button class="admin-action-btn replace-btn" onclick="replaceFileUrl(${file.id})" title="Replace URL">
                    <i class="fas fa-exchange-alt"></i>
                </button>
                <button class="admin-action-btn delete-btn" onclick="deleteFile(${file.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        adminFilesList.appendChild(fileItem);
    });
}

// ====== ADD NEW FILE ======
window.addNewFile = function() {
    const name = document.getElementById('newFileName').value.trim();
    const icon = document.getElementById('newFileIcon').value.trim() || 'fas fa-file-archive';
    const desc = document.getElementById('newFileDesc').value.trim() || 'Backup File';
    const url = document.getElementById('newFileUrl').value.trim() || '#';
    
    if (!name) {
        alert('❌ File name is required!');
        return;
    }
    
    const newFile = {
        id: files.length > 0 ? Math.max(...files.map(f => f.id)) + 1 : 1,
        name: name,
        icon: icon,
        desc: desc,
        url: url
    };
    
    files.push(newFile);
    saveFiles();
    loadAdminFilesList();
    clearFileForm();
    
    showNotification('✅ File added successfully!', 'success');
};

// ====== EDIT FILE ======
window.editFile = function(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    const newName = prompt('Edit File Name:', file.name);
    if (newName && newName.trim() !== '') {
        file.name = newName.trim();
    }
    
    const newDesc = prompt('Edit Description:', file.desc);
    if (newDesc && newDesc.trim() !== '') {
        file.desc = newDesc.trim();
    }
    
    saveFiles();
    loadAdminFilesList();
    showNotification('✅ File updated successfully!', 'success');
};

// ====== RENAME FILE ======
window.renameFile = function(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    const newName = prompt('Enter new filename:', file.name);
    if (newName && newName.trim() !== '') {
        file.name = newName.trim();
        saveFiles();
        loadAdminFilesList();
        showNotification('✅ File renamed successfully!', 'success');
    }
};

// ====== REPLACE FILE URL ======
window.replaceFileUrl = function(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    const newUrl = prompt('Enter new download URL:', file.url);
    if (newUrl && newUrl.trim() !== '') {
        file.url = newUrl.trim();
        saveFiles();
        loadAdminFilesList();
        showNotification('✅ File URL updated successfully!', 'success');
    }
};

// ====== DELETE FILE ======
window.deleteFile = function(fileId) {
    if (confirm('⚠️ Are you sure you want to delete this file? This action cannot be undone!')) {
        const index = files.findIndex(f => f.id === fileId);
        if (index !== -1) {
            files.splice(index, 1);
            saveFiles();
            loadAdminFilesList();
            showNotification('✅ File deleted successfully!', 'warning');
        }
    }
};

// ====== SEARCH FILES ======
window.searchFiles = function() {
    const searchTerm = document.getElementById('fileSearchInput').value.toLowerCase();
    const adminFilesList = document.getElementById('adminFilesFullList');
    
    if (!adminFilesList) return;
    
    const filteredFiles = files.filter(file => 
        file.name.toLowerCase().includes(searchTerm) || 
        (file.desc && file.desc.toLowerCase().includes(searchTerm))
    );
    
    adminFilesList.innerHTML = '';
    
    filteredFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'admin-item-full';
        fileItem.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-title">
                    <span>${file.name}</span>
                </div>
                <div class="admin-item-meta">
                    <span>${file.desc || ''}</span>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-action-btn edit-btn" onclick="editFile(${file.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-action-btn delete-btn" onclick="deleteFile(${file.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        adminFilesList.appendChild(fileItem);
    });
};

// ====== CLEAR FILE FORM ======
window.clearFileForm = function() {
    document.getElementById('newFileName').value = '';
    document.getElementById('newFileIcon').value = 'fas fa-file-archive';
    document.getElementById('newFileDesc').value = '';
    document.getElementById('newFileUrl').value = '';
};