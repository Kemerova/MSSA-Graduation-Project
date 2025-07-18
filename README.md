# Lock, Stock, and Two Smoking Servers: A MSSA Odyssey

An interactive web application showcasing the 17-week journey of a Microsoft Software & Systems Academy (MSSA) cohort. Built for graduation ceremony presentations with auto-advancing slideshow and AI-powered chatbot integration.

## 🎯 Overview

"Lock, Stock, and Two Smoking Servers: A MSSA Odyssey" tells the epic tale of eight military veterans turned tech wizards through an engaging slideshow experience. The application features:

- **Comic book-style storytelling** with character-driven narrative through 7 themed slides
- **Auto-advancing slideshow** with the complete cohort odyssey from Power-Hell to Cloud Heaven
- **AI-powered chatbot** using Azure OpenAI for interactive Q&A about the journey
- **Responsive design** optimized for presentation screens, tablets, and mobile
- **Professional styling** with military-inspired color scheme
- **Accessibility features** with keyboard navigation and screen reader support

## 🎭 The Story

Follow our band of brothers through their transformation:
- **Introduction**: Meet the eight veterans and their guides
- **Power-Hell Chronicles**: Learning PowerShell with Mike Howell
- **The Swan Act**: ProDev training with Fiona Jones
- **Dave's Artistic Server Academy**: Hand-drawn diagrams and car stories
- **Azure Enlightenment**: Godfrey as the "god of MS Azure"
- **M365 Endpoint Mastery**: Final technical training
- **From Power-Hell to Cloud Heaven**: Graduation and reflection

## 🚀 Live Demo

