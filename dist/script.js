// The Cohort Chronicles - MSSA Journey Data and Management
console.log('The Cohort Chronicles - Loading...');

// Slide Data Structure - 17-week MSSA Journey
const slideData = [
    {
        week: 1,
        weekRange: "1-2",
        title: "The Power-Hell Chronicles",
        content: `Our journey began with PowerShell under Mike Howell's guidance. Most of us had no programming background - we quickly renamed it 'Power-Hell'. Military veterans learning to code for the first time, staring at terminals that seemed to speak a foreign language. Every command was a battle, every script a small victory.`,
        imagePlaceholder: "Confused soldiers staring at PowerShell terminal",
        duration: 10000,
        metadata: {
            instructors: ["Mike Howell"],
            keyTopics: ["PowerShell Basics", "Command Line", "Scripting Fundamentals"],
            milestones: ["First Scripts", "Terminal Navigation", "Basic Automation"]
        }
    },
    {
        week: 3,
        weekRange: "3-8",
        title: "Dave's Artistic Server Lessons",
        content: `David Hodson taught us server administration with hand-drawn diagrams that made more sense than any PowerPoint slide. While VMs processed in the background, he'd tell us stories about fast cars and racing. His passion for both servers and speed kept us engaged through the longest configuration sessions. Those diagrams became our roadmap to understanding complex server architectures.`,
        imagePlaceholder: "British instructor drawing server diagrams, sports car in background",
        duration: 10000,
        metadata: {
            instructors: ["David Hodson"],
            keyTopics: ["Server Administration", "VM Management", "Network Configuration"],
            milestones: ["Server Setup", "Network Troubleshooting", "System Monitoring"]
        }
    },
    {
        week: 9,
        weekRange: "9",
        title: "Professional Development Intensive",
        content: `Fiona Jones led us through ProDev week with military precision. We practiced our 'Tell Me About Yourself' pitches repeatedly until they were second nature. The first attempts were rough - we kept using 'we' and 'team' instead of 'I', struggling to highlight individual achievements. Fiona taught us the swan act: appearing calm and confident above water while our feet flapped frantically below.`,
        imagePlaceholder: "Professional woman coaching nervous veterans, swan metaphor visual",
        duration: 10000,
        metadata: {
            instructors: ["Fiona Jones"],
            keyTopics: ["Professional Communication", "Interview Skills", "Personal Branding"],
            milestones: ["Elevator Pitch", "Resume Optimization", "Interview Confidence"]
        }
    },
    {
        week: 10,
        weekRange: "10-14",
        title: "Azure Enlightenment",
        content: `Godfrey Chatira is a god of Microsoft Azure. There's nothing he doesn't understand about the cloud, and under his patient guidance, we transformed from server administrators to cloud architects. Every concept clicked into place as he demystified the Azure ecosystem. Virtual networks, storage accounts, compute resources - it all became second nature under his expert tutelage.`,
        imagePlaceholder: "Wise instructor surrounded by Azure cloud symbols, students in awe",
        duration: 10000,
        metadata: {
            instructors: ["Godfrey Chatira"],
            keyTopics: ["Azure Fundamentals", "Cloud Architecture", "Resource Management"],
            milestones: ["Cloud Migration", "Azure Certifications", "Architecture Design"]
        }
    },
    {
        week: 15,
        weekRange: "15-16",
        title: "Microsoft 365 Mastery",
        content: `Dave returned to teach us Microsoft 365 endpoint administration, but we were different students now. Confident, skilled, and ready for the commercial IT world. The same instructor who had drawn server diagrams now guided us through modern workplace management. We absorbed endpoint security, device management, and user administration with the expertise we'd built over 14 weeks.`,
        imagePlaceholder: "Confident students working with M365 interfaces",
        duration: 10000,
        metadata: {
            instructors: ["David Hodson"],
            keyTopics: ["M365 Administration", "Endpoint Management", "Security Policies"],
            milestones: ["Device Deployment", "Security Implementation", "User Management"]
        }
    },
    {
        week: 17,
        weekRange: "17",
        title: "Lock, Stock, and Two Smoking Servers",
        content: `From 'Power-Hell' survivors to Azure professionals, our transformation was complete. Our cohort chose the name 'Lock, Stock, and Two Smoking Servers' - representing our journey from confusion to expertise, from individual struggles to collective strength. We stand here today as certified cloud professionals, ready to serve the IT industry with the same dedication we brought to military service.`,
        imagePlaceholder: "Graduation ceremony with cohort logo, professional veterans in caps and gowns",
        duration: 10000,
        metadata: {
            instructors: ["All Staff"],
            keyTopics: ["Graduation", "Certification", "Career Transition"],
            milestones: ["Azure Certifications", "Job Readiness", "Professional Network"]
        }
    }
];

