// User Flow Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Load UPI settings for payment page
    if (document.getElementById('totalAmount')) {
        loadUpiSettings();
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.onsubmit = function(e) {
            e.preventDefault();
            const userData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                business: document.getElementById('business').value
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            location.href = 'dashboard.html';
        };
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const phone = document.getElementById('loginPhone').value;
            const savedUser = localStorage.getItem('userData');
            if (savedUser && JSON.parse(savedUser).phone === phone) {
                location.href = 'dashboard.html';
            } else {
                alert('Phone not found! Please signup first.');
            }
        };
    }
    
    // Details form
    const detailsForm = document.getElementById('detailsForm');
    if (detailsForm) {
        detailsForm.onsubmit = function(e) {
            e.preventDefault();
            const details = {
                category: document.getElementById('category').value,
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                contact: document.getElementById('contact').value,
                whatsapp: document.getElementById('whatsapp').value,
                address: document.getElementById('address').value
            };
            localStorage.setItem('websiteDetails', JSON.stringify(details));
            location.href = 'payment.html';
        };
    }
});

function loadUpiSettings() {
    const upiSettings = JSON.parse(localStorage.getItem('upiSettings')) || {
        id: 'website.maker@paytm',
        name: 'Website Maker',
        amount: 999
    };
    
    document.getElementById('totalAmount').textContent = '₹' + upiSettings.amount;
    document.getElementById('payAmount').textContent = upiSettings.amount;
    document.getElementById('upiId').textContent = upiSettings.id;
}

function completePayment() {
    alert('✅ Payment successful! Website ready in 24 hours.');
    localStorage.removeItem('userData');
    localStorage.removeItem('websiteDetails');
    location.href = 'index.html';
}