// Chatbot functionality for "Ask the Cohort" feature
console.log('Chatbot module loading...');

class ChatbotManager {
    constructor(contentManager) {
        this.contentManager = contentManager;
        this.chatContainer = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatSend = document.getElementById('chat-send');
        this.isTyping = false;
        
        // Bind methods
        this.sendMessage = this.sendMessage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        
        // Initialize chatbot context
        this.cohortContext = this.contentManager.getChatbotContext();
        this.characterProfiles = this.contentManager.getCharacterProfiles();
        
        this.setupEventListeners();
        console.log('ChatbotManager initialized');
    }
    
    setupEventListeners() {
        if (this.chatSend) {
            this.chatSend.addEventListener('click', this.sendMessage);
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', this.handleKeyPress);
        }
    }
    
    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Check if offline
        if (window.errorHandler && window.errorHandler.isOffline()) {
            this.addMessage('You are currently offline. The chatbot requires an internet connection to work.', 'bot', true);
            return;
        }
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.chatInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response with retry logic
            const response = await this.getAIResponseWithRetry(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response to chat
            this.addMessage(response, 'bot');
            
            // Reset retry count on success
            if (window.errorHandler) {
                window.errorHandler.resetRetryCount('chatbot');
            }
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            
            // Use error handler for better error messages
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            if (window.errorHandler) {
                errorMessage = window.errorHandler.handleChatbotError(error);
            }
            
            this.addMessage(errorMessage, 'bot', true);
        }
    }
    
    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat__message chat__message--${sender}`;
        
        if (isError) {
            messageDiv.classList.add('chat__message--error');
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'chat__message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(messageContent);
        
        if (this.chatContainer) {
            this.chatContainer.appendChild(messageDiv);
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat__typing';
        typingDiv.id = 'typing-indicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'chat__typing-content';
        typingContent.innerHTML = `
            <span>The cohort is typing</span>
            <div class="chat__typing-dots">
                <div class="chat__typing-dot"></div>
                <div class="chat__typing-dot"></div>
                <div class="chat__typing-dot"></div>
            </div>
        `;
        
        typingDiv.appendChild(typingContent);
        
        if (this.chatContainer) {
            this.chatContainer.appendChild(typingDiv);
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
        
        // Disable input while typing
        if (this.chatInput) this.chatInput.disabled = true;
        if (this.chatSend) this.chatSend.disabled = true;
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Re-enable input
        if (this.chatInput) this.chatInput.disabled = false;
        if (this.chatSend) this.chatSend.disabled = false;
    }
    
    async getAIResponseWithRetry(userMessage, maxRetries = 3) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Try to get response from Azure OpenAI API first
                if (this.shouldUseAzureAPI()) {
                    return await this.getAzureOpenAIResponse(userMessage);
                } else {
                    // Fallback to simulated response
                    return this.getSimulatedResponse(userMessage);
                }
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt} failed:`, error.message);
                
                // If it's a network error and we have more attempts, wait before retrying
                if (attempt < maxRetries && this.isNetworkError(error)) {
                    await this.delay(1000 * attempt); // Exponential backoff
                    continue;
                }
                
                // If Azure API fails, try fallback
                if (attempt === 1 && this.isAPIError(error)) {
                    console.log('Azure API failed, using fallback response');
                    return this.getSimulatedResponse(userMessage);
                }
            }
        }
        
        // If all retries failed, throw the last error
        throw lastError;
    }

    async getAIResponse(userMessage) {
        // For now, return a simulated response based on keywords
        // This will be replaced with actual Azure OpenAI integration
        return this.getSimulatedResponse(userMessage);
    }
    
    shouldUseAzureAPI() {
        // Check if Azure OpenAI is configured and available
        // Enable this when Azure Functions API is properly deployed
        return true; // Enable Azure API integration
    }
    
    isNetworkError(error) {
        return error.name === 'TypeError' || 
               error.message.includes('fetch') || 
               error.message.includes('network') ||
               error.code === 'NETWORK_ERROR';
    }
    
    isAPIError(error) {
        return error.status >= 400 || 
               error.name === 'OpenAI' ||
               error.message.includes('API');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    getSimulatedResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for instructor-specific questions
        if (message.includes('fiona') || message.includes('prodev') || message.includes('professional development')) {
            return "That's about Fiona Jones! She taught us the 'swan act' - looking calm and professional above water while our feet flapped frantically below. Her ProDev sessions on Fridays were crucial for our interview preparation. She made sure we learned to say 'I' instead of 'we' when talking about our achievements!";
        }
        
        if (message.includes('dave') || message.includes('david') || message.includes('server') || message.includes('car')) {
            return "Dave (David Hodson) was amazing! He taught us server administration with hand-drawn diagrams that made more sense than any PowerPoint. While VMs processed, he'd tell us stories about fast cars and racing. His passion for both servers and speed kept us engaged through the longest configuration sessions.";
        }
        
        if (message.includes('godfrey') || message.includes('azure') || message.includes('cloud')) {
            return "Godfrey Chatira is truly an Azure god! There's nothing he doesn't understand about Microsoft Azure. Under his patient guidance, we transformed from server administrators to cloud architects. Every concept clicked into place as he demystified the Azure ecosystem.";
        }
        
        if (message.includes('mike') || message.includes('powershell') || message.includes('power-hell')) {
            return "Mike Howell introduced us to PowerShell - or as we called it, 'Power-Hell'! Most of us had no programming background, so every command was a battle. But Mike was patient with us complete beginners and helped us get through those first challenging weeks.";
        }
        
        // Check for student-specific questions
        if (message.includes('frank') || message.includes('screen sharing') || message.includes('share screen')) {
            return "Ha! Frank Taylor was excellent at reminding instructors to share their screen. His Fiji background and UK Army experience made him a helpful team player who always looked out for everyone. He had great attention to detail!";
        }
        
        if (message.includes('michael') || message.includes('blake') || message.includes('ai') || message.includes('automation')) {
            return "Michael Blake is amazing with AI agents and automation! His Army background gave him great problem-solving skills, and he really excelled at AI and machine learning concepts. He brought an innovation-focused approach to everything.";
        }
        
        if (message.includes('brandon') || message.includes('california') || message.includes('sweden')) {
            return "Brandon Brown brings a unique perspective - California origin with West Coast vibes, US Navy background, and now living in Sweden! His international perspective and naval technical aptitude made him great at adapting to new technologies.";
        }
        
        // Check for general questions
        if (message.includes('cohort') || message.includes('name') || message.includes('lock stock')) {
            return "We chose 'Lock, Stock, and Two Smoking Servers' as our cohort name! It represents our journey from confusion to expertise, from individual struggles to collective strength. From 'Power-Hell' survivors to Azure professionals!";
        }
        
        if (message.includes('week') || message.includes('journey') || message.includes('17')) {
            return "Our 17-week journey was incredible! We started with PowerShell 'Power-Hell' in weeks 1-2, learned server administration from Dave's hand-drawn diagrams in weeks 3-8, had ProDev with Fiona in week 9, became Azure architects under Godfrey in weeks 10-14, mastered M365 with Dave again in weeks 15-16, and graduated as certified professionals in week 17!";
        }
        
        if (message.includes('military') || message.includes('veteran') || message.includes('army') || message.includes('navy')) {
            return "We're all military veterans transitioning to IT careers! Our cohort includes US Army, US Navy, US Air Force, and UK Army veterans from diverse backgrounds. We brought military discipline, teamwork, and dedication to our MSSA training.";
        }
        
        if (message.includes('certification') || message.includes('certificate') || message.includes('azure cert')) {
            return "We all worked toward Azure certifications during our training! Godfrey guided us through Azure fundamentals, and we're now certified cloud professionals ready to serve the IT industry with the same dedication we brought to military service.";
        }
        
        if (message.includes('funny') || message.includes('humor') || message.includes('joke') || message.includes('laugh')) {
            return "Oh, we had plenty of laughs! Like when we renamed PowerShell to 'Power-Hell', Frank constantly reminding instructors to share screens, Dave's car stories during VM processing, and Fiona's swan metaphor for looking professional while panicking inside. Good times!";
        }
        
        // Default response
        return "Thanks for asking! We're the MSSA cohort 'Lock, Stock, and Two Smoking Servers' - military veterans who completed a 17-week journey from PowerShell beginners to Azure professionals. Ask us about our instructors (Fiona, Dave, Godfrey, Mike), our training experience, or any of our cohort members. We love sharing our story!";
    }
    
    // Method to integrate with Azure OpenAI via Azure Functions API
    async getAzureOpenAIResponse(userMessage) {
        const apiEndpoint = '/api/chat';
        
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: this.getChatHistory()
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.response) {
                throw new Error('No response received from API');
            }
            
            return data.response;
            
        } catch (error) {
            console.error('Azure Functions API error:', error);
            
            // Enhance error information
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network connection failed. Please check your internet connection.');
            } else if (error.message.includes('HTTP 5')) {
                throw new Error('Server error. The AI service is temporarily unavailable.');
            } else if (error.message.includes('HTTP 4')) {
                throw new Error('Request error. Please try again with a different message.');
            }
            
            throw error;
        }
    }
    
    getChatHistory() {
        // Get recent chat messages for context
        const messages = [];
        const chatMessages = this.chatContainer?.querySelectorAll('.chat__message');
        
        if (chatMessages) {
            // Get last 10 messages for context
            const recentMessages = Array.from(chatMessages).slice(-10);
            
            recentMessages.forEach(messageEl => {
                const isUser = messageEl.classList.contains('chat__message--user');
                const isError = messageEl.classList.contains('chat__message--error');
                const content = messageEl.querySelector('.chat__message-content p')?.textContent;
                
                if (content && !isError) {
                    messages.push({
                        sender: isUser ? 'user' : 'bot',
                        content: content
                    });
                }
            });
        }
        
        return messages;
    }
    
    buildSystemPrompt() {
        return `You are representing the MSSA cohort "${this.cohortContext.cohortName}" during their graduation ceremony. 
        
        Programme: ${this.cohortContext.programme}
        Duration: ${this.cohortContext.duration}
        
        Cohort Personality: ${this.cohortContext.cohortPersonality}
        
        Staff Members:
        ${this.characterProfiles.staff.map(person => 
            `- ${person.name} (${person.role}): ${person.characteristics.join(', ')}`
        ).join('\n')}
        
        Students:
        ${this.characterProfiles.students.map(person => 
            `- ${person.name} (${person.background}): ${person.characteristics.join(', ')}`
        ).join('\n')}
        
        Key Journey Milestones:
        ${this.cohortContext.keyMilestones.join(', ')}
        
        Respond as the collective voice of this cohort. Be professional but personable, share specific stories and experiences, and maintain the military veteran perspective transitioning to IT careers. Keep responses conversational and engaging, as if speaking to graduation ceremony guests.`;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for contentManager to be available
    if (typeof contentManager !== 'undefined') {
        window.chatbotManager = new ChatbotManager(contentManager);
        console.log('Chatbot initialized successfully');
    } else {
        console.error('ContentManager not found - chatbot initialization failed');
    }
});