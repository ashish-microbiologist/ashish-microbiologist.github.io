// assets/js/admin-script.js

/**
 * OP ASHISH YT - Admin Panel JavaScript
 * Version: 1.0.0
 */

class AdminPanel {
    constructor() {
        this.appsData = [];
        this.filteredApps = [];
        this.currentPage = 1;
        this.appsPerPage = 15;
        this.totalPages = 0;
        this.bulkSelected = [];
        this.stats = {};
        
        this.init();
    }
    
    init() {
        this.checkLoginStatus();
        this.loadData();
        this.setupEventListeners();
        this.updateUserInfo();
        this.setupSessionTimer();
    }
    
    // Check if user is logged in
    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
        
        if (!isLoggedIn) {
            this.showAlert('कृपया पहले लॉगिन करें', 'warning');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        
        return true;
    }
    
    // Update user information in sidebar
    updateUserInfo() {
        const username = localStorage.getItem('admin_username') || 'Admin';
        const loginTime = localStorage.getItem('login_time');
        
        // Update user avatar and name
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        if (userAvatar) {
            userAvatar.textContent = username.charAt(0).toUpperCase();
        }
        
        if (userName) {
            userName.textContent = username;
        }
        
        if (welcomeMessage) {
            if (loginTime) {
                const loginDate = new Date(parseInt(loginTime));
                const timeString = loginDate.toLocaleTimeString('hi-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                welcomeMessage.textContent = `आखिरी लॉगिन: ${timeString}`;
            } else {
                welcomeMessage.textContent = `वेलकम, ${username}!`;
            }
        }
    }
    
    // Load all dashboard data
    async loadData() {
        try {
            this.showLoading(true);
            
            await this.loadAppsData();
            await this.calculateStats();
            await this.loadQuickStats();
            
            this.displayAppsTable();
            
            // Show chart section if we have apps
            if (this.appsData.length > 0) {
                const chartSection = document.getElementById('chartSection');
                if (chartSection) {
                    chartSection.style.display = 'block';
                }
            }
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showAlert('डेटा लोड करने में त्रुटि: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Load apps data from localStorage or default
    async loadAppsData() {
        // Try to load custom apps from localStorage
        const customApps = localStorage.getItem('user_apps');
        
        if (customApps) {
            this.appsData = JSON.parse(customApps);
        } else {
            // Load default apps from global variable
            this.appsData = window.appsData || [];
        }
        
        // Update download counts from localStorage
        this.appsData = this.updateDownloadCounts(this.appsData);
        
        // Set filtered apps to all apps initially
        this.filteredApps = [...this.appsData];
        
        return this.appsData;
    }
    
    // Update download counts from localStorage
    updateDownloadCounts(apps) {
        return apps.map(app => {
            const savedCount = localStorage.getItem(`downloads_${app.id}`);
            if (savedCount) {
                app.downloads = parseInt(savedCount) || app.downloads;
            }
            return app;
        });
    }
    
    // Calculate dashboard statistics
    async calculateStats() {
        const apps = this.appsData;
        
        // Basic stats
        const totalApps = apps.length;
        const totalDownloads = apps.reduce((sum, app) => sum + app.downloads, 0);
        const avgDownloads = totalApps > 0 ? Math.round(totalDownloads / totalApps) : 0;
        
        // Today's downloads (simulated)
        const today = new Date().toDateString();
        const todayKey = `daily_downloads_${today}`;
        let todayDownloads = localStorage.getItem(todayKey);
        
        if (!todayDownloads) {
            // Generate random for simulation
            todayDownloads = Math.floor(Math.random() * 100) + 20;
            localStorage.setItem(todayKey, todayDownloads);
        } else {
            todayDownloads = parseInt(todayDownloads);
        }
        
        // Calculate trends
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = `daily_downloads_${yesterday.toDateString()}`;
        const yesterdayDownloads = parseInt(localStorage.getItem(yesterdayKey)) || 0;
        
        const downloadsTrend = yesterdayDownloads > 0 ? 
            Math.round(((todayDownloads - yesterdayDownloads) / yesterdayDownloads) * 100) : 0;
        
        // Update stats object
        this.stats = {
            totalApps,
            totalDownloads,
            avgDownloads,
            todayDownloads,
            downloadsTrend,
            appsTrend: '+12%', // Simulated
            avgTrend: '+5%', // Simulated
            todayTrend: downloadsTrend > 0 ? `+${downloadsTrend}%` : `${downloadsTrend}%`
        };
        
        // Update UI
        this.updateStatsUI();
    }
    
    // Update statistics in UI
    updateStatsUI() {
        const stats = this.stats;
        
        // Update DOM elements
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateElement('totalApps', stats.totalApps);
        updateElement('totalDownloads', this.formatNumber(stats.totalDownloads));
        updateElement('avgDownloads', this.formatNumber(stats.avgDownloads));
        updateElement('todayDownloads', stats.todayDownloads);
        
        // Update trends
        const updateTrend = (id, value, isPositive = true) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                element.className = 'stat-trend ' + (isPositive ? 'trend-up' : 'trend-down');
            }
        };
        
        updateTrend('appsTrend', stats.appsTrend, true);
        updateTrend('downloadsTrend', stats.downloadsTrend > 0 ? `+${stats.downloadsTrend}%` : `${stats.downloadsTrend}%`, stats.downloadsTrend > 0);
        updateTrend('avgTrend', stats.avgTrend, true);
        updateTrend('todayTrend', stats.todayTrend, stats.downloadsTrend > 0);
    }
    
    // Load quick stats
    async loadQuickStats() {
        const apps = this.appsData;
        
        // Category counts
        const categories = {
            social: 0,
            entertainment: 0,
            tools: 0,
            games: 0,
            other: 0
        };
        
        apps.forEach(app => {
            if (app.category && categories[app.category] !== undefined) {
                categories[app.category]++;
            } else {
                categories.other++;
            }
        });
        
        // Featured apps count
        const featuredCount = apps.filter(app => app.featured).length;
        
        // New apps (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newAppsCount = apps.filter(app => {
            if (!app.created_at) return false;
            const created = new Date(app.created_at);
            return created > weekAgo;
        }).length;
        
        // Top downloaded app
        const topApp = apps.length > 0 ? 
            apps.reduce((max, app) => app.downloads > max.downloads ? app : max) : 
            null;
        
        // Update quick stats in UI
        const quickStatsContainer = document.getElementById('quickStats');
        if (quickStatsContainer) {
            quickStatsContainer.innerHTML = `
                <div class="stat-card">
                    <i class="fas fa-hashtag"></i>
                    <h3>${Object.keys(categories).length}</h3>
                    <p>कैटेगरीज़</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <h3>${featuredCount}</h3>
                    <p>फीचर्ड ऐप्स</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <h3>${newAppsCount}</h3>
                    <p>नए ऐप्स (7 दिन)</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-crown"></i>
                    <h3>${topApp ? this.formatNumber(topApp.downloads) : '0'}</h3>
                    <p>टॉप ऐप डाउनलोड</p>
                </div>
            `;
        }
    }
    
