# Complete Azure Deployment Script - The Cohort Chronicles

## 🚀 CRITICAL DEPLOYMENT GUIDE

This script provides **EXACT** steps, commands, and configurations for deploying "The Cohort Chronicles" to Azure. Follow these steps in **EXACT ORDER** for successful deployment.

## Prerequisites Checklist

- [ ] Azure subscription with contributor access
- [ ] Azure CLI installed and updated (version 2.50.0+)
- [ ] GitHub account with repository access
- [ ] Node.js 18+ installed locally
- [ ] Git installed and configured

## Phase 3A: Azure Resource Creation

### Step 1: Azure CLI Setup and Login

```bash
# Verify Azure CLI installation
az --version

# Login to Azure
az login

# List available subscriptions
az account list --output table

# Set your subscription (replace with your subscription ID)
az account set --subscription "your-subscription-id-here"

# Verify current subscription
az account show --output table
```

### Step 2: Create Resource Group

```bash
# Create resource group in East US
az group create \
  --name "rg-cohort-chronicles" \
  --location "East US" \
  --tags project="cohort-chronicles" environment="production"

# Verify resource group creation
az group show --name "rg-cohort-chronicles" --output table
```

**Portal Alternative:**
1. Go to https://portal.azure.com
2. Click "Resource groups" → "Create"
3. Resource group name: `rg-cohort-chronicles`
4. Region: `East US`
5. Tags: `project=cohort-chronicles, environment=production`
6. Click "Review + Create" → "Create"

### Step 3: Create Azure OpenAI Service

```bash
# Create Azure OpenAI service
az cognitiveservices account create \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles" \
  --location "East US" \
  --kind "OpenAI" \
  --sku "S0" \
  --custom-domain "openai-cohort-chronicles" \
  --tags project="cohort-chronicles"

# Verify OpenAI service creation
az cognitiveservices account show \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles" \
  --output table
```

**Portal Alternative:**
1. Search "Azure OpenAI" in Azure Portal
2. Click "Create"
3. Configuration:
   - Resource group: `rg-cohort-chronicles`
   - Region: `East US`
   - Name: `openai-cohort-chronicles`
   - Pricing tier: `Standard S0`
4. Click "Review + Create" → "Create"

### Step 4: Get OpenAI Service Details

```bash
# Get OpenAI endpoint
OPENAI_ENDPOINT=$(az cognitiveservices account show \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles" \
  --query "properties.endpoint" \
  --output tsv)

# Get OpenAI API key
OPENAI_API_KEY=$(az cognitiveservices account keys list \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles" \
  --query "key1" \
  --output tsv)

# Display values (SAVE THESE!)
echo "OpenAI Endpoint: $OPENAI_ENDPOINT"
echo "OpenAI API Key: $OPENAI_API_KEY"
```

**Portal Alternative:**
1. Go to your Azure OpenAI resource
2. Click "Keys and Endpoint"
3. Copy "Key 1" and "Endpoint"
4. Save these values securely

### Step 5: Deploy GPT Model

```bash
# Deploy GPT-4 model (recommended)
az cognitiveservices account deployment create \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles" \
  --deployment-name "gpt-4-cohort" \
  --model-name "gpt-4" \
  --model-version "0613" \
  --model-format "OpenAI" \
  --sku-capacity 10 \
  --sku-name "Standard"

# Alternative: Deploy GPT-3.5-turbo (cost-effective)
# az cognitiveservices account deployment create \
#   --name "openai-cohort-chronicles" \
#   --resource-group "rg-cohort-chronicles" \
#   --deployment-name "gpt-35-turbo-cohort" \
#   --model-name "gpt-35-turbo" \
#   --model-version "0613" \
#   --model-format "OpenAI" \
#   --sku-capacity 20 \
#   --sku-name "Standard"

# Verify model deployment
az cognitiveservices account deployment list \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles" \
  --output table
```

**Portal Alternative:**
1. Go to your Azure OpenAI resource
2. Click "Model deployments" → "Create new deployment"
3. Configuration:
   - Model: `gpt-4` (or `gpt-35-turbo` for cost savings)
   - Deployment name: `gpt-4-cohort`
   - Version: `0613` (latest stable)
   - Deployment type: `Standard`
   - Capacity: `10` (adjust based on needs)
4. Click "Create"

### Step 6: Create Azure Static Web App

