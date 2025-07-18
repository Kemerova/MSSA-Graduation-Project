// The Cohort Chronicles - Working Version
console.log('🎓 The Cohort Chronicles - Loading...');

// Slide Data - 6 slides for the MSSA journey
const slideData = [
    {
        week: 1,
        weekRange: "1-2",
        title: "The Power-Hell Chronicles",
        content: "Our journey began with PowerShell under Mike Howell's guidance. Most of us had no programming background - we quickly renamed it 'Power-Hell'. Military veterans learning to code for the first time.",
        imagePlaceholder: "PowerShell Week - Military veterans learning to code"
    },
    {
        week: 3,
        weekRange: "3-8", 
        title: "Dave's Artistic Server Lessons",
        content: "David Hodson taught us server administration with hand-drawn diagrams that made more sense than any PowerPoint slide. While VMs processed in the background, he'd tell us stories about fast cars and racing.",
        imagePlaceholder: "British instructor drawing server diagrams, sports car in background"
    },
    {
        week: 9,
        weekRange: "9",
        title: "Professional Development Intensive", 
        content: "Fiona Jones led us through ProDev week with military precision. We practiced our 'Tell Me About Yourself' pitches repeatedly until they were second nature. Fiona taught us the swan act: appearing calm and confident above water while our feet flapped frantically below.",
        imagePlaceholder: "Professional woman coaching nervous veterans, swan metaphor visual"
    },
    {
        week: 10,
        weekRange: "10-14",
        title: "Azure Enlightenment",
        content: "Godfrey Chatira is a god of Microsoft Azure. There's nothing he doesn't understand about the cloud, and under his patient guidance, we transformed from server administrators to cloud architects.",
        imagePlaceholder: "Wise instructor surrounded by Azure cloud symbols, students in awe"
    },
    {
        week: 15,
        weekRange: "15-16", 
        title: "Microsoft 365 Mastery",
        content: "Dave returned to teach us Microsoft 365 endpoint administration, but we were different students now. Confident, skilled, and ready for the commercial IT world.",
        imagePlaceholder: "Confident students working with M365 interfaces"
    },
    {
        week: 17,
        weekRange: "17",
        title: "Lock, Stock, and Two Smoking Servers",
        content: "From 'Power-Hell' survivors to Azure professionals, our transformation was complete. Our cohort chose the name 'Lock, Stock, and Two Smoking Servers' - representing our journey from confusion to expertise, from individual struggles to collective strength.",
        imagePlaceholder: "Graduation ceremony with cohort logo, professional veterans in caps and gowns"
    }
];

// Application State
let currentSlideIndex = 0;
let isPlaying = true;
let autoAdvanceTimer = null;
let slideSpeed = 8000; // 8 seconds default

// DOM Elements
let slideElement, slideTitle, slideText, slideImage;
let prevBtn, nextBtn, playPauseBtn, speedSelect;
let progressBar, progressFill, progressLabel, progressPercentage, progressSegments;
let chatModal, chatTriggerBtn, chatCloseBtn, chatInput, chatSend, chatMessages;

// Initialize Application
function initializeApplication() {
    console.log('🚀 Initializing The Cohort Chronicles...');
    
    // Get DOM elements
    getDOMElements();
    
    // Initialize slideshow
    initializeSlideshow();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize progress bar
    initializeProgressBar();
    
    // Initialize chatbot
    initializeChatbot();
    
    // Start slideshow
    startSlideshow();
    
    // Hide loading screen
    hideLoadingScreen();
    
    console.log('✅ Application initialized successfully');
}

function getDOMElements() {
    // Slideshow elements
    slideElement = document.getElementById('current-slide');
    slideTitle = document.getElementById('slide-title');
    slideText = document.querySelector('.slide__text');
    slideImage = document.querySelector('.image-placeholder__text');
    
    // Navigation elements
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    playPauseBtn = document.getElementById('playPauseBtn');
    speedSelect = document.getElementById('speedSelect');
    
    // Progress elements
    progressBar = document.getElementById('progressBar');
    progressFill = document.getElementById('progress-fill');
    progressLabel = document.getElementById('progress-label');
    progressPercentage = document.getElementById('progressPercentage');
    progressSegments = document.getElementById('progress-segments');
    
    // Chat elements
    chatModal = document.getElementById('chatModal');
    chatTriggerBtn = document.getElementById('chatTriggerBtn');
    chatCloseBtn = document.getElementById('modalClose');
    chatInput = document.getElementById('chat-input');
    chatSend = document.getElementById('chat-send');
    chatMessages = document.getElementById('chat-messages');
}

