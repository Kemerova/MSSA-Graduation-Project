# Troubleshooting Guide - Cohort Chronicles

This guide provides solutions to common issues encountered during deployment and operation of the Cohort Chronicles application.

## Table of Contents

1. [Deployment Issues](#deployment-issues)
2. [Azure OpenAI Issues](#azure-openai-issues)
3. [Static Web Apps Issues](#static-web-apps-issues)
4. [Performance Issues](#performance-issues)
5. [Security Issues](#security-issues)
6. [Browser Compatibility Issues](#browser-compatibility-issues)
7. [API Issues](#api-issues)
8. [Diagnostic Tools](#diagnostic-tools)

## Deployment Issues

### GitHub Actions Build Fails

#### Symptom
```
Error: The process '/usr/bin/npm' failed with exit code 1
```

#### Diagnosis
```bash
# Check GitHub Actions logs
# Navigate to: Repository → Actions → Failed workflow → View logs

# Common causes:
# - Missing dependencies
# - Test failures
# - Build script errors
# - Environment variable issues
```

#### Solutions

**Missing Dependencies:**
```bash
# Ensure package.json includes all dependencies
npm install
npm audit fix

# Update package-lock.json
npm ci
```

**Test Failures:**
```bash
# Run tests locally first
npm run test:all

# Fix failing tests before pushing
npm run test:unit
npm run test:integration
```

**Environment Variables:**
```bash
# Verify GitHub Secrets are set:
# - AZURE_STATIC_WEB_APPS_API_TOKEN
# - AZURE_OPENAI_API_KEY
# - AZURE_OPENAI_ENDPOINT
# - AZURE_OPENAI_DEPLOYMENT_NAME
```

### Azure Static Web Apps Deployment Token Issues

#### Symptom
```
Error: Invalid deployment token
```

#### Solutions
```bash
# Regenerate deployment token in Azure Portal
# 1. Go to Azure Portal → Static Web Apps → Overview
# 2. Click "Manage deployment token"
# 3. Copy new token
# 4. Update GitHub Secret: AZURE_STATIC_WEB_APPS_API_TOKEN
```

### Build Script Failures

#### Symptom
```
Error: Cannot find module 'terser'
Error: build.js failed to execute
```

#### Solutions
```bash
# Install build dependencies
npm install --save-dev terser clean-css-cli

# Verify build script
node build.js

# Check build output
ls -la dist/
```

## Azure OpenAI Issues

### API Authentication Failures

#### Symptom
```
Error: 401 Unauthorized
Error: Invalid API key
```

#### Diagnosis
```bash
# Test API key directly
curl -X POST "https://your-resource.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview" \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d '{"messages":[{"role":"user","content":"test"}],"max_tokens":10}'
```

#### Solutions

**Invalid API Key:**
```bash
# Get correct API key
az cognitiveservices account keys list \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg

# Update GitHub Secret and Azure Static Web Apps configuration
```

**Wrong Endpoint:**
```bash
# Get correct endpoint
az cognitiveservices account show \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --query "properties.endpoint"
```

### Model Deployment Issues

#### Symptom
```
Error: The API deployment for this resource does not exist
Error: Model not found
```

#### Diagnosis
```bash
# List available deployments
az cognitiveservices account deployment list \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg
```

#### Solutions
```bash
# Create model deployment
az cognitiveservices account deployment create \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --deployment-name gpt-4 \
  --model-name gpt-4 \
  --model-version "0613" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard

# Update deployment name in configuration
# Ensure AZURE_OPENAI_DEPLOYMENT_NAME matches actual deployment
```

### Rate Limiting Issues

#### Symptom
```
Error: 429 Too Many Requests
Error: Rate limit exceeded
```

#### Diagnosis
```bash
# Check quota usage
az cognitiveservices account show \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --query "properties.quotaUsage"

# Monitor API calls
az monitor metrics list \
  --resource cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --metric "TotalCalls"
```

#### Solutions

**Increase Quota:**
```bash
# Request quota increase in Azure Portal
# Navigate to: Cognitive Services → Quotas → Request increase
```

**Implement Retry Logic:**
```javascript
// api/chat/index.js
async function callOpenAIWithRetry(payload, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await callOpenAI(payload);
        } catch (error) {
            if (error.status === 429 && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000; // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
}
```

## Static Web Apps Issues

### Routing Problems

#### Symptom
```
404 Not Found for /api/chat
SPA routing not working
```

#### Solutions

**Check staticwebapp.config.json:**
```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "*.css", "*.js", "*.png", "*.jpg"]
  }
}
```

**Verify API Location:**
```bash
# Ensure API files are in 'api' directory
ls -la api/
# Should contain: package.json, function.json, chat.js
```

### CORS Issues

#### Symptom
```
Access to fetch at 'https://api.example.com' from origin 'https://app.example.com' has been blocked by CORS policy
```

#### Solutions

**Update staticwebapp.config.json:**
```json
{
  "globalHeaders": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  }
}
```

**API Function CORS:**
```javascript
// api/chat/index.js
module.exports = async function (context, req) {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }
    
    // Your API logic here
};
```

### Environment Variables Not Loading

#### Symptom
```
Error: Environment variable undefined
process.env.AZURE_OPENAI_API_KEY is undefined
```

#### Solutions

**Azure Portal Configuration:**
```bash
# Navigate to: Static Web Apps → Configuration → Application settings
# Add all required environment variables
# Restart the application after changes
```

**Local Development:**
```bash
# Create api/.env file
echo "AZURE_OPENAI_API_KEY=your-key" > api/.env
echo "AZURE_OPENAI_ENDPOINT=your-endpoint" >> api/.env

# Install dotenv for local development
cd api && npm install dotenv
```

## Performance Issues

### Slow Page Load Times

#### Symptom
```
Page load time > 5 seconds
Lighthouse performance score < 70
```

#### Diagnosis
```bash
# Run Lighthouse audit
npx lighthouse https://your-app.azurestaticapps.net --output html

# Check network performance
curl -w "@curl-format.txt" -o /dev/null -s https://your-app.azurestaticapps.net
```

#### Solutions

**Asset Optimization:**
```bash
# Minify assets
npm install --save-dev terser clean-css-cli
node build.js

# Verify minified files
ls -la dist/
```

**Enable Compression:**
```json
// staticwebapp.config.json
{
  "globalHeaders": {
    "Cache-Control": "public, max-age=86400",
    "Content-Encoding": "gzip"
  }
}
```

**Image Optimization:**
```bash
# Optimize images
npm install --save-dev imagemin imagemin-pngquant imagemin-mozjpeg

# Create optimization script
node optimize-images.js
```

### Slow API Response Times

#### Symptom
```
API response time > 5 seconds
Chatbot takes too long to respond
```

#### Diagnosis
```bash
# Test API directly
time curl -X POST "https://your-app.azurestaticapps.net/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# Monitor Azure Functions
az monitor metrics list \
  --resource your-function-app \
  --metric "AverageResponseTime"
```

#### Solutions

**Optimize OpenAI Prompts:**
```javascript
// Reduce token usage
const optimizedPrompt = {
    messages: [
        {
            role: "system",
            content: "Brief, concise responses only." // Shorter system prompt
        },
        {
            role: "user",
            content: userMessage
        }
    ],
    max_tokens: 150, // Limit response length
    temperature: 0.7
};
```

**Implement Caching:**
```javascript
// Simple in-memory cache
const responseCache = new Map();

function getCachedResponse(message) {
    const key = message.toLowerCase().trim();
    return responseCache.get(key);
}

function setCachedResponse(message, response) {
    const key = message.toLowerCase().trim();
    responseCache.set(key, {
        response,
        timestamp: Date.now()
    });
}
```

## Security Issues

### Content Security Policy Violations

#### Symptom
```
Refused to load script because it violates CSP directive
Refused to connect to API because it violates CSP directive
```

#### Solutions

**Update CSP Headers:**
```json
// staticwebapp.config.json
{
  "globalHeaders": {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.openai.azure.com https://*.azurestaticapps.net; img-src 'self' data: https:;"
  }
}
```

**Remove Inline Scripts:**
```html
<!-- Instead of inline scripts -->
<script>
  // Move to external file
</script>

<!-- Use external file -->
<script src="script.js"></script>
```

### SSL Certificate Issues

#### Symptom
```
NET::ERR_CERT_AUTHORITY_INVALID
SSL certificate error
```

#### Solutions

**Custom Domain Setup:**
```bash
# Add custom domain in Azure Portal
# Navigate to: Static Web Apps → Custom domains → Add

# Configure DNS
# Add CNAME record pointing to your Static Web App
```

**Certificate Renewal:**
```bash
# Azure automatically renews certificates
# Check certificate status in Azure Portal
# Contact Azure support if issues persist
```

## Browser Compatibility Issues

### Internet Explorer Issues

#### Symptom
```
Script errors in IE
Features not working in older browsers
```

#### Solutions

**Add Polyfills:**
```html
<!-- Add to index.html -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,fetch,Promise"></script>
```

**Feature Detection:**
```javascript
// Check for modern features
if (!window.fetch) {
    // Provide fallback or show message
    console.warn('This browser is not supported');
}

// Use feature detection instead of browser detection
if ('serviceWorker' in navigator) {
    // Use service worker
}
```

### Mobile Safari Issues

#### Symptom
```
Touch events not working
Viewport issues on iOS
```

#### Solutions

**Viewport Configuration:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

**Touch Event Handling:**
```javascript
// Handle both touch and mouse events
element.addEventListener('touchstart', handleTouch, { passive: true });
element.addEventListener('mousedown', handleMouse);

function handleTouch(event) {
    event.preventDefault();
    // Handle touch
}
```

## API Issues

### Function App Cold Start

#### Symptom
```
First API call takes 10+ seconds
Subsequent calls are fast
```

#### Solutions

**Keep Functions Warm:**
```javascript
// Add a simple health check endpoint
// api/health/index.js
module.exports = async function (context, req) {
    context.res = {
        status: 200,
        body: { status: 'healthy', timestamp: new Date().toISOString() }
    };
};
```

**Ping Function Regularly:**
```javascript
// Add to main application
setInterval(() => {
    fetch('/api/health').catch(() => {
        // Ignore errors, just keep function warm
    });
}, 300000); // Every 5 minutes
```

### JSON Parsing Errors

#### Symptom
```
SyntaxError: Unexpected token in JSON
Invalid JSON response
```

#### Solutions

**Robust Error Handling:**
```javascript
// api/chat/index.js
module.exports = async function (context, req) {
    try {
        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            context.res = {
                status: 400,
                body: { error: 'Invalid request body' }
            };
            return;
        }

        // Process request
        const result = await processRequest(req.body);
        
        context.res = {
            status: 200,
            body: result,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        context.log.error('API Error:', error);
        context.res = {
            status: 500,
            body: { error: 'Internal server error' }
        };
    }
};
```

**Client-Side Error Handling:**
```javascript
async function callAPI(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
```

## Diagnostic Tools

### Health Check Script

Create `health-check.js`:

```javascript
const https = require('https');
const { URL } = require('url');

class HealthChecker {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.results = [];
    }

    async checkEndpoint(path, options = {}) {
        const url = new URL(path, this.baseUrl);
        const startTime = Date.now();

        return new Promise((resolve) => {
            const req = https.request(url, {
                method: options.method || 'GET',
                headers: options.headers || {},
                timeout: options.timeout || 10000
            }, (res) => {
                const duration = Date.now() - startTime;
                const result = {
                    path,
                    status: res.statusCode,
                    duration,
                    success: res.statusCode >= 200 && res.statusCode < 400
                };
                this.results.push(result);
                resolve(result);
            });

            req.on('error', (error) => {
                const result = {
                    path,
                    status: 0,
                    duration: Date.now() - startTime,
                    success: false,
                    error: error.message
                };
                this.results.push(result);
                resolve(result);
            });

            req.on('timeout', () => {
                req.destroy();
                const result = {
                    path,
                    status: 0,
                    duration: Date.now() - startTime,
                    success: false,
                    error: 'Timeout'
                };
                this.results.push(result);
                resolve(result);
            });

            if (options.body) {
                req.write(JSON.stringify(options.body));
            }

            req.end();
        });
    }

    async runHealthCheck() {
        console.log(`🏥 Health Check for: ${this.baseUrl}\n`);

        const checks = [
            { path: '/', name: 'Homepage' },
            { path: '/styles.css', name: 'CSS Assets' },
            { path: '/script.js', name: 'JavaScript Assets' },
            { 
                path: '/api/health', 
                name: 'API Health',
                method: 'GET'
            },
            { 
                path: '/api/chat', 
                name: 'Chat API',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { message: 'Health check' }
            }
        ];

        for (const check of checks) {
            const result = await this.checkEndpoint(check.path, check);
            const status = result.success ? '✅' : '❌';
            const duration = `${result.duration}ms`;
            const error = result.error ? ` (${result.error})` : '';
            
            console.log(`${status} ${check.name}: ${result.status} - ${duration}${error}`);
        }

        console.log('\n📊 Summary:');
        const successful = this.results.filter(r => r.success).length;
        const total = this.results.length;
        const avgDuration = Math.round(
            this.results.reduce((sum, r) => sum + r.duration, 0) / total
        );

        console.log(`Success Rate: ${successful}/${total} (${Math.round(successful/total*100)}%)`);
        console.log(`Average Response Time: ${avgDuration}ms`);

        return {
            success: successful === total,
            results: this.results,
            summary: { successful, total, avgDuration }
        };
    }
}

// Usage
const checker = new HealthChecker(process.argv[2] || 'https://cohort-chronicles.azurestaticapps.net');
checker.runHealthCheck().then(result => {
    process.exit(result.success ? 0 : 1);
});
```

### Performance Monitor

Create `performance-monitor.js`:

```javascript
const puppeteer = require('puppeteer');

async function monitorPerformance(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Enable performance monitoring
    await page.setCacheEnabled(false);
    
    const metrics = {};
    
    // Monitor network requests
    const requests = [];
    page.on('request', request => {
        requests.push({
            url: request.url(),
            method: request.method(),
            timestamp: Date.now()
        });
    });

    // Monitor responses
    const responses = [];
    page.on('response', response => {
        responses.push({
            url: response.url(),
            status: response.status(),
            timestamp: Date.now()
        });
    });

    // Navigate and measure
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;

    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
    });

    await browser.close();

    return {
        loadTime,
        requests: requests.length,
        responses: responses.length,
        ...performanceMetrics
    };
}

// Usage
const url = process.argv[2] || 'https://cohort-chronicles.azurestaticapps.net';
monitorPerformance(url).then(metrics => {
    console.log('🚀 Performance Metrics:');
    console.log(`Page Load Time: ${metrics.loadTime}ms`);
    console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`First Paint: ${metrics.firstPaint}ms`);
    console.log(`First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    console.log(`Network Requests: ${metrics.requests}`);
    console.log(`Network Responses: ${metrics.responses}`);
});
```

### Log Analysis Script

Create `analyze-logs.js`:

```javascript
const fs = require('fs');

function analyzeLogs(logFile) {
    const logs = fs.readFileSync(logFile, 'utf8').split('\n');
    const analysis = {
        errors: [],
        warnings: [],
        performance: [],
        apiCalls: []
    };

    logs.forEach((line, index) => {
        if (line.includes('ERROR')) {
            analysis.errors.push({ line: index + 1, message: line });
        } else if (line.includes('WARN')) {
            analysis.warnings.push({ line: index + 1, message: line });
        } else if (line.includes('API call')) {
            analysis.apiCalls.push({ line: index + 1, message: line });
        } else if (line.includes('Performance')) {
            analysis.performance.push({ line: index + 1, message: line });
        }
    });

    return analysis;
}

// Generate report
function generateReport(analysis) {
    console.log('📋 Log Analysis Report\n');
    
    console.log(`❌ Errors: ${analysis.errors.length}`);
    analysis.errors.slice(0, 5).forEach(error => {
        console.log(`  Line ${error.line}: ${error.message}`);
    });
    
    console.log(`\n⚠️  Warnings: ${analysis.warnings.length}`);
    analysis.warnings.slice(0, 5).forEach(warning => {
        console.log(`  Line ${warning.line}: ${warning.message}`);
    });
    
    console.log(`\n🔗 API Calls: ${analysis.apiCalls.length}`);
    console.log(`\n⚡ Performance Entries: ${analysis.performance.length}`);
}

// Usage
const logFile = process.argv[2] || 'application.log';
if (fs.existsSync(logFile)) {
    const analysis = analyzeLogs(logFile);
    generateReport(analysis);
} else {
    console.log('Log file not found. Please provide a valid log file path.');
}
```

## Getting Help

### Support Channels

1. **Azure Support**: Create support ticket in Azure Portal
2. **GitHub Issues**: Repository issue tracker
3. **Stack Overflow**: Tag questions with `azure-static-web-apps`, `azure-openai`
4. **Azure Community**: Microsoft Q&A platform

### Before Contacting Support

1. **Check this troubleshooting guide**
2. **Run diagnostic tools**
3. **Collect error logs and screenshots**
4. **Document steps to reproduce the issue**
5. **Note your environment details** (browser, OS, etc.)

### Information to Provide

- **Error messages** (exact text)
- **Steps to reproduce** the issue
- **Environment details** (browser, OS, device)
- **Deployment configuration**
- **Recent changes** made to the application
- **Diagnostic tool output**

This troubleshooting guide should help resolve most common issues. For complex problems, don't hesitate to reach out to the appropriate support channels.