// Character Profiles for AI Chatbot Context
const characterProfiles = {
    staff: [
        {
            name: "Fiona Jones",
            role: "Career Development Manager",
            demographics: "White British Female",
            characteristics: [
                "Uses swan metaphor for professional composure",
                "Teaches ProDev every Friday",
                "Ensures full presence and engagement",
                "Expert in interview preparation",
                "Focuses on individual achievement language"
            ],
            personality: "Professional, supportive, detail-oriented",
            expertise: ["Career Development", "Interview Skills", "Professional Communication"]
        },
        {
            name: "Iain May",
            role: "Programme Coordinator",
            demographics: "White British Male",
            characteristics: [
                "Works behind the scenes organizing schedules",
                "Ensures smooth programme delivery",
                "Coordinates between instructors and students",
                "Administrative excellence"
            ],
            personality: "Organized, reliable, supportive",
            expertise: ["Programme Management", "Coordination", "Administrative Support"]
        },
        {
            name: "Mike Howell",
            role: "PowerShell Instructor",
            demographics: "White British Male",
            characteristics: [
                "Taught PowerShell in weeks 1-2",
                "Patient with complete beginners",
                "Made complex concepts accessible",
                "Survived the 'Power-Hell' period with students"
            ],
            personality: "Patient, understanding, foundational",
            expertise: ["PowerShell", "Scripting", "Command Line", "Automation"]
        },
        {
            name: "David Hodson",
            role: "Server & M365 Instructor",
            demographics: "White British Male",
            characteristics: [
                "Draws hand diagrams instead of using slides",
                "Loves fast cars and racing",
                "Tells car stories during VM processing time",
                "Taught server admin (weeks 3-8) and M365 (weeks 15-16)",
                "Makes complex server concepts visual and understandable"
            ],
            personality: "Artistic, passionate, engaging, car enthusiast",
            expertise: ["Server Administration", "Microsoft 365", "Network Configuration", "Endpoint Management"]
        },
        {
            name: "Godfrey Chatira",
            role: "Azure Expert Instructor",
            demographics: "Black British Male from Zimbabwe",
            characteristics: [
                "Azure god-level expertise",
                "Taught Azure principles (weeks 10-14)",
                "Understands every aspect of Microsoft Azure",
                "Patient and thorough teacher",
                "Transformed students from server admins to cloud architects"
            ],
            personality: "Expert, patient, thorough, inspiring",
            expertise: ["Microsoft Azure", "Cloud Architecture", "Azure Certifications", "Cloud Migration"]
        }
    ],
    students: [
        {
            name: "Brandon Brown",
            demographics: "African American Male",
            background: "Former US Navy veteran",
            origin: "California",
            currentLocation: "Sweden",
            characteristics: [
                "California origin brings West Coast perspective",
                "Naval background with technical aptitude",
                "International perspective living in Sweden",
                "Adapts well to new technologies"
            ],
            personality: "Adaptable, international perspective, technically minded"
        },
        {
            name: "Frank Taylor",
            demographics: "African British Male",
            background: "Former UK Army veteran",
            origin: "Fiji",
            currentLocation: "UK",
            characteristics: [
                "Excellent at reminding instructors to share screen",
                "Fiji background brings Pacific perspective",
                "UK Army experience with attention to detail",
                "Helpful team player who looks out for everyone"
            ],
            personality: "Helpful, detail-oriented, team-focused, observant"
        },
        {
            name: "Fortune Tofa",
            demographics: "African British Male",
            background: "Retiring UK Army soldier",
            origin: "Zimbabwe",
            currentLocation: "UK",
            characteristics: [
                "Very inquisitive and asks great questions",
                "Always thankful and appreciative",
                "Zimbabwe background with UK military service",
                "Brings curiosity and gratitude to learning"
            ],
            personality: "Inquisitive, grateful, curious, appreciative"
        },
        {
            name: "Jacob Phillips",
            demographics: "White American Male",
            background: "Former US Air Force veteran",
            origin: "USA",
            currentLocation: "UK",
            characteristics: [
                "Experienced in commercial IT before MSSA",
                "Air Force technical background",
                "Brings prior IT industry knowledge",
                "Mentor figure for less experienced students"
            ],
            personality: "Experienced, knowledgeable, mentoring, technically skilled"
        },
        {
            name: "Michael Blake",
            demographics: "White American Male",
            background: "Retiring US Army soldier",
            origin: "USA",
            currentLocation: "Germany",
            characteristics: [
                "Amazing with AI agents and automation",
                "Army background with problem-solving skills",
                "Excels at AI and machine learning concepts",
                "Innovation-focused approach to technology"
            ],
            personality: "Innovative, AI-focused, problem-solver, forward-thinking"
        },
        {
            name: "Nicholas Stauffer",
            demographics: "Asian/White American Male",
            background: "Retiring Army soldier",
            origin: "USA",
            currentLocation: "South Korea",
            characteristics: [
                "Sounds like he has answers for everything",
                "Mixed Asian/White heritage brings diverse perspective",
                "Korea-based with international experience",
                "Confident and knowledgeable contributor"
            ],
            personality: "Knowledgeable, confident, well-informed, international perspective"
        },
        {
            name: "Ryan Turney",
            demographics: "White American Male",
            background: "Retiring US Army soldier",
            origin: "USA",
            currentLocation: "Germany",
            characteristics: [
                "Solid Army background with discipline",
                "Germany-based with European perspective",
                "Reliable team member",
                "Steady progress through the programme"
            ],
            personality: "Disciplined, reliable, steady, team-oriented"
        },
        {
            name: "Ty Wolf",
            demographics: "White American Male",
            background: "Retiring US Army soldier",
            origin: "USA",
            currentLocation: "Germany",
            characteristics: [
                "Army background with technical aptitude",
                "Germany-based with international experience",
                "Strong work ethic and determination",
                "Committed to career transition success"
            ],
            personality: "Determined, hardworking, committed, internationally experienced"
        }
    ]
};

// Content Management Functions
class ContentManager {
    constructor() {
        this.slides = slideData;
        this.characters = characterProfiles;
        this.currentSlideIndex = 0;
    }

    // Get slide by index
    getSlide(index) {
        if (index < 0 || index >= this.slides.length) {
            return null;
        }
        return this.slides[index];
    }

    // Get current slide
    getCurrentSlide() {
        return this.getSlide(this.currentSlideIndex);
    }

    // Get total number of slides
    getTotalSlides() {
        return this.slides.length;
    }

    // Get all slides
    getAllSlides() {
        return this.slides;
    }

    // Get character profiles for chatbot context
    getCharacterProfiles() {
        return this.characters;
    }

    // Get all staff members
    getStaff() {
        return this.characters.staff;
    }

    // Get all students  
    getStudents() {
        return this.characters.students;
    }

    // Find character by name
    findCharacter(name) {
        const staff = this.characters.staff.find(person =>
            person.name.toLowerCase().includes(name.toLowerCase())
        );
        if (staff) return staff;

        const student = this.characters.students.find(person =>
            person.name.toLowerCase().includes(name.toLowerCase())
        );
        return student || null;
    }

