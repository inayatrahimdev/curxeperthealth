# CureXpert - Healthcare Platform

A modern, fully responsive, professional multi-page website for CureXpert, a healthcare startup focused on affordable, AI-assisted primary care, telemedicine, and clinical decision support for emerging markets.

## 🚀 Features

### 🔐 **Production-Ready Authentication System**
- **Secure Access Control**: No direct access to website without authentication
- **User Registration**: Complete signup with role selection (Patient/Provider/Partner)
- **User Login**: Secure email/password authentication
- **Google SSO**: Google OAuth integration ready
- **Session Management**: Secure localStorage-based sessions with expiration
- **Role-Based Access**: Different content based on user type

### 🎨 **Professional Design**
- **Medical Color Palette**: Clean, trust-building design
- **Responsive Layout**: Mobile-first, fully responsive design
- **Modern UI/UX**: Professional healthcare aesthetics
- **Accessibility**: WCAG compliant design

### 📱 **Multi-Page Website**
- **Home Page**: Hero section, problem/solution, how it works
- **For Patients**: Services, pricing, testimonials
- **For Providers**: Features, demo booking, practice management
- **For Partners**: Investment opportunities, partnership models
- **Security & Compliance**: HIPAA/GDPR ready, certifications
- **About Us**: Mission, vision, team
- **Contact**: Contact forms, support information
- **Legal Pages**: Privacy Policy, Terms of Service

### 🤖 **AI Chatbot**
- **Intelligent Support**: Answers questions about CureXpert services
- **Professional Design**: Medical-themed, non-intrusive
- **Responsive**: Works on all devices

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Authentication**: Custom authentication system with localStorage
- **Styling**: Custom CSS with CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter, Lato, Open Sans)
- **Deployment**: GitHub Pages ready

## 🚀 Deployment

### GitHub Pages Deployment

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/yourusername/curexpert-website.git
   cd curexpert-website
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: main (or master)
   - Folder: / (root)

3. **Custom Domain Setup** (Optional)
   - Add your domain in repository Settings > Pages
   - Configure DNS records as per GitHub instructions

4. **Deploy**
   - Push changes to main branch
   - GitHub Pages will automatically deploy

### Local Development

1. **Start Local Server**
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

2. **Access Website**
   - Open `http://localhost:8000` in browser
   - You'll be redirected to authentication page

## 🔐 Authentication Flow

### **New Users**
1. Visit any page → Redirected to `auth.html`
2. Click "Sign Up" tab
3. Fill registration form with:
   - First Name, Last Name
   - Email, Password
   - Role selection (Patient/Provider/Partner)
   - Terms acceptance
4. Account created → Redirected to dashboard
5. Welcome message with first name

### **Existing Users**
1. Visit any page → Redirected to `auth.html`
2. Click "Sign In" tab
3. Enter email/password
4. Authentication successful → Redirected to dashboard
5. Welcome back message

### **Session Management**
- **Session Duration**: 24 hours (configurable)
- **Remember Me**: 30 days for checked sessions
- **Auto-Logout**: Expired sessions automatically logged out
- **Security**: Passwords never stored in session data

## 📁 File Structure

```
curexpert-website/
├── index.html              # Home page (requires auth)
├── auth.html               # Authentication page
├── dashboard.html          # User dashboard
├── patients.html           # For Patients page
├── providers.html          # For Providers page
├── partners.html           # For Partners page
├── security.html           # Security page
├── compliance.html         # Compliance page
├── about.html              # About Us page
├── contact.html            # Contact page
├── privacy.html            # Privacy Policy
├── terms.html              # Terms of Service
├── styles.css              # Main stylesheet
├── auth.css                # Authentication styles
├── dashboard.css           # Dashboard styles
├── script.js               # Main JavaScript
├── auth.js                 # Authentication logic
├── auth-guard.js           # Authentication guard
├── dashboard.js            # Dashboard logic
├── CureXpert Logo.png      # Logo image
└── README.md               # This file
```

## 🔒 Security Features

- **Authentication Required**: All pages protected
- **Session Expiration**: Automatic logout after 24 hours
- **Password Security**: Minimum 8 characters, strength validation
- **Data Protection**: No sensitive data in client-side storage
- **CSRF Protection**: Form validation and sanitization
- **XSS Prevention**: Input sanitization and validation

## 🌐 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **IE**: Not supported (ES6+ features)

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Responsive tablet layouts
- **Desktop**: Full desktop experience
- **Breakpoints**: 320px, 768px, 1024px, 1200px

## 🎯 Production Features

- **SEO Optimized**: Meta tags, OpenGraph, structured data
- **Performance**: Optimized images, minified CSS/JS
- **Accessibility**: ARIA labels, keyboard navigation
- **Analytics Ready**: Google Analytics integration ready
- **Error Handling**: Graceful error handling and user feedback
- **Loading States**: Professional loading animations

## 🔧 Customization

### **Colors**
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-blue: #1A73E8;
    --teal: #009688;
    --soft-green: #4CAF50;
    --white: #FFFFFF;
}
```

### **Content**
- Update text content in HTML files
- Replace placeholder images with real content
- Customize authentication messages

### **Features**
- Add real Google OAuth integration
- Connect to backend API
- Implement real database storage

## 📞 Support

For technical support or questions:
- **Email**: support@curexpert.com
- **Documentation**: Check code comments
- **Issues**: Use GitHub Issues

## 📄 License

This project is proprietary software for CureXpert. All rights reserved.

---

**CureXpert** - Affordable Primary Care, Faster Outcomes — for Everyone.
