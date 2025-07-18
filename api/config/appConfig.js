// Azure App Configuration Service
// Secure configuration management with fallback to environment variables

const { AppConfigurationClient } = require('@azure/app-configuration');
const { DefaultAzureCredential } = require('@azure/identity');

class AppConfigService {
    constructor() {
        this.client = null;
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.cacheTTL = 5 * 60 * 1000; // 5 minutes cache TTL
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Try to initialize with connection string first
            const connectionString = process.env.APP_CONFIG_CONNECTION_STRING;
            
            if (connectionString) {
                this.client = new AppConfigurationClient(connectionString);
                console.log('App Configuration initialized with connection string');
            } else {
                // Fallback to managed identity (for production)
                const endpoint = process.env.APP_CONFIG_ENDPOINT;
                if (endpoint) {
                    const credential = new DefaultAzureCredential();
                    this.client = new AppConfigurationClient(endpoint, credential);
                    console.log('App Configuration initialized with managed identity');
                }
            }

            this.initialized = true;
        } catch (error) {
            console.warn('Failed to initialize App Configuration:', error.message);
            console.log('Falling back to environment variables');
        }
    }

    async getConfiguration(key, defaultValue = null) {
        await this.initialize();

        // Check cache first
        const cacheKey = `config:${key}`;
        const cached = this.cache.get(cacheKey);
        const expiry = this.cacheExpiry.get(cacheKey);

        if (cached && expiry && Date.now() < expiry) {
            return cached;
        }

        let value = defaultValue;

        try {
            if (this.client) {
                // Try to get from App Configuration
                const setting = await this.client.getConfigurationSetting({ key });
                value = setting.value;
                
                // Cache the result
                this.cache.set(cacheKey, value);
                this.cacheExpiry.set(cacheKey, Date.now() + this.cacheTTL);
            }
        } catch (error) {
            console.warn(`Failed to get configuration for ${key}:`, error.message);
        }

        // Fallback to environment variables
        if (value === null || value === undefined) {
            const envKey = key.replace(/[:.]/g, '_').toUpperCase();
            value = process.env[envKey] || defaultValue;
        }

        return value;
    }

    async getOpenAIConfig() {
        const [endpoint, apiKey, deploymentName, apiVersion] = await Promise.all([
            this.getConfiguration('OpenAI:Endpoint', process.env.AZURE_OPENAI_ENDPOINT),
            this.getConfiguration('OpenAI:ApiKey', process.env.AZURE_OPENAI_API_KEY),
            this.getConfiguration('OpenAI:DeploymentName', process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-35-turbo'),
            this.getConfiguration('OpenAI:ApiVersion', process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview')
        ]);

        return {
            endpoint,
            apiKey,
            deploymentName,
            apiVersion
        };
    }

    async getSecurityConfig() {
        const [rateLimitMax, rateLimitWindow, maxMessageLength, allowedOrigins] = await Promise.all([
            this.getConfiguration('Security:RateLimit:Max', '10'),
            this.getConfiguration('Security:RateLimit:Window', '60000'),
            this.getConfiguration('Security:MaxMessageLength', '1000'),
            this.getConfiguration('Security:AllowedOrigins', '*')
        ]);

        return {
            rateLimit: {
                max: parseInt(rateLimitMax, 10),
                windowMs: parseInt(rateLimitWindow, 10)
            },
            maxMessageLength: parseInt(maxMessageLength, 10),
            allowedOrigins: allowedOrigins.split(',').map(origin => origin.trim())
        };
    }

    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
}

// Export singleton instance
module.exports = new AppConfigService();