    // Get slide content formatted for display
    getFormattedSlideContent(index) {
        const slide = this.getSlide(index);
        if (!slide) return null;

        return {
            title: `Week ${slide.weekRange}: ${slide.title}`,
            content: slide.content,
            imagePlaceholder: slide.imagePlaceholder,
            week: slide.week,
            weekRange: slide.weekRange,
            metadata: slide.metadata
        };
    }

    // Get progress information
    getProgressInfo(currentIndex) {
        const total = this.getTotalSlides();
        const current = Math.max(0, Math.min(currentIndex, total - 1));
        const percentage = ((current + 1) / total) * 100;

        return {
            current: current + 1,
            total: total,
            percentage: percentage,
            label: `Week ${this.slides[current].weekRange} of 17`
        };
    }

    // Search slides by content
    searchSlides(query) {
        const searchTerm = query.toLowerCase();
        return this.slides.filter(slide =>
            slide.title.toLowerCase().includes(searchTerm) ||
            slide.content.toLowerCase().includes(searchTerm) ||
            slide.metadata.keyTopics.some(topic =>
                topic.toLowerCase().includes(searchTerm)
            )
        );
    }

    // Get slides by instructor
    getSlidesByInstructor(instructorName) {
        const searchName = instructorName.toLowerCase();
        return this.slides.filter(slide =>
            slide.metadata.instructors.some(instructor =>
                instructor.toLowerCase().includes(searchName)
            )
        );
    }

    // Get chatbot context summary
    getChatbotContext() {
        return {
            cohortName: "Lock, Stock, and Two Smoking Servers",
            programme: "Microsoft Software & Systems Academy (MSSA)",
            duration: "17 weeks (April 7 - August 1, 2025)",
            totalStudents: this.characters.students.length,
            totalStaff: this.characters.staff.length,
            keyMilestones: [
                "PowerShell Fundamentals",
                "Server Administration",
                "Professional Development",
                "Azure Cloud Architecture",
                "Microsoft 365 Management",
                "Industry Certifications"
            ],
            cohortPersonality: "Military veterans transitioning to IT careers with professionalism, humor, and mutual support"
        };
    }
}

// Slideshow Engine Class
class SlideshowEngine {
    constructor(contentManager, options = {}) {
        this.contentManager = contentManager;
        this.currentSlideIndex = 0;
        this.isPlaying = false;
        this.autoAdvanceInterval = null;
        this.transitionDuration = options.transitionDuration || 800;
        this.autoAdvanceDelay = options.autoAdvanceDelay || 10000; // 10 seconds

        // DOM elements
        this.slideContainer = document.getElementById('current-slide');
        this.slideTitle = document.getElementById('slide-title');
        this.slideContent = document.getElementById('slide-content');
        this.slideImage = document.getElementById('slide-image');
        this.progressFill = document.getElementById('progress-fill');
        this.progressLabel = document.getElementById('progress-label');

        // Bind methods to preserve context
        this.nextSlide = this.nextSlide.bind(this);
        this.previousSlide = this.previousSlide.bind(this);
        this.goToSlide = this.goToSlide.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);

        console.log('SlideshowEngine initialized');
    }

    // Start the slideshow with auto-advancement
    start() {
        console.log('Starting slideshow');
        this.isPlaying = true;
        this.renderCurrentSlide();
        this.startAutoAdvancement();
        this.updatePlayPauseButton();
    }

    // Pause auto-advancement
    pause() {
        console.log('Pausing slideshow');
        this.isPlaying = false;
        this.stopAutoAdvancement();
        this.updatePlayPauseButton();
    }

    // Resume auto-advancement
    resume() {
        console.log('Resuming slideshow');
        this.isPlaying = true;
        this.startAutoAdvancement();
        this.updatePlayPauseButton();
    }

    // Navigate to next slide
    nextSlide() {
        const nextIndex = (this.currentSlideIndex + 1) % this.contentManager.getTotalSlides();
        this.goToSlide(nextIndex);
    }

    // Navigate to previous slide
    previousSlide() {
        const totalSlides = this.contentManager.getTotalSlides();
        const prevIndex = (this.currentSlideIndex - 1 + totalSlides) % totalSlides;
        this.goToSlide(prevIndex);
    }

    // Navigate to specific slide by index
    goToSlide(index) {
        if (index < 0 || index >= this.contentManager.getTotalSlides()) {
            console.warn(`Invalid slide index: ${index}`);
            return;
        }

        console.log(`Navigating to slide ${index + 1}`);
        this.currentSlideIndex = index;
        this.renderCurrentSlide();

        // Reset auto-advancement timer if playing
        if (this.isPlaying) {
            this.stopAutoAdvancement();
            this.startAutoAdvancement();
        }
    }

    // Render the current slide content
    renderCurrentSlide() {
        const slideContent = this.contentManager.getFormattedSlideContent(this.currentSlideIndex);
        if (!slideContent) {
            console.error('Failed to get slide content');
            return;
        }

        // Add transition class for smooth animation
        if (this.slideContainer) {
            this.slideContainer.classList.add('slide--transitioning');
        }

        // Update slide content with a slight delay for smooth transition
        setTimeout(() => {
            this.updateSlideContent(slideContent);
            this.updateProgress();
            this.notifySlideChange();

            // Remove transition class after animation
            setTimeout(() => {
                if (this.slideContainer) {
                    this.slideContainer.classList.remove('slide--transitioning');
                }
            }, this.transitionDuration);
        }, 50);
    }

    // Update slide content in DOM
    updateSlideContent(slideContent) {
        if (this.slideTitle) {
            this.slideTitle.textContent = slideContent.title;
        }

        if (this.slideContent) {
            this.slideContent.innerHTML = `<p>${slideContent.content}</p>`;
        }

        if (this.slideImage) {
            this.slideImage.innerHTML = `
                <div class="image-placeholder">
                    <span class="image-placeholder__text">${slideContent.imagePlaceholder}</span>
                </div>
            `;
        }
    }

    // Update progress bar
    updateProgress() {
        // Update progress tracker if available
        if (window.progressTracker) {
            window.progressTracker.updateProgress(this.currentSlideIndex);
        } else {
            // Fallback to direct DOM updates
            const progressInfo = this.contentManager.getProgressInfo(this.currentSlideIndex);

            if (this.progressFill) {
                this.progressFill.style.width = `${progressInfo.percentage}%`;
            }

            if (this.progressLabel) {
                this.progressLabel.textContent = progressInfo.label;
            }
        }
    }

    // Start auto-advancement timer
    startAutoAdvancement() {
        this.stopAutoAdvancement(); // Clear any existing timer
        this.autoAdvanceInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoAdvanceDelay);
    }

    // Stop auto-advancement timer
    stopAutoAdvancement() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }

    // Update play/pause button appearance
    updatePlayPauseButton() {
        const playPauseIcon = document.getElementById('play-pause-icon');
        const playPauseBtn = document.getElementById('play-pause-btn');

        if (playPauseIcon) {
            playPauseIcon.textContent = this.isPlaying ? '⏸' : '▶';
        }

        if (playPauseBtn) {
            playPauseBtn.setAttribute('aria-label', this.isPlaying ? 'Pause slideshow' : 'Play slideshow');
        }
    }

    // Get current slide information
    getCurrentSlideInfo() {
        return {
            index: this.currentSlideIndex,
            total: this.contentManager.getTotalSlides(),
            isPlaying: this.isPlaying,
            slide: this.contentManager.getCurrentSlide()
        };
    }

    // Toggle play/pause state
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }

    // Notify navigation controller when slide changes
    notifySlideChange() {
        if (window.navigationController) {
            window.navigationController.updateButtonStates();
        }
    }
}

