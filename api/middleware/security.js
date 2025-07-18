// Security Middleware for Azure Functions
// Implements rate limiting, input validation, and XSS prevention

const validator = require('validator');
const appConfig = require('../config/appConfig');

// Rate limiting store (in-memory for simplicity, use Redis for production)
const rateLimitStore = new Map();

class SecurityMiddleware {
    static async validateAndSanitize(req, context) {
        try {
            // Get security configuration
            const securityConfig = await appConfig.getSecurityConfig();
            
            // 1. Rate Limiting
            const clientId = this.getClientIdentifier(req);
            const rateLimitResult = this.checkRateLimit(clientId, securityConfig.rateLimit);
            
            if (!rateLimitResult.allowed) {
                return {
                    isValid: false,
                    error: {
                        status: 429,
                        message: 'Too many requests. Please try again later.',
                        retryAfter: rateLimitResult.retryAfter
                    }
                };
            }

            // 2. CORS Validation
            const corsResult = this.validateCORS(req, securityConfig.allowedOrigins);
            if (!corsResult.allowed) {
                return {
                    isValid: false,
                    error: {
                        status: 403,
                        message: 'Origin not allowed'
                    }
                };
            }

            // 3. Input Validation and Sanitization
            if (req.body && req.body.message) {
                const validationResult = this.validateMessage(req.body.message, securityConfig.maxMessageLength);
                if (!validationResult.isValid) {
                    return {
                        isValid: false,
                        error: {
                            status: 400,
                            message: validationResult.error
                        }
                    };
                }
                
                // Sanitize the message
                req.body.message = this.sanitizeInput(req.body.message);
            }

            // 4. Validate conversation history
            if (req.body && req.body.history) {
                const historyResult = this.validateHistory(req.body.history);
                if (!historyResult.isValid) {
                    return {
                        isValid: false,
                        error: {
                            status: 400,
                            message: historyResult.error
                        }
                    };
                }
                
                // Sanitize history messages
                req.body.history = req.body.history.map(msg => ({
                    ...msg,
                    content: this.sanitizeInput(msg.content)
                }));
            }

            return {
                isValid: true,
                corsHeaders: corsResult.headers
            };

        } catch (error) {
            context.log.error('Security middleware error:', error);
            return {
                isValid: false,
                error: {
                    status: 500,
                    message: 'Security validation failed'
                }
            };
        }
    }

    static getClientIdentifier(req) {
        // Use IP address and User-Agent for rate limiting
        const ip = req.headers['x-forwarded-for'] || 
                  req.headers['x-real-ip'] || 
                  req.connection?.remoteAddress || 
                  'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        return `${ip}:${userAgent.substring(0, 50)}`;
    }

    static checkRateLimit(clientId, rateLimitConfig) {
        const now = Date.now();
        const windowStart = now - rateLimitConfig.windowMs;
        
        // Clean old entries
        for (const [key, timestamps] of rateLimitStore.entries()) {
            const validTimestamps = timestamps.filter(ts => ts > windowStart);
            if (validTimestamps.length === 0) {
                rateLimitStore.delete(key);
            } else {
                rateLimitStore.set(key, validTimestamps);
            }
        }

        // Check current client
        const clientRequests = rateLimitStore.get(clientId) || [];
        const recentRequests = clientRequests.filter(ts => ts > windowStart);

        if (recentRequests.length >= rateLimitConfig.max) {
            const oldestRequest = Math.min(...recentRequests);
            const retryAfter = Math.ceil((oldestRequest + rateLimitConfig.windowMs - now) / 1000);
            
            return {
                allowed: false,
                retryAfter
            };
        }

        // Add current request
        recentRequests.push(now);
        rateLimitStore.set(clientId, recentRequests);

        return { allowed: true };
    }

    static validateCORS(req, allowedOrigins) {
        const origin = req.headers.origin;
        
        // If no origin (same-origin request), allow
        if (!origin) {
            return {
                allowed: true,
                headers: {}
            };
        }

        // Check if origin is allowed
        let isAllowed = false;
        
        if (allowedOrigins.includes('*')) {
            isAllowed = true;
        } else {
            isAllowed = allowedOrigins.some(allowed => {
                if (allowed.includes('*')) {
                    const pattern = allowed.replace(/\*/g, '.*');
                    return new RegExp(`^${pattern}$`).test(origin);
                }
                return allowed === origin;
            });
        }

        if (!isAllowed) {
            return { allowed: false };
        }

        return {
            allowed: true,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            }
        };
    }

    static validateMessage(message, maxLength) {
        // Check if message exists
        if (!message || typeof message !== 'string') {
            return {
                isValid: false,
                error: 'Message is required and must be a string'
            };
        }

        // Check length
        if (message.length > maxLength) {
            return {
                isValid: false,
                error: `Message too long. Maximum ${maxLength} characters allowed.`
            };
        }

        // Check for minimum length
        if (message.trim().length < 1) {
            return {
                isValid: false,
                error: 'Message cannot be empty'
            };
        }

        // Check for suspicious patterns
        const suspiciousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi
        ];

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(message)) {
                return {
                    isValid: false,
                    error: 'Message contains potentially harmful content'
                };
            }
        }

        return { isValid: true };
    }

    static validateHistory(history) {
        if (!Array.isArray(history)) {
            return {
                isValid: false,
                error: 'History must be an array'
            };
        }

        // Limit history size
        if (history.length > 20) {
            return {
                isValid: false,
                error: 'History too long. Maximum 20 messages allowed.'
            };
        }

        // Validate each history item
        for (const item of history) {
            if (!item || typeof item !== 'object') {
                return {
                    isValid: false,
                    error: 'Invalid history item format'
                };
            }

            if (!item.content || typeof item.content !== 'string') {
                return {
                    isValid: false,
                    error: 'History item must have content string'
                };
            }

            if (!['user', 'bot', 'assistant'].includes(item.sender)) {
                return {
                    isValid: false,
                    error: 'Invalid sender in history item'
                };
            }

            // Validate content length
            if (item.content.length > 2000) {
                return {
                    isValid: false,
                    error: 'History item content too long'
                };
            }
        }

        return { isValid: true };
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        // HTML encode dangerous characters
        let sanitized = input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');

        // Remove null bytes and control characters
        sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

        // Normalize whitespace
        sanitized = sanitized.replace(/\s+/g, ' ').trim();

        return sanitized;
    }

    static getSecurityHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Type': 'application/json; charset=utf-8'
        };
    }
}

module.exports = SecurityMiddleware;