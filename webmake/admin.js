const ADMIN_PASSWORD = 'Ashish@2006';

function adminLogin() {
    const password = document.getElementById('adminPass').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminData();
    } else {
        alert('❌ Wrong Password!');
        document.getElementById('adminPass').value = '';
    }
}

function loadAdminData() {
    const users = JSON.parse(localStorage.getItem('websiteMakerUsers')) || [];
    const orders = users.filter(u => u.status !== 'registered');
    
    // Update stats
    document.getElementById('totalOrders').textContent = users.length;
    document.getElementById('paidOrders').textContent = users.filter(u => u.status === 'paid').length;
    document.getElementById('completedOrders').textContent = users.filter(u => u.status === 'completed').length;
    
    // Load orders
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = orders.map(user => createOrderCard(user)).join('');
}

function createOrderCard(user) {
    const statusClass = `status-${user.status}`;
    const statusText = {
        'registered': 'Details Pending',
        'details_submitted': 'Payment Pending', 
        'paid': 'Processing',
        'completed': '✅ Completed'
    }[user.status] || 'Unknown';

    const btnText = user.status === 'completed' ? '✅ Done' : 'Mark Complete';
    const btnDisabled = user.status === 'completed' ? 'disabled' : '';

    return `
        <div class="order-card">
            <div class="order-header">
                <h3>${user.name}</h3>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="order-details">
                <div><strong>Email:</strong> ${user.email}</div>
                <div><strong>Phone:</strong> ${user.phone}</div>
                <div><strong>Order ID:</strong> ${user.orderId || 'N/A'}</div>
                ${user.txnId ? `<div><strong>Txn ID:</strong> ${user.txnId}</div>` : ''}
                ${user.details ? `
                    <div><strong>Website:</strong> ${user.details.websiteName}</div>
                    <div><strong>Business:</strong> ${user.details.businessName}</div>
                ` : ''}
            </div>
            <button class="complete-btn" onclick="markComplete(${user.id})" ${btnDisabled}>
                ${btnText}
            </button>
        </div>
    `;
}

function markComplete(userId) {
    const users = JSON.parse(localStorage.getItem('websiteMakerUsers')) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1 && users[userIndex].status !== 'completed') {
        users[userIndex].status = 'completed';
        users[userIndex].completedAt = new Date().toISOString();
        localStorage.setItem('websiteMakerUsers', JSON.stringify(users));
        loadAdminData();
        alert('✅ Order marked as completed!');
    }
}

function exportData() {
    const users = JSON.parse(localStorage.getItem('websiteMakerUsers')) || [];
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `website-maker-orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}