    // Display apps in table
    displayAppsTable() {
        const container = document.getElementById('tableContainer');
        const emptyState = document.getElementById('emptyState');
        const pagination = document.getElementById('pagination');
        const tbody = document.getElementById('appsTableBody');
        
        if (!tbody) return;
        
        // Check if we have apps
        if (this.filteredApps.length === 0) {
            if (container) container.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            if (pagination) pagination.style.display = 'none';
            return;
        }
        
        if (container) container.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.appsPerPage;
        const endIndex = startIndex + this.appsPerPage;
        const currentApps = this.filteredApps.slice(startIndex, endIndex);
        
        // Generate table rows
        tbody.innerHTML = currentApps.map((app, index) => `
            <tr data-id="${app.id}" data-index="${startIndex + index}">
                <td>
                    <input type="checkbox" class="app-checkbox" value="${app.id}" 
                           onchange="adminPanel.updateBulkSelection()">
                </td>
                <td>#${app.id}</td>
                <td>
                    <img src="${app.logo}" 
                         alt="${app.name}" 
                         class="app-logo-sm"
                         onerror="this.src='../assets/img/default-logo.png'">
                </td>
                <td>
                    <span class="app-name">${app.name}</span>
                    <span class="app-desc">${app.description.substring(0, 60)}...</span>
                    ${app.featured ? `
                        <span class="badge badge-warning" style="margin-top: 5px;">
                            <i class="fas fa-star"></i> फीचर्ड
                        </span>
                    ` : ''}
                </td>
                <td>${app.version}</td>
                <td>${app.size}</td>
                <td>
                    <span style="color: #059669; font-weight: bold;">
                        ${this.formatNumber(app.downloads)}
                    </span>
                </td>
                <td>
                    ${app.created_at ? new Date(app.created_at).toLocaleDateString('hi-IN') : 'N/A'}
                </td>
                <td>
                    <div class="action-buttons">
                        <a href="add-app.html?edit=${app.id}" class="action-btn edit-btn" title="Edit">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button class="action-btn delete-btn" 
                                onclick="adminPanel.deleteApp(${app.id})"
                                title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                        <a href="../download.html?id=${app.id}" 
                           target="_blank" 
                           class="action-btn view-btn"
                           title="View">
                            <i class="fas fa-eye"></i>
                        </a>
                        <a href="${app.apk_file}" 
                           class="action-btn download-btn"
                           download
                           title="Download APK">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Update pagination
        this.updatePagination();
    }
    
    // Update pagination controls
    updatePagination() {
        const pagination = document.getElementById('pagination');
        const pageNumbers = document.getElementById('pageNumbers');
        const totalPages = Math.ceil(this.filteredApps.length / this.appsPerPage);
        
        this.totalPages = totalPages;
        
        if (!pagination || !pageNumbers) return;
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        // Generate page number buttons
        pageNumbers.innerHTML = '';
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (i === this.currentPage ? ' active' : '');
            btn.textContent = i;
            btn.onclick = () => this.goToPage(i);
            pageNumbers.appendChild(btn);
        }
        
        // Update navigation buttons
        const firstBtn = document.getElementById('firstBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const lastBtn = document.getElementById('lastBtn');
        
        if (firstBtn) firstBtn.disabled = this.currentPage === 1;
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
        if (lastBtn) lastBtn.disabled = this.currentPage === totalPages;
        
        // Add event listeners
        if (firstBtn) firstBtn.onclick = () => this.goToPage(1);
        if (prevBtn) prevBtn.onclick = () => this.goToPage(this.currentPage - 1);
        if (nextBtn) nextBtn.onclick = () => this.goToPage(this.currentPage + 1);
        if (lastBtn) lastBtn.onclick = () => this.goToPage(totalPages);
    }
    
    // Go to specific page
    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) return;
        
        this.currentPage = page;
        this.displayAppsTable();
        
        // Scroll to table
        const tableContainer = document.getElementById('tableContainer');
        if (tableContainer) {
            tableContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Filter apps based on search and category
    filterApps() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : '';
        const sortBy = sortFilter ? sortFilter.value : 'newest';
        
        this.filteredApps = this.appsData.filter(app => {
            // Search term check
            const matchesSearch = !searchTerm || 
                app.name.toLowerCase().includes(searchTerm) ||
                app.description.toLowerCase().includes(searchTerm);
            
            // Category check
            const matchesCategory = !category || app.category === category;
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort apps
        this.sortApps(sortBy);
        
        // Reset to first page
        this.currentPage = 1;
        
        // Redraw table
        this.displayAppsTable();
    }
    
    // Sort apps by criteria
    sortApps(sortBy) {
        switch(sortBy) {
            case 'newest':
                this.filteredApps.sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
                    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
                    return dateB - dateA;
                });
                break;
                
            case 'oldest':
                this.filteredApps.sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
                    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
                    return dateA - dateB;
                });
                break;
                
            case 'popular':
                this.filteredApps.sort((a, b) => b.downloads - a.downloads);
                break;
                
            case 'name':
                this.filteredApps.sort((a, b) => a.name.localeCompare(b.name));
                break;
                
            case 'downloads':
                this.filteredApps.sort((a, b) => b.downloads - a.downloads);
                break;
        }
    }
    
    // Update bulk selection
    updateBulkSelection() {
        const checkboxes = document.querySelectorAll('.app-checkbox:checked');
        this.bulkSelected = Array.from(checkboxes).map(cb => cb.value);
        
        // Update bulk action button state
        const applyBtn = document.getElementById('applyBulkAction');
        if (applyBtn) {
            applyBtn.disabled = this.bulkSelected.length === 0;
        }
        
        // Update select all checkbox
        const selectAll = document.getElementById('selectAll');
        const allCheckboxes = document.querySelectorAll('.app-checkbox');
        
        if (selectAll && allCheckboxes.length > 0) {
            selectAll.checked = this.bulkSelected.length === allCheckboxes.length;
            selectAll.indeterminate = this.bulkSelected.length > 0 && 
                                      this.bulkSelected.length < allCheckboxes.length;
        }
    }
    
    // Apply bulk action
    applyBulkAction() {
        const bulkAction = document.getElementById('bulkAction');
        if (!bulkAction) return;
        
        const action = bulkAction.value;
        const selectedCount = this.bulkSelected.length;
        
        if (!action) {
            this.showAlert('कृपया एक बल्क एक्शन चुनें', 'warning');
            return;
        }
        
        if (selectedCount === 0) {
            this.showAlert('कृपया कम से कम एक ऐप चुनें', 'warning');
            return;
        }
        
        switch(action) {
            case 'delete':
                this.deleteMultipleApps();
                break;
                
            case 'export':
                this.exportApps();
                break;
                
            case 'featured':
                this.markAsFeatured();
                break;
                
            case 'unfeatured':
                this.markAsUnfeatured();
                break;
        }
    }
    
    // Delete multiple apps
    deleteMultipleApps() {
        const selectedIds = this.bulkSelected;
        
        if (confirm(`क्या आप ${selectedIds.length} ऐप्स को डिलीट करना चाहते हैं? यह एक्शन वापस नहीं किया जा सकता।`)) {
            // Filter out selected apps
            this.appsData = this.appsData.filter(app => !selectedIds.includes(app.id.toString()));
            this.filteredApps = this.filteredApps.filter(app => !selectedIds.includes(app.id.toString()));
            
            // Save to localStorage
            localStorage.setItem('user_apps', JSON.stringify(this.appsData));
            
            // Clear selection
            this.clearBulkSelection();
            
            // Recalculate stats
            this.calculateStats();
            this.loadQuickStats();
            
            // Redraw table
            this.displayAppsTable();
            
            this.showAlert(`${selectedIds.length} ऐप्स सफलतापूर्वक डिलीट किए गए`, 'success');
        }
    }
    
    // Export selected apps
    exportApps() {
        const selectedIds = this.bulkSelected;
        const selectedApps = this.appsData.filter(app => selectedIds.includes(app.id.toString()));
        
        // Generate JSON file
        const dataStr = JSON.stringify(selectedApps, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `op_ashish_yt_apps_${new Date().getTime()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showAlert(`${selectedIds.length} ऐप्स एक्सपोर्ट किए गए`, 'success');
    }
    
    // Mark apps as featured
    markAsFeatured() {
        const selectedIds = this.bulkSelected;
        
        this.appsData.forEach(app => {
            if (selectedIds.includes(app.id.toString())) {
                app.featured = true;
            }
        });
        
        // Save to localStorage
        localStorage.setItem('user_apps', JSON.stringify(this.appsData));
        
        // Update filtered apps
        this.filteredApps = [...this.appsData];
        
        // Clear selection
        this.clearBulkSelection();
        
        // Redraw table
        this.displayAppsTable();
        
        this.showAlert(`${selectedIds.length} ऐप्स को फीचर्ड में जोड़ा गया`, 'success');
    }
    
    // Mark apps as unfeatured
    markAsUnfeatured() {
        const selectedIds = this.bulkSelected;
        
        this.appsData.forEach(app => {
            if (selectedIds.includes(app.id.toString())) {
                app.featured = false;
            }
        });
        
        // Save to localStorage
        localStorage.setItem('user_apps', JSON.stringify(this.appsData));
        
        // Update filtered apps
        this.filteredApps = [...this.appsData];
        
        // Clear selection
        this.clearBulkSelection();
        
        // Redraw table
        this.displayAppsTable();
        
        this.showAlert(`${selectedIds.length} ऐप्स को फीचर्ड से हटाया गया`, 'success');
    }
    
    // Clear bulk selection
    clearBulkSelection() {
        const checkboxes = document.querySelectorAll('.app-checkbox');
        checkboxes.forEach(cb => cb.checked = false);
        
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        }
        
        this.bulkSelected = [];
        
        // Disable bulk action button
        const applyBtn = document.getElementById('applyBulkAction');
        if (applyBtn) {
            applyBtn.disabled = true;
        }
    }
    
    // Delete single app
    deleteApp(appId) {
        const app = this.appsData.find(a => a.id == appId);
        
        if (!app) return;
        
        if (confirm(`क्या आप "${app.name}" को डिलीट करना चाहते हैं?\n\nयह एक्शन वापस नहीं किया जा सकता।`)) {
            // Remove app
            this.appsData = this.appsData.filter(a => a.id != appId);
            this.filteredApps = this.filteredApps.filter(a => a.id != appId);
            
            // Save to localStorage
            localStorage.setItem('user_apps', JSON.stringify(this.appsData));
            
            // Recalculate stats
            this.calculateStats();
            this.loadQuickStats();
            
            // Redraw table
            this.displayAppsTable();
            
            this.showAlert(`"${app.name}" सफलतापूर्वक डिलीट किया गया`, 'success');
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebar = document.getElementById('adminSidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar(sidebar, sidebarOverlay));
        }
        
        if (sidebarOverlay && sidebar) {
            sidebarOverlay.addEventListener('click', () => this.toggleSidebar(sidebar, sidebarOverlay));
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterApps());
        }
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterApps());
        }
        
        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                const sortBy = sortFilter.value;
                this.sortApps(sortBy);
                this.displayAppsTable();
            });
        }
        
        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.app-checkbox');
                checkboxes.forEach(cb => cb.checked = e.target.checked);
                this.updateBulkSelection();
            });
        }
        
        // Bulk action apply button
        const applyBulkAction = document.getElementById('applyBulkAction');
        if (applyBulkAction) {
            applyBulkAction.addEventListener('click', () => this.applyBulkAction());
        }
        
        // Chart control buttons
        const weekBtn = document.getElementById('weekBtn');
        const monthBtn = document.getElementById('monthBtn');
        const yearBtn = document.getElementById('yearBtn');
        
        if (weekBtn) weekBtn.addEventListener('click', () => this.setActiveChartButton('week'));
        if (monthBtn) monthBtn.addEventListener('click', () => this.setActiveChartButton('month'));
        if (yearBtn) yearBtn.addEventListener('click', () => this.setActiveChartButton('year'));
        
        // Admin links
        const setupLink = (id, message) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAlert(message, 'info');
                });
            }
        };
        
        setupLink('analyticsLink', 'एनालिटिक्स फीचर जल्द ही आ रहा है!');
        setupLink('usersLink', 'यूजर मैनेजमेंट जल्द ही आ रहा है!');
        setupLink('settingsLink', 'सेटिंग्स फीचर जल्द ही आ रहा है!');
        setupLink('backupLink', 'बैकअप सिस्टम जल्द ही आ रहा है!');
    }
    
    // Toggle sidebar for mobile
    toggleSidebar(sidebar, overlay) {
        sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    }
    
    // Logout user
    logout() {
        if (confirm('क्या आप वाकई लॉगआउट करना चाहते हैं?')) {
            // Clear admin data
            localStorage.removeItem('admin_logged_in');
            localStorage.removeItem('admin_username');
            localStorage.removeItem('login_time');
            
            this.showAlert('सफलतापूर्वक लॉगआउट किया गया', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }
    
    // Refresh dashboard data
    refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            const originalHTML = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            refreshBtn.disabled = true;
            
            this.loadData();
            
            setTimeout(() => {
                refreshBtn.innerHTML = originalHTML;
                refreshBtn.disabled = false;
                this.showAlert('डेटा रिफ्रेश किया गया', 'success');
            }, 1000);
        }
    }
    
    // Set active chart button
    setActiveChartButton(activeBtn) {
        ['weekBtn', 'monthBtn', 'yearBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.remove('active');
        });
        
        const activeButton = document.getElementById(activeBtn + 'Btn');
        if (activeButton) activeButton.classList.add('active');
    }
    
    // Setup session timer
    setupSessionTimer() {
        // Check every minute
        setInterval(() => {
            const loginTime = localStorage.getItem('login_time');
            if (!loginTime) return;
            
            const currentTime = new Date().getTime();
            const sessionDuration = 30 * 60 * 1000; // 30 minutes
            
            if (currentTime - loginTime > sessionDuration) {
                this.showAlert('आपका सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें।', 'warning');
                
                setTimeout(() => {
                    localStorage.removeItem('admin_logged_in');
                    localStorage.removeItem('admin_username');
                    localStorage.removeItem('login_time');
                    window.location.href = 'login.html';
                }, 2000);
            } else if (currentTime - loginTime > sessionDuration - 5 * 60 * 1000) {
                // Warning 5 minutes before expiry
                const timeLeft = Math.ceil((sessionDuration - (currentTime - loginTime)) / 60000);
                if (timeLeft <= 5 && timeLeft > 0) {
                    this.showAlert(`आपका सत्र ${timeLeft} मिनट में समाप्त होगा`, 'warning');
                }
            }
        }, 60000); // Every minute
    }
    
    // Show loading state
    showLoading(show) {
        const loadingContainer = document.getElementById('loadingContainer');
        if (loadingContainer) {
            loadingContainer.classList.toggle('active', show);
        }
    }
    
    // Show alert message
    showAlert(message, type = 'info') {
        const container = document.getElementById('alertContainer');
        if (!container) return;
        
        const alertId = 'alert-' + Date.now();
        const alert = document.createElement('div');
        alert.id = alertId;
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="document.getElementById('${alertId}').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                alertElement.remove();
            }
        }, 5000);
    }
    
    // Format number with K, M suffixes
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    // Get app by ID
    getAppById(id) {
        return this.appsData.find(app => app.id == id);
    }
    
    // Add new app
    addNewApp(appData) {
        // Generate new ID
        const newId = this.appsData.length > 0 ? 
            Math.max(...this.appsData.map(app => app.id)) + 1 : 1;
        
        const newApp = {
            id: newId,
            ...appData,
            downloads: 0,
            created_at: new Date().toISOString().split('T')[0],
            featured: false
        };
        
        // Add to data
        this.appsData.unshift(newApp);
        this.filteredApps.unshift(newApp);
        
        // Save to localStorage
        localStorage.setItem('user_apps', JSON.stringify(this.appsData));
        
        // Update stats
        this.calculateStats();
        this.loadQuickStats();
        
        return newApp;
    }
    
    // Update existing app
    updateApp(appId, updatedData) {
        const appIndex = this.appsData.findIndex(app => app.id == appId);
        
        if (appIndex === -1) {
            throw new Error('App not found');
        }
        
        // Update app
        this.appsData[appIndex] = {
            ...this.appsData[appIndex],
            ...updatedData
        };
        
        // Update filtered apps
        const filteredIndex = this.filteredApps.findIndex(app => app.id == appId);
        if (filteredIndex !== -1) {
            this.filteredApps[filteredIndex] = this.appsData[appIndex];
        }
        
        // Save to localStorage
        localStorage.setItem('user_apps', JSON.stringify(this.appsData));
        
        // Update stats
        this.calculateStats();
        this.loadQuickStats();
        
        return this.appsData[appIndex];
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global adminPanel instance
    window.adminPanel = new AdminPanel();
    
    // Add utility functions to window
    window.formatNumber = (num) => window.adminPanel.formatNumber(num);
    window.deleteApp = (id) => window.adminPanel.deleteApp(id);
    window.goToPage = (page) => window.adminPanel.goToPage(page);
});

// Utility functions for other admin pages
const AdminUtils = {
    // Check login status
    checkLogin: function() {
        if(localStorage.getItem('admin_logged_in') !== 'true') {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },
    
    // Logout function
    logout: function() {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('login_time');
        window.location.href = 'login.html';
    },
    
    // Get current user
    getCurrentUser: function() {
        return localStorage.getItem('admin_username') || 'Admin';
    },
    
    // Format date
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('hi-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .notification-success {
                    background: #10b981;
                    color: white;
                }
                .notification-error {
                    background: #ef4444;
                    color: white;
                }
                .notification-warning {
                    background: #f59e0b;
                    color: white;
                }
                .notification-info {
                    background: #3b82f6;
                    color: white;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
};

// Make AdminUtils available globally
window.AdminUtils = AdminUtils;