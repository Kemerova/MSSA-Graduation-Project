// Azure Functions - Health Check Endpoint
// Provides health status and system information for monitoring

const appConfig = require('./config/appConfig');

module.exports = async function (context, req) {
    const startTime = Date.now();
    
    // Set security headers
    context.res.headers = {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    try {
        // Basic health checks
        const healthChecks = {
            timestamp: new Date().toISOString(),
            status: 'healthy',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            checks: {}
        };

        // Check OpenAI configuration
        try {
            const openaiConfig = await appConfig.getOpenAIConfig();
            healthChecks.checks.openai = {
                status: openaiConfig.endpoint && openaiConfig.apiKey ? 'healthy' : 'unhealthy',
                hasEndpoint: !!openaiConfig.endpoint,
                hasApiKey: !!openaiConfig.apiKey,
                hasDeploymentName: !!openaiConfig.deploymentName
            };
        } catch (error) {
            healthChecks.checks.openai = {
                status: 'unhealthy',
                error: 'Configuration check failed'
            };
        }

        // Check App Configuration service
        try {
            await appConfig.getConfiguration('test', 'default');
            healthChecks.checks.appConfig = {
                status: 'healthy',
                message: 'App Configuration accessible'
            };
        } catch (error) {
            healthChecks.checks.appConfig = {
                status: 'degraded',
                message: 'Using environment variables fallback'
            };
        }

        // Calculate response time
        healthChecks.responseTime = Date.now() - startTime;

        // Determine overall status
        const unhealthyChecks = Object.values(healthChecks.checks)
            .filter(check => check.status === 'unhealthy');
        
        if (unhealthyChecks.length > 0) {
            healthChecks.status = 'unhealthy';
            context.res.status = 503;
        } else {
            const degradedChecks = Object.values(healthChecks.checks)
                .filter(check => check.status === 'degraded');
            
            if (degradedChecks.length > 0) {
                healthChecks.status = 'degraded';
            }
        }

        context.res = {
            status: context.res.status || 200,
            headers: context.res.headers,
            body: healthChecks
        };

    } catch (error) {
        context.log.error('Health check failed:', error);
        
        context.res = {
            status: 503,
            headers: context.res.headers,
            body: {
                timestamp: new Date().toISOString(),
                status: 'unhealthy',
                error: 'Health check failed',
                responseTime: Date.now() - startTime
            }
        };
    }
};