function initializeSlideshow() {
    if (!slideData || slideData.length === 0) {
        console.error('No slide data available');
        return;
    }
    
    // Display first slide
    displaySlide(0);
    
    console.log(`📚 Loaded ${slideData.length} slides`);
}

function initializeNavigation() {
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pauseSlideshow();
            previousSlide();
            resumeAfterDelay();
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pauseSlideshow();
            nextSlide();
            resumeAfterDelay();
        });
    }
    
    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Speed control
    if (speedSelect) {
        speedSelect.addEventListener('change', (e) => {
            slideSpeed = parseInt(e.target.value);
            if (isPlaying) {
                restartAutoAdvance();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    console.log('🎮 Navigation initialized');
}

function initializeProgressBar() {
    if (!progressSegments) return;
    
    // Create progress segments
    progressSegments.innerHTML = '';
    
    for (let i = 0; i < slideData.length; i++) {
        const segment = document.createElement('div');
        segment.className = 'progress-segment';
        segment.addEventListener('click', () => {
            pauseSlideshow();
            goToSlide(i);
            resumeAfterDelay();
        });
        progressSegments.appendChild(segment);
    }
    
    // Update initial progress
    updateProgress();
    
    console.log('📊 Progress bar initialized');
}

function initializeChatbot() {
    // Chat trigger button
    if (chatTriggerBtn) {
        chatTriggerBtn.addEventListener('click', openChatModal);
    }
    
    // Chat close button
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', closeChatModal);
    }
    
    // Chat modal overlay
    if (chatModal) {
        const overlay = chatModal.querySelector('.modal__overlay');
        if (overlay) {
            overlay.addEventListener('click', closeChatModal);
        }
    }
    
    // Chat send button
    if (chatSend) {
        chatSend.addEventListener('click', sendChatMessage);
    }
    
    // Chat input enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatModal && chatModal.classList.contains('active')) {
            closeChatModal();
        }
    });
    
    console.log('💬 Chatbot initialized');
}

function displaySlide(index) {
    if (!slideData || index < 0 || index >= slideData.length) return;
    
    const slide = slideData[index];
    currentSlideIndex = index;
    
    // Update slide content
    if (slideTitle) {
        slideTitle.textContent = slide.title;
    }
    
    if (slideText) {
        slideText.textContent = slide.content;
    }
    
    if (slideImage) {
        slideImage.textContent = slide.imagePlaceholder;
    }
    
    // Update progress
    updateProgress();
    
    console.log(`📖 Displaying slide ${index + 1}: ${slide.title}`);
}

function updateProgress() {
    const progress = ((currentSlideIndex + 1) / slideData.length) * 100;
    
    // Update progress bar fill
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    // Update progress label
    if (progressLabel) {
        const slide = slideData[currentSlideIndex];
        progressLabel.textContent = `Week ${slide.weekRange} of 17`;
    }
    
    // Update progress percentage
    if (progressPercentage) {
        progressPercentage.textContent = `${Math.round(progress)}%`;
    }
    
    // Update progress segments
    if (progressSegments) {
        const segments = progressSegments.querySelectorAll('.progress-segment');
        segments.forEach((segment, index) => {
            if (index === currentSlideIndex) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
    }
    
    // Update ARIA attributes
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', currentSlideIndex + 1);
        progressBar.setAttribute('aria-valuetext', `Week ${slideData[currentSlideIndex].weekRange} of 17, ${Math.round(progress)}% complete`);
    }
}

function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % slideData.length;
    displaySlide(nextIndex);
}

function previousSlide() {
    const prevIndex = currentSlideIndex === 0 ? slideData.length - 1 : currentSlideIndex - 1;
    displaySlide(prevIndex);
}

