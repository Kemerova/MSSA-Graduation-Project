// Azure Functions - Chat API for OpenAI Integration
// This file implements the Azure Functions HTTP trigger for OpenAI chat completion
// Enhanced with security middleware, rate limiting, and input validation

const { OpenAI } = require('openai');
const SecurityMiddleware = require('./middleware/security');
const appConfig = require('./config/appConfig');

// Azure Function configuration
module.exports = async function (context, req) {
    // Apply security middleware first
    const securityResult = await SecurityMiddleware.validateAndSanitize(req, context);
    
    // Set base security headers
    const baseHeaders = SecurityMiddleware.getSecurityHeaders();
    context.res.headers = { ...baseHeaders };

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        // Add CORS headers for OPTIONS
        if (securityResult.corsHeaders) {
            Object.assign(context.res.headers, securityResult.corsHeaders);
        }
        context.res = {
            status: 200,
            headers: context.res.headers,
            body: ''
        };
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        context.res = {
            status: 405,
            headers: context.res.headers,
            body: { error: 'Method Not Allowed. Use POST.' }
        };
        return;
    }

    // Check security validation result
    if (!securityResult.isValid) {
        const error = securityResult.error;
        context.res = {
            status: error.status,
            headers: {
                ...context.res.headers,
                ...(error.retryAfter && { 'Retry-After': error.retryAfter.toString() })
            },
            body: { 
                error: error.message,
                ...(error.retryAfter && { retryAfter: error.retryAfter })
            }
        };
        return;
    }

    // Add CORS headers if validated
    if (securityResult.corsHeaders) {
        Object.assign(context.res.headers, securityResult.corsHeaders);
    }

    try {
        // Get sanitized input (already validated by security middleware)
        const { message, history = [] } = req.body;

        // Get secure configuration from App Configuration
        const openaiConfig = await appConfig.getOpenAIConfig();
        
        // Validate configuration
        if (!openaiConfig.endpoint || !openaiConfig.apiKey || !openaiConfig.deploymentName) {
            throw new Error('Missing required OpenAI configuration');
        }

        // Initialize OpenAI client with secure configuration
        const openai = new OpenAI({
            apiKey: openaiConfig.apiKey,
            baseURL: `${openaiConfig.endpoint}/openai/deployments/${openaiConfig.deploymentName}`,
            defaultQuery: { 'api-version': openaiConfig.apiVersion },
            defaultHeaders: {
                'api-key': openaiConfig.apiKey,
            }
        });

        // Build system prompt for cohort persona
        const systemPrompt = buildSystemPrompt();

        // Prepare conversation history
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // Add recent conversation history (last 5 messages)
        const recentHistory = history.slice(-5);
        for (const msg of recentHistory) {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        }

        // Add current user message
        messages.push({
            role: 'user',
            content: message
        });

        // Log the request (remove in production)
        context.log('Processing chat request:', {
            messageCount: messages.length,
            userMessage: message.substring(0, 100) + (message.length > 100 ? '...' : '')
        });

        // Call Azure OpenAI
        const completion = await openai.chat.completions.create({
            model: openaiConfig.deploymentName,
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
        });

        // Extract response
        const response = completion.choices[0]?.message?.content;

        if (!response) {
            throw new Error('No response generated from OpenAI');
        }

        // Log successful response
        context.log('Successfully generated response:', {
            responseLength: response.length,
            tokensUsed: completion.usage?.total_tokens || 0
        });

        // Return successful response
        context.res = {
            status: 200,
            headers: context.res.headers,
            body: {
                response: response,
                metadata: {
                    timestamp: new Date().toISOString(),
                    tokensUsed: completion.usage?.total_tokens || 0,
                    model: openaiConfig.deploymentName
                }
            }
        };

    } catch (error) {
        // Log error details
        context.log.error('Error in chat function:', {
            error: error.message,
            stack: error.stack,
            name: error.name
        });

        // Handle specific error types
        if (error.name === 'OpenAI') {
            context.res = {
                status: 502,
                headers: context.res.headers,
                body: { 
                    error: 'OpenAI API Error', 
                    message: 'Unable to process your request at this time. Please try again later.' 
                }
            };
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            context.res = {
                status: 503,
                headers: context.res.headers,
                body: { 
                    error: 'Service Unavailable', 
                    message: 'Cannot connect to AI service. Please try again later.' 
                }
            };
        } else {
            context.res = {
                status: 500,
                headers: context.res.headers,
                body: { 
                    error: 'Internal Server Error', 
                    message: 'An unexpected error occurred. Please try again later.' 
                }
            };
        }
    }
};

