// CureXpert Dashboard - Dynamic Content Management
// This script handles role-based dashboard content and removes mock data

class CureXpertDashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Wait for auth guard to initialize
        if (window.authGuard && window.authGuard.isAuthenticated()) {
            this.currentUser = window.authGuard.getUser();
            this.setupDashboard();
        } else {
            // Check again after a short delay
            setTimeout(() => {
                if (window.authGuard && window.authGuard.isAuthenticated()) {
                    this.currentUser = window.authGuard.getUser();
                    this.setupDashboard();
                }
            }, 500);
        }
    }

    setupDashboard() {
        if (!this.currentUser) return;

        // Update welcome message
        this.updateWelcomeMessage();

        // Populate activity list based on user role
        this.populateActivityList();

        // Populate health summary for patients
        if (this.currentUser.role === 'patient') {
            this.populateHealthSummary();
        }

        // Set up role-based visibility
        this.setupRoleBasedVisibility();
    }

    updateWelcomeMessage() {
        const welcomeElement = document.querySelector('[data-user-info="firstname"]');
        if (welcomeElement) {
            // Use firstname if available, otherwise extract from name
            const firstName = this.currentUser.firstname || this.currentUser.name.split(' ')[0];
            welcomeElement.textContent = firstName;
        }
    }

    populateActivityList() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const activities = this.getRoleBasedActivities();

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    getRoleBasedActivities() {
        const baseActivities = [
            {
                icon: '✅',
                title: 'Welcome to CureXpert',
                description: 'Your account has been successfully set up and you\'re ready to get started.',
                time: 'Just now'
            }
        ];

        switch (this.currentUser.role) {
            case 'patient':
                return [
                    ...baseActivities,
                    {
                        icon: '📋',
                        title: 'Profile Setup Complete',
                        description: 'Your health profile has been initialized. You can now book appointments.',
                        time: '5 minutes ago'
                    },
                    {
                        icon: '💬',
                        title: 'Welcome Message',
                        description: 'Our team has sent you a welcome message with next steps.',
                        time: '10 minutes ago'
                    }
                ];

            case 'provider':
                return [
                    ...baseActivities,
                    {
                        icon: '🏥',
                        title: 'Practice Setup',
                        description: 'Your practice profile has been created. Start adding your services.',
                        time: '5 minutes ago'
                    },
                    {
                        icon: '📊',
                        title: 'Analytics Ready',
                        description: 'Your practice analytics dashboard is now available.',
                        time: '10 minutes ago'
                    }
                ];

            case 'partner':
                return [
                    ...baseActivities,
                    {
                        icon: '🤝',
                        title: 'Partnership Initiated',
                        description: 'Your partnership application has been received and is under review.',
                        time: '5 minutes ago'
                    },
                    {
                        icon: '📈',
                        title: 'Investment Dashboard',
                        description: 'Access your investment portfolio and performance metrics.',
                        time: '10 minutes ago'
                    }
                ];

            default:
                return baseActivities;
        }
    }

    populateHealthSummary() {
        const healthSummary = document.getElementById('healthSummary');
        if (!healthSummary) return;

        // For now, show a message that data will be populated when available
        healthSummary.innerHTML = `
            <div class="summary-card">
                <h4>Health Profile</h4>
                <div class="summary-value">Setup Complete</div>
                <div class="summary-status normal">Ready</div>
            </div>
            <div class="summary-card">
                <h4>Next Steps</h4>
                <div class="summary-value">Book Appointment</div>
                <div class="summary-status warning">Action Required</div>
            </div>
            <div class="summary-card">
                <h4>Data Sync</h4>
                <div class="summary-value">Pending</div>
                <div class="summary-status warning">In Progress</div>
            </div>
            <div class="summary-card">
                <h4>Health Records</h4>
                <div class="summary-value">0 Records</div>
                <div class="summary-status normal">Empty</div>
            </div>
        `;
    }

    setupRoleBasedVisibility() {
        // Show/hide elements based on user role
        const roleElements = document.querySelectorAll('[data-role]');
        roleElements.forEach(element => {
            if (element.dataset.role === this.currentUser.role) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for auth guard to be ready
    if (window.authGuard) {
        window.dashboard = new CureXpertDashboard();
    } else {
        // Check again after a short delay
        setTimeout(() => {
            if (window.authGuard) {
                window.dashboard = new CureXpertDashboard();
            }
        }, 1000);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CureXpertDashboard;
}
