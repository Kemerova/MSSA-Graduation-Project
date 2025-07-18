# Security Configuration Guide

## Overview

This document outlines the security measures implemented for the Cohort Chronicles application, including Azure services configuration, API security, and client-side protection.

## Security Features Implemented

### 1. Azure OpenAI Service Security

- **Managed Identity**: Preferred authentication method for production
- **API Key Rotation**: Automated key rotation every 90 days
- **Network Restrictions**: Firewall rules to limit access to specific IP ranges
- **Rate Limiting**: Built-in Azure OpenAI rate limiting plus application-level controls

### 2. Azure App Configuration Security

- **Secure Storage**: API keys and sensitive configuration stored as secrets
- **Access Control**: Role-based access control (RBAC) for configuration access
- **Connection String Security**: Secure connection strings with minimal permissions
- **Configuration Caching**: 5-minute TTL to reduce API calls while maintaining security

### 3. API Security Measures

#### Rate Limiting
- **Default Limits**: 10 requests per minute per client
- **Client Identification**: IP address + User-Agent fingerprinting
- **Sliding Window**: 60-second sliding window for rate calculations
- **Configurable**: Limits adjustable via Azure App Configuration

#### Input Validation
- **Message Length**: Maximum 1,000 characters per message
- **History Validation**: Maximum 20 messages in conversation history
- **Content Sanitization**: HTML encoding and XSS prevention
- **Suspicious Pattern Detection**: Blocks script injection attempts

#### CORS Configuration
- **Restricted Origins**: Only allows specific domains (no wildcard in production)
- **Preflight Handling**: Proper OPTIONS request handling
- **Credential Restrictions**: Credentials not allowed for security

### 4. Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://*.openai.azure.com https://*.azurestaticapps.net;
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

### 5. HTTP Security Headers

- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `DENY` - Prevents clickjacking attacks
- **X-XSS-Protection**: `1; mode=block` - Enables XSS filtering
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains` - Enforces HTTPS
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information
- **Permissions-Policy**: Restricts access to sensitive browser APIs

## Configuration Requirements

### Environment Variables (Production)

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-openai-service.openai.azure.com/
AZURE_OPENAI_API_KEY=your-secure-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Azure App Configuration
APP_CONFIG_CONNECTION_STRING=Endpoint=https://your-config.azconfig.io;Id=xxx;Secret=xxx
APP_CONFIG_ENDPOINT=https://your-config.azconfig.io

# Security Configuration (via App Configuration)
Security:RateLimit:Max=10
Security:RateLimit:Window=60000
Security:MaxMessageLength=1000
Security:AllowedOrigins=https://your-domain.com,https://your-staging.com
```

### Azure App Configuration Keys

| Key | Description | Example Value |
|-----|-------------|---------------|
| `OpenAI:Endpoint` | Azure OpenAI service endpoint | `https://service.openai.azure.com/` |
| `OpenAI:ApiKey` | Azure OpenAI API key (secret) | `your-api-key` |
| `OpenAI:DeploymentName` | Model deployment name | `gpt-35-turbo` |
| `OpenAI:ApiVersion` | API version | `2024-02-15-preview` |
| `Security:RateLimit:Max` | Max requests per window | `10` |
| `Security:RateLimit:Window` | Rate limit window (ms) | `60000` |
| `Security:MaxMessageLength` | Max message length | `1000` |
| `Security:AllowedOrigins` | Allowed CORS origins | `https://domain.com` |

## Security Best Practices

### 1. API Key Management
- Store API keys in Azure App Configuration as secrets
- Use managed identity when possible
- Rotate keys regularly (every 90 days)
- Monitor key usage and access patterns

### 2. Network Security
- Configure Azure OpenAI firewall rules
- Use Azure Private Endpoints for internal communication
- Implement Azure Front Door for additional protection
- Monitor network traffic and access patterns

### 3. Monitoring and Alerting
- Enable Application Insights for security monitoring
- Set up alerts for rate limit violations
- Monitor for suspicious input patterns
- Track API usage and costs

### 4. Input Validation
- Always validate and sanitize user input
- Implement server-side validation
- Use parameterized queries and safe APIs
- Log security events for analysis

## Incident Response

### Rate Limiting Violations
1. Identify the source IP and user agent
2. Check for legitimate vs. malicious traffic
3. Temporarily block if necessary
4. Adjust rate limits if needed

### Suspicious Input Detection
1. Log the suspicious input and source
2. Block the request immediately
3. Analyze patterns for potential attacks
4. Update validation rules if necessary

### API Key Compromise
1. Immediately rotate the compromised key
2. Update all applications with new key
3. Monitor for unauthorized usage
4. Review access logs for breach extent

## Testing Security Measures

### Rate Limiting Tests
```bash
# Test rate limiting with curl
for i in {1..15}; do
  curl -X POST https://your-api.com/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"test"}' \
    -w "Status: %{http_code}\n"
done
```

### Input Validation Tests
```bash
# Test XSS prevention
curl -X POST https://your-api.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"<script>alert(\"xss\")</script>"}'

# Test message length limits
curl -X POST https://your-api.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"'$(python -c "print('a' * 2000)")'"}'
```

### CORS Tests
```bash
# Test CORS with unauthorized origin
curl -X POST https://your-api.com/api/chat \
  -H "Origin: https://malicious-site.com" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

## Compliance Considerations

### GDPR Compliance
- No persistent storage of user conversations
- Minimal data collection and processing
- Clear privacy policy and data handling procedures
- User consent mechanisms where required

### Security Standards
- Follows OWASP security guidelines
- Implements defense in depth strategy
- Regular security assessments and updates
- Secure development lifecycle practices

## Maintenance Schedule

### Weekly
- Review security logs and alerts
- Check for failed authentication attempts
- Monitor rate limiting effectiveness

### Monthly
- Update security configurations
- Review and test incident response procedures
- Analyze security metrics and trends

### Quarterly
- Rotate API keys and secrets
- Conduct security assessments
- Update security documentation
- Review and update security policies