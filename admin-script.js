// Admin Panel JavaScript

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Check if admin is logged in
document.addEventListener('DOMContentLoaded', function() {
    const adminLoggedIn = sessionStorage.getItem('youaid-admin-logged-in');
    if (adminLoggedIn === 'true') {
        showAdminPanel();
    } else {
        showAdminLogin();
    }
});

// Admin login function
function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('youaid-admin-logged-in', 'true');
        showAdminPanel();
        loadDashboardData();
    } else {
        alert('Invalid admin credentials. Please try again.');
    }
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadDashboardData();
}

// Show admin login
function showAdminLogin() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout from admin panel?')) {
        sessionStorage.removeItem('youaid-admin-logged-in');
        showAdminLogin();
        // Clear form
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
    }
}

// Load dashboard data
function loadDashboardData() {
    loadStatistics();
    loadUsersTable();
    loadReportsTable();
    loadActivityTable();
    loadRawData();
}

// Load statistics
function loadStatistics() {
    const users = JSON.parse(localStorage.getItem('youaid-users') || '[]');
    const reports = JSON.parse(localStorage.getItem('youaid-reports') || '[]');
    const activity = JSON.parse(localStorage.getItem('youaid-login-activity') || '[]');
    const currentUser = localStorage.getItem('youaid-current-user');
    
    // Count demo logins
    const demoLogins = activity.filter(log => log.email === 'demo@youaid.org').length;
    
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-reports').textContent = reports.length;
    document.getElementById('active-sessions').textContent = currentUser ? 1 : 0;
    document.getElementById('demo-logins').textContent = demoLogins;
}