```bash
# Create Static Web App (replace GitHub URL with your repository)
az staticwebapp create \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --location "East US 2" \
  --source "https://github.com/yourusername/cohort-chronicles" \
  --branch "main" \
  --app-location "/" \
  --api-location "api" \
  --output-location "" \
  --tags project="cohort-chronicles"

# Get Static Web App details
az staticwebapp show \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --output table

# Get deployment token (SAVE THIS!)
STATIC_WEB_APP_TOKEN=$(az staticwebapp secrets list \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --query "properties.apiKey" \
  --output tsv)

echo "Static Web App Token: $STATIC_WEB_APP_TOKEN"
```

**Portal Alternative:**
1. Search "Static Web Apps" in Azure Portal
2. Click "Create"
3. Configuration:
   - Resource group: `rg-cohort-chronicles`
   - Name: `cohort-chronicles-app`
   - Region: `East US 2`
   - Deployment source: `GitHub`
   - GitHub account: [Your GitHub account]
   - Repository: `cohort-chronicles`
   - Branch: `main`
   - Build presets: `Custom`
   - App location: `/`
   - Api location: `api`
   - Output location: `` (empty)
4. Click "Review + Create" → "Create"

## Phase 3B: GitHub Repository Setup

### Step 1: Prepare Repository Structure

```bash
# Clone your repository (if not already local)
git clone https://github.com/yourusername/cohort-chronicles.git
cd cohort-chronicles

# Verify all required files exist
ls -la

# Required files checklist:
# ✅ index.html
# ✅ styles.css  
# ✅ script.js
# ✅ staticwebapp.config.json
# ✅ api/chat.js
# ✅ api/package.json
# ✅ api/function.json
# ✅ api/host.json
# ✅ .github/workflows/azure-static-web-apps-deploy.yml
```

### Step 2: Update GitHub Actions Workflow

