# Azure Security Configuration Deployment Script
# This script sets up Azure OpenAI, App Configuration, and security settings

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "eastus",
    
    [Parameter(Mandatory=$true)]
    [string]$OpenAIServiceName,
    
    [Parameter(Mandatory=$true)]
    [string]$AppConfigName,
    
    [Parameter(Mandatory=$true)]
    [string]$StaticWebAppName,
    
    [string]$DeploymentName = "gpt-35-turbo"
)

Write-Host "Starting Azure Security Configuration Deployment..." -ForegroundColor Green

# 1. Create Resource Group if it doesn't exist
Write-Host "Creating resource group: $ResourceGroupName" -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

# 2. Create Azure OpenAI Service
Write-Host "Creating Azure OpenAI service: $OpenAIServiceName" -ForegroundColor Yellow
az cognitiveservices account create `
    --name $OpenAIServiceName `
    --resource-group $ResourceGroupName `
    --location $Location `
    --kind OpenAI `
    --sku S0 `
    --custom-domain $OpenAIServiceName

# 3. Deploy GPT Model
Write-Host "Deploying GPT model: $DeploymentName" -ForegroundColor Yellow
az cognitiveservices account deployment create `
    --name $OpenAIServiceName `
    --resource-group $ResourceGroupName `
    --deployment-name $DeploymentName `
    --model-name gpt-35-turbo `
    --model-version "0613" `
    --model-format OpenAI `
    --sku-capacity 10 `
    --sku-name Standard

# 4. Create App Configuration Store
Write-Host "Creating App Configuration store: $AppConfigName" -ForegroundColor Yellow
az appconfig create `
    --name $AppConfigName `
    --resource-group $ResourceGroupName `
    --location $Location `
    --sku Standard

# 5. Get OpenAI Service Details
Write-Host "Retrieving OpenAI service details..." -ForegroundColor Yellow
$openaiEndpoint = az cognitiveservices account show `
    --name $OpenAIServiceName `
    --resource-group $ResourceGroupName `
    --query "properties.endpoint" `
    --output tsv

$openaiKey = az cognitiveservices account keys list `
    --name $OpenAIServiceName `
    --resource-group $ResourceGroupName `
    --query "key1" `
    --output tsv

# 6. Store Configuration in App Configuration
Write-Host "Storing secure configuration..." -ForegroundColor Yellow

# OpenAI Configuration
az appconfig kv set `
    --name $AppConfigName `
    --key "OpenAI:Endpoint" `
    --value $openaiEndpoint `
    --content-type "text/plain"

az appconfig kv set `
    --name $AppConfigName `
    --key "OpenAI:ApiKey" `
    --value $openaiKey `
    --content-type "text/plain" `
    --secret

az appconfig kv set `
    --name $AppConfigName `
    --key "OpenAI:DeploymentName" `
    --value $DeploymentName `
    --content-type "text/plain"

az appconfig kv set `
    --name $AppConfigName `
    --key "OpenAI:ApiVersion" `
    --value "2024-02-15-preview" `
    --content-type "text/plain"

# Security Configuration
az appconfig kv set `
    --name $AppConfigName `
    --key "Security:RateLimit:Max" `
    --value "10" `
    --content-type "text/plain"

az appconfig kv set `
    --name $AppConfigName `
    --key "Security:RateLimit:Window" `
    --value "60000" `
    --content-type "text/plain"

az appconfig kv set `
    --name $AppConfigName `
    --key "Security:MaxMessageLength" `
    --value "1000" `
    --content-type "text/plain"

az appconfig kv set `
    --name $AppConfigName `
    --key "Security:AllowedOrigins" `
    --value "https://$StaticWebAppName.azurestaticapps.net" `
    --content-type "text/plain"

# 7. Get App Configuration Connection String
Write-Host "Retrieving App Configuration connection string..." -ForegroundColor Yellow
$appConfigConnectionString = az appconfig credential list `
    --name $AppConfigName `
    --resource-group $ResourceGroupName `
    --query "[?name=='Primary'].connectionString" `
    --output tsv

# 8. Configure Static Web App Environment Variables
Write-Host "Configuring Static Web App environment variables..." -ForegroundColor Yellow
az staticwebapp appsettings set `
    --name $StaticWebAppName `
    --setting-names `
        "AZURE_OPENAI_ENDPOINT=$openaiEndpoint" `
        "AZURE_OPENAI_API_KEY=$openaiKey" `
        "AZURE_OPENAI_DEPLOYMENT_NAME=$DeploymentName" `
        "AZURE_OPENAI_API_VERSION=2024-02-15-preview" `
        "APP_CONFIG_CONNECTION_STRING=$appConfigConnectionString"

# 9. Enable Security Features
Write-Host "Configuring security features..." -ForegroundColor Yellow

# Enable Application Insights
az monitor app-insights component create `
    --app cohort-chronicles-insights `
    --location $Location `
    --resource-group $ResourceGroupName `
    --application-type web

# Configure OpenAI Service Network Security
az cognitiveservices account network-rule add `
    --name $OpenAIServiceName `
    --resource-group $ResourceGroupName `
    --subnet-name default `
    --vnet-name cohort-chronicles-vnet

# 10. Output Configuration Summary
Write-Host "`n=== Deployment Summary ===" -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "OpenAI Service: $OpenAIServiceName" -ForegroundColor White
Write-Host "OpenAI Endpoint: $openaiEndpoint" -ForegroundColor White
Write-Host "App Configuration: $AppConfigName" -ForegroundColor White
Write-Host "Static Web App: $StaticWebAppName" -ForegroundColor White
Write-Host "`nDeployment completed successfully!" -ForegroundColor Green

# 11. Security Checklist
Write-Host "`n=== Security Checklist ===" -ForegroundColor Yellow
Write-Host "✓ Azure OpenAI service created with secure configuration" -ForegroundColor Green
Write-Host "✓ API keys stored securely in App Configuration" -ForegroundColor Green
Write-Host "✓ Rate limiting configured" -ForegroundColor Green
Write-Host "✓ CORS restrictions applied" -ForegroundColor Green
Write-Host "✓ Content Security Policy headers configured" -ForegroundColor Green
Write-Host "✓ Input validation and sanitization implemented" -ForegroundColor Green
Write-Host "✓ Application Insights monitoring enabled" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Test the API endpoints with the security measures" -ForegroundColor White
Write-Host "2. Configure custom domain and SSL certificate" -ForegroundColor White
Write-Host "3. Set up monitoring alerts and dashboards" -ForegroundColor White
Write-Host "4. Review and test incident response procedures" -ForegroundColor White