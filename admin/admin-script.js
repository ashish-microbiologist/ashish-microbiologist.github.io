// Admin Panel JavaScript - Microbiology Research Lab
// No PHP - Pure JavaScript/JSON Implementation

// Admin Configuration
const ADMIN_CONFIG = {
    STORAGE_KEY: 'microbiology_lab_admin',
    PROJECTS_KEY: 'lab_projects',
    DEFAULT_CREDENTIALS: {
        username: 'admin',
        password: 'microbiology123'
    }
};

// State Management
let adminState = {
    isAuthenticated: false,
    projects: [],
    currentUser: null
};

// DOM Elements
const adminElements = {
    loginForm: document.getElementById('adminLoginForm'),
    togglePassword: document.getElementById('togglePassword'),
    
    // Dashboard elements (will be set after login)
    logoutBtn: null,
    addProjectBtn: null,
    projectsTableBody: null,
    projectForm: null,
    projectModal: null,
    closeModalBtns: null
};

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    // Check if on login page or dashboard
    if (window.location.pathname.includes('admin/index.html')) {
        initializeLoginPage();
    } else if (window.location.pathname.includes('admin/dashboard.html')) {
        initializeDashboard();
    }
});

// Initialize Login Page
function initializeLoginPage() {
    if (!adminElements.loginForm) return;
    
    // Load saved credentials if "Remember me" was checked
    loadSavedCredentials();
    
    // Form submission
    adminElements.loginForm.addEventListener('submit', handleLogin);
    
    // Password toggle
    if (adminElements.togglePassword) {
        adminElements.togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Check if already logged in
    const savedSession = localStorage.getItem(`${ADMIN_CONFIG.STORAGE_KEY}_session`);
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            if (session.expires > Date.now()) {
                // Auto-redirect to dashboard
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            // Invalid session data
            localStorage.removeItem(`${ADMIN_CONFIG.STORAGE_KEY}_session`);
        }
    }
}

// Initialize Dashboard
function initializeDashboard() {
    // Check authentication
    checkAdminAuth();
    
    // Initialize dashboard components
    initializeDashboardComponents();
    
    // Load data
    loadDashboardData();
    
    // Initialize event listeners
    initializeDashboardEvents();
}

// Check Admin Authentication
function checkAdminAuth() {
    const savedSession = localStorage.getItem(`${ADMIN_CONFIG.STORAGE_KEY}_session`);
    
    if (!savedSession) {
        redirectToLogin();
        return;
    }
    
    try {
        const session = JSON.parse(savedSession);
        
        // Check if session is expired
        if (session.expires < Date.now()) {
            localStorage.removeItem(`${ADMIN_CONFIG.STORAGE_KEY}_session`);
            redirectToLogin();
            return;
        }
        
        // Update state
        adminState.isAuthenticated = true;
        adminState.currentUser = session.user;
        
        // Update UI with user info
        updateUserInfo();
        
    } catch (error) {
        console.error('Session validation error:', error);
        redirectToLogin();
    }
}

// Redirect to login page
function redirectToLogin() {
    window.location.href = 'index.html';
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    // Validate credentials
    if (validateCredentials(username, password)) {
        // Create session
        createSession(username, rememberMe);
        
        // Redirect to dashboard
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } else {
        showError('Invalid username or password');
    }
}

// Validate credentials
function validateCredentials(username, password) {
    // Check against default credentials
    if (username === ADMIN_CONFIG.DEFAULT_CREDENTIALS.username && 
        password === ADMIN_CONFIG.DEFAULT_CREDENTIALS.password) {
        return true;
    }
    
    // Check against stored credentials (for future expansion)
    const storedCredentials = localStorage.getItem(`${ADMIN_CONFIG.STORAGE_KEY}_credentials`);
    if (storedCredentials) {
        try {
            const credentials = JSON.parse(storedCredentials);
            return credentials.username === username && credentials.password === password;
        } catch (error) {
            return false;
        }
    }
    
    return false;
}

// Create session
function createSession(username, rememberMe) {
    const session = {
        user: {
            username: username,
            role: 'administrator',
            loginTime: new Date().toISOString()
        },
        expires: Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000) // 7 days or 1 day
    };
    
    localStorage.setItem(`${ADMIN_CONFIG.STORAGE_KEY}_session`, JSON.stringify(session));
}