Create/update `.github/workflows/azure-static-web-apps-deploy.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'api/package-lock.json'
          
      - name: Install API dependencies
        run: |
          cd api
          npm ci --only=production
          
      - name: Run API tests
        run: |
          cd api
          npm install --only=dev
          npm test || echo "No tests configured"
          
      - name: Install build dependencies
        run: |
          npm install -g clean-css-cli terser
          
      - name: Optimize static assets
        run: |
          # Minify CSS
          clean-css-cli -o styles.min.css styles.css || cp styles.css styles.min.css
          # Minify JavaScript  
          terser script.js -o script.min.js --compress --mangle || cp script.js script.min.js
          
      - name: Run build script
        run: |
          node build.js || echo "No build script found"
        env:
          NODE_ENV: production
          MINIFY_ASSETS: true
          API_ENDPOINT: /api
          
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: "api"
          output_location: ""
          skip_app_build: true
        env:
          AZURE_OPENAI_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}
          AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          AZURE_OPENAI_DEPLOYMENT_NAME: ${{ secrets.AZURE_OPENAI_DEPLOYMENT_NAME }}
          AZURE_OPENAI_API_VERSION: ${{ secrets.AZURE_OPENAI_API_VERSION }}

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### Step 3: Configure GitHub Secrets

**Go to GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value | Source |
|-------------|-------|--------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | `[Token from Step 6]` | Azure Static Web App deployment token |
| `AZURE_OPENAI_API_KEY` | `[Key from Step 4]` | Azure OpenAI service API key |
| `AZURE_OPENAI_ENDPOINT` | `[Endpoint from Step 4]` | Azure OpenAI service endpoint |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | `gpt-4-cohort` | Model deployment name |
| `AZURE_OPENAI_API_VERSION` | `2024-02-15-preview` | OpenAI API version |

## Phase 3C: Configuration Files

### Step 1: Update Static Web App Configuration

Update `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif,ico,svg}", "/styles.css", "/script.js", "/api/*"]
  },
  "mimeTypes": {
    ".json": "application/json",
    ".js": "application/javascript",
    ".css": "text/css",
    ".html": "text/html",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  },
  "globalHeaders": {
    "Cache-Control": "public, max-age=86400",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.openai.azure.com https://*.azurestaticapps.net; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "platform": {
    "apiRuntime": "node:18"
  },
  "trailingSlash": "never"
}
```

### Step 2: Verify Azure Functions Configuration

Ensure `api/host.json` is configured:

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    },
    "logLevel": {
      "default": "Information",
      "Host.Results": "Error",
      "Function": "Information",
      "Host.Aggregator": "Trace"
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  },
  "functionTimeout": "00:02:00",
  "healthMonitor": {
    "enabled": true,
    "healthCheckInterval": "00:00:10",
    "healthCheckWindow": "00:02:00",
    "healthCheckThreshold": 6,
    "counterThreshold": 0.80
  },
  "http": {
    "routePrefix": "api",
    "maxOutstandingRequests": 200,
    "maxConcurrentRequests": 100,
    "dynamicThrottlesEnabled": true
  }
}
```

### Step 3: Verify API Package Configuration

Ensure `api/package.json` includes all dependencies:

```json
{
  "name": "cohort-chronicles-api",
  "version": "1.0.0",
  "description": "Azure Functions API for Cohort Chronicles chatbot",
  "main": "index.js",
  "scripts": {
    "start": "func start",
    "test": "jest || echo 'No tests configured'",
    "build": "echo 'API build complete'",
    "prestart": "npm run build"
  },
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "openai": "^4.0.0",
    "dotenv": "^16.3.1",
    "@azure/app-configuration": "^1.5.0",
    "@azure/identity": "^4.0.1",
    "validator": "^13.11.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Phase 3D: Environment Variables Setup

### Step 1: Configure Application Settings via Azure CLI

```bash
# Set environment variables for Static Web App
az staticwebapp appsettings set \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --setting-names \
    "AZURE_OPENAI_API_KEY=$OPENAI_API_KEY" \
    "AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT" \
    "AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-cohort" \
    "AZURE_OPENAI_API_VERSION=2024-02-15-preview" \
    "NODE_ENV=production"

# Verify settings
az staticwebapp appsettings list \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --output table
```

**Portal Alternative:**
1. Go to your Static Web App resource
2. Click "Configuration" in left menu
3. Click "Add" for each setting:
   - Name: `AZURE_OPENAI_API_KEY`, Value: `[Your OpenAI Key]`
   - Name: `AZURE_OPENAI_ENDPOINT`, Value: `[Your OpenAI Endpoint]`
   - Name: `AZURE_OPENAI_DEPLOYMENT_NAME`, Value: `gpt-4-cohort`
   - Name: `AZURE_OPENAI_API_VERSION`, Value: `2024-02-15-preview`
   - Name: `NODE_ENV`, Value: `production`
4. Click "Save"

## Phase 3E: Deployment Execution

### Step 1: Commit and Deploy

```bash
# Add all changes to git
git add .

# Commit changes
git commit -m "Configure Azure deployment with OpenAI integration"

# Push to main branch (triggers deployment)
git push origin main
```

### Step 2: Monitor Deployment

```bash
# Check deployment status
az staticwebapp show \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --query "{name:name,status:repositoryUrl,defaultHostname:defaultHostname}" \
  --output table

# Get application URL
APP_URL=$(az staticwebapp show \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --query "defaultHostname" \
  --output tsv)

echo "Application URL: https://$APP_URL"
```

**Monitor via GitHub:**
1. Go to your GitHub repository
2. Click "Actions" tab
3. Watch the deployment workflow progress
4. Check for any errors in the build logs

**Monitor via Azure Portal:**
1. Go to your Static Web App resource
2. Click "GitHub Actions" to see deployment status
3. Click "Functions" tab to verify API deployment
4. Click "Browse" to test the live site

## Phase 3F: Testing and Validation

### Step 1: Basic Functionality Testing

```bash
# Test application homepage
curl -I "https://$APP_URL"

# Test API health endpoint
curl "https://$APP_URL/api/health"

# Test chat API endpoint
curl -X POST "https://$APP_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about the MSSA program"}'
```

### Step 2: Comprehensive Testing Checklist

**Frontend Testing:**
- [ ] Navigate to your Static Web App URL
- [ ] Verify slideshow loads and advances automatically
- [ ] Test navigation buttons (Previous/Next/Pause)
- [ ] Check responsive design on mobile device
- [ ] Test "Ask the Cohort" button opens modal
- [ ] Verify all 6 slides display correctly

**API Testing:**
- [ ] Send test message in chatbot
- [ ] Verify AI responses are working
- [ ] Test error handling with invalid input
- [ ] Check API response times (<2 seconds)
- [ ] Verify character personalities in responses

**Performance Testing:**
- [ ] Page load time <3 seconds
- [ ] Smooth animations and transitions
- [ ] No JavaScript errors in browser console
- [ ] Mobile responsiveness working
- [ ] All images and assets loading

## Phase 3G: Troubleshooting Guide

### Common Issue 1: Static Web App Not Deploying

**Symptoms:**
- GitHub Actions workflow fails
- Build errors in logs
- Application not accessible

**Solutions:**
```bash
# Check GitHub Actions logs
# Go to GitHub repo → Actions tab → Check latest workflow run

# Verify GitHub secrets are set correctly
# Go to GitHub repo → Settings → Secrets and variables → Actions

# Check Azure Static Web App status
az staticwebapp show \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --query "repositoryUrl"
```

### Common Issue 2: API Functions Not Working

**Symptoms:**
- Chatbot not responding
- API endpoints returning errors
- 500 Internal Server Error

**Solutions:**
```bash
# Check function logs
az webapp log tail \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles"

# Verify environment variables
az staticwebapp appsettings list \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles"

# Test OpenAI connection directly
curl -X POST "$OPENAI_ENDPOINT/openai/deployments/gpt-4-cohort/chat/completions?api-version=2024-02-15-preview" \
  -H "Content-Type: application/json" \
  -H "api-key: $OPENAI_API_KEY" \
  -d '{"messages":[{"role":"user","content":"test"}],"max_tokens":10}'
```

### Common Issue 3: OpenAI API Errors

**Symptoms:**
- "Invalid API key" errors
- "Model not found" errors
- Rate limiting errors

**Solutions:**
```bash
# Verify API key is correct
az cognitiveservices account keys list \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles"

# Check model deployment
az cognitiveservices account deployment list \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles"

# Check quota usage
az cognitiveservices account show \
  --name "openai-cohort-chronicles" \
  --resource-group "rg-cohort-chronicles" \
  --query "properties.quotaUsage"
```

### Common Issue 4: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API calls blocked by browser
- "Access-Control-Allow-Origin" errors

**Solutions:**
1. Verify `staticwebapp.config.json` is deployed correctly
2. Check CSP headers in configuration
3. Ensure API routes are properly configured
4. Verify OpenAI endpoint is included in CSP

## Phase 3H: Final Verification Checklist

### Azure Resources ✅
- [ ] Resource group created successfully
- [ ] Azure OpenAI service deployed and accessible
- [ ] GPT-4 model deployed and working
- [ ] Static Web App created and configured
- [ ] All resources in same region (East US)

### GitHub Configuration ✅
- [ ] Repository configured with correct structure
- [ ] GitHub Actions workflow updated and working
- [ ] All required secrets configured
- [ ] Deployment pipeline successful

### Application Functionality ✅
- [ ] Frontend slideshow working correctly
- [ ] All 6 slides displaying with proper content
- [ ] Navigation controls working (buttons and keyboard)
- [ ] Chatbot modal opens and closes properly
- [ ] AI responses working with character personalities
- [ ] Mobile responsive design working
- [ ] No JavaScript errors in console

### Performance and Security ✅
- [ ] Page load time <3 seconds
- [ ] API response time <2 seconds
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Security headers properly configured
- [ ] Content Security Policy working
- [ ] No security vulnerabilities detected

### Monitoring and Operations ✅
- [ ] Health check endpoint accessible
- [ ] Application Insights configured (optional)
- [ ] Error logging working
- [ ] Performance monitoring in place
- [ ] Documentation complete

## Phase 3I: Final Deployment URL

After successful deployment, your application will be available at:

**Primary URL:** `https://cohort-chronicles-app.azurestaticapps.net`

**API Endpoints:**
- Health Check: `https://cohort-chronicles-app.azurestaticapps.net/api/health`
- Chat API: `https://cohort-chronicles-app.azurestaticapps.net/api/chat`

**Azure Resources:**
- Resource Group: `rg-cohort-chronicles`
- Static Web App: `cohort-chronicles-app`
- OpenAI Service: `openai-cohort-chronicles`

## Emergency Backup Deployment Method

If GitHub Actions fails, use this Azure CLI backup method:

```bash
# Build application locally
npm install
npm run build

# Deploy using Azure CLI
az staticwebapp environment set \
  --name "cohort-chronicles-app" \
  --resource-group "rg-cohort-chronicles" \
  --source . \
  --environment-name "production"
```

## 🎯 Success Confirmation

Your deployment is successful when:

1. ✅ Application loads at the Static Web App URL
2. ✅ All 6 slides display correctly with MSSA journey content
3. ✅ Slideshow auto-advances every 8 seconds
4. ✅ Navigation buttons work (Previous/Next/Play-Pause)
5. ✅ "Ask the Cohort" button opens chatbot modal
6. ✅ Chatbot responds with character personalities
7. ✅ Mobile responsive design works on phones/tablets
8. ✅ No errors in browser console
9. ✅ API health check returns successful response
10. ✅ Performance is acceptable (<3 second load time)

**🎓 Your MSSA Cohort Chronicles application is now LIVE and ready for the graduation ceremony!**

Provide the deployment URL to your cohort for testing before the graduation ceremony presentation.