// Initialize Content Manager and Slideshow Engine
const contentManager = new ContentManager();
let slideshowEngine;
let progressTracker;
let navigationController;

// DOM Content Loaded Event Handler
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - Initializing application');
    console.log(`Loaded ${contentManager.getTotalSlides()} slides`);
    console.log(`Character profiles: ${contentManager.getStaff().length} staff, ${contentManager.getStudents().length} students`);

    // Initialize components
    try {
        // Initialize progress tracker first
        progressTracker = new ProgressTracker(contentManager);
        window.progressTracker = progressTracker;

        // Initialize slideshow engine
        slideshowEngine = new SlideshowEngine(contentManager);
        window.slideshowEngine = slideshowEngine;

        // Initialize navigation controller
        navigationController = new NavigationController(slideshowEngine, progressTracker);
        window.navigationController = navigationController;

        // Set up navigation controls
        setupNavigationControls();

        // Set up modal functionality
        setupModalFunctionality();

        // Start the slideshow
        slideshowEngine.start();

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});

// Progress Tracker Class
class ProgressTracker {
    constructor(contentManager) {
        this.contentManager = contentManager;
        this.currentSlideIndex = 0;

        // DOM elements
        this.progressBar = document.getElementById('progress-section');
        this.progressFill = document.getElementById('progress-fill');
        this.progressLabel = document.getElementById('progress-label');
        this.progressSegments = document.getElementById('progress-segments');

        // Bind methods
        this.handleSegmentClick = this.handleSegmentClick.bind(this);
        this.handleSegmentHover = this.handleSegmentHover.bind(this);

        this.initializeSegments();
        console.log('ProgressTracker initialized');
    }

    // Initialize progress bar segments
    initializeSegments() {
        if (!this.progressSegments) return;

        const totalSlides = this.contentManager.getTotalSlides();
        this.progressSegments.innerHTML = '';

        // Create individual segments for each slide
        for (let i = 0; i < totalSlides; i++) {
            const segment = document.createElement('div');
            segment.className = 'progress__segment';
            segment.dataset.slideIndex = i;

            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'progress__tooltip';
            const slide = this.contentManager.getSlide(i);
            tooltip.textContent = `Week ${slide.weekRange}: ${slide.title}`;

            segment.appendChild(tooltip);
            segment.addEventListener('click', this.handleSegmentClick);

            this.progressSegments.appendChild(segment);
        }

        console.log(`Created ${totalSlides} progress segments`);
    }

    // Handle segment click navigation
    handleSegmentClick(event) {
        const segment = event.currentTarget;
        const slideIndex = parseInt(segment.dataset.slideIndex);

        if (slideIndex >= 0 && slideIndex < this.contentManager.getTotalSlides()) {
            console.log(`Progress segment clicked: navigating to slide ${slideIndex + 1}`);

            // Notify slideshow engine to navigate
            if (window.slideshowEngine) {
                window.slideshowEngine.goToSlide(slideIndex);
            }

            // Pause auto-advancement temporarily
            if (window.navigationController) {
                window.navigationController.pauseAutoAdvancementTemporarily();
            }
        }
    }

    // Update progress display
    updateProgress(slideIndex) {
        this.currentSlideIndex = slideIndex;
        const progressInfo = this.contentManager.getProgressInfo(slideIndex);

        // Update progress fill
        if (this.progressFill) {
            this.progressFill.style.width = `${progressInfo.percentage}%`;
        }

        // Update progress label
        if (this.progressLabel) {
            this.progressLabel.textContent = progressInfo.label;
        }

        // Update active segment
        this.updateActiveSegment(slideIndex);
    }

