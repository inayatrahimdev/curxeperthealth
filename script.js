// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navList.classList.contains('active')) {
            navList.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.solution-card, .step-card, .metric-card, .partner-logo');
    animateElements.forEach(el => observer.observe(el));
});

// Form handling
const contactForms = document.querySelectorAll('form');
contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Add loading states to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.classList.contains('btn-primary') || this.classList.contains('btn-secondary')) {
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;

                // Simulate loading (remove in production)
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
});

// Add mobile menu styles
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-list {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-list.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(mobileMenuStyles);

// Simple Working Chatbot
class CureXpertChatbot {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create chatbot HTML
        const html = `
            <div class="chatbot-container">
                <button class="chatbot-button" id="chatbotButton">
                    <div class="chatbot-icon"></div>
                    <span>Ask CureXpert AI</span>
                </button>
                
                <div class="chatbot-interface" id="chatbotInterface">
                    <div class="chatbot-header">
                        <h3>CureXpert AI</h3>
                        <button class="chatbot-close" id="chatbotClose">×</button>
                    </div>
                    <div class="chatbot-messages" id="chatbotMessages">
                        <div class="chatbot-message bot">
                            <div class="chatbot-avatar bot">AI</div>
                            <div class="chatbot-text">Hello! I'm your CureXpert AI Assistant. How can I help you today?</div>
                        </div>
                    </div>
                    <div class="chatbot-input-container">
                        <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type your message..." />
                        <button class="chatbot-send" id="chatbotSend">Send</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Get elements
        this.button = document.getElementById('chatbotButton');
        this.interface = document.getElementById('chatbotInterface');
        this.closeBtn = document.getElementById('chatbotClose');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.messages = document.getElementById('chatbotMessages');

        // Add event listeners
        this.button.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        console.log('Chatbot initialized successfully!');
    }

    toggle() {
        console.log('Toggle clicked!');
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.interface.style.display = 'flex';
        this.button.classList.add('active');
        console.log('Chatbot opened');
    }

    close() {
        this.isOpen = false;
        this.interface.style.display = 'none';
        this.button.classList.remove('active');
        console.log('Chatbot closed');
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        // Add user message
        this.addMessage(text, 'user');
        this.input.value = '';

        // Simulate bot response
        setTimeout(() => {
            this.addMessage('Thank you for your message! I\'m here to help with CureXpert services.', 'bot');
        }, 1000);
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}`;
        messageDiv.innerHTML = `
            <div class="chatbot-avatar ${type}">${type === 'bot' ? 'AI' : 'U'}</div>
            <div class="chatbot-text">${text}</div>
        `;
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing chatbot...');
    try {
        const chatbot = new CureXpertChatbot();
        console.log('Chatbot created successfully:', chatbot);

        // Test if button exists
        setTimeout(() => {
            const testButton = document.getElementById('chatbotButton');
            if (testButton) {
                console.log('Chatbot button found:', testButton);
                testButton.style.border = '3px solid red'; // Visual test
            } else {
                console.error('Chatbot button NOT found!');
            }
        }, 1000);

    } catch (error) {
        console.error('Error creating chatbot:', error);
    }
});

// Fallback initialization
if (document.readyState === 'complete') {
    console.log('Document already complete, initializing chatbot...');
    try {
        const chatbot = new CureXpertChatbot();
        console.log('Chatbot created successfully (fallback):', chatbot);
    } catch (error) {
        console.error('Error creating chatbot (fallback):', error);
    }
}
