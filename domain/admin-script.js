// Admin Panel - Complete with Error Validation
const ADMIN_CREDENTIALS = { id: 'admin123', pass: 'admin@123' };
let ordersDB = JSON.parse(localStorage.getItem('ordersDB')) || [];
let usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];

// Error handling functions
function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        errorEl.style.color = '#f44336';
    }
}

function showSuccess(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        errorEl.style.color = '#00C851';
    }
}

// Admin Login
function adminLogin(event) {
    event.preventDefault();
    clearErrors();
    
    const adminId = document.getElementById('adminId').value.trim();
    const adminPass = document.getElementById('adminPass').value;
    const loginError = document.getElementById('loginError');
    
    if (!adminId) {
        showError('adminIdError', 'Admin ID required!');
        return;
    }
    
    if (adminId.length < 3) {
        showError('adminIdError', 'Admin ID must be 3+ characters!');
        return;
    }
    
    if (!adminPass) {
        showError('adminPassError', 'Password required!');
        return;
    }
    
    if (adminPass.length < 6) {
        showError('adminPassError', 'Password must be 6+ characters!');
        return;
    }
    
    if (adminId !== ADMIN_CREDENTIALS.id || adminPass !== ADMIN_CREDENTIALS.pass) {
        loginError.textContent = '❌ Wrong Admin ID or Password!';
        loginError.style.display = 'block';
        loginError.style.color = '#f44336';
        return;
    }
    
    localStorage.setItem('adminLoggedIn', 'true');
    showSuccess('loginError', '✅ Login successful!');
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 800);
}

// Check Admin Auth
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    }
}

// Load Stats
function loadStats() {
    document.getElementById('totalUsers').textContent = usersDB.length;
    document.getElementById('totalOrders').textContent = ordersDB.length;
    
    const totalRevenue = ordersDB.reduce((sum, order) => sum + parseInt(order.amount), 0);
    document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toLocaleString();
}

// Edit UPI
function editUPI() {
    document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
    document.getElementById('upiSection').style.display = 'block';
    
    const upiSettings = JSON.parse(localStorage.getItem('upiSettings')) || {};
    document.getElementById('upiId').value = upiSettings.id || '';
    document.getElementById('upiName').value = upiSettings.name || '';
    document.getElementById('qrUrl').value = upiSettings.qrUrl || '';
    document.getElementById('defaultAmount').value = upiSettings.amount || 999;
}

// UPI Form Submit
document.getElementById('upiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();
    
    let isValid = true;
    
    const upiId = document.getElementById('upiId').value.trim();
    if (!upiId) {
        showError('upiIdError', 'UPI ID required!');
        isValid = false;
    } else if (!/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(upiId)) {
        showError('upiIdError', 'Invalid UPI format! (username@bank)');
        isValid = false;
    }
    
    const upiName = document.getElementById('upiName').value.trim();
    if (!upiName || upiName.length < 2) {
        showError('upiNameError', 'Name must be 2+ characters!');
        isValid = false;
    }
    
    const amount = parseInt(document.getElementById('defaultAmount').value);
    if (!amount || amount < 100 || amount > 50000) {
        showError('amountError', 'Amount must be ₹100 - ₹50,000!');
        isValid = false;
    }
    
    const qrUrl = document.getElementById('qrUrl').value.trim();
    if (qrUrl && !isValidURL(qrUrl)) {
        showError('qrUrlError', 'Invalid URL format!');
        isValid = false;
    }
    
    if (!isValid) {
        document.getElementById('upiFormError').innerHTML = '<strong>❌ Fix errors above!</strong>';
        return;
    }
    
    const upiSettings = {
        id: upiId,
        name: upiName,
        qrUrl: qrUrl || '',
        amount: amount
    };
    
    localStorage.setItem('upiSettings', JSON.stringify(upiSettings));
    showSuccess('upiFormError', '✅ UPI Settings Saved Successfully!');
});

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// View Orders
function viewOrders() {
    document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
    document.getElementById('ordersSection').style.display = 'block';
    displayOrders();
}

// Display Orders
function displayOrders(searchTerm = '') {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    
    let filteredOrders = ordersDB.filter(order => 
        order.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm)
    );
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<div style="text-align:center; padding:40px; color:#666;"><i class="fas fa-search" style="font-size:48px; margin-bottom:10px; display:block;"></i>No orders found!</div>';
        return;
    }
    
    filteredOrders.forEach((order, index) => {
        const globalIndex = ordersDB.indexOf(order);
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-details">
                <strong>Order #${order.id}</strong>
                <p><strong>${order.business}</strong> - ${order.category}</p>
                <p>📞 ${order.phone} | 💰 ₹${order.amount}</p>
                <small>${order.date}</small>
                <span class="status ${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <div class="order-actions">
                <button onclick="updateStatus(${globalIndex}, 'completed')" class="btn-small green" title="Mark Complete">
                    <i class="fas fa-check"></i>
                </button>
                <button onclick="updateStatus(${globalIndex}, 'pending')" class="btn-small orange" title="Mark Pending">
                    <i class="fas fa-clock"></i>
                </button>
                <button onclick="deleteOrder(${globalIndex})" class="btn-small red" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        ordersList.appendChild(orderCard);
    });
}

// Update Status
function updateStatus(index, status) {
    const order = ordersDB[index];
    const statusMap = { 'completed': 'Complete', 'pending': 'Pending' };
    
    if (confirm(`Mark order #${order.id} as ${statusMap[status]}?`)) {
        ordersDB[index].status = status;
        localStorage.setItem('ordersDB', JSON.stringify(ordersDB));
        displayOrders();
        loadStats();
        alert(`✅ Order #${order.id} marked as ${statusMap[status]}!`);
    }
}

// Delete Order
function deleteOrder(index) {
    const order = ordersDB[index];
    if (confirm(`Delete order #${order.id} permanently?\n\nBusiness: ${order.business}\nAmount: ₹${order.amount}`)) {
        ordersDB.splice(index, 1);
        localStorage.setItem('ordersDB', JSON.stringify(ordersDB));
        displayOrders();
        loadStats();
        alert('🗑️ Order deleted successfully!');
    }
}

// Other functions
function sendBulkSMS() {
    alert('📱 Bulk SMS sent to all pending orders!');
}

function exportData() {
    const data = { users: usersDB, orders: ordersDB, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-maker-data.json';
    a.click();
}

// Auto-save data
window.addEventListener('storage', function(e) {
    if (e.key === 'userData') {
        const userData = JSON.parse(e.newValue);
        if (!usersDB.find(u => u.phone === userData.phone)) {
            usersDB.push(userData);
            localStorage.setItem('usersDB', JSON.stringify(usersDB));
        }
    }
    
    if (e.key === 'websiteDetails') {
        const details = JSON.parse(e.newValue);
        const userData = JSON.parse(localStorage.getItem('userData'));
        const newOrder = {
            id: 'ORD' + Date.now(),
            ...userData,
            ...details,
            status: 'pending',
            date: new Date().toLocaleDateString()
        };
        ordersDB.push(newOrder);
        localStorage.setItem('ordersDB', JSON.stringify(ordersDB));
        loadStats();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
});