// Load users table
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('youaid-users') || '[]');
    const container = document.getElementById('users-table-container');
    
    if (users.length === 0) {
        container.innerHTML = '<div class="empty-state">No users registered yet.</div>';
        return;
    }
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        const registrationDate = new Date(user.createdAt).toLocaleDateString();
        const currentUser = JSON.parse(localStorage.getItem('youaid-current-user') || '{}');
        const isActive = currentUser.email === user.email;
        
        tableHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${registrationDate}</td>
                <td>
                    <span class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">
                        ${isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="action-btn btn-view" onclick="viewUser('${user.id}')">View</button>
                    <button class="action-btn btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

// Load reports table
function loadReportsTable() {
    const reports = JSON.parse(localStorage.getItem('youaid-reports') || '[]');
    const container = document.getElementById('reports-table-container');
    
    if (reports.length === 0) {
        container.innerHTML = '<div class="empty-state">No reports submitted yet.</div>';
        return;
    }
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Reference ID</th>
                    <th>Submitted By</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    reports.forEach(report => {
        const submissionDate = new Date(report.timestamp).toLocaleDateString();
        
        tableHTML += `
            <tr>
                <td>${report.id}</td>
                <td>${report.submittedBy || 'Unknown'}</td>
                <td>${report.submitterEmail || 'Unknown'}</td>
                <td>${submissionDate}</td>
                <td>
                    <span class="status-badge status-active">
                        ${report.status || 'Submitted'}
                    </span>
                </td>
                <td>
                    <button class="action-btn btn-view" onclick="viewReport('${report.id}')">View</button>
                    <button class="action-btn btn-delete" onclick="deleteReport('${report.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

// Load activity table
function loadActivityTable() {
    const activity = JSON.parse(localStorage.getItem('youaid-login-activity') || '[]');
    const container = document.getElementById('activity-table-container');
    
    if (activity.length === 0) {
        container.innerHTML = '<div class="empty-state">No login activity recorded yet.</div>';
        return;
    }
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Login Time</th>
                    <th>User Agent</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Sort by most recent first
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    activity.forEach(log => {
        const loginTime = new Date(log.timestamp).toLocaleString();
        
        tableHTML += `
            <tr>
                <td>${log.email}</td>
                <td>${loginTime}</td>
                <td>${log.userAgent || 'Unknown'}</td>
                <td>
                    <span class="status-badge ${log.success ? 'status-active' : 'status-inactive'}">
                        ${log.success ? 'Success' : 'Failed'}
                    </span>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

// Load raw data
function loadRawData() {
    const users = localStorage.getItem('youaid-users') || '[]';
    const reports = localStorage.getItem('youaid-reports') || '[]';
    const activity = localStorage.getItem('youaid-login-activity') || '[]';
    const currentUser = localStorage.getItem('youaid-current-user') || 'null';
    
    const rawData = {
        users: JSON.parse(users),
        reports: JSON.parse(reports),
        loginActivity: JSON.parse(activity),
        currentUser: JSON.parse(currentUser),
        timestamp: new Date().toISOString()
    };
    
    document.getElementById('raw-data').value = JSON.stringify(rawData, null, 2);
}

// Search users
function searchUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('youaid-users') || '[]');
    
    if (!searchTerm) {
        loadUsersTable();
        return;
    }
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredUsers(filteredUsers);
}

// Display filtered users
function displayFilteredUsers(users) {
    const container = document.getElementById('users-table-container');
    
    if (users.length === 0) {
        container.innerHTML = '<div class="empty-state">No users found matching your search.</div>';
        return;
    }
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        const registrationDate = new Date(user.createdAt).toLocaleDateString();
        const currentUser = JSON.parse(localStorage.getItem('youaid-current-user') || '{}');
        const isActive = currentUser.email === user.email;
        
        tableHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${registrationDate}</td>
                <td>
                    <span class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">
                        ${isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="action-btn btn-view" onclick="viewUser('${user.id}')">View</button>
                    <button class="action-btn btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

// View user details
function viewUser(userId) {
    const users = JSON.parse(localStorage.getItem('youaid-users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    const activity = JSON.parse(localStorage.getItem('youaid-login-activity') || '[]');
    const userActivity = activity.filter(log => log.email === user.email);
    const reports = JSON.parse(localStorage.getItem('youaid-reports') || '[]');
    const userReports = reports.filter(report => report.submitterEmail === user.email);
    
    const detailsHTML = `
        <div class="user-details">
            <h3>👤 User Information</h3>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Password:</strong> ${user.password}</p>
            <p><strong>Registration Date:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
        </div>
        
        <div class="user-details">
            <h3>📊 Activity Summary</h3>
            <p><strong>Total Logins:</strong> ${userActivity.length}</p>
            <p><strong>Successful Logins:</strong> ${userActivity.filter(log => log.success).length}</p>
            <p><strong>Failed Logins:</strong> ${userActivity.filter(log => !log.success).length}</p>
            <p><strong>Reports Submitted:</strong> ${userReports.length}</p>
            <p><strong>Last Login:</strong> ${userActivity.length > 0 ? new Date(userActivity[userActivity.length - 1].timestamp).toLocaleString() : 'Never'}</p>
        </div>
        
        <div class="user-details">
            <h3>🔐 Recent Login Activity</h3>
            ${userActivity.length > 0 ? 
                userActivity.slice(-5).map(log => `
                    <p>• ${new Date(log.timestamp).toLocaleString()} - ${log.success ? '✅ Success' : '❌ Failed'}</p>
                `).join('') : 
                '<p>No login activity recorded</p>'
            }
        </div>
        
        <div class="user-details">
            <h3>📋 Recent Reports</h3>
            ${userReports.length > 0 ? 
                userReports.slice(-3).map(report => `
                    <p>• ${report.id} - ${new Date(report.timestamp).toLocaleString()}</p>
                `).join('') : 
                '<p>No reports submitted</p>'
            }
        </div>
    `;
    
    document.getElementById('user-details-content').innerHTML = detailsHTML;
    document.getElementById('user-modal').style.display = 'block';
}

// Close user modal
function closeUserModal() {
    document.getElementById('user-modal').style.display = 'none';
}

// Delete user
function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('youaid-users') || '[]');
    const updatedUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('youaid-users', JSON.stringify(updatedUsers));
    
    // Also remove from current user if it's the deleted user
    const currentUser = JSON.parse(localStorage.getItem('youaid-current-user') || '{}');
    if (currentUser.id === userId) {
        localStorage.removeItem('youaid-current-user');
    }
    
    loadDashboardData();
    alert('User deleted successfully');
}

// View report
function viewReport(reportId) {
    const reports = JSON.parse(localStorage.getItem('youaid-reports') || '[]');
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
        alert('Report not found');
        return;
    }
    
    alert(`Report Details:\n\nID: ${report.id}\nSubmitted By: ${report.submittedBy || 'Unknown'}\nEmail: ${report.submitterEmail || 'Unknown'}\nDate: ${new Date(report.timestamp).toLocaleString()}\nStatus: ${report.status || 'Submitted'}`);
}

// Delete report
function deleteReport(reportId) {
    if (!confirm('Are you sure you want to delete this report?')) {
        return;
    }
    
    const reports = JSON.parse(localStorage.getItem('youaid-reports') || '[]');
    const updatedReports = reports.filter(report => report.id !== reportId);
    localStorage.setItem('youaid-reports', JSON.stringify(updatedReports));
    
    loadDashboardData();
    alert('Report deleted successfully');
}

// Export data
function exportData() {
    const rawData = document.getElementById('raw-data').value;
    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youaid-database-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Clear all data
function clearAllData() {
    if (!confirm('⚠️ WARNING: This will delete ALL user data, reports, and login activity. This action cannot be undone!\n\nAre you absolutely sure?')) {
        return;
    }
    
    if (!confirm('This is your final warning. All data will be permanently deleted. Continue?')) {
        return;
    }
    
    localStorage.removeItem('youaid-users');
    localStorage.removeItem('youaid-reports');
    localStorage.removeItem('youaid-login-activity');
    localStorage.removeItem('youaid-current-user');
    
    loadDashboardData();
    alert('All data has been cleared successfully');
}

// Refresh data
function refreshData() {
    loadDashboardData();
    alert('Data refreshed successfully');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('user-modal');
    if (event.target === modal) {
        closeUserModal();
    }
});

// Auto-refresh data every 30 seconds when panel is active
setInterval(() => {
    const adminLoggedIn = sessionStorage.getItem('youaid-admin-logged-in');
    if (adminLoggedIn === 'true' && document.getElementById('admin-panel').style.display !== 'none') {
        loadStatistics();
    }
}, 30000);