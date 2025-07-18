// The Cohort Chronicles - Working Version
console.log('Loading working version...');

// Complete 17 slides data
const slides = [
    { week: 1, title: "The Power-Hell Chronicles", content: "Our journey began with PowerShell under Mike Howell's guidance. Most of us had no programming background - we quickly renamed it 'Power-Hell'. Military veterans learning to code for the first time.", image: "images/powershell-week.jpg" },
    { week: 2, title: "Power-Hell Continues", content: "Week 2 of PowerShell with Mike Howell. We're starting to understand the basics, but still calling it 'Power-Hell' when he's not listening!", image: "images/powershell-week2.jpg" },
    { week: 3, title: "Dave's Artistic Server Lessons Begin", content: "David Hodson started teaching us server administration. His hand-drawn diagrams made more sense than any slides. We learned he loves fast cars too!", image: "images/server-week1.jpg" },
    { week: 4, title: "More Server Adventures", content: "Dave continued with server administration. While VMs processed, he'd tell us about his latest car obsession. His passion kept us engaged.", image: "images/server-week2.jpg" },
    { week: 5, title: "Server Mastery Building", content: "Getting comfortable with server concepts. Dave's diagrams are becoming legendary. Frank keeps reminding him to share his screen!", image: "images/server-week3.jpg" },
    { week: 6, title: "Advanced Server Topics", content: "Diving deeper into server administration. We're understanding more complex concepts thanks to Dave's unique teaching style.", image: "images/server-week4.jpg" },
    { week: 7, title: "Server Administration Confidence", content: "We're getting confident with server tasks. Dave's car stories during loading screens have become part of our routine.", image: "images/server-week5.jpg" },
    { week: 8, title: "Server Administration Complete", content: "Completed our server administration training with Dave. Ready for the next phase of our journey!", image: "images/server-week6.jpg" },
    { week: 9, title: "Professional Development Intensive", content: "Fiona Jones led us through ProDev week. We practiced 'Tell Me About Yourself' pitches repeatedly. The swan act: calm above water, feet flapping frantically below.", image: "images/prodev-week.jpg" },
    { week: 10, title: "Azure Enlightenment Begins", content: "Godfrey Chatira introduced us to Microsoft Azure. This man is a god of Azure - there's nothing he doesn't understand about the cloud.", image: "images/azure-week1.jpg" },
    { week: 11, title: "Azure Principles Deepening", content: "Godfrey continued expanding our Azure knowledge. We're starting to see the bigger picture of cloud computing.", image: "images/azure-week2.jpg" },
    { week: 12, title: "Azure Mastery Growing", content: "Under Godfrey's guidance, we're transforming from server admins to cloud architects. Azure is starting to make sense!", image: "images/azure-week3.jpg" },
    { week: 13, title: "Advanced Azure Concepts", content: "Godfrey is pushing us harder with complex Azure scenarios. We're rising to meet the challenge.", image: "images/azure-week4.jpg" },
    { week: 14, title: "Azure Certification Ready", content: "Final week with Godfrey the Azure god. We're confident in our cloud skills and ready for certification.", image: "images/azure-week5.jpg" },
    { week: 15, title: "Microsoft 365 Mastery Begins", content: "Dave returned to teach us Microsoft 365 endpoint administration. We were different students now - confident, skilled, ready for commercial IT.", image: "images/m365-week1.jpg" },
    { week: 16, title: "M365 Endpoint Excellence", content: "Completing Microsoft 365 training with Dave. We can see the finish line and we're ready for the commercial world.", image: "images/m365-week2.jpg" },
    { week: 17, title: "Lock, Stock, and Two Smoking Servers", content: "From 'Power-Hell' survivors to Azure professionals. Our cohort chose the name 'Lock, Stock, and Two Smoking Servers' - representing our journey from confusion to expertise. We made it!", image: "images/graduation.jpg" }
];

// Simple state
let currentSlide = 0;
let isPlaying = true;
let autoAdvanceTimer = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting simple app');
    
    // Hide loading immediately
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
    
    // Initialize slideshow
    displaySlide(0);
    createProgressSegments();
    bindEvents();
    startAutoAdvance();
    
    console.log('Simple app started successfully');
});

function displaySlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    currentSlide = index;
    const slide = slides[index];
    
    // Update slide content
    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');
    const slideImage = document.getElementById('slideImage');
    
    if (slideTitle) slideTitle.textContent = slide.title;
    if (slideText) slideText.textContent = slide.content;
    if (slideImage) {
        slideImage.src = slide.image;
        slideImage.alt = slide.title;
        slideImage.onerror = function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'background: #f0f0f0; height: 300px; display: flex; align-items: center; justify-content: center; border-radius: 8px;';
            placeholder.innerHTML = '<p style="color: #666; font-style: italic;">' + slide.title + '</p>';
            this.parentNode.appendChild(placeholder);
        };
    }
    
    // Update progress
    updateProgress();
}

function updateProgress() {
    const percentage = ((currentSlide + 1) / slides.length) * 100;
    
    const progressFill = document.getElementById('progressFill');
    const progressCounter = document.getElementById('progressCounter');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressCounter) progressCounter.textContent = `Week ${slides[currentSlide].week} of 17`;
    if (progressPercentage) progressPercentage.textContent = Math.round(percentage) + '%';
}

function createProgressSegments() {
    const container = document.getElementById('progressSegments');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < slides.length; i++) {
        const segment = document.createElement('div');
        segment.className = 'progress-segment';
        segment.style.cssText = 'flex: 1; height: 100%; cursor: pointer; border-right: 1px solid rgba(255,255,255,0.3);';
        segment.addEventListener('click', () => goToSlide(i));
        container.appendChild(segment);
    }
}

function goToSlide(index) {
    displaySlide(index);
    if (isPlaying) {
        startAutoAdvance();
    }
}

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}

function previousSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
}

function togglePlayPause() {
    if (isPlaying) {
        stopAutoAdvance();
        isPlaying = false;
        updatePlayPauseButton();
    } else {
        startAutoAdvance();
        isPlaying = true;
        updatePlayPauseButton();
    }
}

function updatePlayPauseButton() {
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const playPauseText = document.getElementById('playPauseText');
    
    if (isPlaying) {
        if (playIcon) playIcon.classList.remove('active');
        if (pauseIcon) pauseIcon.classList.add('active');
        if (playPauseText) playPauseText.textContent = 'Pause';
    } else {
        if (playIcon) playIcon.classList.add('active');
        if (pauseIcon) pauseIcon.classList.remove('active');
        if (playPauseText) playPauseText.textContent = 'Play';
    }
}

function startAutoAdvance() {
    stopAutoAdvance();
    autoAdvanceTimer = setInterval(nextSlide, 8000);
}

function stopAutoAdvance() {
    if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
}

function bindEvents() {
    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', previousSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Chat modal
    const chatTriggerBtn = document.getElementById('chatTriggerBtn');
    const chatModal = document.getElementById('chatModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (chatTriggerBtn && chatModal) {
        chatTriggerBtn.addEventListener('click', () => {
            chatModal.classList.add('active');
        });
    }
    
    if (modalClose && chatModal) {
        modalClose.addEventListener('click', () => {
            chatModal.classList.remove('active');
        });
    }
    
    if (modalOverlay && chatModal) {
        modalOverlay.addEventListener('click', () => {
            chatModal.classList.remove('active');
        });
    }
    
    // Chat functionality
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    
    if (chatSend) chatSend.addEventListener('click', sendChatMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                break;
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
        }
    });
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const response = getBotResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat__message chat__message--${sender}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat__avatar';
    avatarDiv.innerHTML = `<div class="avatar">${sender === 'user' ? '👤' : '🎓'}</div>`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat__content';
    contentDiv.innerHTML = `<p class="chat__text">${content}</p>`;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('fiona') || msg.includes('prodev')) {
        return "Fiona Jones taught us the 'swan act' - looking calm and professional above water while our feet flapped frantically below!";
    }
    if (msg.includes('dave') || msg.includes('server')) {
        return "Dave Hodson was amazing with his hand-drawn server diagrams and car stories during VM processing!";
    }
    if (msg.includes('godfrey') || msg.includes('azure')) {
        return "Godfrey Chatira is an Azure god! He transformed us from server admins to cloud architects.";
    }
    if (msg.includes('mike') || msg.includes('powershell')) {
        return "Mike Howell helped us survive 'Power-Hell' - our nickname for PowerShell in the early weeks!";
    }
    if (msg.includes('cohort') || msg.includes('name')) {
        return "We're 'Lock, Stock, and Two Smoking Servers' - representing our journey from confusion to expertise!";
    }
    
    return "Thanks for asking! We're the MSSA cohort 'Lock, Stock, and Two Smoking Servers' - ask us about our 17-week journey!";
}

console.log('Working script loaded successfully');