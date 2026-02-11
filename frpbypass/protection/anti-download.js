// ====== ANTI DOWNLOAD PROTECTION ======
// Version: 3.0
// This file prevents any download of source code

(function() {
    'use strict';
    
    // Block all save/download attempts
    const blockSave = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    };
    
    // Block Ctrl+S, Cmd+S, etc.
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 's' || e.key === 'S' || 
                e.key === 'u' || e.key === 'U' ||
                e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                return false;
            }
        }
    });
    
    // Block drag & drop
    document.addEventListener('dragstart', blockSave);
    document.addEventListener('drop', blockSave);
    document.addEventListener('dragover', blockSave);
    
    // Block selection
    document.addEventListener('selectstart', blockSave);
    
    // Block copy/paste
    document.addEventListener('copy', blockSave);
    document.addEventListener('cut', blockSave);
    document.addEventListener('paste', blockSave);
    
    // Disable print
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Block DevTools completely
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            window.location.href = 'about:blank';
        }
    });
    
    // Console cleaner
    setInterval(function() {
        console.clear();
        console.log('%c⚠️ PROTECTED CONTENT ⚠️', 'font-size:20px;color:red;font-weight:bold;');
        console.log('%cDownloading/Reproduction is strictly prohibited!', 'color:#ff0000;');
    }, 1000);
    
    // Block iframe embedding
    if (window.self !== window.top) {
        window.top.location.href = window.self.location.href;
    }
    
    // Anti-bot detection
    const isBot = navigator.webdriver || 
                  !navigator.languages || 
                  navigator.languages.length === 0 ||
                  navigator.plugins.length === 0;
    
    if (isBot) {
        document.body.innerHTML = '<h1>Access Denied</h1>';
    }
    
    // Hide source in view-source
    if (window.location.protocol === 'view-source:') {
        document.write('<!-- Source view disabled -->');
    }
    
    // Block offline storage
    if (!window.navigator.onLine) {
        sessionStorage.clear();
        localStorage.clear();
    }
    
    console.log('🔒 Anti-Download Protection Active');
})();