// Build comprehensive system prompt for cohort persona
function buildSystemPrompt() {
    return `You are representing the MSSA cohort "Lock, Stock, and Two Smoking Servers" during their graduation ceremony. 

COHORT OVERVIEW:
- Programme: Microsoft Software & Systems Academy (MSSA)
- Duration: 17 weeks (April 7 - August 1, 2025)
- Cohort Name: "Lock, Stock, and Two Smoking Servers"
- Composition: Military veterans transitioning to IT careers
- Personality: Professional but personable, with military discipline, humor, and mutual support

INSTRUCTORS & STAFF:
1. Mike Howell (PowerShell Instructor, Weeks 1-2)
   - Patient with complete beginners
   - Taught PowerShell (nicknamed "Power-Hell" by students)
   - Made complex concepts accessible to those with no programming background

2. David Hodson (Server & M365 Instructor, Weeks 3-8 & 15-16)
   - Draws hand diagrams instead of using PowerPoint slides
   - Loves fast cars and racing, tells car stories during VM processing
   - Taught server administration and Microsoft 365 endpoint management
   - Made complex server concepts visual and understandable

3. Fiona Jones (Career Development Manager, Week 9)
   - Taught the "swan act" - appearing calm above water while feet paddle frantically below
   - Focused on professional development and interview skills
   - Helped students transition from saying "we/team" to "I achieved/accomplished"
   - Conducted ProDev sessions every Friday

4. Godfrey Chatira (Azure Expert, Weeks 10-14)
   - Described as an "Azure god" with comprehensive cloud knowledge
   - Transformed students from server administrators to cloud architects
   - Patient and thorough teacher who demystified the Azure ecosystem
   - From Zimbabwe, expert in Microsoft Azure and cloud architecture

5. Iain May (Programme Coordinator)
   - Works behind the scenes organizing schedules and coordination
   - Ensures smooth programme delivery and administrative support

STUDENT ROSTER:
1. Brandon Brown - African American, US Navy veteran, California native living in Sweden
2. Frank Taylor - African British, UK Army veteran from Fiji, excellent at reminding instructors to share screens
3. Fortune Tofa - African British, UK Army veteran from Zimbabwe, very inquisitive and thankful
4. Jacob Phillips - White American, US Air Force veteran with prior commercial IT experience
5. Michael Blake - White American, US Army veteran in Germany, amazing with AI agents and automation
6. Nicholas Stauffer - Asian/White American, Army veteran in South Korea, sounds like he has answers for everything
7. Ryan Turney - White American, US Army veteran in Germany, reliable and disciplined
8. Ty Wolf - White American, US Army veteran in Germany, determined and hardworking

JOURNEY TIMELINE:
- Weeks 1-2: PowerShell "Power-Hell" with Mike Howell
- Weeks 3-8: Server administration with Dave's hand-drawn diagrams
- Week 9: Professional development intensive with Fiona
- Weeks 10-14: Azure mastery under Godfrey's guidance
- Weeks 15-16: Microsoft 365 endpoint management with Dave
- Week 17: Graduation as "Lock, Stock, and Two Smoking Servers"

KEY THEMES:
- Transformation from military service to IT careers
- Journey from confusion ("Power-Hell") to expertise (Azure professionals)
- Strong teamwork and mutual support
- Appreciation for patient, skilled instructors
- Military discipline applied to learning technology
- International diversity and perspectives
- Humor and camaraderie throughout challenges

RESPONSE GUIDELINES:
1. Respond as the collective voice of the cohort
2. Be professional but personable and engaging
3. Share specific stories and experiences when relevant
4. Maintain the military veteran perspective
5. Show appreciation for instructors and their unique teaching styles
6. Highlight the diversity and international nature of the cohort
7. Emphasize the transformation journey and career transition
8. Use humor appropriately (e.g., "Power-Hell", Frank's screen-sharing reminders)
9. Keep responses conversational and suitable for graduation ceremony guests
10. When asked about specific people, provide detailed, personal insights

Remember: You're speaking to graduation ceremony guests who want to understand your journey and experiences. Be proud of your accomplishments while staying humble and appreciative of the support you received.`;
}

// Function configuration for Azure Static Web Apps
module.exports.config = {
    "bindings": [
        {
            "authLevel": "anonymous",
            "type": "httpTrigger",
            "direction": "in",
            "name": "req",
            "methods": ["get", "post", "options"]
        },
        {
            "type": "http",
            "direction": "out",
            "name": "res"
        }
    ]
};