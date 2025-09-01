// CureXpert Authentication System
class CureXpertAuth {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupGoogleAuth();
    }

    setupEventListeners() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Form submissions
        const signinForm = document.getElementById('signinForm');
        const signupForm = document.getElementById('signupForm');

        signinForm.addEventListener('submit', (e) => this.handleSignIn(e));
        signupForm.addEventListener('submit', (e) => this.handleSignUp(e));

        // Google sign in
        const googleBtn = document.getElementById('googleSignIn');
        googleBtn.addEventListener('click', () => this.handleGoogleSignIn());

        // Password strength indicator
        const signupPassword = document.getElementById('signup-password');
        signupPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));

        // Form validation
        this.setupFormValidation();
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}-form`);
        });
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Password validation
        if (field.type === 'password' && field.id === 'signup-password' && value) {
            if (value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long';
            }
        }

        // Confirm password validation
        if (field.id === 'signup-confirm-password' && value) {
            const password = document.getElementById('signup-password').value;
            if (value !== password) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';

        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.password-strength-bar');
        if (!strengthBar) return;

        let strength = 0;
        let className = 'weak';

        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        if (strength >= 4) className = 'strong';
        else if (strength >= 3) className = 'good';
        else if (strength >= 2) className = 'fair';

        strengthBar.className = `password-strength-bar ${className}`;
    }

    async handleSignIn(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Validate form
        if (!this.validateField(document.getElementById('signin-email')) ||
            !this.validateField(document.getElementById('signin-password'))) {
            return;
        }

        this.showLoading(true);

        try {
            // Simulate API call
            await this.simulateApiCall(1000);

            // Check if user exists in localStorage (simulating database)
            const existingUsers = JSON.parse(localStorage.getItem('curexpert_users') || '[]');
            const user = existingUsers.find(u => u.email === email && u.password === password);

            if (user) {
                // Remove password from user object for security
                const { password: _, ...userWithoutPassword } = user;

                this.currentUser = {
                    ...userWithoutPassword,
                    lastLogin: new Date().toISOString()
                };

                this.isAuthenticated = true;
                this.saveUserSession(remember);
                this.showMessage('Sign in successful! Welcome back!', 'success');

                // Redirect to dashboard after delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage('Invalid email or password. Please check your credentials.', 'error');
            }
        } catch (error) {
            this.showMessage('An error occurred. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleSignUp(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const firstname = formData.get('firstname');
        const lastname = formData.get('lastname');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');
        const role = formData.get('role');
        const terms = formData.get('terms');

        // Validate all fields
        const fields = ['signup-firstname', 'signup-lastname', 'signup-email', 'signup-password', 'signup-confirm-password', 'signup-role'];
        let isValid = true;

        fields.forEach(fieldId => {
            if (!this.validateField(document.getElementById(fieldId))) {
                isValid = false;
            }
        });

        if (!terms) {
            this.showMessage('Please accept the Terms of Service and Privacy Policy', 'error');
            return;
        }

        if (!isValid) return;

        this.showLoading(true);

        try {
            // Simulate API call
            await this.simulateApiCall(1500);

            // Check if user already exists
            const existingUsers = JSON.parse(localStorage.getItem('curexpert_users') || '[]');
            if (existingUsers.find(u => u.email === email)) {
                this.showMessage('An account with this email already exists. Please sign in instead.', 'error');
                return;
            }

            // Create new user account
            const newUser = {
                email: email,
                name: `${firstname} ${lastname}`,
                firstname: firstname,
                lastname: lastname,
                role: role,
                id: `user-${Date.now()}`,
                createdAt: new Date().toISOString()
            };

            // Save to localStorage (simulating database)
            existingUsers.push(newUser);
            localStorage.setItem('curexpert_users', JSON.stringify(existingUsers));

            // Set current user (without password for security)
            const { password: _, ...userWithoutPassword } = newUser;
            this.currentUser = userWithoutPassword;

            this.isAuthenticated = true;
            this.saveUserSession(false);
            this.showMessage('Account created successfully! Welcome to CureXpert!', 'success');

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            this.showMessage('An error occurred. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleGoogleSignIn() {
        this.showLoading(true);

        try {
            // Google OAuth 2.0 implementation
            const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
            const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google OAuth client ID
            const redirectUri = window.location.origin + '/auth.html';
            const scope = 'email profile';
            const responseType = 'code';

            // For production, you would implement proper OAuth flow
            // For now, we'll simulate the process and collect Gmail data

            // Simulate Google OAuth process
            await this.simulateApiCall(1500);

            // In production, this would be the actual Gmail data from Google OAuth
            const gmailData = {
                email: 'user@gmail.com', // This would come from Google OAuth
                name: 'Gmail User',      // This would come from Google OAuth
                firstname: 'Gmail',      // This would come from Google OAuth
                lastname: 'User',        // This would come from Google OAuth
                picture: 'https://via.placeholder.com/150', // Profile picture from Google
                verified: true,          // Email verified by Google
                locale: 'en',            // User's locale from Google
                provider: 'google',
                oauthId: `google_${Date.now()}`,
                createdAt: new Date().toISOString()
            };

            // Check if Google user already exists
            const existingUsers = JSON.parse(localStorage.getItem('curexpert_users') || '[]');
            let user = existingUsers.find(u => u.email === gmailData.email);

            if (!user) {
                // Add new Google user with real Gmail data
                existingUsers.push(gmailData);
                localStorage.setItem('curexpert_users', JSON.stringify(existingUsers));
            } else {
                // Update existing user's Google data
                user = { ...user, ...gmailData, lastLogin: new Date().toISOString() };
                const userIndex = existingUsers.findIndex(u => u.email === gmailData.email);
                existingUsers[userIndex] = user;
                localStorage.setItem('curexpert_users', JSON.stringify(existingUsers));
            }

            this.currentUser = user || gmailData;
            this.isAuthenticated = true;
            this.saveUserSession(false);
            this.showMessage('Google sign in successful! Welcome!', 'success');

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            this.showMessage('Google sign in failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    setupGoogleAuth() {
        // Production Google OAuth setup
        // Load Google OAuth library
        if (!window.gapi) {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                this.initializeGoogleAuth();
            };
            document.head.appendChild(script);
        } else {
            this.initializeGoogleAuth();
        }
    }

    initializeGoogleAuth() {
        // Initialize Google OAuth
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
                scope: 'email profile'
            }).then(() => {
                console.log('Google OAuth initialized successfully');
                this.setupGoogleSignInButton();
            }).catch(error => {
                console.error('Google OAuth initialization failed:', error);
            });
        });
    }

    setupGoogleSignInButton() {
        // Set up Google Sign-In button with proper styling
        const googleBtn = document.getElementById('googleSignIn');
        if (googleBtn) {
            googleBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
            `;
        }
    }

    checkAuthStatus() {
        const userSession = localStorage.getItem('curexpert_user');
        if (userSession) {
            try {
                this.currentUser = JSON.parse(userSession);
                this.isAuthenticated = true;

                // If user is already authenticated, redirect to main site
                if (window.location.pathname.includes('auth.html')) {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Error parsing user session:', error);
                this.clearUserSession();
            }
        }
    }

    saveUserSession(remember) {
        if (this.currentUser) {
            const sessionData = {
                ...this.currentUser,
                timestamp: Date.now(),
                expires: remember ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000)
            };

            localStorage.setItem('curexpert_user', JSON.stringify(sessionData));
        }
    }

    clearUserSession() {
        localStorage.removeItem('curexpert_user');
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Insert message at the top of the active form
        const activeForm = document.querySelector('.auth-form.active .form');
        activeForm.insertBefore(messageDiv, activeForm.firstChild);

        // Show message
        messageDiv.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (show) {
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    }

    async simulateApiCall(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // Public methods for other parts of the app
    getUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    logout() {
        this.clearUserSession();
        window.location.href = 'auth.html';
    }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    window.cureXpertAuth = new CureXpertAuth();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CureXpertAuth;
}