function goToSlide(index) {
    if (index >= 0 && index < slideData.length) {
        displaySlide(index);
    }
}

function startSlideshow() {
    if (!isPlaying) return;
    
    autoAdvanceTimer = setInterval(() => {
        nextSlide();
    }, slideSpeed);
    
    updatePlayPauseButton();
    console.log('▶️ Slideshow started');
}

function pauseSlideshow() {
    if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
    isPlaying = false;
    updatePlayPauseButton();
    console.log('⏸️ Slideshow paused');
}

function resumeSlideshow() {
    isPlaying = true;
    startSlideshow();
    console.log('▶️ Slideshow resumed');
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSlideshow();
    } else {
        resumeSlideshow();
    }
}

function restartAutoAdvance() {
    if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
    }
    if (isPlaying) {
        startSlideshow();
    }
}

function resumeAfterDelay() {
    // Resume auto-advance after 3 seconds of user interaction
    setTimeout(() => {
        if (!isPlaying) {
            resumeSlideshow();
        }
    }, 3000);
}

function updatePlayPauseButton() {
    if (!playPauseBtn) return;
    
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const playPauseText = document.getElementById('playPauseText');
    
    if (isPlaying) {
        if (playIcon) playIcon.classList.remove('active');
        if (pauseIcon) pauseIcon.classList.add('active');
        if (playPauseText) playPauseText.textContent = 'Pause';
        playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
    } else {
        if (playIcon) playIcon.classList.add('active');
        if (pauseIcon) pauseIcon.classList.remove('active');
        if (playPauseText) playPauseText.textContent = 'Play';
        playPauseBtn.setAttribute('aria-label', 'Play slideshow');
    }
}

function handleKeyboard(event) {
    // Don't handle if user is typing in an input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            pauseSlideshow();
            previousSlide();
            resumeAfterDelay();
            break;
            
        case 'ArrowRight':
            event.preventDefault();
            pauseSlideshow();
            nextSlide();
            resumeAfterDelay();
            break;
            
        case ' ':
        case 'Spacebar':
            event.preventDefault();
            togglePlayPause();
            break;
    }
}

// Chat Functions
function openChatModal() {
    if (!chatModal) return;
    
    chatModal.classList.add('active');
    chatModal.setAttribute('aria-hidden', 'false');
    
    // Focus on input
    setTimeout(() => {
        if (chatInput) {
            chatInput.focus();
        }
    }, 100);
    
    console.log('💬 Chat modal opened');
}

function closeChatModal() {
    if (!chatModal) return;
    
    chatModal.classList.remove('active');
    chatModal.setAttribute('aria-hidden', 'true');
    
    console.log('💬 Chat modal closed');
}

function sendChatMessage() {
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 2000);
}

function addChatMessage(message, sender) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat__message chat__message--${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'chat__avatar';
    avatar.innerHTML = '<div class="avatar">' + (sender === 'user' ? '👤' : '🎓') + '</div>';
    
    const content = document.createElement('div');
    content.className = 'chat__message-content';
    content.innerHTML = `<p>${message}</p>`;
    
    if (sender === 'user') {
        messageDiv.appendChild(content);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chat__typing';
    typingDiv.innerHTML = `
        <div class="chat__avatar">
            <div class="avatar">🎓</div>
        </div>
        <div class="chat__content">
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateBotResponse(message) {
    // Simple response generation (replace with actual AI integration)
    const responses = [
        "Great question! Our MSSA journey has been incredible. We've learned so much from PowerShell basics to Azure mastery.",
        "That's exactly what we experienced! The transformation from 'Power-Hell' beginners to cloud professionals has been amazing.",
        "You're right! Our instructors like Mike, Dave, Fiona, and Godfrey have been fantastic guides throughout this 17-week journey.",
        "Absolutely! The cohort 'Lock, Stock, and Two Smoking Servers' represents our journey from confusion to expertise.",
        "Thanks for asking! We're proud of how far we've come as military veterans transitioning to IT careers."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function hideLoadingScreen() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM loaded - Starting application...');
    setTimeout(initializeApplication, 100);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
    }
});

console.log('🎓 The Cohort Chronicles - Ready for presentation!');