    // Update active segment highlighting
    updateActiveSegment(slideIndex) {
        if (!this.progressSegments) return;

        const segments = this.progressSegments.querySelectorAll('.progress__segment');
        segments.forEach((segment, index) => {
            if (index === slideIndex) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
    }

    // Get progress information
    getProgressInfo() {
        return this.contentManager.getProgressInfo(this.currentSlideIndex);
    }

    // Reset progress (for slideshow loop)
    reset() {
        this.updateProgress(0);
    }
}

// Navigation Controller Class
class NavigationController {
    constructor(slideshowEngine, progressTracker) {
        this.slideshowEngine = slideshowEngine;
        this.progressTracker = progressTracker;
        this.isUserInteracting = false;
        this.userInteractionTimeout = null;

        // DOM elements
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.progressBar = document.getElementById('progress-section');
        this.progressFill = document.getElementById('progress-fill');

        // Bind methods to preserve context
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleProgressClick = this.handleProgressClick.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);

        console.log('NavigationController initialized');
    }

    // Initialize all event listeners
    bindEvents() {
        // Button event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', this.handlePrevious);
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', this.handleNext);
        }

        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', this.handlePlayPause);
        }

        // Progress bar click navigation
        if (this.progressBar) {
            this.progressBar.addEventListener('click', this.handleProgressClick);

            // Add hover effects for progress bar
            this.progressBar.addEventListener('mouseenter', () => {
                this.progressBar.style.cursor = 'pointer';
            });

            this.progressBar.addEventListener('mouseleave', () => {
                this.progressBar.style.cursor = 'default';
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard);

        console.log('Navigation events bound successfully');
    }

    // Handle previous button click
    handlePrevious() {
        console.log('Previous button clicked');
        this.pauseAutoAdvancementTemporarily();
        this.slideshowEngine.previousSlide();
    }

    // Handle next button click
    handleNext() {
        console.log('Next button clicked');
        this.pauseAutoAdvancementTemporarily();
        this.slideshowEngine.nextSlide();
    }

    // Handle play/pause button click
    handlePlayPause() {
        console.log('Play/Pause button clicked');
        this.slideshowEngine.togglePlayPause();
    }

    // Handle progress bar click navigation
    handleProgressClick(event) {
        // Only handle clicks on the progress bar itself, not other elements
        if (!event.target.closest('.progress__bar')) {
            return;
        }

        const progressBar = event.target.closest('.progress__bar');
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const progressWidth = rect.width;
        const clickPercentage = (clickX / progressWidth) * 100;

        // Calculate which slide to navigate to based on click position
        const totalSlides = this.slideshowEngine.contentManager.getTotalSlides();
        const targetSlideIndex = Math.floor((clickPercentage / 100) * totalSlides);
        const clampedIndex = Math.max(0, Math.min(targetSlideIndex, totalSlides - 1));

        console.log(`Progress bar clicked at ${clickPercentage.toFixed(1)}%, navigating to slide ${clampedIndex + 1}`);

        this.pauseAutoAdvancementTemporarily();
        this.slideshowEngine.goToSlide(clampedIndex);
    }

    // Handle keyboard navigation
    handleKeyboard(event) {
        // Don't handle keyboard events if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                console.log('Left arrow key pressed');
                this.pauseAutoAdvancementTemporarily();
                this.slideshowEngine.previousSlide();
                break;

            case 'ArrowRight':
                event.preventDefault();
                console.log('Right arrow key pressed');
                this.pauseAutoAdvancementTemporarily();
                this.slideshowEngine.nextSlide();
                break;

            case ' ': // Spacebar
                event.preventDefault();
                console.log('Spacebar pressed');
                this.slideshowEngine.togglePlayPause();
                break;

            case 'Home':
                event.preventDefault();
                console.log('Home key pressed');
                this.pauseAutoAdvancementTemporarily();
                this.slideshowEngine.goToSlide(0);
                break;

            case 'End':
                event.preventDefault();
                console.log('End key pressed');
                this.pauseAutoAdvancementTemporarily();
                const lastSlideIndex = this.slideshowEngine.contentManager.getTotalSlides() - 1;
                this.slideshowEngine.goToSlide(lastSlideIndex);
                break;
        }
    }

    // Pause auto-advancement temporarily when user interacts
    pauseAutoAdvancementTemporarily() {
        if (!this.slideshowEngine.isPlaying) {
            return; // Don't interfere if slideshow is already paused
        }

        this.isUserInteracting = true;

        // Clear any existing timeout
        if (this.userInteractionTimeout) {
            clearTimeout(this.userInteractionTimeout);
        }

        // Temporarily stop auto-advancement
        this.slideshowEngine.stopAutoAdvancement();

        // Resume auto-advancement after 3 seconds of no interaction
        this.userInteractionTimeout = setTimeout(() => {
            if (this.slideshowEngine.isPlaying && this.isUserInteracting) {
                console.log('Resuming auto-advancement after user interaction timeout');
                this.slideshowEngine.startAutoAdvancement();
                this.isUserInteracting = false;
            }
        }, 3000);
    }

    // Update button states based on current slide
    updateButtonStates() {
        const currentInfo = this.slideshowEngine.getCurrentSlideInfo();

        // Update previous button state
        if (this.prevBtn) {
            this.prevBtn.disabled = false; // Always enabled since we loop
            this.prevBtn.setAttribute('aria-label',
                `Previous slide (${currentInfo.index === 0 ? currentInfo.total : currentInfo.index} of ${currentInfo.total})`
            );
        }

        // Update next button state
        if (this.nextBtn) {
            this.nextBtn.disabled = false; // Always enabled since we loop
            this.nextBtn.setAttribute('aria-label',
                `Next slide (${currentInfo.index + 2 > currentInfo.total ? 1 : currentInfo.index + 2} of ${currentInfo.total})`
            );
        }

        // Update play/pause button
        this.updatePlayPauseButton();
    }

