# Cohort Chronicles API

Azure Functions API for the Cohort Chronicles chatbot backend, integrating with Azure OpenAI Service.

## Setup

### Prerequisites

- Node.js 18+ 
- Azure Functions Core Tools v4
- Azure OpenAI Service resource

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Copy environment configuration:
```bash
cp .env.example .env
```

3. Update `local.settings.json` with your Azure OpenAI credentials:
```json
{
  "Values": {
    "AZURE_OPENAI_ENDPOINT": "https://your-resource.openai.azure.com/",
    "AZURE_OPENAI_API_KEY": "your-api-key",
    "AZURE_OPENAI_DEPLOYMENT_NAME": "your-deployment-name"
  }
}
```

4. Start the local development server:
```bash
func start
```

The API will be available at `http://localhost:7071/api/chat`

## API Endpoints

### POST /api/chat

Send a message to the cohort chatbot.

**Request Body:**
```json
{
  "message": "Tell me about your MSSA experience"
}
```

**Response:**
```json
{
  "message": "We had an incredible 17-week journey...",
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Message is required and must be a string",
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### OPTIONS /api/chat

CORS preflight request handler.

## Configuration

### Environment Variables

- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI resource endpoint
- `AZURE_OPENAI_API_KEY`: API key for authentication
- `AZURE_OPENAI_API_VERSION`: API version (default: 2024-02-15-preview)
- `AZURE_OPENAI_DEPLOYMENT_NAME`: Name of your GPT deployment

### Rate Limiting

The API includes built-in rate limiting and error handling for:
- Azure OpenAI service limits
- Request validation
- Authentication errors
- Service availability

## Deployment

This API is designed to be deployed as part of an Azure Static Web App with integrated Azure Functions.

### Azure Static Web Apps Deployment

1. The API will be automatically deployed when the Static Web App is created
2. Configure environment variables in the Azure portal under Static Web App settings
3. Ensure your Azure OpenAI resource is in the same region for optimal performance

### Manual Azure Functions Deployment

```bash
func azure functionapp publish your-function-app-name
```

## Testing

Run the test suite:
```bash
npm test
```

## Error Handling

The API implements comprehensive error handling for:

- **400 Bad Request**: Invalid message format or length
- **429 Too Many Requests**: Rate limiting from Azure OpenAI
- **503 Service Unavailable**: Configuration or authentication issues
- **500 Internal Server Error**: Unexpected errors

All errors return a consistent JSON format with error message and timestamp.

## Security

- CORS enabled for web app integration
- Input validation and sanitization
- Rate limiting protection
- Secure API key management through Azure App Settings
- No persistent storage of conversation data