// ====== DISABLE INSPECT ELEMENT ======
// Blocks all developer tools access

(function() {
    'use strict';
    
    // Block F12, Ctrl+Shift+I, Cmd+Opt+I, etc.
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I / Cmd+Shift+I
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J / Cmd+Shift+J
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+C / Cmd+Shift+C
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U / Cmd+U (View Source)
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable right click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Detect DevTools opening
    let devtoolsOpen = false;
    
    // Method 1: Check window size
    const checkDevTools = function() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                document.body.innerHTML = '<div style="text-align:center;margin-top:50px;"><h1 style="color:red;">❌ Developer Tools Detected!</h1><p>Please close DevTools to continue.</p></div>';
            }
        } else {
            devtoolsOpen = false;
        }
    };
    
    // Method 2: Debugger trick
    setInterval(function() {
        const start = new Date();
        debugger;
        const end = new Date();
        
        if (end - start > 100) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                // Redirect or show warning
                document.body.innerHTML = '<div style="text-align:center;margin-top:50px;"><h1 style="color:red;">❌ Developer Tools Detected!</h1><p>This site is protected.</p></div>';
            }
        }
    }, 500);
    
    // Check every second
    setInterval(checkDevTools, 1000);
    
    // Block console output
    const noConsole = function() {
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
        console.info = function() {};
        console.debug = function() {};
        console.table = function() {};
        console.trace = function() {};
        console.group = function() {};
        console.groupEnd = function() {};
    };
    
    noConsole();
    setInterval(noConsole, 100);
    
    // Anti-debugging
    const fn = function() {};
    Object.defineProperty(window, 'console', {
        get: function() {
            return {
                log: fn,
                warn: fn,
                error: fn,
                info: fn,
                debug: fn,
                table: fn,
                trace: fn,
                group: fn,
                groupEnd: fn
            };
        }
    });
    
    console.log('🛡️ Inspect Element Protection Active');
})();