    // Update play/pause button appearance and state
    updatePlayPauseButton() {
        const playPauseIcon = document.getElementById('play-pause-icon');

        if (playPauseIcon) {
            playPauseIcon.textContent = this.slideshowEngine.isPlaying ? '⏸' : '▶';
        }

        if (this.playPauseBtn) {
            this.playPauseBtn.setAttribute('aria-label',
                this.slideshowEngine.isPlaying ? 'Pause slideshow' : 'Play slideshow'
            );

            // Update button class for styling
            if (this.slideshowEngine.isPlaying) {
                this.playPauseBtn.classList.remove('btn--play');
                this.playPauseBtn.classList.add('btn--pause');
            } else {
                this.playPauseBtn.classList.remove('btn--pause');
                this.playPauseBtn.classList.add('btn--play');
            }
        }
    }

    // Add visual feedback for user interactions
    addInteractionFeedback(element) {
        if (!element) return;

        element.classList.add('btn--active');
        setTimeout(() => {
            element.classList.remove('btn--active');
        }, 150);
    }

    // Get current navigation state
    getNavigationState() {
        return {
            isUserInteracting: this.isUserInteracting,
            currentSlide: this.slideshowEngine.getCurrentSlideInfo(),
            isPlaying: this.slideshowEngine.isPlaying
        };
    }

    // Cleanup method for removing event listeners
    destroy() {
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.handlePrevious);
        }

        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.handleNext);
        }

        if (this.playPauseBtn) {
            this.playPauseBtn.removeEventListener('click', this.handlePlayPause);
        }

        if (this.progressBar) {
            this.progressBar.removeEventListener('click', this.handleProgressClick);
        }

        document.removeEventListener('keydown', this.handleKeyboard);

        if (this.userInteractionTimeout) {
            clearTimeout(this.userInteractionTimeout);
        }

        console.log('NavigationController destroyed');
    }
}

// Setup navigation controls (updated to use NavigationController)
function setupNavigationControls() {
    // Bind all navigation events
    if (window.navigationController) {
        window.navigationController.bindEvents();

        // Update button states initially
        window.navigationController.updateButtonStates();
    }

    console.log('Navigation controls setup completed');
}

// ChatbotInterface Class
class ChatbotInterface {
    constructor(contentManager) {
        this.contentManager = contentManager;
        this.messageHistory = [];
        this.isTyping = false;
        this.messageIdCounter = 0;

        // DOM elements
        this.modal = document.getElementById('chatbot-modal');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatSend = document.getElementById('chat-send');
        this.modalClose = document.getElementById('modal-close');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.chatbotBtn = document.getElementById('chatbot-btn');

        // Bind methods to preserve context
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);

