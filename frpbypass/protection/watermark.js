// ====== DYNAMIC WATERMARK ======
// Adds user-specific invisible watermark

(function() {
    'use strict';
    
    // Generate unique user ID
    const userId = generateUserId();
    
    // Add to localStorage
    localStorage.setItem('frp_uid', userId);
    
    function generateUserId() {
        const userAgent = navigator.userAgent;
        const screenRes = `${screen.width}x${screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        
        const raw = `${userAgent}-${screenRes}-${timezone}-${language}-${Date.now()}`;
        return btoa(raw).substring(0, 20);
    }
    
    // Create invisible watermark
    function createWatermark() {
        // Visible watermark
        const visibleWatermark = document.querySelector('.watermark');
        if (visibleWatermark) {
            visibleWatermark.innerHTML = `© ASHISH FRP BYPASS 2026 • ID: ${userId.substring(0, 8)}`;
        }
        
        // Invisible watermarks throughout page
        const elements = document.querySelectorAll('*');
        elements.forEach((el, index) => {
            if (index % 100 === 0) { // Add to every 100th element
                el.setAttribute('data-frp', userId);
            }
        });
        
        // Add to meta tags
        let meta = document.querySelector('meta[name="frp-id"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'frp-id';
            meta.content = userId;
            document.head.appendChild(meta);
        }
        
        // Add to body attribute
        document.body.setAttribute('data-frp-session', userId);
    }
    
    // Check for screenshots
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            // Add more watermarks when tab is hidden (screenshot detected)
            const elements = document.querySelectorAll('.app-card, .grid-item');
            elements.forEach(el => {
                el.style.border = '2px dashed #ff0000';
                setTimeout(() => {
                    el.style.border = '';
                }, 100);
            });
        }
    });
    
    // Periodic watermark refresh
    setInterval(createWatermark, 5000);
    
    // Initial creation
    createWatermark();
    
    console.log('💧 Dynamic Watermark Active');
})();