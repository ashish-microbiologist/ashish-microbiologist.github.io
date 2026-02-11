// ====== CONTENT ENCRYPTION ======
// Encrypts sensitive data in memory

(function() {
    'use strict';
    
    // Simple XOR encryption for strings
    const encrypt = function(text, key = 'frp2026') {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return btoa(result);
    };
    
    const decrypt = function(encrypted, key = 'frp2026') {
        try {
            const text = atob(encrypted);
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(
                    text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            return result;
        } catch(e) {
            return '';
        }
    };
    
    // Store encrypted URLs
    window._secureStorage = {
        data: {},
        
        set: function(key, value) {
            this.data[key] = encrypt(value);
        },
        
        get: function(key) {
            return decrypt(this.data[key]);
        },
        
        clear: function() {
            this.data = {};
        }
    };
    
    // Encrypt app URLs on load
    window.addEventListener('DOMContentLoaded', function() {
        const appData = document.querySelector('#app-data');
        if (appData) {
            const apps = JSON.parse(appData.textContent || '[]');
            apps.forEach(app => {
                if (app.url) {
                    window._secureStorage.set(app.name, app.url);
                    app.url = '#'; // Remove original URL
                }
            });
        }
    });
    
    // Clear sensitive data on tab close
    window.addEventListener('beforeunload', function() {
        window._secureStorage.clear();
    });
    
    console.log('🔐 Content Encryption Active');
})();