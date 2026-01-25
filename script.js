// Microbiology Research Lab - Main JavaScript
// No PHP Dependencies - Pure JavaScript/JSON

// Configuration
const CONFIG = {
    LAB_NAME: 'Microbiology Research Lab',
    LAB_EMAIL: 'opashishytff@gmail.com',
    LAB_PHONE: '8418078994',
    PROJECTS_JSON: 'projects.json'
};

// State Management
let state = {
    projects: [],
    filteredProjects: [],
    currentFilter: 'all',
    isLoading: false
};

// DOM Elements
const elements = {
    projectsContainer: document.getElementById('projectsContainer'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    contactForm: document.getElementById('contactForm'),
    menuToggle: document.querySelector('.menu-toggle'),
    navLinks: document.querySelector('.nav-links'),
    backToTop: document.getElementById('backToTop')
};

// Initialize Website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

async function initializeWebsite() {
    try {
        // Load projects from JSON
        await loadProjects();
        
        // Initialize all components
        initializeComponents();
        
        // Add scroll event listener for navbar
        window.addEventListener('scroll', handleScroll);
        
        console.log('Microbiology Research Lab website initialized successfully');
        
    } catch (error) {
        console.error('Website initialization error:', error);
        showError('Failed to initialize website. Please refresh the page.');
    }
}

// Load projects from JSON file
async function loadProjects() {
    try {
        showLoading(true);
        
        const response = await fetch(CONFIG.PROJECTS_JSON);
        
        if (!response.ok) {
            throw new Error(`Failed to load projects: ${response.status}`);
        }
        
        const projects = await response.json();
        
        // Validate projects data
        if (!Array.isArray(projects)) {
            throw new Error('Invalid projects data format');
        }
        
        state.projects = projects;
        state.filteredProjects = [...projects];
        
        displayProjects();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        
        // Fallback to sample projects
        state.projects = getSampleProjects();
        state.filteredProjects = [...state.projects];
        displayProjects();
        
        showError('Using sample projects. Could not load project data.');
        
    } finally {
        showLoading(false);
    }
}

// Display projects in the grid
function displayProjects() {
    if (!elements.projectsContainer) return;
    
    const projectsToShow = state.filteredProjects;
    
    if (projectsToShow.length === 0) {
        elements.projectsContainer.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-flask"></i>
                <h3>No Research Projects Found</h3>
                <p>No projects available in this category.</p>
                <button class="btn secondary-btn" onclick="resetFilters()">
                    <i class="fas fa-redo"></i> Show All Projects
                </button>
            </div>
        `;
        return;
    }
    
    elements.projectsContainer.innerHTML = projectsToShow.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${escapeHtml(project.title)}</h3>
                <div class="project-tags">
                    ${(project.tags || []).map(tag => 
                        `<span class="project-tag">${escapeHtml(tag)}</span>`
                    ).join('')}
                </div>
                <p class="project-description">${escapeHtml(project.shortDescription)}</p>
                <div class="project-meta">
                    <span><i class="fas fa-user"></i> ${escapeHtml(project.principal_investigator || 'Lab Team')}</span>
                    <span><i class="fas fa-calendar"></i> ${project.status === 'completed' ? 'Completed' : 'Ongoing'}</span>
                </div>
                <button class="btn secondary-btn view-details-btn" onclick="viewProjectDetails(${project.id})" style="margin-top: 1rem; width: 100%;">
                    <i class="fas fa-info-circle"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Filter projects by category
function filterProjects(filter) {
    state.currentFilter = filter;
    
    if (filter === 'all') {
        state.filteredProjects = [...state.projects];
    } else {
        state.filteredProjects = state.projects.filter(
            project => project.category === filter
        );
    }
    
    // Update active filter button
    updateActiveFilterButton(filter);
    
    // Display filtered projects
    displayProjects();
    
    // Scroll to projects section if not visible
    if (!isElementInViewport(document.getElementById('research'))) {
        document.getElementById('research').scrollIntoView({ behavior: 'smooth' });
    }
}

// Reset filters to show all projects
function resetFilters() {
    filterProjects('all');
}

// Update active filter button
function updateActiveFilterButton(activeFilter) {
    elements.filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-filter') === activeFilter) {
            button.classList.add('active');
        }
    });
}

// View project details
function viewProjectDetails(projectId) {
    const project = state.projects.find(p => p.id === projectId);
    
    if (!project) {
        showError('Project not found');
        return;
    }
    
    // Create modal HTML
    const modalHtml = `
        <div class="project-modal" id="projectModal">
            <div class="modal-overlay" onclick="closeModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <h2>${escapeHtml(project.title)}</h2>
                    <div class="modal-subtitle">
                        <span class="project-status ${project.status}">${project.status === 'completed' ? 'Completed' : 'Ongoing'}</span>
                        <span class="project-category">${project.category}</span>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${project.image}" alt="${escapeHtml(project.title)}">
                    </div>
                    <div class="modal-details">
                        <h3>Project Description</h3>
                        <p>${escapeHtml(project.fullDescription)}</p>
                        
                        <h3>Project Details</h3>
                        <ul>
                            ${(project.details || []).map(detail => 
                                `<li><i class="fas fa-check"></i> ${escapeHtml(detail)}</li>`
                            ).join('')}
                        </ul>
                        
                        <div class="project-info-grid">
                            <div class="info-item">
                                <strong><i class="fas fa-user"></i> Principal Investigator:</strong>
                                <span>${escapeHtml(project.principal_investigator || 'Lab Team')}</span>
                            </div>
                            <div class="info-item">
                                <strong><i class="fas fa-calendar"></i> Start Date:</strong>
                                <span>${project.start_date || 'Not specified'}</span>
                            </div>
                            <div class="info-item">
                                <strong><i class="fas fa-calendar"></i> End Date:</strong>
                                <span>${project.end_date || 'Ongoing'}</span>
                            </div>
                            <div class="info-item">
                                <strong><i class="fas fa-money-bill"></i> Funding Source:</strong>
                                <span>${escapeHtml(project.funding_source || 'Not specified')}</span>
                            </div>
                        </div>
                        
                        <div class="modal-tags">
                            ${(project.tags || []).map(tag => 
                                `<span class="modal-tag">${escapeHtml(tag)}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn primary-btn" onclick="closeModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add modal styles
    addModalStyles();
}

// Close modal
function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Add modal styles dynamically
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const styles = `
        .project-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            z-index: 1;
            animation: modalSlideIn 0.3s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            color: #666;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 2;
        }
        
        .modal-close:hover {
            background: #f5f5f5;
            color: #333;
        }
        
        .modal-header {
            padding: 30px 30px 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
            margin: 0 0 10px 0;
            color: #2E7D32;
        }
        
        .modal-subtitle {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .project-status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .project-status.completed {
            background: #4CAF50;
            color: white;
        }
        
        .project-status.active,
        .project-status.ongoing {
            background: #FF9800;
            color: white;
        }
        
        .project-category {
            color: #666;
            font-size: 14px;
        }
        
        .modal-body {
            padding: 20px 30px;
        }
        
        .modal-image {
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .modal-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .modal-details h3 {
            color: #2E7D32;
            margin: 20px 0 10px;
            font-size: 18px;
        }
        
        .modal-details p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .modal-details ul {
            list-style: none;
            padding: 0;
            margin: 0 0 20px 0;
        }
        
        .modal-details ul li {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        
        .modal-details ul li:last-child {
            border-bottom: none;
        }
        
        .modal-details ul li i {
            color: #4CAF50;
            margin-top: 4px;
        }
        
        .project-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .info-item strong {
            color: #333;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .info-item span {
            color: #666;
            font-size: 14px;
        }
        
        .modal-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 20px 0;
        }
        
        .modal-tag {
            background: #E8F5E9;
            color: #2E7D32;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .modal-footer {
            padding: 20px 30px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                max-width: 95%;
                max-height: 85vh;
            }
            
            .modal-header,
            .modal-body,
            .modal-footer {
                padding: 20px;
            }
            
            .project-info-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'modal-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Initialize all components
function initializeComponents() {
    // Initialize filter buttons
    initializeFilterButtons();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize back to top button
    initializeBackToTop();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
}

// Initialize filter buttons
function initializeFilterButtons() {
    if (!elements.filterButtons.length) return;
    
    elements.filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

// Initialize contact form
function initializeContactForm() {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!validateContactForm(formDataObj)) {
            return;
        }
        
        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Simulate API call (in real implementation, this would be a fetch call)
            await simulateFormSubmission(formDataObj);
            
            // Show success message
            showSuccess('Thank you for your message! We will contact you soon.');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showError('Failed to send message. Please try again.');
            
        } finally {
            // Restore button state
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitButton.disabled = false;
        }
    });
}

// Validate contact form
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulate form submission (replace with real API call)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log form data to console (in production, send to server)
            console.log('Form submitted:', {
                ...data,
                timestamp: new Date().toISOString(),
                lab: CONFIG.LAB_NAME
            });
            
            // Simulate 10% chance of failure for demo
            if (Math.random() < 0.1) {
                reject(new Error('Simulated server error'));
            } else {
                resolve();
            }
        }, 1500);
    });
}

