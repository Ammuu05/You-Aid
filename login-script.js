// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('youaid-current-user');
    if (currentUser) {
        // User is already logged in, redirect to main site
        window.location.href = 'index.html';
    }
});

// Form switching functions
function showSignupForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Message display functions
function showMessage(message, type = 'error') {
    const messageElement = document.getElementById(type + '-message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Login form handler
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    // Add loading state
    submitButton.textContent = 'Signing In...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Get stored users
        const users = JSON.parse(localStorage.getItem('youaid-users') || '[]');
        
        // Check demo credentials
        if (email === 'demo@youaid.org' && password === 'demo123') {
            const demoUser = {
                id: 'demo-user',
                name: 'Demo User',
                email: 'demo@youaid.org'
            };
            
            // Store current user
            localStorage.setItem('youaid-current-user', JSON.stringify(demoUser));
            
            showMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
            return;
        }
        
        // Check registered users
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store current user (without password)
            const currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            
            localStorage.setItem('youaid-current-user', JSON.stringify(currentUser));
            
            showMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showMessage('Invalid email or password. Please try again.');
            submitButton.textContent = 'Sign In';
            submitButton.disabled = false;
        }
    }, 1500);
});

// Signup form handler
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match. Please try again.');
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long.');
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        return;
    }
    
    // Add loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('youaid-users') || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            showMessage('An account with this email already exists. Please use a different email or sign in.');
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            return;
        }
        
        // Create new user
        const newUser = {
            id: 'user-' + Date.now(),
            name: name,
            email: email,
            password: password, // In production, this would be hashed
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('youaid-users', JSON.stringify(users));
        
        showMessage('Account created successfully! You can now sign in.', 'success');
        
        // Reset form and switch to login
        event.target.reset();
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        setTimeout(() => {
            showLoginForm();
            // Pre-fill email in login form
            document.getElementById('login-email').value = email;
        }, 2000);
    }, 1500);
});

// Auto-fill demo credentials when clicking on demo info
document.querySelector('.demo-credentials').addEventListener('click', function() {
    document.getElementById('login-email').value = 'demo@youaid.org';
    document.getElementById('login-password').value = 'demo123';
});

// Form validation enhancements
document.getElementById('signup-password').addEventListener('input', function() {
    const password = this.value;
    const confirmField = document.getElementById('signup-confirm');
    
    if (password.length < 6) {
        this.setCustomValidity('Password must be at least 6 characters long');
    } else {
        this.setCustomValidity('');
    }
    
    // Check confirm password if it has a value
    if (confirmField.value && confirmField.value !== password) {
        confirmField.setCustomValidity('Passwords do not match');
    } else if (confirmField.value === password) {
        confirmField.setCustomValidity('');
    }
});

document.getElementById('signup-confirm').addEventListener('input', function() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = this.value;
    
    if (confirmPassword !== password) {
        this.setCustomValidity('Passwords do not match');
    } else {
        this.setCustomValidity('');
    }
});

// Enter key handling for better UX
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const activeForm = document.querySelector('.auth-form:not([style*="display: none"])');
        if (activeForm) {
            const submitButton = activeForm.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
    }
});