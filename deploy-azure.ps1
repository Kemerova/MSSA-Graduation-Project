# Quick Azure Deployment Script
# Run this in PowerShell

Write-Host "🚀 Deploying Cohort Chronicles to Azure..." -ForegroundColor Green

# Check if Azure CLI is installed
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Please install from: https://aka.ms/installazurecliwindows" -ForegroundColor Yellow
    exit
}

# Login to Azure
Write-Host "🔐 Logging into Azure..." -ForegroundColor Yellow
az login

# Create resource group
Write-Host "📁 Creating resource group..." -ForegroundColor Yellow
az group create --name "cohort-chronicles-rg" --location "eastus"

# Create static web app
Write-Host "🌐 Creating Static Web App..." -ForegroundColor Yellow
az staticwebapp create `
  --name "cohort-chronicles" `
  --resource-group "cohort-chronicles-rg" `
  --location "eastus" `
  --source "." `
  --app-location "/" `
  --api-location "/api" `
  --output-location "/"

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "Your app will be available at: https://cohort-chronicles.azurestaticapps.net" -ForegroundColor Cyan
Write-Host "Note: It may take a few minutes to become available." -ForegroundColor Yellow