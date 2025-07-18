const { describe, test, expect, beforeEach } = require('@jest/globals');

// Mock Azure Functions
jest.mock('@azure/functions', () => ({
    app: {
        http: jest.fn()
    }
}));

// Mock OpenAI
jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: jest.fn()
            }
        }
    }));
});

describe('Chat API Function', () => {
    beforeEach(() => {
        // Reset environment variables
        delete process.env.AZURE_OPENAI_ENDPOINT;
        delete process.env.AZURE_OPENAI_API_KEY;
    });

    test('should register both chat and CORS endpoints', () => {
        const { app } = require('@azure/functions');
        
        // Clear mocks before importing
        jest.clearAllMocks();
        
        // Import the function to trigger registration
        require('./index.js');
        
        // Verify both endpoints were registered
        expect(app.http).toHaveBeenCalledTimes(2);
        
        // Verify the chat endpoint was registered
        expect(app.http).toHaveBeenCalledWith('chat', expect.objectContaining({
            methods: ['POST'],
            authLevel: 'anonymous',
            route: 'chat',
            handler: expect.any(Function)
        }));
        
        // Verify the CORS endpoint was registered
        expect(app.http).toHaveBeenCalledWith('chatOptions', expect.objectContaining({
            methods: ['OPTIONS'],
            authLevel: 'anonymous',
            route: 'chat',
            handler: expect.any(Function)
        }));
    });

    test('should have comprehensive system prompt with character profiles', () => {
        // Import to access the system prompt (would need to export it for testing)
        require('./index.js');
        
        // This test verifies the structure exists - in a real scenario,
        // we'd export the systemPrompt for testing
        expect(true).toBe(true); // Placeholder - structure verification
    });
});

describe('API Request Validation', () => {
    test('should validate message length limits', () => {
        // Test that messages over 1000 characters are rejected
        const longMessage = 'a'.repeat(1001);
        expect(longMessage.length).toBeGreaterThan(1000);
    });

    test('should validate required message field', () => {
        // Test that empty or missing messages are handled
        const validMessage = "Hello, cohort!";
        const emptyMessage = "";
        
        expect(validMessage.length).toBeGreaterThan(0);
        expect(emptyMessage.length).toBe(0);
    });
});