// Initialize navigation
function initializeNavigation() {
    if (!elements.menuToggle || !elements.navLinks) return;
    
    // Mobile menu toggle
    elements.menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!elements.navLinks.contains(event.target) && 
            !elements.menuToggle.contains(event.target) &&
            elements.navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && elements.navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Toggle mobile menu
function toggleMobileMenu() {
    elements.navLinks.classList.toggle('active');
    elements.menuToggle.innerHTML = elements.navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    
    // Prevent body scroll when menu is open
    if (elements.navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu
function closeMobileMenu() {
    elements.navLinks.classList.remove('active');
    elements.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = '';
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

// Handle scroll events
function handleScroll() {
    // Add/remove scrolled class to navbar
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update back to top button
    updateBackToTopButton();
    
    // Update active nav link
    updateActiveNavLink();
}

// Initialize back to top button
function initializeBackToTop() {
    if (!elements.backToTop) return;
    
    elements.backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update back to top button visibility
function updateBackToTopButton() {
    if (!elements.backToTop) return;
    
    if (window.scrollY > 300) {
        elements.backToTop.classList.add('visible');
    } else {
        elements.backToTop.classList.remove('visible');
    }
}

// Initialize keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + / to focus search
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) searchInput.focus();
        }
        
        // Escape to close modal
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// Show loading state
function showLoading(show) {
    state.isLoading = show;
    
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
    }
    
    // Disable filter buttons while loading
    if (elements.filterButtons) {
        elements.filterButtons.forEach(button => {
            button.disabled = show;
        });
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

// Show alert message
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
    
    // Add alert styles if not already added
    addAlertStyles();
}

// Remove existing alerts
function removeExistingAlerts() {
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
}

// Add alert styles dynamically
function addAlertStyles() {
    if (document.getElementById('alert-styles')) return;
    
    const styles = `
        .alert {
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        }
        
        .alert-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-left: 4px solid;
        }
        
        .alert-success .alert-content {
            background: #d4edda;
            color: #155724;
            border-left-color: #28a745;
        }
        
        .alert-error .alert-content {
            background: #f8d7da;
            color: #721c24;
            border-left-color: #dc3545;
        }
        
        .alert-content i:first-child {
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .alert-content span {
            flex: 1;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .alert-close {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: inherit;
            padding: 4px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.3s ease;
            flex-shrink: 0;
        }
        
        .alert-close:hover {
            background: rgba(0, 0, 0, 0.1);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            .alert {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'alert-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Check if element is in viewport
function isElementInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Escape HTML to prevent XSS
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
            title: "Antibiotic Resistance Research",
            shortDescription: "Study of antibiotic-resistant bacteria in clinical settings",
            fullDescription: "This research project focuses on identifying and characterizing antibiotic-resistant bacterial strains in hospital environments. We're studying resistance mechanisms and developing new detection methods.",
            image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1032&q=80",
            tags: ["Antibiotic Resistance", "Clinical Microbiology", "Pathogen Research"],
            category: "ongoing",
            details: [
                "Sample collection from hospital surfaces",
                "Identification of resistant strains",
                "Genetic analysis of resistance genes",
                "Development of rapid detection methods"
            ],
            status: "active",
            start_date: "2023-01-15",
            end_date: "2024-12-31",
            principal_investigator: "Dr. Sarah Chen",
            funding_source: "National Science Foundation"
        },
        {
            id: 2,
            title: "Soil Microbial Diversity",
            shortDescription: "Analysis of microbial communities in agricultural soils",
            fullDescription: "Investigating the diversity of microbial communities in various agricultural soil ecosystems and their role in nutrient cycling and soil health.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1174&q=80",
            tags: ["Soil Microbiology", "Agriculture", "Microbial Ecology"],
            category: "completed",
            details: [
                "Soil sample collection from different farms",
                "DNA extraction and sequencing",
                "Bioinformatic analysis",
                "Correlation with soil parameters"
            ],
            status: "completed",
            start_date: "2022-03-01",
            end_date: "2023-02-28",
            principal_investigator: "Dr. Maria Rodriguez",
            funding_source: "Agricultural Research Council"
        }
    ];
}

// Make functions available globally
window.filterProjects = filterProjects;
window.resetFilters = resetFilters;
window.viewProjectDetails = viewProjectDetails;
window.closeModal = closeModal;