- **Production**: [https://cohort-chronicles.azurestaticapps.net](https://cohort-chronicles.azurestaticapps.net)
- **Staging**: Available through Azure Static Web Apps staging slots

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Hosting**: Azure Static Web Apps
- **API**: Azure Functions (Node.js) for OpenAI integration
- **AI Service**: Azure OpenAI Service (GPT-4)
- **Deployment**: GitHub Actions with automated CI/CD

### Key Components

```
├── Frontend Components
│   ├── SlideshowEngine - Auto-advancing slideshow logic
│   ├── NavigationController - Manual navigation and controls
│   └── ChatbotInterface - AI chatbot modal and messaging
├── Backend Services
│   ├── Azure Functions API - Serverless chatbot backend
│   └── Azure OpenAI - AI conversation processing
└── Infrastructure
    ├── Azure Static Web Apps - Hosting and CDN
    └── GitHub Actions - CI/CD pipeline
```

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18.0.0 or later
- **Azure CLI** (for deployment)
- **Git** for version control
- **Azure Subscription** (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cohort-chronicles.git
   cd cohort-chronicles
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd api && npm install && cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Copy example environment files
   cp .env.example .env
   cp api/.env.example api/.env
   
   # Edit .env files with your Azure OpenAI credentials
   ```

4. **Start local development server**
   ```bash
   npm run serve
   ```

5. **Access the application**
   - Open http://localhost:8000 in your browser

### Environment Variables

Create `.env` and `api/.env` files with the following variables:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Development Settings
NODE_ENV=development
PORT=8000
```

## 🧪 Testing

### Test Suites

The project includes comprehensive testing:

- **Unit Tests**: Individual component testing (87 tests)
- **Integration Tests**: API endpoint testing (21 tests)
- **End-to-End Tests**: Complete workflow testing (64 tests)
- **Performance Tests**: Load time and optimization (14 tests)

### Running Tests

```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance

# Run with coverage
npm run test:coverage
```

### Validation Scripts

```bash
# Validate local deployment readiness
node validate-local-deployment.js

# Test production deployment
node final-deployment-test.js https://your-app.azurestaticapps.net
```

## 🚀 Deployment

### Quick Deployment

1. **Fork this repository**
2. **Set up Azure Static Web Apps** (see [DEPLOYMENT-COMPLETE.md](DEPLOYMENT-COMPLETE.md))
3. **Configure GitHub Secrets** with Azure credentials
4. **Push to main branch** - automatic deployment via GitHub Actions

### Detailed Deployment Guide

For comprehensive deployment instructions, see:
- **[DEPLOYMENT-COMPLETE.md](DEPLOYMENT-COMPLETE.md)** - Complete deployment guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

### GitHub Secrets Required

| Secret Name | Description |
|-------------|-------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Static Web Apps deployment token |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI service API key |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI service endpoint |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name (e.g., gpt-4) |

## 📱 Features

### Slideshow Features

- **Auto-advancement**: 10-second intervals with smooth transitions
- **Manual navigation**: Previous/Next buttons and keyboard controls
- **Progress tracking**: Interactive progress bar with click-to-jump
- **Responsive design**: Optimized for all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation

### Chatbot Features

- **AI-powered responses**: Azure OpenAI integration with cohort context
- **Character consistency**: Maintains cohort personalities and story details
- **Error handling**: Graceful degradation and retry mechanisms
- **Message history**: Conversation context preservation
- **Loading states**: Visual feedback during API calls

### Technical Features

- **Performance optimized**: Asset minification and CDN delivery
- **Security hardened**: CSP headers and input validation
- **Cross-browser compatible**: Tested on Chrome, Firefox, Safari, Edge
- **Mobile responsive**: Touch-friendly navigation and responsive layout

## 🎨 Customization

### Content Updates

1. **Slide Content**: Edit the `slideData` object in `script.js`
2. **Character Profiles**: Update `characterProfiles` in the API system prompt
3. **Styling**: Modify CSS custom properties in `styles.css`
4. **Branding**: Update logos and colors in the CSS file

### Configuration

- **Slideshow timing**: Adjust `AUTO_ADVANCE_INTERVAL` in `script.js`
- **API settings**: Configure endpoints in `api/config/appConfig.js`
- **Security headers**: Update `staticwebapp.config.json`

## 📊 Performance

### Optimization Features

- **Asset minification**: CSS and JavaScript compression
- **Image optimization**: Lazy loading and compression
- **CDN delivery**: Azure Static Web Apps global distribution
- **Caching strategy**: Browser and API response caching

### Performance Metrics

- **Page load time**: < 3 seconds target
- **First Contentful Paint**: < 2 seconds
- **API response time**: < 2 seconds average
- **Lighthouse score**: 90+ performance rating

## 🔒 Security

### Security Features

- **Content Security Policy**: Comprehensive CSP headers
- **Input validation**: API request sanitization
- **Rate limiting**: API call throttling
- **HTTPS enforcement**: SSL/TLS encryption
- **XSS protection**: Content sanitization

### Security Headers

```json
{
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; ...",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
}
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and add tests
4. **Run validation**: `node validate-local-deployment.js`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- **ESLint**: JavaScript linting and formatting
- **Prettier**: Code formatting consistency
- **Jest**: Unit and integration testing
- **Playwright**: End-to-end testing

### Testing Requirements

- All new features must include tests
- Maintain 90%+ code coverage
- Pass all existing tests
- Include accessibility testing

## 📚 Documentation

### Available Documentation

- **[DEPLOYMENT-COMPLETE.md](DEPLOYMENT-COMPLETE.md)** - Complete deployment guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[tests/README.md](tests/README.md)** - Testing documentation
- **[api/README.md](api/README.md)** - API documentation

### API Documentation

The chatbot API provides a single endpoint:

```
POST /api/chat
Content-Type: application/json

{
  "message": "Your question here"
}
```

Response:
```json
{
  "response": "AI-generated response",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Deployment fails**: Check GitHub Secrets and Azure configuration
2. **Chatbot not responding**: Verify Azure OpenAI service and API keys
3. **Assets not loading**: Check build process and CDN configuration
4. **Performance issues**: Review asset optimization and caching

### Getting Help

- **Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for detailed solutions
- **Run diagnostic scripts**: `node final-deployment-test.js`
- **Review GitHub Actions logs** for deployment issues
- **Check Azure Portal** for service status

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### MSSA Cohort: "Lock, Stock, and Two Smoking Servers"

Special thanks to the amazing cohort members and instructors who made this journey possible:

#### Staff
- **Fiona Jones** - Career Development Manager
- **Dave Wentzel** - Senior Instructor
- **Gwen Faraday** - Lead Instructor
- **Kimberly Wilber** - Program Manager

#### Students
- **Brandon Brown** - US Navy veteran from Sweden
- **Cody Gagnon** - US Army veteran from New Hampshire
- **Michael Ackerman** - US Army veteran from Washington
- **And many more amazing cohort members...**

### Technologies

- **Microsoft Azure** - Cloud platform and services
- **Azure OpenAI** - AI conversation capabilities
- **GitHub** - Version control and CI/CD
- **Node.js** - Runtime environment
- **Jest & Playwright** - Testing frameworks

## 📞 Support

### Contact Information

- **Project Repository**: [GitHub Issues](https://github.com/your-username/cohort-chronicles/issues)
- **Azure Support**: [Azure Portal Support](https://portal.azure.com)
- **Documentation**: Available in this repository

### Emergency Contacts

For production issues:
- **Azure Support**: Available 24/7 for critical issues
- **GitHub Support**: For repository and Actions issues

---

## 🎓 About MSSA

The Microsoft Software & Systems Academy (MSSA) is a 17-week program that provides transitioning military service members and veterans with the skills needed for careers in cloud computing and software development.

**Learn more**: [Microsoft MSSA Program](https://military.microsoft.com/mssa/)

---

*Built with ❤️ by the "Lock, Stock, and Two Smoking Servers" cohort*