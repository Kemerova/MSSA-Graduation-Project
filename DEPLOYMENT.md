# Azure Static Web Apps Deployment Guide

This document provides step-by-step instructions for deploying the Cohort Chronicles application to Azure Static Web Apps.

## Prerequisites

- Azure subscription
- GitHub account
- Azure CLI (optional, for advanced configuration)
- Node.js 18+ (for local development)

## Deployment Configuration

### 1. Static Web App Configuration

The application uses `staticwebapp.config.json` for routing and configuration:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "platform": {
    "apiRuntime": "node:18"
  }
}
```

### 2. GitHub Actions Workflow

The deployment is automated using GitHub Actions (`.github/workflows/azure-static-web-apps-deploy.yml`):

- **Triggers**: Push to main branch, Pull requests
- **Build Process**: 
  - Install dependencies
  - Run tests
  - Optimize static assets (minification)
  - Deploy to Azure

### 3. Environment Variables

#### Required GitHub Secrets

Set these secrets in your GitHub repository settings:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Static Web Apps deployment token | `abc123...` |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI service API key | `sk-...` |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI service endpoint | `https://your-resource.openai.azure.com/` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | OpenAI model deployment name | `gpt-4` |

#### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `MINIFY_ASSETS` | Enable asset minification | `false` |
| `API_ENDPOINT` | API endpoint path | `/api` |

## Step-by-Step Deployment

### Step 1: Create Azure Static Web App

1. **Using Azure Portal:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"

2. **Configuration:**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or select existing
   - **Name**: `cohort-chronicles` (or your preferred name)
   - **Plan Type**: Free (for development) or Standard (for production)
   - **Region**: Choose closest to your users
   - **Source**: GitHub
   - **GitHub Account**: Authenticate with GitHub
   - **Organization**: Your GitHub username/organization
   - **Repository**: Select your repository
   - **Branch**: `main`

3. **Build Configuration:**
   - **Build Presets**: Custom
   - **App Location**: `/`
   - **Api Location**: `api`
   - **Output Location**: `` (empty)

4. Click "Review + Create" then "Create"

### Step 2: Configure GitHub Repository

1. **Add Secrets:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Add the required secrets listed above

2. **Verify Workflow:**
   - Check `.github/workflows/azure-static-web-apps-deploy.yml` exists
   - Ensure the workflow file matches your Azure Static Web App configuration

### Step 3: Configure Azure OpenAI Service

1. **Create Azure OpenAI Resource:**
   - In Azure Portal, create an "Azure OpenAI" resource
   - Note the endpoint URL and API key
   - Deploy a model (GPT-4 or GPT-3.5-turbo recommended)

2. **Update GitHub Secrets:**
   - Add the OpenAI endpoint, API key, and deployment name to GitHub secrets

### Step 4: Deploy

1. **Automatic Deployment:**
   - Push changes to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Monitor the deployment in the Actions tab

2. **Manual Deployment:**
   - Go to GitHub Actions
   - Select the workflow
   - Click "Run workflow"

## Build Process

### Local Development

```bash
# Install dependencies
cd api && npm install

# Start local development
npm start

# Run tests
npm test

# Build for production
NODE_ENV=production MINIFY_ASSETS=true node build.js
```

### Production Build

The GitHub Actions workflow automatically:

1. **Installs dependencies** for the API
2. **Runs tests** to ensure code quality
3. **Optimizes assets**:
   - Minifies CSS using clean-css-cli
   - Minifies JavaScript using terser
4. **Builds the application** using the build script
5. **Deploys to Azure** using the Static Web Apps deploy action

## Asset Optimization

### CSS Minification
- Original: `styles.css`
- Minified: `styles.min.css`
- Tool: clean-css-cli

### JavaScript Minification
- Original: `script.js`
- Minified: `script.min.js`
- Tool: terser with compression and mangling

### Build Configuration
The `build.js` script handles:
- Asset copying and optimization
- Environment variable injection
- HTML processing for production
- Configuration file generation

## Monitoring and Troubleshooting

### Application Insights (Optional)

Add Application Insights for monitoring:

1. Create Application Insights resource in Azure
2. Add `APPINSIGHTS_INSTRUMENTATIONKEY` to GitHub secrets
3. The application will automatically send telemetry

### Common Issues

#### 1. Deployment Fails
- **Check GitHub Secrets**: Ensure all required secrets are set
- **Verify API Token**: The Azure Static Web Apps API token should be valid
- **Review Logs**: Check GitHub Actions logs for specific errors

#### 2. API Not Working
- **OpenAI Configuration**: Verify endpoint, API key, and deployment name
- **CORS Issues**: Check Azure Static Web Apps CORS settings
- **Function Runtime**: Ensure Node.js 18 is specified in configuration

#### 3. Assets Not Loading
- **Build Process**: Check if minification completed successfully
- **File Paths**: Verify asset paths in HTML match deployed files
- **Cache Issues**: Clear browser cache or check cache headers

### Debugging Commands

```bash
# Check deployment status
az staticwebapp show --name cohort-chronicles --resource-group your-rg

# View application logs
az staticwebapp logs show --name cohort-chronicles --resource-group your-rg

# Test API locally
cd api && func start
```

## Security Considerations

### Content Security Policy
The application includes security headers in `staticwebapp.config.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### API Security
- API endpoints are configured to allow anonymous access for the chatbot
- Input validation is implemented in the Azure Functions
- Rate limiting is handled by Azure Static Web Apps

### Environment Variables
- Sensitive data is stored in GitHub Secrets
- API keys are not exposed in client-side code
- Environment-specific configuration is handled securely

## Performance Optimization

### Static Assets
- CSS and JavaScript are minified in production
- Images are optimized and served with appropriate cache headers
- CDN distribution through Azure Static Web Apps

### API Performance
- Azure Functions provide serverless scaling
- Connection pooling for OpenAI API calls
- Efficient error handling and retry logic

## Custom Domain (Optional)

To use a custom domain:

1. **In Azure Portal:**
   - Go to your Static Web App
   - Navigate to "Custom domains"
   - Click "Add"
   - Enter your domain name

2. **DNS Configuration:**
   - Add CNAME record pointing to your Static Web App URL
   - Verify domain ownership

3. **SSL Certificate:**
   - Azure automatically provisions SSL certificates
   - Certificate renewal is handled automatically

## Backup and Recovery

### Source Code
- Code is stored in GitHub repository
- All configuration is version controlled
- Deployment history is available in GitHub Actions

### Data
- No persistent data is stored in the application
- Chat conversations are not persisted
- Configuration can be restored from repository

## Support and Maintenance

### Regular Updates
- Monitor Azure service updates
- Update Node.js dependencies regularly
- Review security advisories

### Monitoring
- Set up Azure Monitor alerts
- Monitor GitHub Actions for failed deployments
- Track application performance metrics

For additional support, refer to:
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure OpenAI Service Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)