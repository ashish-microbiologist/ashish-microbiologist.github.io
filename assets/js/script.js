// assets/js/script.js

// डॉक्यूमेंट लोड होने पर
document.addEventListener('DOMContentLoaded', function() {
    
    // मोबाइल मेन्यू टॉगल
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if(menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if(icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // स्मूथ स्क्रॉलिंग
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // मोबाइल मेन्यू बंद करें
                if(navLinks) {
                    navLinks.classList.remove('active');
                    if(menuBtn) {
                        menuBtn.querySelector('i').classList.remove('fa-times');
                        menuBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // डाउनलोड बटन क्लिक ट्रैकिंग
    document.querySelectorAll('.btn-download').forEach(button => {
        button.addEventListener('click', function() {
            const appCard = this.closest('.app-card, .app-item');
            if(appCard) {
                const appName = appCard.querySelector('h3').textContent;
                console.log('डाउनलोड शुरू:', appName);
                
                // डाउनलोड काउंट बढ़ाएं (लोकल स्टोरेज में)
                const appId = this.getAttribute('href').split('id=')[1];
                if(appId) {
                    let downloads = localStorage.getItem(`downloads_${appId}`) || 0;
                    downloads = parseInt(downloads) + 1;
                    localStorage.setItem(`downloads_${appId}`, downloads);
                }
            }
        });
    });
    
    // सर्च फॉर्म वैलिडेशन
    const searchForm = document.querySelector('form[action="search.html"]');
    if(searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('input[name="q"]');
            if(searchInput && searchInput.value.trim().length < 2) {
                e.preventDefault();
                alert('कृपया सर्च करने के लिए कम से कम 2 अक्षर दर्ज करें।');
                searchInput.focus();
            }
        });
    }
    
    // एडमिन लॉगिन फॉर्म वैलिडेशन
    const loginForm = document.querySelector('form[action*="login"]');
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = this.querySelector('input[name="username"]');
            const password = this.querySelector('input[name="password"]');
            
            if(username && username.value.trim() === '') {
                e.preventDefault();
                alert('कृपया यूजरनेम दर्ज करें');
                username.focus();
                return false;
            }
            
            if(password && password.value.trim() === '') {
                e.preventDefault();
                alert('कृपया पासवर्ड दर्ज करें');
                password.focus();
                return false;
            }
        });
    }
});

// एप्लिकेशन डेटा
const appsData = [
    {
        id: 1,
        name: "WhatsApp MOD",
        description: "WhatsApp का MOD वर्जन जिसमें सभी प्रीमियम फीचर्स अनलॉक हैं",
        version: "2.23.10.78",
        size: "85 MB",
        logo: "assets/img/whatsapp-logo.png",
        downloads: 1250,
        features: ["Blue Tick Hide", "Status Download", "Anti-Delete Messages"]
    },
    {
        id: 2,
        name: "YouTube Premium",
        description: "YouTube का MOD वर्जन जिसमें विज्ञापन हटाए गए हैं और बैकग्राउंड प्लेबैक है",
        version: "18.45.43",
        size: "120 MB",
        logo: "assets/img/youtube-logo.png",
        downloads: 2100,
        features: ["No Ads", "Background Play", "Download Videos"]
    },
    {
        id: 3,
        name: "Instagram MOD",
        description: "Instagram का MOD वर्जन जिसमें सभी फीचर्स अनलॉक हैं",
        version: "302.0.0.30.107",
        size: "95 MB",
        logo: "assets/img/instagram-logo.png",
        downloads: 1800,
        features: ["Download Photos/Videos", "Zoom Profile Pictures", "No Ads"]
    },
    {
        id: 4,
        name: "Spotify Premium",
        description: "Spotify का MOD वर्जन जिसमें सभी गाने फ्री में सुन सकते हैं",
        version: "8.9.0.500",
        size: "110 MB",
        logo: "assets/img/spotify-logo.png",
        downloads: 1600,
        features: ["Unlimited Skips", "No Ads", "Extreme Quality"]
    },
    {
        id: 5,
        name: "GB WhatsApp",
        description: "WhatsApp का बेहतरीन MOD वर्जन जिसमें 100+ फीचर्स हैं",
        version: "17.50",
        size: "90 MB",
        logo: "assets/img/gbwhatsapp-logo.png",
        downloads: 3200,
        features: ["Dual WhatsApp", "Custom Themes", "Hide Online Status"]
    },
    {
        id: 6,
        name: "Snapchat MOD",
        description: "Snapchat का MOD वर्जन जिसमें सभी फिल्टर्स फ्री हैं",
        version: "12.50.0.40",
        size: "105 MB",
        logo: "assets/img/snapchat-logo.png",
        downloads: 950,
        features: ["Unlock Filters", "Save Snaps", "Stealth Mode"]
    },
    {
        id: 7,
        name: "TikTok MOD",
        description: "TikTok का MOD वर्जन जिसमें विज्ञापन हटाए गए हैं और वाटरमार्क नहीं है",
        version: "30.5.4",
        size: "115 MB",
        logo: "assets/img/tiktok-logo.png",
        downloads: 1400,
        features: ["No Watermark", "No Ads", "Region Unlock"]
    },
    {
        id: 8,
        name: "Facebook MOD",
        description: "Facebook का MOD वर्जन जिसमें सभी प्रीमियम फीचर्स अनलॉक हैं",
        version: "404.0.0.40.115",
        size: "130 MB",
        logo: "assets/img/facebook-logo.png",
        downloads: 1100,
        features: ["Download Videos", "No Ads", "Stealth Mode"]
    }
];

// सर्च फंक्शन
function searchApps(query) {
    const results = appsData.filter(app => {
        const searchInName = app.name.toLowerCase().includes(query.toLowerCase());
        const searchInDesc = app.description.toLowerCase().includes(query.toLowerCase());
        return searchInName || searchInDesc;
    });
    
    return results;
}

// ऐप ID के अनुसार ऐप ढूंढें
function getAppById(id) {
    return appsData.find(app => app.id == id);
}

// पेज URL से पैरामीटर पढ़ें
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const paramsObj = {};
    
    for (const [key, value] of params) {
        paramsObj[key] = value;
    }
    
    return paramsObj;
}