# Azure Deployment Guide - The Cohort Chronicles

## 🎯 Deploy to Azure Static Web Apps (Recommended)

### **Step 1: Prepare Your Files**

Make sure you have these files ready:
- `index.html` (main application)
- `script.js` (JavaScript functionality) 
- `styles.css` (styling)
- `package.json` (project configuration)
- `api/` folder (your Azure Functions)

### **Step 2: Deploy via Azure Portal**

1. **Go to Azure Portal** (portal.azure.com)
2. **Create Resource** → Search "Static Web Apps"
3. **Click "Create"**

**Configuration:**
- **Subscription:** Your Azure subscription
- **Resource Group:** Create new or use existing
- **Name:** `cohort-chronicles` (or your preferred name)
- **Plan Type:** Free (perfect for this project)
- **Region:** Choose closest to your audience
- **Source:** GitHub (recommended) or Other

### **Step 3: GitHub Deployment (Easiest)**

If using GitHub:
1. **Connect to GitHub** → Select your repository
2. **Build Presets:** Choose "Custom"
3. **App Location:** `/` (root folder)
4. **API Location:** `/api` (your Azure Functions folder)
5. **Output Location:** `/` (since no build process needed)

### **Step 4: Manual Deployment (Alternative)**

If not using GitHub:
1. **Choose "Other" as source**
2. **Download deployment token** from the portal
3. **Use Azure CLI or VS Code extension**

## 🔧 **Azure CLI Deployment**

```bash
# Install Azure CLI if not already installed
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login to Azure
az login

# Create resource group (if needed)
az group create --name cohort-chronicles-rg --location eastus

# Create static web app
az staticwebapp create \
  --name cohort-chronicles \
  --resource-group cohort-chronicles-rg \
  --location eastus \
  --source https://github.com/yourusername/your-repo \
  --branch main \
  --app-location "/" \
  --api-location "/api" \
  --output-location "/"
```

## 🌐 **VS Code Extension (Easiest)**

1. **Install Extension:** "Azure Static Web Apps" in VS Code
2. **Sign in to Azure** in VS Code
3. **Right-click your project folder**
4. **Select "Create Static Web App..."**
5. **Follow the prompts**

## ⚙️ **Configuration Files**

### **staticwebapp.config.json** (Optional but recommended)
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
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html"
    }
  },
  "globalHeaders": {
    "Cache-Control": "public, max-age=31536000"
  }
}
```

### **package.json** (Make sure this exists)
```json
{
  "name": "cohort-chronicles",
  "version": "1.0.0",
  "description": "MSSA Graduation Story - Lock, Stock, and Two Smoking Servers",
  "main": "index.html",
  "scripts": {
    "start": "http-server -p 8000",
    "build": "echo 'No build process needed'",
    "test": "echo 'Tests would go here'"
  },
  "keywords": ["MSSA", "graduation", "military", "veterans", "Azure"],
  "author": "MSSA Cohort - Lock, Stock, and Two Smoking Servers",
  "license": "MIT"
}
```

## 🔑 **Environment Variables & API Configuration**

### **For Azure Functions API:**
1. **Go to your Static Web App** in Azure Portal
2. **Configuration** → **Application Settings**
3. **Add these settings:**

```
OPENAI_API_KEY=your_openai_api_key_here
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_key
```

### **API Folder Structure:**
```
api/
├── chat/
│   ├── function.json
│   └── index.js
├── host.json
├── package.json
└── local.settings.json
```

## 🚀 **Quick Deploy Commands**

### **Option A: GitHub Actions (Automatic)**
When you push to GitHub, it automatically deploys!

### **Option B: Azure CLI**
```bash
# Deploy from local folder
az staticwebapp deploy \
  --name cohort-chronicles \
  --resource-group cohort-chronicles-rg \
  --source .
```

### **Option C: VS Code**
1. Open project in VS Code
2. Azure extension → Static Web Apps
3. Right-click your app → "Deploy to Static Web App"

## 🌍 **Custom Domain (Optional)**

1. **Buy domain** (GoDaddy, Namecheap, etc.)
2. **Azure Portal** → Your Static Web App → **Custom Domains**
3. **Add custom domain** → Follow DNS setup instructions
4. **Enable HTTPS** (automatic with Azure)

## 📊 **Monitoring & Analytics**

### **Built-in Analytics:**
- Azure Portal → Your Static Web App → **Analytics**
- View traffic, performance, errors

### **Application Insights (Optional):**
```html
<!-- Add to index.html <head> -->
<script>
!function(T,l,y){/* Application Insights code */}
</script>
```

## 🔒 **Security & Performance**

### **Automatic Features:**
- ✅ HTTPS enabled by default
- ✅ Global CDN distribution
- ✅ DDoS protection
- ✅ Automatic scaling

### **Additional Security:**
```json
// In staticwebapp.config.json
{
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
  }
}
```

## 🎯 **Final Steps After Deployment**

1. **Test your live URL** (provided by Azure)
2. **Test the chatbot API** (make sure it connects)
3. **Test on mobile devices**
4. **Share URL with your cohort** for testing
5. **Create QR code** for graduation ceremony

## 📱 **QR Code for Graduation**

Use any QR code generator with your Azure URL:
- qr-code-generator.com
- qrcode.com
- Or Google "QR code generator"

## 🆘 **Troubleshooting**

### **Common Issues:**

**API not working:**
- Check Application Settings in Azure Portal
- Verify API folder structure
- Check function.json configuration

**Site not loading:**
- Check build logs in Azure Portal
- Verify file structure
- Check staticwebapp.config.json

**Slow loading:**
- Enable CDN (automatic with Static Web Apps)
- Optimize images
- Check network tab in browser

## 🎉 **You're Done!**

Your Cohort Chronicles will be live at:
`https://your-app-name.azurestaticapps.net`

Perfect for your MSSA graduation ceremony! 🎓