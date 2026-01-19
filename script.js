// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initWebsite();
    
    // Hide loader after 3 seconds
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('main-content').style.opacity = '1';
        
        // Initialize matrix effect after loader is hidden
        initMatrixEffect();
    }, 3000);
    
    // Initialize visitor count
    updateVisitorCount();
    
    // Initialize videos
    loadVideos();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update system time
    updateSystemTime();
    
    // Start system animations
    startSystemAnimations();
});

// Initialize the website
function initWebsite() {
    console.log("> INITIALIZING OP ASHISH YT WEBSITE...");
    console.log("> SYSTEM BOOT COMPLETE");
    console.log("> WELCOME TO THE MATRIX");
}

// Matrix rain effect
function initMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters
    const matrixChars = "01OPASHISHYT";
    const chars = matrixChars.split("");
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Create an array of drops
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    // Draw the matrix effect
    function drawMatrix() {
        // Semi-transparent black background for trailing effect
        ctx.fillStyle = "rgba(0, 10, 0, 0.04)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text color and font
        ctx.fillStyle = "#00ff00";
        ctx.font = fontSize + "px 'Share Tech Mono', monospace";
        
        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            
            // Draw character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Move drop down
            drops[i]++;
            
            // Randomly reset drop to top
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    }
    
    // Resize canvas when window resizes
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Start animation
    setInterval(drawMatrix, 35);
}

// Update visitor count
function updateVisitorCount() {
    // Generate random visitor count between 1000 and 5000
    const visitorCount = Math.floor(Math.random() * 4000) + 1000;
    document.getElementById('visitor-count').textContent = visitorCount.toLocaleString();
}

// Load videos
function loadVideos() {
    const videoContainer = document.getElementById('video-container');
    
    // Sample videos data
    const videos = [
        {
            title: "Kali Linux Full Tutorial for Beginners",
            thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "https://youtube.com/OPASHISHYT315M",
            desc: "Complete guide to Kali Linux for ethical hacking beginners",
            date: "2023-10-15"
        },
        {
            title: "How to Hack WiFi Password Using Termux",
            thumbnail: "https://images.unsplash.com/photo-1546054450-469c6d9f3d91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "https://youtube.com/OPASHISHYT315M",
            desc: "Step by step tutorial to hack WiFi passwords using Termux on Android",
            date: "2023-10-10"
        },
        {
            title: "Metasploit Framework Complete Guide",
            thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "https://youtube.com/OPASHISHYT315M",
            desc: "Learn how to use Metasploit for penetration testing",
            date: "2023-10-05"
        },
        {
            title: "Bug Bounty Hunting for Beginners",
            thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "https://youtube.com/OPASHISHYT315M",
            desc: "Start your bug bounty journey with this complete guide",
            date: "2023-09-28"
        },
        {
            title: "Python for Ethical Hacking - Full Course",
            thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "https://youtube.com/OPASHISHYT315M",
            desc: "Learn Python programming for cybersecurity and hacking",
            date: "2023-09-20"
        },
        {
            title: "How to Stay Anonymous Online - Complete Guide",
            thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "https://youtube.com/OPASHISHYT315M",
            desc: "Complete anonymity guide for hackers and privacy enthusiasts",
            date: "2023-09-15"
        }
    ];
    
    // Clear container
    videoContainer.innerHTML = '';
    
    // Add videos to container
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videoContainer.appendChild(videoCard);
    });
}

// Create video card element
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    
    card.innerHTML = `
        <div class="video-thumb">
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-play">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <p class="video-desc">${video.desc}</p>
            <div class="video-meta">
                <span class="video-date">${video.date}</span>
                <span class="video-views"><i class="fas fa-eye"></i> ${Math.floor(Math.random() * 10000) + 1000}</span>
            </div>
        </div>
    `;
    
    // Add click event to open video
    card.addEventListener('click', function() {
        window.open(video.url, '_blank');
    });
    
    return card;
}

// Set up event listeners
function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 20,
                behavior: 'smooth'
            });
        });
    });
    
    // Add video button
    document.getElementById('add-video-btn').addEventListener('click', function() {
        openVideoModal();
    });
    
    // Close modal button
    document.querySelector('.close-modal').addEventListener('click', function() {
        closeVideoModal();
    });
    
    // Save video button
    document.getElementById('save-video-btn').addEventListener('click', function() {
        saveVideo();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('video-modal');
        if (e.target === modal) {
            closeVideoModal();
        }
    });
    
    // Theme selector
    document.getElementById('theme').addEventListener('change', function() {
        changeTheme(this.value);
    });
    
    // Animation speed slider
    document.getElementById('animation').addEventListener('input', function() {
        updateAnimationSpeed(this.value);
    });
    
    // Reset button
    document.getElementById('reset-btn').addEventListener('click', function() {
        resetToDefault();
    });
    
    // Send message button
    document.getElementById('send-btn').addEventListener('click', function() {
        sendMessage();
    });
    
    // Glitch effect toggle
    document.getElementById('glitch').addEventListener('change', function() {
        toggleGlitchEffect(this.checked);
    });
}

