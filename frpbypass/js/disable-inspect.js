// ====== DISABLE INSPECT ELEMENT & DEVTOOLS ======
// Version: 4.0.0
// Complete DevTools blocking solution

(function() {
    'use strict';
    
    // ====== BLOCK ALL DEVTOOLS SHORTCUTS ======
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            showDevToolsWarning();
            return false;
        }
        
        // Ctrl+Shift+I / Cmd+Shift+I
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            showDevToolsWarning();
            return false;
        }
        
        // Ctrl+Shift+J / Cmd+Shift+J
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            showDevToolsWarning();
            return false;
        }
        
        // Ctrl+Shift+C / Cmd+Shift+C
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            showDevToolsWarning();
            return false;
        }
        
        // Ctrl+U / Cmd+U (View Source)
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            showViewSourceWarning();
            return false;
        }
        
        // Ctrl+Shift+K (Console)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+E (Network)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+F (Search)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            return false;
        }
    });
    
    // ====== SHOW WARNINGS ======
    function showDevToolsWarning() {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            z-index: 999999;
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.5);
            animation: slideDown 0.3s ease;
            border: 2px solid rgba(255,255,255,0.2);
        `;
        warning.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <i class="fas fa-ban" style="font-size:20px;"></i>
                <span>❌ Developer Tools Detected! Access Denied.</span>
            </div>
            <style>
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(warning);
        setTimeout(() => warning.remove(), 3000);
    }
    
    function showViewSourceWarning() {
        alert('❌ View Source is disabled on this page!');
    }
    
    // ====== DEVTOOLS DETECTION METHODS ======
    
    // Method 1: Console Log Detection
    let devtoolsOpen = false;
    const devtoolsPattern = /./;
    devtoolsPattern.toString = function() {
        devtoolsOpen = true;
        return '';
    };
    
    // Method 2: Debugger Detection
    setInterval(function() {
        const startTime = performance.now();
        debugger;
        const endTime = performance.now();
        
        if (endTime - startTime > 100) {
            devtoolsOpen = true;
        }
        
        if (devtoolsOpen) {
            // Clear console
            console.clear();
            
            // Show warning in console
            console.log('%c⚠️ PROTECTED CONTENT ⚠️', 'font-size:30px; color:red; font-weight:bold;');
            console.log('%cDeveloper tools are not allowed!', 'font-size:20px; color:#ef4444;');
            console.log('%cClose DevTools to continue', 'font-size:16px; color:#666;');
            
            // Replace page content (optional - uncomment to enable)
            // document.body.innerHTML = '<div style="text-align:center;margin-top:100px;"><h1 style="color:#ef4444;">❌ Developer Tools Detected!</h1><p style="color:#666;">Please close DevTools to continue.</p></div>';
            
            devtoolsOpen = false;
        }
    }, 500);
    
    // Method 3: Window Size Detection
    function detectDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
            devtoolsOpen = true;
        }
    }
    
    setInterval(detectDevTools, 1000);
    
    // Method 4: Element ID Detection
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devtoolsOpen = true;
        }
    });
    
    // Method 5: Firebug Detection
    if (window.console && (console.firebug || console.assert && console.table)) {
        devtoolsOpen = true;
    }
    
    // ====== DISABLE CONSOLE COMPLETELY ======
    const noop = function() {};
    const consoleMethods = [
        'log', 'warn', 'error', 'info', 'debug', 
        'table', 'trace', 'group', 'groupCollapsed', 
        'groupEnd', 'time', 'timeEnd', 'profile', 
        'profileEnd', 'dir', 'dirxml', 'assert', 
        'count', 'markTimeline', 'timeline', 'timelineEnd'
    ];
    
    const fakeConsole = {};
    consoleMethods.forEach(method => {
        fakeConsole[method] = noop;
    });
    
    Object.defineProperty(window, 'console', {
        get: function() {
            if (devtoolsOpen) {
                return fakeConsole;
            }
            return console;
        },
        set: function(val) {
            return val;
        }
    });
    
    // ====== BLOCK RIGHT CLICK CONTEXT MENU ======
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        // Show custom context menu? (Optional)
        // You can create custom menu here
        
        return false;
    });
    
    // ====== BLOCK SELECTION ======
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // ====== BLOCK CSS INSPECTION ======
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            -khtml-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
        
        img, a, div, span, p, h1, h2, h3, h4, h5, h6 {
            -webkit-user-drag: none !important;
            user-drag: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // ====== ANTI-DEBUGGING ======
    (function() {
        const start = new Date();
        debugger;
        const end = new Date();
        if (end - start > 100) {
            // DevTools is open
            while(true) {
                // Infinite loop to crash DevTools
            }
        }
    })();
    
    // ====== DETECT EMULATED DEVICES ======
    if (window.navigator.webdriver) {
        window.location.href = 'about:blank';
    }
    
    console.log('✅ DevTools Protection Active');
})();