// Load saved credentials
function loadSavedCredentials() {
    const savedCredentials = localStorage.getItem(`${ADMIN_CONFIG.STORAGE_KEY}_remember`);
    if (savedCredentials) {
        try {
            const credentials = JSON.parse(savedCredentials);
            document.getElementById('username').value = credentials.username || '';
            if (document.getElementById('rememberMe')) {
                document.getElementById('rememberMe').checked = true;
            }
        } catch (error) {
            // Invalid saved credentials
        }
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Initialize Dashboard Components
function initializeDashboardComponents() {
    // Get dashboard elements
    adminElements.logoutBtn = document.getElementById('logoutBtn');
    adminElements.addProjectBtn = document.getElementById('addProjectBtn');
    adminElements.projectsTableBody = document.querySelector('#projectsTable tbody');
    adminElements.projectForm = document.getElementById('projectForm');
    adminElements.projectModal = document.getElementById('projectModal');
    adminElements.closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');
    
    // Set user info in dashboard
    updateUserInfo();
}

// Update user info in dashboard
function updateUserInfo() {
    if (!adminState.currentUser) return;
    
    const usernameElement = document.getElementById('adminUsername');
    const avatarElement = document.getElementById('adminAvatar');
    
    if (usernameElement) {
        usernameElement.textContent = adminState.currentUser.username;
    }
    
    if (avatarElement) {
        avatarElement.textContent = adminState.currentUser.username.charAt(0).toUpperCase();
    }
}

// Load dashboard data
function loadDashboardData() {
    // Load projects
    loadProjects();
    
    // Update stats
    updateDashboardStats();
}

// Load projects
function loadProjects() {
    try {
        // Try to load from localStorage first
        const savedProjects = localStorage.getItem(ADMIN_CONFIG.PROJECTS_KEY);
        
        if (savedProjects) {
            adminState.projects = JSON.parse(savedProjects);
        } else {
            // Load from main projects.json
            fetch('../projects.json')
                .then(response => response.json())
                .then(projects => {
                    adminState.projects = projects;
                    saveProjects();
                    updateProjectsTable();
                })
                .catch(error => {
                    console.error('Error loading projects:', error);
                    adminState.projects = getSampleProjects();
                    saveProjects();
                    updateProjectsTable();
                });
        }
        
        updateProjectsTable();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        adminState.projects = getSampleProjects();
        updateProjectsTable();
    }
}

// Save projects to localStorage
function saveProjects() {
    try {
        localStorage.setItem(ADMIN_CONFIG.PROJECTS_KEY, JSON.stringify(adminState.projects));
    } catch (error) {
        console.error('Error saving projects:', error);
    }
}

// Update projects table
function updateProjectsTable() {
    if (!adminElements.projectsTableBody) return;
    
    if (adminState.projects.length === 0) {
        adminElements.projectsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="fas fa-flask fa-2x text-muted mb-2"></i>
                    <p class="mb-0 text-muted">No research projects found</p>
                    <button class="btn btn-primary mt-2" onclick="openAddProjectModal()">
                        <i class="fas fa-plus"></i> Add First Project
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    adminElements.projectsTableBody.innerHTML = adminState.projects.map(project => `
        <tr>
            <td>${project.id}</td>
            <td class="project-image-cell">
                <img src="${project.image}" alt="${escapeHtml(project.title)}" width="80">
            </td>
            <td>
                <strong>${escapeHtml(project.title)}</strong>
                <div class="small text-muted">${escapeHtml(project.principal_investigator || 'Lab Team')}</div>
            </td>
            <td>
                <div class="d-flex flex-wrap gap-1">
                    ${(project.tags || []).map(tag => 
                        `<span class="badge bg-light text-dark">${escapeHtml(tag)}</span>`
                    ).join('')}
                </div>
            </td>
            <td>
                <span class="badge ${project.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                    ${project.status || 'active'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update dashboard stats
function updateDashboardStats() {
    const totalProjects = adminState.projects.length;
    const completedProjects = adminState.projects.filter(p => p.status === 'completed').length;
    const ongoingProjects = totalProjects - completedProjects;
    
    // Update stats cards
    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('completedProjects').textContent = completedProjects;
    document.getElementById('ongoingProjects').textContent = ongoingProjects;
    document.getElementById('researchTeam').textContent = '10+'; // Static for now
}

// Initialize dashboard event listeners
function initializeDashboardEvents() {
    // Logout button
    if (adminElements.logoutBtn) {
        adminElements.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Add project button
    if (adminElements.addProjectBtn) {
        adminElements.addProjectBtn.addEventListener('click', openAddProjectModal);
    }
    
    // Project form submission
    if (adminElements.projectForm) {
        adminElements.projectForm.addEventListener('submit', handleProjectForm);
    }
    
    // Close modal buttons
    if (adminElements.closeModalBtns) {
        adminElements.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
    }
    
    // Close modal on overlay click
    if (adminElements.projectModal) {
        adminElements.projectModal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeModal();
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Escape to close modal
        if (event.key === 'Escape') {
            closeModal();
        }
        
        // Ctrl/Cmd + N to add new project
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            openAddProjectModal();
        }
    });
}

// Handle logout
function handleLogout() {
    // Clear session
    localStorage.removeItem(`${ADMIN_CONFIG.STORAGE_KEY}_session`);
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Open add project modal
function openAddProjectModal() {
    if (!adminElements.projectModal) return;
    
    // Reset form
    if (adminElements.projectForm) {
        adminElements.projectForm.reset();
        adminElements.projectForm.setAttribute('data-mode', 'add');
        adminElements.projectForm.removeAttribute('data-project-id');
        
        // Set default values
        document.getElementById('projectStatus').value = 'active';
        document.getElementById('projectCategory').value = 'ongoing';
    }
    
    // Update modal title
    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Add New Research Project';
    }
    
    // Show modal
    adminElements.projectModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Edit project
function editProject(projectId) {
    const project = adminState.projects.find(p => p.id === projectId);
    
    if (!project) {
        showError('Project not found');
        return;
    }
    
    openEditProjectModal(project);
}

// Open edit project modal
function openEditProjectModal(project) {
    if (!adminElements.projectModal) return;
    
    // Fill form with project data
    if (adminElements.projectForm) {
        adminElements.projectForm.setAttribute('data-mode', 'edit');
        adminElements.projectForm.setAttribute('data-project-id', project.id);
        
        // Fill form fields
        const fields = [
            'title', 'shortDescription', 'fullDescription', 'image',
            'status', 'category', 'start_date', 'end_date',
            'principal_investigator', 'funding_source'
        ];
        
        fields.forEach(field => {
            const input = document.getElementById(`project${field.charAt(0).toUpperCase() + field.slice(1)}`);
            if (input && project[field]) {
                if (input.type === 'textarea') {
                    input.value = project[field];
                } else {
                    input.value = project[field];
                }
            }
        });
        
        // Handle tags
        const tagsInput = document.getElementById('projectTags');
        if (tagsInput && project.tags) {
            tagsInput.value = Array.isArray(project.tags) ? project.tags.join(', ') : project.tags;
        }
        
        // Handle details
        const detailsInput = document.getElementById('projectDetails');
        if (detailsInput && project.details) {
            detailsInput.value = Array.isArray(project.details) ? project.details.join('\\n') : project.details;
        }
    }
    
    // Update modal title
    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Research Project';
    }
    
    // Show modal
    adminElements.projectModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Handle project form submission
function handleProjectForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const mode = form.getAttribute('data-mode');
    const projectId = form.getAttribute('data-project-id');
    
    // Get form data
    const formData = new FormData(form);
    const projectData = Object.fromEntries(formData.entries());
    
    // Process tags and details
    if (projectData.tags) {
        projectData.tags = projectData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    if (projectData.details) {
        projectData.details = projectData.details.split('\\n').map(detail => detail.trim()).filter(detail => detail);
    }
    
    // Generate ID for new projects
    if (mode === 'add') {
        projectData.id = generateProjectId();
        projectData.created_at = new Date().toISOString();
    }
    
    try {
        if (mode === 'add') {
            // Add new project
            adminState.projects.unshift(projectData);
            showSuccess('Research project added successfully!');
            
        } else if (mode === 'edit' && projectId) {
            // Update existing project
            const index = adminState.projects.findIndex(p => p.id == projectId);
            if (index !== -1) {
                projectData.updated_at = new Date().toISOString();
                adminState.projects[index] = { ...adminState.projects[index], ...projectData };
                showSuccess('Research project updated successfully!');
            }
        }
        
        // Save projects
        saveProjects();
        
        // Update UI
        updateProjectsTable();
        updateDashboardStats();
        
        // Close modal
        closeModal();
        
    } catch (error) {
        console.error('Error saving project:', error);
        showError('Failed to save project. Please try again.');
    }
}

// Delete project
function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this research project? This action cannot be undone.')) {
        return;
    }
    
    const index = adminState.projects.findIndex(p => p.id == projectId);
    
    if (index !== -1) {
        // Remove project
        adminState.projects.splice(index, 1);
        
        // Save projects
        saveProjects();
        
        // Update UI
        updateProjectsTable();
        updateDashboardStats();
        
        showSuccess('Research project deleted successfully!');
    }
}

// Generate unique project ID
function generateProjectId() {
    const maxId = adminState.projects.reduce((max, project) => Math.max(max, project.id || 0), 0);
    return maxId + 1;
}

// Close modal
function closeModal() {
    if (adminElements.projectModal) {
        adminElements.projectModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Show success message
function showSuccess(message) {
    showAlert(message, 'success');
}

// Show error message
function showError(message) {
    showAlert(message, 'error');
}

// Show alert
function showAlert(message, type) {
    // Remove existing alerts
    removeExistingAlerts();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Remove existing alerts
function removeExistingAlerts() {
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
}

// Escape HTML
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get sample projects (fallback)
function getSampleProjects() {
    return [
        {
            id: 1,
            title: "Sample Research Project",
            shortDescription: "Sample microbiology research project description",
            fullDescription: "This is a sample research project for demonstration purposes.",
            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&q=80",
            tags: ["Microbiology", "Research", "Sample"],
            category: "ongoing",
            details: ["Sample detail 1", "Sample detail 2"],
            status: "active",
            start_date: "2023-01-01",
            end_date: "2023-12-31",
            principal_investigator: "Lab Team",
            funding_source: "Internal Funding",
            created_at: new Date().toISOString()
        }
    ];
}

// Make functions globally available
window.editProject = editProject;
window.deleteProject = deleteProject;
window.openAddProjectModal = openAddProjectModal;
window.closeModal = closeModal;