// Open video modal
function openVideoModal() {
    document.getElementById('video-modal').style.display = 'flex';
}

// Close video modal
function closeVideoModal() {
    document.getElementById('video-modal').style.display = 'none';
    // Clear form
    document.getElementById('video-title').value = '';
    document.getElementById('video-url').value = '';
    document.getElementById('video-thumb').value = '';
    document.getElementById('video-desc').value = '';
}

// Save video
function saveVideo() {
    const title = document.getElementById('video-title').value;
    const url = document.getElementById('video-url').value;
    const thumb = document.getElementById('video-thumb').value;
    const desc = document.getElementById('video-desc').value;
    
    if (!title || !url || !thumb || !desc) {
        alert("> ERROR: ALL FIELDS ARE REQUIRED!");
        return;
    }
    
    // Create new video object
    const newVideo = {
        title: title,
        thumbnail: thumb,
        url: url,
        desc: desc,
        date: new Date().toISOString().split('T')[0]
    };
    
    // Add to videos container
    const videoContainer = document.getElementById('video-container');
    const videoCard = createVideoCard(newVideo);
    videoContainer.prepend(videoCard);
    
    // Close modal
    closeVideoModal();
    
    // Show success message
    showTerminalMessage("> VIDEO ADDED SUCCESSFULLY!");
}

// Change theme
function changeTheme(theme) {
    const root = document.documentElement;
    
    switch(theme) {
        case 'green':
            // Default green theme - already set
            break;
        case 'cyan':
            document.querySelectorAll('.green-text').forEach(el => {
                el.classList.remove('green-text');
                el.classList.add('cyan-text');
            });
            document.documentElement.style.setProperty('--main-color', '#00ffff');
            break;
        case 'red':
            document.querySelectorAll('.green-text').forEach(el => {
                el.classList.remove('green-text');
                el.classList.add('red-text');
            });
            document.documentElement.style.setProperty('--main-color', '#ff0000');
            break;
        case 'blue':
            document.querySelectorAll('.green-text').forEach(el => {
                el.classList.remove('green-text');
                el.classList.add('blue-text');
            });
            document.documentElement.style.setProperty('--main-color', '#0099ff');
            break;
    }
    
    showTerminalMessage(`> THEME CHANGED TO: ${theme.toUpperCase()}`);
}

// Update animation speed
function updateAnimationSpeed(speed) {
    const valueText = document.getElementById('speed-value');
    
    if (speed <= 3) {
        valueText.textContent = 'SLOW';
    } else if (speed <= 7) {
        valueText.textContent = 'MEDIUM';
    } else {
        valueText.textContent = 'FAST';
    }
    
    // Update animation speeds
    const blinkElements = document.querySelectorAll('.blink');
    blinkElements.forEach(el => {
        el.style.animationDuration = `${11 - speed}s`;
    });
    
    const pulseElements = document.querySelectorAll('.pulse, .status-indicator');
    pulseElements.forEach(el => {
        el.style.animationDuration = `${11 - speed}s`;
    });
}

// Reset to default settings
function resetToDefault() {
    // Reset theme
    document.getElementById('theme').value = 'green';
    changeTheme('green');
    
    // Reset animation speed
    document.getElementById('animation').value = 5;
    updateAnimationSpeed(5);
    
    // Reset toggles
    document.getElementById('sound').checked = true;
    document.getElementById('glitch').checked = true;
    
    showTerminalMessage("> SETTINGS RESET TO DEFAULT");
}

// Send message
function sendMessage() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
        alert("> ERROR: ALL FIELDS ARE REQUIRED!");
        return;
    }
    
    // In a real application, you would send this data to a server
    console.log(`> MESSAGE FROM: ${name}`);
    console.log(`> EMAIL: ${email}`);
    console.log(`> MESSAGE: ${message}`);
    
    // Clear form
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    
    // Show success message
    showTerminalMessage("> MESSAGE SENT SUCCESSFULLY!");
}

