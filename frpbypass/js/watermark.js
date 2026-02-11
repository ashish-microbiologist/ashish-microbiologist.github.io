// ====== DYNAMIC WATERMARK SYSTEM ======
// Version: 3.0.0
// Adds visible and invisible watermarks

(function() {
    'use strict';
    
    // ====== GENERATE UNIQUE USER ID ======
    function generateUserID() {
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 'unknown',
            navigator.deviceMemory || 'unknown',
            navigator.platform,
            navigator.vendor,
            navigator.maxTouchPoints || 0
        ].join('|');
        
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return 'ASHISH-' + Math.abs(hash).toString(36).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
    }
    
    const USER_ID = generateUserID();
    const SESSION_ID = btoa(Date.now().toString() + Math.random().toString()).substring(0, 16);
    
    // ====== VISIBLE WATERMARK ======
    function createVisibleWatermark() {
        // Remove existing watermark
        const existing = document.querySelector('.frp-watermark-visible');
        if (existing) existing.remove();
        
        const watermark = document.createElement('div');
        watermark.className = 'frp-watermark-visible';
        watermark.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: rgba(255, 255, 255, 0.3);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 11px;
            font-family: monospace;
            z-index: 99999;
            pointer-events: none;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            letter-spacing: 1px;
        `;
        
        const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;
        
        watermark.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:3px;">
                <div style="display:flex; align-items:center; gap:5px;">
                    <span style="color:#3b82f6; font-weight:bold;">©</span>
                    <span style="color:#8b5cf6;">ASHISH FRP</span>
                </div>
                <div style="display:flex; gap:10px; font-size:9px; color:rgba(255,255,255,0.5);">
                    <span>ID: ${USER_ID.substring(0, 8)}</span>
                    <span>${formattedDate}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(watermark);
    }
    
    // ====== INVISIBLE WATERMARK (HTML Comments) ======
    function addInvisibleWatermark() {
        // Add to HTML comments
        const comment = document.createComment(` FRP BYPASS | USER: ${USER_ID} | SESSION: ${SESSION_ID} | DATE: ${new Date().toISOString()} `);
        document.body.appendChild(comment);
        
        // Add to meta tags
        let meta = document.querySelector('meta[name="frp-user"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'frp-user';
            meta.content = USER_ID;
            document.head.appendChild(meta);
        }
        
        // Add to body attribute
        document.body.setAttribute('data-frp-session', SESSION_ID);
        document.body.setAttribute('data-frp-user', USER_ID);
        document.body.setAttribute('data-frp-timestamp', Date.now());
        
        // Add to root element
        document.documentElement.setAttribute('data-frp', USER_ID.substring(0, 8));
    }
    
    // ====== INVISIBLE WATERMARK (CSS) ======
    function addCSSWatermark() {
        const style = document.createElement('style');
        style.textContent = `
            body::after {
                content: "© ASHISH FRP BYPASS 2026 | USER: ${USER_ID}";
                display: none;
            }
            
            #app-container::before {
                content: "${SESSION_ID}";
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ====== INVISIBLE WATERMARK (DOM Elements) ======
    function addDOMWatermark() {
        // Add to every 50th element
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el, index) => {
            if (index % 50 === 0) {
                el.setAttribute('data-frp-id', USER_ID.substring(0, 5));
            }
        });
        
        // Add to images
        document.querySelectorAll('img').forEach((img, index) => {
            if (index % 3 === 0) {
                img.setAttribute('alt', img.alt + ` [FRP: ${USER_ID.substring(0, 5)}]`);
            }
        });
    }
    
    // ====== INVISIBLE WATERMARK (Canvas) ======
    function addCanvasWatermark() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        canvas.style.display = 'none';
        canvas.id = 'frp-canvas-' + SESSION_ID;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0,0,0,0.01)';
        ctx.font = '1px Arial';
        ctx.fillText(USER_ID, 0, 0);
        
        document.body.appendChild(canvas);
    }
    
    // ====== TRACK SCREENSHOTS ======
    function trackScreenshots() {
        let isTabHidden = false;
        
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                isTabHidden = true;
                
                // Flash effect when screenshot is taken
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(59, 130, 246, 0.3);
                    z-index: 999999;
                    pointer-events: none;
                    animation: flash 0.3s ease;
                `;
                
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes flash {
                        0% { opacity: 0; }
                        50% { opacity: 1; }
                        100% { opacity: 0; }
                    }
                `;
                
                document.head.appendChild(style);
                document.body.appendChild(flash);
                
                setTimeout(() => {
                    flash.remove();
                    style.remove();
                }, 300);
            }
            
            if (document.visibilityState === 'visible' && isTabHidden) {
                // Log screenshot attempt (invisible)
                console.log(`[FRP] Screenshot captured - User: ${USER_ID} - Time: ${new Date().toISOString()}`);
                isTabHidden = false;
            }
        });
    }
    
    // ====== ADD TEXT WATERMARK TO SELECTABLE CONTENT ======
    function addTextWatermark() {
        // Override copy to add watermark
        const originalAddEventListener = document.addEventListener;
        document.addEventListener('copy', function(e) {
            const selection = document.getSelection();
            const text = selection.toString();
            
            if (text) {
                e.clipboardData.setData('text/plain', 
                    text + '\n\n---\n© FRP BYPASS BY ASHISH 2026\nUser ID: ' + USER_ID + '\nSession: ' + SESSION_ID
                );
                e.preventDefault();
            }
        });
    }
    
    // ====== INITIALIZE ALL WATERMARKS ======
    function initWatermarks() {
        createVisibleWatermark();
        addInvisibleWatermark();
        addCSSWatermark();
        addDOMWatermark();
        addCanvasWatermark();
        trackScreenshots();
        addTextWatermark();
        
        console.log('✅ Watermark System Active - User:', USER_ID.substring(0, 8));
    }
    
    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWatermarks);
    } else {
        initWatermarks();
    }
    
    // Refresh watermark periodically
    setInterval(createVisibleWatermark, 30000);
    
    // Export for admin
    window.getUserID = function() {
        return USER_ID;
    };
    
    window.getSessionID = function() {
        return SESSION_ID;
    };
})();