        this.initializeEventListeners();
        console.log('ChatbotInterface initialized');
    }

    // Initialize event listeners
    initializeEventListeners() {
        if (this.chatbotBtn) {
            this.chatbotBtn.addEventListener('click', this.openModal);
        }

        if (this.modalClose) {
            this.modalClose.addEventListener('click', this.closeModal);
        }

        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', this.closeModal);
        }

        if (this.chatSend) {
            this.chatSend.addEventListener('click', this.handleSendClick);
        }

        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', this.handleKeyPress);
            this.chatInput.addEventListener('input', this.handleInputChange.bind(this));
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });
    }

    // Open the chatbot modal
    openModal() {
        if (!this.modal) return;

        console.log('Opening chatbot modal');
        this.modal.classList.add('show');
        this.modal.style.display = 'block';
        this.modal.setAttribute('aria-hidden', 'false');

        // Focus on input field
        setTimeout(() => {
            if (this.chatInput) {
                this.chatInput.focus();
            }
        }, 100);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close the chatbot modal
    closeModal() {
        if (!this.modal) return;

        console.log('Closing chatbot modal');
        this.modal.classList.remove('show');

        // Add fade out animation
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.modal.setAttribute('aria-hidden', 'true');
        }, 300);

        // Restore body scroll
        document.body.style.overflow = '';

        // Clear any typing indicators
        this.hideTypingIndicator();
    }

    // Check if modal is open
    isModalOpen() {
        return this.modal && this.modal.style.display === 'block';
    }

    // Handle Enter key press in input field
    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSendClick();
        }
    }

    // Handle send button click
    handleSendClick() {
        const message = this.chatInput?.value?.trim();
        if (message && !this.isTyping) {
            this.sendMessage(message);
        }
    }

    // Handle input field changes
    handleInputChange() {
        const message = this.chatInput?.value?.trim();
        const sendButton = this.chatSend;

        if (sendButton) {
            sendButton.disabled = !message || this.isTyping;
        }
    }

    // Send a message to the chatbot
    async sendMessage(message) {
        if (!message || this.isTyping) return;

        console.log('Sending message:', message);

        // Add user message to chat with sending status
        const userMessageId = this.addMessage(message, 'user', 'sending');

        // Clear input field
        if (this.chatInput) {
            this.chatInput.value = '';
        }

        // Update send button state
        this.handleInputChange();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Call Azure Functions API with retry mechanism
            const response = await this.callChatAPI(message);

            // Hide typing indicator
            this.hideTypingIndicator();

            // Update user message status to sent
            this.updateMessageStatus(userMessageId, 'sent');

            // Add bot response
            this.addMessage(response, 'bot');

        } catch (error) {
            console.error('Error sending message:', error);

            // Hide typing indicator
            this.hideTypingIndicator();

            // Update user message status to error
            this.updateMessageStatus(userMessageId, 'error');

            // Add retry button to failed message
            this.addRetryButton(userMessageId);

            // Show appropriate error message based on error type
            const errorMessage = this.getErrorMessage(error);
            this.addMessage(errorMessage, 'bot', 'error');

            // Check and show connection status if needed
            const isConnected = await this.checkAPIConnectivity();
            if (!isConnected) {
                this.showConnectionStatus(false);
            }
        }
    }

    // Add a message to the chat display
    addMessage(content, sender, status = 'sent') {
        if (!this.chatMessages) return;

        const messageId = `msg-${++this.messageIdCounter}`;
        const timestamp = new Date();

        // Create message object
        const messageObj = {
            id: messageId,
            content: content,
            sender: sender,
            timestamp: timestamp,
            status: status
        };

        // Add to message history
        this.messageHistory.push(messageObj);

        // Create message element
        const messageElement = this.createMessageElement(messageObj);

        // Add to chat display
        this.chatMessages.appendChild(messageElement);

        // Scroll to bottom
        this.scrollToBottom();

        console.log(`Added ${sender} message:`, content);
        
        // Return message ID for status updates
        return messageId;
    }

    // Create a message DOM element
    createMessageElement(messageObj) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat__message chat__message--${messageObj.sender}`;
        messageDiv.id = messageObj.id;

        if (messageObj.status === 'sending') {
            messageDiv.classList.add('chat__message--sending');
        } else if (messageObj.status === 'error') {
            messageDiv.classList.add('chat__message--error');
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'chat__message-content';

        const textElement = document.createElement('p');
        textElement.textContent = messageObj.content;
        contentDiv.appendChild(textElement);

        messageDiv.appendChild(contentDiv);

        // Add status indicator for user messages
        if (messageObj.sender === 'user' && messageObj.status !== 'sent') {
            const statusDiv = document.createElement('div');
            statusDiv.className = 'chat__message-status';
            statusDiv.textContent = this.getStatusText(messageObj.status);
            messageDiv.appendChild(statusDiv);
        }

        return messageDiv;
    }

    // Get status text for message status
    getStatusText(status) {
        switch (status) {
            case 'sending': return 'Sending...';
            case 'sent': return 'Sent';
            case 'error': return 'Failed to send';
            default: return '';
        }
    }

    // Show typing indicator with optional custom message
    showTypingIndicator(message = 'The cohort is typing') {
        if (!this.chatMessages || this.isTyping) return;

        this.isTyping = true;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat__typing';
        typingDiv.id = 'typing-indicator';

        const typingContent = document.createElement('div');
        typingContent.className = 'chat__typing-content';

        const typingText = document.createElement('span');
        typingText.textContent = message;

        const typingDots = document.createElement('div');
        typingDots.className = 'chat__typing-dots';

        // Create three animated dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'chat__typing-dot';
            typingDots.appendChild(dot);
        }

        typingContent.appendChild(typingText);
        typingContent.appendChild(typingDots);
        typingDiv.appendChild(typingContent);

        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();

        // Update input state
        this.handleInputChange();
    }

    // Hide typing indicator
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }

        this.isTyping = false;

        // Update input state
        this.handleInputChange();
    }

    // Scroll chat to bottom
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    // Call Azure Functions Chat API with retry mechanism
    async callChatAPI(message, retryCount = 0) {
        const maxRetries = 3;
        const baseDelay = 1000; // 1 second base delay
        
        try {
            console.log(`Calling chat API (attempt ${retryCount + 1}/${maxRetries + 1})`);
            
            // Determine API endpoint - use relative path for Azure Static Web Apps
            const apiEndpoint = '/api/chat';
            
            // Prepare request payload
            const requestPayload = {
                message: message.trim(),
                timestamp: new Date().toISOString()
            };
            
            // Make API call with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestPayload),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Check if response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API Error ${response.status}: ${errorData.error || response.statusText}`);
            }
            
            // Parse response
            const responseData = await response.json();
            
            // Validate response structure
            if (!responseData.success || !responseData.message) {
                throw new Error('Invalid response format from API');
            }
            
            console.log('Chat API call successful');
            return responseData.message;
            
        } catch (error) {
            console.error(`Chat API call failed (attempt ${retryCount + 1}):`, error);
            
            // Check if we should retry
            if (retryCount < maxRetries && this.shouldRetry(error)) {
                const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
                console.log(`Retrying in ${delay}ms...`);
                
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.callChatAPI(message, retryCount + 1);
            }
            
            // If all retries failed or error is not retryable, throw the error
            throw error;
        }
    }
    
    // Determine if an error should trigger a retry
    shouldRetry(error) {
        // Retry on network errors, timeouts, and certain HTTP status codes
        if (error.name === 'AbortError') return true; // Timeout
        if (error.message.includes('Failed to fetch')) return true; // Network error
        if (error.message.includes('API Error 429')) return true; // Rate limit
        if (error.message.includes('API Error 500')) return true; // Server error
        if (error.message.includes('API Error 502')) return true; // Bad gateway
        if (error.message.includes('API Error 503')) return true; // Service unavailable
        if (error.message.includes('API Error 504')) return true; // Gateway timeout
        
        return false;
    }
    
    // Update message status in the UI
    updateMessageStatus(messageId, status) {
        const messageElement = document.getElementById(messageId);
        if (!messageElement) return;
        
        // Update message object in history
        const messageObj = this.messageHistory.find(msg => msg.id === messageId);
        if (messageObj) {
            messageObj.status = status;
        }
        
        // Update DOM element classes
        messageElement.classList.remove('chat__message--sending', 'chat__message--error');
        if (status === 'sending') {
            messageElement.classList.add('chat__message--sending');
        } else if (status === 'error') {
            messageElement.classList.add('chat__message--error');
        }
        
        // Update status text for user messages
        if (messageObj && messageObj.sender === 'user') {
            let statusElement = messageElement.querySelector('.chat__message-status');
            if (!statusElement && status !== 'sent') {
                statusElement = document.createElement('div');
                statusElement.className = 'chat__message-status';
                messageElement.appendChild(statusElement);
            }
            
            if (statusElement) {
                statusElement.textContent = this.getStatusText(status);
                if (status === 'sent') {
                    statusElement.style.display = 'none';
                } else {
                    statusElement.style.display = 'block';
                }
            }
        }
    }
    
    // Get appropriate error message based on error type
    getErrorMessage(error) {
        if (error.name === 'AbortError') {
            return "The request timed out. Please check your connection and try again.";
        }
        
        if (error.message.includes('Failed to fetch')) {
            return "Unable to connect to the chat service. Please check your internet connection and try again.";
        }
        
        if (error.message.includes('API Error 429')) {
            return "Too many requests. Please wait a moment before sending another message.";
        }
        
        if (error.message.includes('API Error 503') || error.message.includes('Service temporarily unavailable')) {
            return "The chat service is temporarily unavailable. Please try again in a few moments.";
        }
        
        if (error.message.includes('API Error 500') || error.message.includes('API Error 502') || error.message.includes('API Error 504')) {
            return "There's a temporary issue with the chat service. Please try again.";
        }
        
        if (error.message.includes('Invalid response format')) {
            return "Received an unexpected response from the chat service. Please try again.";
        }
        
        // Generic error message
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }



    // Get message history
    getMessageHistory() {
        return this.messageHistory;
    }

    // Clear message history
    clearMessageHistory() {
        this.messageHistory = [];
        if (this.chatMessages) {
            // Keep only the initial welcome message
            const welcomeMessage = this.chatMessages.querySelector('.chat__message--bot');
            this.chatMessages.innerHTML = '';
            if (welcomeMessage) {
                this.chatMessages.appendChild(welcomeMessage);
            }
        }
        console.log('Message history cleared');
    }

    // Handle error display
    displayError(errorMessage) {
        this.addMessage(errorMessage, 'bot', 'error');
    }
    
    // Check API connectivity
    async checkAPIConnectivity() {
        try {
            const response = await fetch('/api/chat', {
                method: 'OPTIONS',
                headers: {
                    'Accept': 'application/json'
                }
            });
            return response.ok;
        } catch (error) {
            console.warn('API connectivity check failed:', error);
            return false;
        }
    }
    
    // Add connection status indicator to chat
    showConnectionStatus(isConnected) {
        const existingStatus = document.getElementById('connection-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        if (!isConnected && this.chatMessages) {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'connection-status';
            statusDiv.className = 'chat__connection-status chat__connection-status--offline';
            statusDiv.innerHTML = `
                <span class="chat__connection-icon">⚠️</span>
                <span class="chat__connection-text">Connection issues detected. Responses may be delayed.</span>
            `;
            
            // Insert at the top of chat messages
            this.chatMessages.insertBefore(statusDiv, this.chatMessages.firstChild);
        }
    }
    
    // Add retry button for failed messages
    addRetryButton(messageId) {
        const messageElement = document.getElementById(messageId);
        if (!messageElement) return;
        
        const existingRetry = messageElement.querySelector('.chat__retry-button');
        if (existingRetry) return; // Already has retry button
        
        const retryButton = document.createElement('button');
        retryButton.className = 'chat__retry-button';
        retryButton.textContent = 'Retry';
        retryButton.setAttribute('aria-label', 'Retry sending message');
        
        // Find the original message content
        const messageObj = this.messageHistory.find(msg => msg.id === messageId);
        if (messageObj && messageObj.sender === 'user') {
            retryButton.addEventListener('click', () => {
                // Remove the failed message
                messageElement.remove();
                // Remove from history
                const index = this.messageHistory.findIndex(msg => msg.id === messageId);
                if (index > -1) {
                    this.messageHistory.splice(index, 1);
                }
                // Retry sending
                this.sendMessage(messageObj.content);
            });
            
            messageElement.appendChild(retryButton);
        }
    }
}

