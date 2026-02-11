// ====== CONTENT ENCRYPTION SYSTEM ======
// Version: 3.0.0
// Encrypts sensitive data and URLs

(function() {
    'use strict';
    
    // ====== ENCRYPTION KEY ======
    const ENCRYPTION_KEY = 'ashish-frp-2026-bypass';
    
    // ====== SIMPLE XOR ENCRYPTION ======
    const xorEncrypt = function(text, key = ENCRYPTION_KEY) {
        if (!text) return '';
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        
        // Convert to base64
        return btoa(encodeURIComponent(result));
    };
    
    const xorDecrypt = function(encrypted, key = ENCRYPTION_KEY) {
        if (!encrypted) return '';
        
        try {
            // Decode from base64
            const decoded = decodeURIComponent(atob(encrypted));
            
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode);
            }
            return result;
        } catch(e) {
            console.warn('Decryption failed:', e);
            return '';
        }
    };
    
    // ====== ADVANCED ENCRYPTION ======
    const advancedEncrypt = function(text) {
        // Multiple layers of encoding
        let encoded = btoa(text); // Base64
        encoded = btoa(encoded); // Double Base64
        encoded = xorEncrypt(encoded); // XOR
        
        // Reverse string
        encoded = encoded.split('').reverse().join('');
        
        return encoded;
    };
    
    const advancedDecrypt = function(encrypted) {
        try {
            // Reverse string
            let decoded = encrypted.split('').reverse().join('');
            
            // Decrypt XOR
            decoded = xorDecrypt(decoded);
            
            // Double Base64 decode
            decoded = atob(decoded);
            decoded = atob(decoded);
            
            return decoded;
        } catch(e) {
            return '';
        }
    };
    
    // ====== SECURE STORAGE ======
    window._secureStorage = {
        _data: {},
        
        // Set encrypted value
        set: function(key, value) {
            this._data[key] = advancedEncrypt(value);
        },
        
        // Get decrypted value
        get: function(key) {
            if (!this._data[key]) return null;
            return advancedDecrypt(this._data[key]);
        },
        
        // Set with expiry
        setWithExpiry: function(key, value, ttlMinutes = 60) {
            const item = {
                value: advancedEncrypt(value),
                expiry: Date.now() + (ttlMinutes * 60 * 1000)
            };
            this._data[key] = advancedEncrypt(JSON.stringify(item));
        },
        
        // Get with expiry check
        getWithExpiry: function(key) {
            if (!this._data[key]) return null;
            
            try {
                const decrypted = advancedDecrypt(this._data[key]);
                const item = JSON.parse(decrypted);
                
                if (Date.now() > item.expiry) {
                    delete this._data[key];
                    return null;
                }
                
                return advancedDecrypt(item.value);
            } catch(e) {
                return null;
            }
        },
        
        // Clear all data
        clear: function() {
            this._data = {};
        },
        
        // Remove specific key
        remove: function(key) {
            delete this._data[key];
        },
        
        // Get all keys
        keys: function() {
            return Object.keys(this._data);
        }
    };
    
    // ====== ENCRYPT APP URLs ======
    function encryptAppUrls() {
        // Wait for apps to be defined
        const checkApps = setInterval(function() {
            if (window.apps && Array.isArray(window.apps)) {
                clearInterval(checkApps);
                
                // Store original URLs securely
                window.apps.forEach((app, index) => {
                    if (app.url && !app.url.startsWith('#')) {
                        window._secureStorage.set(`app_${index}`, app.url);
                        app.url = '#'; // Remove from visible object
                    }
                });
                
                console.log('✅ App URLs encrypted:', window.apps.length);
            }
        }, 100);
    }
    
    // ====== ENCRYPT FILE URLs ======
    function encryptFileUrls() {
        const checkFiles = setInterval(function() {
            if (window.files && Array.isArray(window.files)) {
                clearInterval(checkFiles);
                
                window.files.forEach((file, index) => {
                    if (file.url && file.url !== '#') {
                        window._secureStorage.set(`file_${index}`, file.url);
                        file.url = '#'; // Remove from visible object
                    }
                });
                
                console.log('✅ File URLs encrypted:', window.files.length);
            }
        }, 100);
    }
    
    // ====== GET ORIGINAL URL ======
    window.getOriginalUrl = function(type, index) {
        if (type === 'app') {
            return window._secureStorage.get(`app_${index}`);
        } else if (type === 'file') {
            return window._secureStorage.get(`file_${index}`);
        }
        return null;
    };
    
    // ====== ENCRYPT LOCALSTORAGE ======
    function encryptLocalStorage() {
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        
        localStorage.setItem = function(key, value) {
            if (key.includes('frp') || key.includes('app') || key.includes('file')) {
                const encrypted = advancedEncrypt(value);
                originalSetItem.call(this, key, encrypted);
            } else {
                originalSetItem.call(this, key, value);
            }
        };
        
        localStorage.getItem = function(key) {
            const value = originalGetItem.call(this, key);
            if (value && (key.includes('frp') || key.includes('app') || key.includes('file'))) {
                try {
                    return advancedDecrypt(value);
                } catch(e) {
                    return value;
                }
            }
            return value;
        };
    }
    
    // ====== ENCRYPT SESSIONSTORAGE ======
    function encryptSessionStorage() {
        const originalSetItem = sessionStorage.setItem;
        const originalGetItem = sessionStorage.getItem;
        
        sessionStorage.setItem = function(key, value) {
            if (key.includes('session') || key.includes('auth')) {
                const encrypted = advancedEncrypt(value);
                originalSetItem.call(this, key, encrypted);
            } else {
                originalSetItem.call(this, key, value);
            }
        };
        
        sessionStorage.getItem = function(key) {
            const value = originalGetItem.call(this, key);
            if (value && (key.includes('session') || key.includes('auth'))) {
                try {
                    return advancedDecrypt(value);
                } catch(e) {
                    return value;
                }
            }
            return value;
        };
    }
    
    // ====== CLEAR SENSITIVE DATA ON TAB CLOSE ======
    window.addEventListener('beforeunload', function() {
        window._secureStorage.clear();
    });
    
    // ====== INITIALIZE ======
    function initEncryption() {
        encryptAppUrls();
        encryptFileUrls();
        encryptLocalStorage();
        encryptSessionStorage();
        
        console.log('✅ Content Encryption Active');
    }
    
    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEncryption);
    } else {
        initEncryption();
    }
    
    // Export functions
    window.encrypt = advancedEncrypt;
    window.decrypt = advancedDecrypt;
})();