// Toggle glitch effect
function toggleGlitchEffect(enabled) {
    const logo = document.querySelector('.logo');
    
    if (enabled) {
        logo.classList.add('glitch');
    } else {
        logo.classList.remove('glitch');
    }
}

// Update system time
function updateSystemTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('last-update').textContent = dateStr;
    
    // Update every second
    setInterval(updateSystemTime, 1000);
}

// Start system animations
function startSystemAnimations() {
    // System load animation
    const systemLoad = document.getElementById('system-load');
    let loadValue = 45;
    let increasing = true;
    
    setInterval(() => {
        if (increasing) {
            loadValue += Math.random() * 5;
            if (loadValue > 85) increasing = false;
        } else {
            loadValue -= Math.random() * 5;
            if (loadValue < 25) increasing = true;
        }
        
        systemLoad.style.width = `${loadValue}%`;
        document.querySelectorAll('.progress-value')[0].textContent = `${Math.round(loadValue)}%`;
    }, 2000);
    
    // Bandwidth animation
    const bandwidth = document.getElementById('bandwidth');
    let bandwidthValue = 72;
    let bandwidthIncreasing = false;
    
    setInterval(() => {
        if (bandwidthIncreasing) {
            bandwidthValue += Math.random() * 3;
            if (bandwidthValue > 90) bandwidthIncreasing = false;
        } else {
            bandwidthValue -= Math.random() * 3;
            if (bandwidthValue < 50) bandwidthIncreasing = true;
        }
        
        bandwidth.style.width = `${bandwidthValue}%`;
        document.querySelectorAll('.progress-value')[1].textContent = `${Math.round(bandwidthValue)}%`;
    }, 1500);
}

// Show terminal message
function showTerminalMessage(message) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'terminal-message';
    messageEl.textContent = message;
    
    // Style the message
    messageEl.style.position = 'fixed';
    messageEl.style.bottom = '20px';
    messageEl.style.right = '20px';
    messageEl.style.backgroundColor = 'rgba(0, 20, 0, 0.9)';
    messageEl.style.color = '#00ff00';
    messageEl.style.padding = '15px';
    messageEl.style.border = '1px solid #00ff00';
    messageEl.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    messageEl.style.zIndex = '1000';
    messageEl.style.fontFamily = "'Share Tech Mono', monospace";
    messageEl.style.fontSize = '0.9rem';
    
    // Add to document
    document.body.appendChild(messageEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// Add some initial terminal messages on load
setTimeout(() => {
    showTerminalMessage("> SYSTEM BOOT COMPLETE");
    setTimeout(() => {
        showTerminalMessage("> WELCOME TO OP ASHISH YT");
    }, 500);
}, 3500);            this.style.color = '#CC0000';
        }, 3000);
    });
    
    // Video Card Click Event
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const videos = [
                'https://youtu.be/example1',
                'https://youtu.be/example2',
                'https://youtu.be/example3'
            ];
            showNotification(`Opening Video ${index + 1}...`);
            
            // In real implementation, you would redirect to video
            // window.open(videos[index], '_blank');
        });
    });
    
    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = document.querySelector('input[type="text"]').value;
        const email = document.querySelector('input[type="email"]').value;
        const message = document.querySelector('textarea').value;
        
        if(name && email && message) {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! Ashish will contact you soon.');
                contactForm.reset();
                this.innerHTML = '<i class="fas fa-paper-plane"></i> मैसेज भेजें';
                this.disabled = false;
            }, 2000);
        } else {
            showNotification('Please fill all fields!', 'error');
        }
    });
    
    // Social Media Icons Hover Effect
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(360deg) scale(1.2)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });
    
    // View Counter Animation
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start) + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Animate stats on scroll
    const statsSection = document.querySelector('.stats');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = document.querySelectorAll('.stat span');
                animateCounter(statElements[0], 0, 1, 2000); // 1M+
                animateCounter(statElements[1], 0, 500, 1500); // 500+
                animateCounter(statElements[2], 0, 50, 2500); // 50M+
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if(statsSection) {
        observer.observe(statsSection);
    }
    
    // Notification Function
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if(existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#FF0000'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // YouTube Channel Link
    const youtubeBtn = document.querySelector('.youtube-btn');
    youtubeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Redirecting to YouTube Channel...');
        // In real implementation:
        // window.open('https://youtube.com/c/OPASHISHYT', '_blank');
    });
    
    // Current Year in Footer
    const yearSpan = document.querySelector('.copyright');
    if(yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = yearSpan.textContent.replace('2024', currentYear);
    }
    
    // Page Load Animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
