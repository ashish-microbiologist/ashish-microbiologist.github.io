// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('OP ASHISH YT Website Loaded Successfully!');
    
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Subscribe Button Animation
    const subscribeBtn = document.querySelector('.subscribe-btn');
    subscribeBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        this.style.background = '#4CAF50';
        this.style.color = 'white';
        
        // Show notification
        showNotification('Successfully subscribed to OP ASHISH YT!');
        
        // Reset after 3 seconds
        setTimeout(() => {
            this.innerHTML = '<i class="fab fa-youtube"></i> सब्सक्राइब';
            this.style.background = '#FFD700';
            this.style.color = '#CC0000';
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