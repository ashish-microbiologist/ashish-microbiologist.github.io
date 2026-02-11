// ====== ANTI DOWNLOAD & COPY PROTECTION ======
// Version: 3.5.0
// This file prevents any kind of content download/copy

(function() {
    'use strict';
    
    // ====== BLOCK ALL SAVE ATTEMPTS ======
    const blockEvent = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    };
    
    // ====== KEYBOARD SHORTCUTS BLOCK ======
    document.addEventListener('keydown', function(e) {
        // Block all Ctrl/Cmd combinations
        if (e.ctrlKey || e.metaKey) {
            const blocked = [
                's', 'S',     // Save
                'u', 'U',     // View Source
                'p', 'P',     // Print
                'c', 'C',     // Copy
                'x', 'X',     // Cut
                'v', 'V',     // Paste
                'a', 'A',     // Select All
                'f', 'F',     // Find
                'g', 'G',     // Find Next
                'h', 'H',     // History
                'j', 'J',     // Download
                'd', 'D',     // Bookmark
                'e', 'E',     // Sidebar
                't', 'T',     // New Tab
                'n', 'N',     // New Window
                'w', 'W',     // Close Tab
                'r', 'R',     // Reload
                'o', 'O'      // Open
            ];
            
            if (blocked.includes(e.key)) {
                e.preventDefault();
                return false;
            }
        }
        
        // Function keys
        const functionKeys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
        if (functionKeys.includes(e.key)) {
            e.preventDefault();
            return false;
        }
        
        // Alt combinations
        if (e.altKey) {
            e.preventDefault();
            return false;
        }
    });
    
    // ====== MOUSE EVENTS BLOCK ======
    document.addEventListener('contextmenu', blockEvent);           // Right click
    document.addEventListener('selectstart', blockEvent);          // Text selection
    document.addEventListener('dragstart', blockEvent);            // Drag
    document.addEventListener('drop', blockEvent);                // Drop
    document.addEventListener('dragover', blockEvent);            // Drag over
    document.addEventListener('dragend', blockEvent);             // Drag end
    
    // ====== COPY/PASTE BLOCK ======
    document.addEventListener('copy', blockEvent);
    document.addEventListener('cut', blockEvent);
    document.addEventListener('paste', blockEvent);
    
    // ====== PRINT BLOCK ======
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        window.close(); // Try to close print dialog
        return false;
    });
    
    // ====== SCREENSHOT DETECTION ======
    let screenshotTaken = false;
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            screenshotTaken = true;
            // Add tracking watermark
            const watermark = document.createElement('div');
            watermark.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(255,0,0,0.1);
                color: red;
                text-align: center;
                padding: 20px;
                font-size: 20px;
                z-index: 999999;
                pointer-events: none;
            `;
            watermark.innerHTML = '© FRP BYPASS BY ASHISH 2026 - TRACKING ID: ' + generateTrackingId();
            document.body.appendChild(watermark);
            
            setTimeout(() => watermark.remove(), 2000);
        }
    });
    
    // ====== GENERATE TRACKING ID ======
    function generateTrackingId() {
        const userAgent = navigator.userAgent;
        const screen = `${screen.width}x${screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        
        return btoa(`${userAgent}-${screen}-${timezone}-${timestamp}-${random}`).substring(0, 16);
    }
    
    // ====== BLOCK SAVE AS ======
    window.addEventListener('load', function() {
        // Block image save
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('contextmenu', blockEvent);
            img.addEventListener('dragstart', blockEvent);
            img.setAttribute('draggable', 'false');
        });
        
        // Block link save
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('contextmenu', blockEvent);
            link.addEventListener('dragstart', blockEvent);
            link.setAttribute('draggable', 'false');
            link.setAttribute('onclick', 'return false;');
        });
    });
    
    // ====== BLOCK OFFLINE ACCESS ======
    if (!navigator.onLine) {
        document.body.innerHTML = '<h1 style="color:red;text-align:center;margin-top:50px;">🔒 Offline access not allowed</h1>';
        setTimeout(() => { window.location.reload(); }, 1000);
    }
    
    // ====== BLOCK VIEW SOURCE ======
    if (window.location.protocol === 'view-source:') {
        document.write('<!-- View Source is disabled for this page -->');
        window.location.href = '/';
    }
    
    // ====== BLOCK WEB ARCHIVE ======
    if (window.location.href.includes('archive.org') || 
        window.location.href.includes('archive.is') ||
        window.location.href.includes('wayback')) {
        document.body.innerHTML = '<h1>🔒 Archived content not available</h1>';
    }
    
    console.log('✅ Anti-Download Protection Active');
})();