// Setup modal functionality
function setupModalFunctionality() {
    // Initialize ChatbotInterface
    if (window.contentManager) {
        window.chatbotInterface = new ChatbotInterface(window.contentManager);
        console.log('Chatbot interface initialized');
    } else {
        console.error('ContentManager not available for ChatbotInterface');
    }
}

// Fix logo paths in script.js
const flashLogoImages = [
    {
        src: "./images/logos/1.png", // Changed from "/images/logos/1.png"
        alt: "Cohort Logo Concept 1"
    },
    {
        src: "./images/logos/2.png",
        alt: "Cohort Logo Concept 2"
    },
    {
        src: "./images/logos/3.png",
        alt: "Cohort Logo Concept 3"
    },
    {
        src: "./images/logos/4.png",
        alt: "Cohort Logo Concept 4"
    },
    {
        src: "./images/logos/5.png",
        alt: "Cohort Logo Concept 5"
    },
    {
        src: "./images/logos/6.png",
        alt: "Cohort Logo Concept 6"
    },
    {
        src: "./images/logos/7.png", // Changed from "/images/logos/7.png" 
        alt: "Cohort Logo Concept 7"
    },
    {
        src: "./images/logos/8.png",
        alt: "Cohort Logo Concept 8"
    },
    {
        src: "./images/logos/9.png",
        alt: "Cohort Logo Concept 9"
    },
    {
        src: "./images/logos/10.png",
        alt: "Cohort Logo Concept 10"
    },
    {
        src: "./images/logos/11.png",
        alt: "Cohort Logo Concept 11"
    },
    {
        src: "./images/logos/12.png",
        alt: "Cohort Logo Concept 12"
    },
    {
        src: "./images/logos/13.png",
        alt: "Cohort Logo Concept 13"
    },
    {
        src: "./images/logos/14.png",
        alt: "Cohort Logo Concept 14"
    },
    {
        src: "./images/logos/15.png",
        alt: "Cohort Logo Concept 15"
    },
    {
        src: "./images/logos/16.png",
        alt: "Cohort Logo Concept 16"
    },
    {
        src: "./images/logos/17.png",
        alt: "Cohort Logo Concept 17"
    },
    {
        src: "./images/logos/18.png",
        alt: "Cohort Logo Concept 18"
    },
    {
        src: "./images/logos/19.png",
        alt: "Cohort Logo Concept 19"
    },
    {
        src: "./images/logos/20.png",
        alt: "Cohort Logo Concept 20"
    }
];

