# Azure Services Setup Guide

## Azure OpenAI Service Configuration

### 1. Create Azure OpenAI Resource

```bash
# Create resource group (if not exists)
az group create --name cohort-chronicles-rg --location eastus

# Create Azure OpenAI service
az cognitiveservices account create \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --location eastus \
  --kind OpenAI \
  --sku S0 \
  --subscription <your-subscription-id>
```

### 2. Deploy GPT Model

```bash
# Deploy GPT-3.5-turbo model
az cognitiveservices account deployment create \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --deployment-name gpt-35-turbo \
  --model-name gpt-35-turbo \
  --model-version "0613" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard
```

### 3. Get Service Endpoint and Keys

```bash
# Get endpoint
az cognitiveservices account show \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --query "properties.endpoint" \
  --output tsv

# Get API key
az cognitiveservices account keys list \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --query "key1" \
  --output tsv
```

## Azure App Configuration Setup

### 1. Create App Configuration Store

```bash
# Create App Configuration resource
az appconfig create \
  --name cohort-chronicles-config \
  --resource-group cohort-chronicles-rg \
  --location eastus \
  --sku Standard
```

### 2. Store Secure Configuration

```bash
# Store OpenAI configuration securely
az appconfig kv set \
  --name cohort-chronicles-config \
  --key "OpenAI:Endpoint" \
  --value "<your-openai-endpoint>" \
  --content-type "text/plain"

az appconfig kv set \
  --name cohort-chronicles-config \
  --key "OpenAI:ApiKey" \
  --value "<your-openai-api-key>" \
  --content-type "text/plain" \
  --secret

az appconfig kv set \
  --name cohort-chronicles-config \
  --key "OpenAI:DeploymentName" \
  --value "gpt-35-turbo" \
  --content-type "text/plain"

az appconfig kv set \
  --name cohort-chronicles-config \
  --key "OpenAI:ApiVersion" \
  --value "2024-02-15-preview" \
  --content-type "text/plain"
```

### 3. Configure Managed Identity Access

```bash
# Get App Configuration connection string
az appconfig credential list \
  --name cohort-chronicles-config \
  --resource-group cohort-chronicles-rg \
  --query "[?name=='Primary'].connectionString" \
  --output tsv
```

## Azure Static Web Apps Configuration

### 1. Environment Variables Setup

In Azure Portal > Static Web Apps > Configuration, add:

- `AZURE_OPENAI_ENDPOINT`: Your OpenAI service endpoint
- `AZURE_OPENAI_API_KEY`: Your OpenAI API key (mark as secret)
- `AZURE_OPENAI_DEPLOYMENT_NAME`: gpt-35-turbo
- `AZURE_OPENAI_API_VERSION`: 2024-02-15-preview
- `APP_CONFIG_CONNECTION_STRING`: Your App Configuration connection string

### 2. Custom Domain and SSL

```bash
# Add custom domain (optional)
az staticwebapp hostname set \
  --name cohort-chronicles \
  --hostname your-custom-domain.com
```

## Security Best Practices

1. **API Key Rotation**: Set up automated key rotation every 90 days
2. **Network Security**: Configure firewall rules to restrict access
3. **Monitoring**: Enable Application Insights for security monitoring
4. **Compliance**: Ensure GDPR compliance for EU users

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify API keys and endpoints
2. **Rate Limiting**: Check quota usage in Azure portal
3. **CORS Issues**: Verify Static Web Apps configuration
4. **SSL Certificate**: Ensure proper certificate configuration

### Monitoring Commands

```bash
# Check OpenAI service status
az cognitiveservices account show \
  --name cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --query "properties.provisioningState"

# Monitor API usage
az monitor metrics list \
  --resource cohort-chronicles-openai \
  --resource-group cohort-chronicles-rg \
  --resource-type Microsoft.CognitiveServices/accounts \
  --metric "TotalCalls"
```