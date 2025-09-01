// CureXpert Authentication Guard
// This script protects all pages and redirects unauthenticated users

class AuthGuard {
    constructor() {
        this.authRequired = true;
        this.init();
    }

    init() {
        // Check if user is authenticated
        this.checkAuthentication();

        // Set up logout functionality
        this.setupLogout();

        // Update UI based on authentication status
        this.updateUI();
    }

    checkAuthentication() {
        // IMMEDIATE redirect if not authenticated - no website access
        const userSession = localStorage.getItem('curexpert_user');

        if (!userSession) {
            this.redirectToAuth();
            return;
        }

        try {
            const userData = JSON.parse(userSession);
            const now = Date.now();

            // Check if session has expired (24 hours)
            if (userData.expires && now > userData.expires) {
                localStorage.removeItem('curexpert_user');
                this.redirectToAuth();
                return;
            }

            // Store user data globally
            window.currentUser = userData;
            window.isAuthenticated = true;

            // Update UI immediately after authentication check
            this.updateUI();

        } catch (error) {
            console.error('Error parsing user session:', error);
            localStorage.removeItem('curexpert_user');
            this.redirectToAuth();
        }
    }

    redirectToAuth() {
        // Don't redirect if already on auth page
        if (window.location.pathname.includes('auth.html')) {
            return;
        }

        // Store the intended destination
        localStorage.setItem('curexpert_redirect', window.location.href);

        // Redirect to authentication page
        window.location.href = 'auth.html';
    }

    setupLogout() {
        // Find logout buttons/links
        const logoutElements = document.querySelectorAll('[data-action="logout"], .logout-btn, .logout-link');

        logoutElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });

        // Add logout functionality to any element with class 'logout'
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout')) {
                e.preventDefault();
                this.logout();
            }
        });
    }

    logout() {
        // Clear user session
        localStorage.removeItem('curexpert_user');
        localStorage.removeItem('curexpert_redirect');

        // Clear global variables
        window.currentUser = null;
        window.isAuthenticated = false;

        // Redirect to auth page
        window.location.href = 'auth.html';
    }

    updateUI() {
        if (!window.isAuthenticated) return;

        // Update user-specific elements
        const userElements = document.querySelectorAll('[data-user-info]');
        userElements.forEach(element => {
            const infoType = element.dataset.userInfo;
            const user = window.currentUser;

            switch (infoType) {
                case 'name':
                    element.textContent = user.name;
                    break;
                case 'email':
                    element.textContent = user.email;
                    break;
                case 'role':
                    element.textContent = user.role;
                    break;
                case 'firstname':
                    element.textContent = user.firstname || user.name.split(' ')[0];
                    break;
                case 'lastname':
                    element.textContent = user.lastname || user.name.split(' ').slice(1).join(' ');
                    break;
            }
        });

        // Show/hide authenticated-only elements
        const authOnlyElements = document.querySelectorAll('[data-auth-only]');
        authOnlyElements.forEach(element => {
            element.style.display = 'block';
        });

        const guestOnlyElements = document.querySelectorAll('[data-guest-only]');
        guestOnlyElements.forEach(element => {
            element.style.display = 'none';
        });

        // Update navigation based on user role
        this.updateNavigation();

        // Trigger dashboard update if on dashboard page
        if (window.location.pathname.includes('dashboard.html') && window.dashboard) {
            window.dashboard.setupDashboard();
        }
    }

    updateNavigation() {
        const user = window.currentUser;
        if (!user) return;

        // Show role-specific navigation items
        const roleElements = document.querySelectorAll(`[data-role="${user.role}"]`);
        roleElements.forEach(element => {
            element.style.display = 'block';
        });

        // Hide elements for other roles
        const allRoleElements = document.querySelectorAll('[data-role]');
        allRoleElements.forEach(element => {
            if (element.dataset.role !== user.role) {
                element.style.display = 'none';
            }
        });
    }

    // Public methods
    getUser() {
        return window.currentUser;
    }

    isAuthenticated() {
        return window.isAuthenticated;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            this.redirectToAuth();
            return false;
        }
        return true;
    }

    requireRole(role) {
        if (!this.requireAuth()) return false;

        const user = this.getUser();
        if (user.role !== role) {
            // Redirect to appropriate page or show error
            this.showAccessDenied();
            return false;
        }
        return true;
    }

    showAccessDenied() {
        // Create and show access denied message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'access-denied-message';
        messageDiv.innerHTML = `
            <div class="access-denied-content">
                <h3>Access Denied</h3>
                <p>You don't have permission to access this page.</p>
                <button onclick="window.history.back()">Go Back</button>
            </div>
        `;

        messageDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        document.body.appendChild(messageDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}

// Initialize authentication guard
document.addEventListener('DOMContentLoaded', () => {
    window.authGuard = new AuthGuard();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthGuard;
}
