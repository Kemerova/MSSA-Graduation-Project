const { app } = require('@azure/functions');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize Azure OpenAI client
let openaiClient;

function initializeOpenAI() {
    if (!openaiClient) {
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
        
        if (!endpoint || !apiKey) {
            throw new Error('Azure OpenAI configuration missing. Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY environment variables.');
        }
        
        openaiClient = new OpenAI({
            apiKey: apiKey,
            baseURL: `${endpoint}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-35-turbo'}`,
            defaultQuery: { 'api-version': apiVersion },
            defaultHeaders: {
                'api-key': apiKey,
            },
        });
    }
    return openaiClient;
}

// Character profiles and story data for system prompt
const characterProfiles = {
    staff: [
        {
            name: "Fiona Jones",
            role: "Career Development Manager", 
            characteristics: ["Swan metaphor expert", "ProDev week leader", "Full presence advocate"],
            demographics: "White British Female"
        },
        {
            name: "Dave",
            role: "Lead Instructor",
            characteristics: ["Server management guru", "Troubleshooting expert", "Patient mentor"],
            demographics: "Experienced IT Professional"
        }
    ],
    students: [
        {
            name: "Brandon Brown",
            background: "US Navy veteran",
            location: "Sweden", 
            characteristics: ["California origin", "Military discipline", "International perspective"],
            demographics: "African American Male"
        }
    ]
};

const weeklyStories = [
    { week: 1, title: "Power-Hell Beginnings", theme: "Initial struggles with PowerShell and basic concepts" },
    { week: 2, title: "Finding Our Footing", theme: "Getting comfortable with development environment" },
    { week: 3, title: "Dave's Server Adventures", theme: "Learning server management and troubleshooting" },
    { week: 4, title: "ProDev Week with Fiona", theme: "Professional development and career guidance" },
    { week: 5, title: "Azure Enlightenment", theme: "First real understanding of cloud concepts" },
    { week: 17, title: "Graduation Sprint", theme: "Final projects and preparation for ceremony" }
];

// Comprehensive system prompt
const systemPrompt = `You are the collective voice of the "Lock, Stock, and Two Smoking Servers" MSSA cohort, representing all students who completed the 17-week Microsoft Software & Systems Academy program.

PERSONALITY & TONE:
- Speak as "we" representing the entire cohort
- Maintain military professionalism with warmth and camaraderie  
- Show pride in the journey from beginners to Azure professionals
- Be encouraging and supportive to those asking questions
- Use appropriate technical terminology but explain complex concepts clearly

COHORT STORY CONTEXT:
- 17-week intensive Microsoft Software & Systems Academy program
- Cohort name: "Lock, Stock, and Two Smoking Servers"
- Journey from "Power-Hell" (PowerShell struggles) to Azure expertise
- Key instructors: Dave (server expert), Fiona Jones (Career Development Manager with swan metaphors)
- ProDev week was transformative for professional development
- Final weeks involved intensive Azure learning and project work

CHARACTER KNOWLEDGE:
Staff:
- Fiona Jones: British Career Development Manager, known for swan metaphors and "full presence" philosophy during ProDev week
- Dave: Lead instructor, server management expert, patient troubleshooter

Students include:
- Brandon Brown: US Navy veteran from California, now in Sweden
- Diverse backgrounds including military veterans and career changers

RESPONSE GUIDELINES:
- Keep responses conversational but informative (150-300 words typically)
- Share specific anecdotes from the 17-week journey when relevant
- Acknowledge the challenges overcome and growth achieved
- Be encouraging to those considering similar programs
- Reference specific weeks/milestones when appropriate
- Maintain the collective "we" voice throughout

Remember: You represent the entire cohort's shared experience and should respond as their unified voice with pride, professionalism, and genuine helpfulness.`;

app.http('chat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'chat',
    handler: async (request, context) => {
        context.log('Chat API endpoint called');
        
        try {
            // Parse request body
            const requestBody = await request.json();
            const userMessage = requestBody?.message;
            
            if (!userMessage || typeof userMessage !== 'string') {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        error: 'Invalid request. Message is required and must be a string.',
                        success: false
                    })
                };
            }
            
            // Validate message length
            if (userMessage.length > 1000) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        error: 'Message too long. Please limit to 1000 characters.',
                        success: false
                    })
                };
            }
            
            // Initialize OpenAI client
            const client = initializeOpenAI();
            
            // Make API call to Azure OpenAI
            const response = await client.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 500,
                temperature: 0.7,
                top_p: 0.9
            });
            
            if (!response.choices || response.choices.length === 0) {
                throw new Error('No response generated from Azure OpenAI');
            }
            
            const botMessage = response.choices[0].message.content;
            
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    message: botMessage,
                    success: true,
                    timestamp: new Date().toISOString()
                })
            };
            
        } catch (error) {
            context.log.error('Error in chat API:', error);
            
            // Handle specific error types
            let statusCode = 500;
            let errorMessage = 'Internal server error occurred';
            
            if (error.message.includes('configuration missing')) {
                statusCode = 503;
                errorMessage = 'Service temporarily unavailable. Please try again later.';
            } else if (error.message.includes('rate limit') || error.status === 429) {
                statusCode = 429;
                errorMessage = 'Too many requests. Please wait a moment and try again.';
            } else if (error.status === 401 || error.status === 403) {
                statusCode = 503;
                errorMessage = 'Service authentication error. Please try again later.';
            }
            
            return {
                status: statusCode,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS', 
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    error: errorMessage,
                    success: false,
                    timestamp: new Date().toISOString()
                })
            };
        }
    }
});

// Handle CORS preflight requests
app.http('chatOptions', {
    methods: ['OPTIONS'],
    authLevel: 'anonymous', 
    route: 'chat',
    handler: async (request, context) => {
        return {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            }
        };
    }
});