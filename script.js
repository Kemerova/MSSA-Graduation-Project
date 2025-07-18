function createDiv(className, onClick) {
  const div = document.createElement('div');
  if (className) div.className = className;
  if (onClick) div.addEventListener('click', onClick);
  return div;
}

function setImage(imgElem, { src, alt }) {
  if (imgElem) {
    imgElem.src = src;
    imgElem.alt = alt;
  }
}

function showLogo(type, idx) {
  const logos = type === 'flash' ? flashLogoImages : displayLogoImages;
  const logo = logos[idx % logos.length];
  return logo;
}

function updateSlideLogo(index, withTransition = true) {
  const slideLogo = document.getElementById('slideLogoImage');
  if (!slideLogo) return;
  
  const logo = showLogo('display', index);
  
  if (withTransition) {
    // Add fade-out transition
    slideLogo.style.opacity = '0';
    slideLogo.style.transform = 'scale(0.9)';
    
    // After fade-out, update the image and fade back in
    setTimeout(() => {
      setImage(slideLogo, logo);
      slideLogo.style.opacity = '1';
      slideLogo.style.transform = 'scale(1)';
    }, 300);
  } else {
    // Update immediately without transition
    setImage(slideLogo, logo);
  }
}
// Lock, Stock, and Two Smoking Servers: A MSSA Odyssey
console.log('🎓 Lock, Stock, and Two Smoking Servers: A MSSA Odyssey - Loading...');

// Slide Data - 7 slides for the MSSA Odyssey
const slideData = [
    {
        week: 1,
        weekRange: "Introduction",
        title: "Lock, Stock, and Two Smoking Servers: A MSSA Odyssey",
        content: "Who's on the call?<br><br><strong>Brandon Brown</strong> - California → Sweden<br>&nbsp;&nbsp;&nbsp;&nbsp;U.S. Navy vet with bottomless energy and pop-culture hype-man<br><br><strong>Frank Taylor</strong> - Fiji → UK<br>&nbsp;&nbsp;&nbsp;&nbsp;Ex-British Army, quiet curator of FYI links and supportive nods<br><br><strong>Fortune Tofa</strong> - Zimbabwe → UK<br>&nbsp;&nbsp;&nbsp;&nbsp;Retiring British Army, unfailingly courteous (very many thanks)<br><br><strong>Jacob Phillips</strong> - USA → UK<br>&nbsp;&nbsp;&nbsp;&nbsp;Ex-U.S. Air Force, GitHub-dropping organizer with dry sarcasm<br><br><strong>Michael Blake</strong> - USA → Germany<br>&nbsp;&nbsp;&nbsp;&nbsp;Retiring U.S. Army, AI-image spammer battling Wiesbaden Wi-Fi<br><br><strong>Nicholas Nick Stauffer</strong> - Asian/White American, USA → South Korea<br>&nbsp;&nbsp;&nbsp;&nbsp;Retiring Army, pun-loving morale-booster (Good one!)<br><br><strong>Ryan Turney</strong> - USA → Germany<br>&nbsp;&nbsp;&nbsp;&nbsp;Retiring U.S. Army, laid-back gamer calmly reporting hardware hiccups<br><br><strong>Ty Wolf</strong> - USA → Germany<br>&nbsp;&nbsp;&nbsp;&nbsp;Retiring U.S. Army, blunt meme-lord ending every post with Thoughts?<br><br><strong>Fiona Jones</strong> - UK<br>&nbsp;&nbsp;&nbsp;&nbsp;Career Development Manager, punctual attendance enforcer and Friday ProDev drill-sergeant (Remember the swan act!)<br><br><strong>The (very) short story</strong><br><br>Ladies and gentlemen, mentors, instructors, and fellow graduates—welcome to the saga of Lock, Stock, and Two Smoking Servers. From 7 April to 1 August 2025, eight veterans-turned-tech-wizards spent 17 gloriously grueling weeks navigating the uncharted waters of Microsoft's Software and Systems Academy.",
        image: "images/1.jpg",
        imagePlaceholder: "Comic-book style panel showing a diverse group of military veterans in uniform transitioning to casual tech attire, gathered around glowing computer screens. In the background, a calendar flips from April 7 to August 1, 2025, with Azure clouds and PowerShell code swirling like a storm. Title text overlays: \"Lock, Stock, and Two Smoking Servers.\""
    },
    {
        week: 2,
        weekRange: "1-2",
        title: "The Power-Hell Chronicles",
        content: "Our adventure kicked off with PowerShell in weeks 1 and 2, taught by the brilliant Mike Howell, a white British master of scripting. Most of us had zero programming background, so it felt like boot camp all over again—hence our nickname: \"Power-Hell.\" Commands like Get-ChildItem and Invoke-WebRequest became our new drill sergeants. We learned to automate tasks, debug errors, and build scripts that could manage files like a well-oiled platoon. Amid the chaos, Frank's quirk shone: he'd politely but firmly remind Mike, \"Instructor, share your screen!\" saving us from endless confusion. And Michael? He amazed us weekly by using AI to build agents that automated even more—turning \"Power-Hell\" into a playground, complete with his lighthearted complaints about \"Iran hax\" connectivity.\n\nEarly on, we brainstormed our cohort identity. Brandon, our high-energy cheerleader and pop-culture punster, hyped ideas like \"Lock, Stock, and Two Smoking Servers,\" a nod to the film (which Ryan humbly admitted he'd never seen, preferring weekend \"brainrot\" gaming). Ty, ever the provocateur, dropped edgy memes to stir the pot and drafted agendas to keep us on track, while Nick fired off punny alternatives like he had answers for everything, starting with enthusiastic thanks. We voted—Brandon insisting on proper capitalization and structured polls—and settled on it, complete with AI-generated banners from Michael's exuberant spams.",
        image: "images/2.jpg",
        imagePlaceholder: "Split-panel comic: Left side shows frustrated students at keyboards with flames around \"Power-Hell\" code; right side depicts Mike Howell teaching, with PowerShell scripts as superhero capes. Include quirky details like Frank yelling \"Share your screen!\""
    },
    {
        week: 3,
        weekRange: "3-9",
        title: "ProDev with Fiona",
        content: "Fridays brought ProDev with Fiona, where we'd rehearse our \"Tell Me About Yourself\" pitches. The first weeks? Rough. We'd stumble, defaulting to \"we\" and \"team\" like true military folk—talking about ourselves felt unnatural. Fortune, always courteous, thanked presenters profusely with his traditional \"lads\" and \"excellent effort,\" and asked insightful questions. Mentors volunteered weekly, sharing experiences and easing concerns: resume tips, networking hacks, imposter syndrome battles. By ProDev week (week 9), it was a blast—mock interviews, role-plays, and revelations. We learned soft skills like emotional intelligence, LinkedIn optimization, and crafting STAR stories for behavioral questions. Jacob, with his commercial IT experience, spoke knowledgeably about the civilian world, guiding us like a veteran scout with helpful lists and upskilling nudges.",
        image: "images/3.jpg",
        imagePlaceholder: "Dynamic comic sequence: Students in swan poses above water (calm faces), legs flailing below; background has interview microphones and \"Tell Me About Yourself\" speech bubbles filled with \"we\" and \"team.\""
    },
    {
        week: 4,
        weekRange: "3-8",
        title: "Server Administration with Dave",
        content: "Weeks 3-8 shifted to on-premise server administration with David Hodson, white British and an absolute artist. Dave ditched slides for hand-drawn diagrams that made complex concepts crystal clear—Active Directory domains, virtualization, storage configs. We learned to deploy servers, manage permissions, and troubleshoot networks. While waiting for virtual machines to chug along, Dave regaled us with tales of fast cars—Porsches, Ferraris—his passion revving up the class. It was fun, hands-on; we built labs that felt like engineering missions, with Brandon suggesting movie-themed analogies to keep the energy high.",
        image: "images/4.jpg",
        imagePlaceholder: "Artistic comic: Dave Hodson drawing fast cars and server diagrams on a whiteboard; students laughing as virtual machines \"rev\" like engines. Include Dave's car affinity with speed lines."
    },
    {
        week: 5,
        weekRange: "10-14",
        title: "Azure Principles with Godfrey",
        content: "Azure principles in weeks 10-14? Enter Godfrey Chatira, Black British from Zimbabwe, the \"god of MS Azure\" with his patient, detail-oriented explanations. If it involved cloud computing, he knew it inside out. We dove into virtual networks, resource groups, App Services, and security—learning to provision resources, implement IaC with Bicep, and optimize costs. Godfrey explained everything effortlessly; no question stumped him. Jacob chimed in with real-world anecdotes and sarcastic humor to lighten the mood, while Ty bluntly called out gaps (\"This is 90% Azure magic, 10% us not messing up\") but shared prompts to bridge them, and Fortune added polite concurrences to maintain harmony.",
        image: "images/5.jpg",
        imagePlaceholder: "Epic comic panel: Godfrey as a god-like figure on an Azure cloud throne, explaining principles with lightning bolts of knowledge; students in awe, with Azure icons (VMs, blobs, functions) as disciples."
    },
    {
        week: 6,
        weekRange: "15-16",
        title: "Microsoft 365 Endpoint Administration",
        content: "Wrapping up in weeks 15-16: Microsoft 365 endpoint administration, back with Dave. We mastered Intune, device compliance, and endpoint security—learning to deploy policies, manage hybrid environments, and secure data on the go. Mentors continued inspiring us, turning fears into fuel, with Ryan's resilient, fuss-free updates keeping the vibe chill even during delays.",
        image: "images/6.jpg",
        imagePlaceholder: "Montage comic: Endpoint admin screens with M365 icons; group high-fiving over hybrid setups. Transition to mentors speaking in speech bubbles about career transitions."
    },
    {
        week: 7,
        weekRange: "17",
        title: "From Power-Hell to Cloud Heaven",
        content: "Through it all, our quirks bonded us. Ryan's laid-back updates kept us grounded (\"Hardware probs, be there soon\"); Brandon hyped every win with fire emojis and detail-focused rules; Ty facilitated with blunt pragmatism, assigning roles and dropping resources. Nick amplified morale with his anxious yet encouraging checks, like all-caps alerts; Fortune brought warmth with his non-disruptive positivity; Frank supported quietly with concise validations; Jacob filled gaps with service-oriented offers; and Michael turned frustrations into gags with his self-deprecating bursts. We learned more than tech—resilience from military roots, collaboration in the cohort, and that humor (AI fails, puns, internet gripes from Michael in Wiesbaden) conquers stress.\n\nTo Fiona, Iain, Mike, Dave, Godfrey, and mentors: Thank you. To my brothers: We locked in, stocked up, and smoked those servers. Here's to our next deployment—in tech!",
        image: "images/7.jpg",
        imagePlaceholder: "Heartfelt comic finale: Group photo of all characters toasting with coffee mugs shaped like servers; smoke rising, confetti of code snippets. Text: \"From Power-Hell to Cloud Heaven.\" Include quirks like Ty memeing, Brandon hyping, Ryan gaming in the corner."
    }
];

// Flash logos (shown between slide transitions)
const flashLogoImages = [
    {
        src: "images/logos/logo-1.jpg",
        alt: "Cohort Logo Concept 1"
    },
    {
        src: "images/logos/logo-2.jpg",
        alt: "Cohort Logo Concept 2"
    },
    {
        src: "images/logos/logo-3.jpg",
        alt: "Cohort Logo Concept 3"
    },
    {
        src: "images/logos/logo-4.jpg",
        alt: "Cohort Logo Concept 4"
    },
    {
        src: "images/logos/logo-5.jpg",
        alt: "Cohort Logo Concept 5"
    },
    {
        src: "images/logos/logo-6.jpg",
        alt: "Cohort Logo Concept 6"
    },
    {
        src: "images/logos/logo-7.jpg",
        alt: "Cohort Logo Concept 7"
    },
    {
        src: "images/logos/logo-8.jpg",
        alt: "Cohort Logo Concept 8"
    },
    {
        src: "images/logos/logo-9.jpg",
        alt: "Cohort Logo Concept 9"
    },
    {
        src: "images/logos/logo-10.jpg",
        alt: "Cohort Logo Concept 10"
    },
    {
        src: "images/logos/logo-11.jpg",
        alt: "Cohort Logo Concept 11"
    },
    {
        src: "images/logos/logo-12.jpg",
        alt: "Cohort Logo Concept 12"
    }
];

// Display logos (shown in the page layout)
const displayLogoImages = [
    {
        src: "images/logos/logo-7.jpg",
        alt: "Cohort Logo Concept 7"
    },
    {
        src: "images/logos/logo-8.jpg",
        alt: "Cohort Logo Concept 8"
    },
    {
        src: "images/logos/logo-9.jpg",
        alt: "Cohort Logo Concept 9"
    },
    {
        src: "images/logos/logo-10.jpg",
        alt: "Cohort Logo Concept 10"
    },
    {
        src: "images/logos/logo-11.jpg",
        alt: "Cohort Logo Concept 11"
    },
    {
        src: "images/logos/logo-12.jpg",
        alt: "Cohort Logo Concept 12"
    },
    {
        src: "images/logos/logo-main.jpg",
        alt: "Cohort Main Logo"
    }
];

// Application State

const AppState = {
  currentSlideIndex: 0,
  logoFlashTimer: null,
  currentLogoIndex: 0,
  textScrollTimer: null,
  dom: {}
};

const domIds = {
  slideElement: 'current-slide',
  slideTitle: 'slide-title',
  slideText: '#slide-content .slide__text', // robust selector for slide text
  slideImage: 'slide-image', // container id, will select img inside
  prevBtn: 'prevBtn',
  nextBtn: 'nextBtn',
  progressBar: 'progressBar',
  progressFill: 'progress-fill',
  progressLabel: 'progress-label',
  progressPercentage: 'progressPercentage',
  progressSegments: 'progress-segments',
  logoFlash: 'logoFlash',
  logoFlashImage1: 'logoFlashImage1',
  logoFlashImage2: 'logoFlashImage2',
  sideLogoContainer: 'sideLogoContainer',
  sideLogoImage: 'sideLogoImage'
};

function assignDomElements() {
  Object.entries(domIds).forEach(([key, id]) => {
    let elem = null;
    if (key === 'slideText') {
      // Try querySelector first
      elem = document.querySelector(id);
      // Fallback: try by ID only if not found
      if (!elem && id.startsWith('#')) {
        const idOnly = id.replace(/[#.].*/, '');
        elem = document.getElementById(idOnly);
      }
      // Fallback: try by class if not found
      if (!elem) {
        elem = document.querySelector('.slide__text');
      }
      if (!elem) {
        console.error('slideText not found:', id);
      }
      AppState.dom[key] = elem;
    } else if (key === 'slideImage') {
      const container = document.getElementById(id);
      let img = null;
      if (container) {
        img = container.querySelector('img.slide__image');
      }
      if (!img) {
        img = document.querySelector('img.slide__image');
      }
      if (!img) console.error('slideImage not found:', id);
      AppState.dom[key] = img;
    } else {
      elem = id.startsWith('.') ? document.querySelector(id) : document.getElementById(id);
      if (!elem) console.error(key + ' not found:', id);
      AppState.dom[key] = elem;
    }
  });
}

// Initialize Application
function initializeApplication() {
    console.log('🚀 Initializing Lock, Stock, and Two Smoking Servers...');
    
    // Assign DOM elements
    assignDomElements();

    // Initialize features
    initializeSlideshow();
    initializeNavigation();
    initializeProgressBar();
    initializeTextScrolling();
    initializeLogoFlash();
    hideLoadingScreen();
    console.log('✅ Application initialized successfully');
}

function getDOMElements() {
    // ...existing code...
    // This function is now replaced by assignDomElements()
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
    // Navigation event listeners
    const { prevBtn, nextBtn } = AppState.dom;
    if (prevBtn) prevBtn.addEventListener('click', previousSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    document.addEventListener('keydown', handleKeyboard);
    console.log('🎮 Navigation initialized');
}

function initializeProgressBar() {
    const { progressSegments } = AppState.dom;
    if (!progressSegments) return;
    progressSegments.innerHTML = '';
    for (let i = 0; i < slideData.length; i++) {
        progressSegments.appendChild(createDiv('progress-segment', () => {
            goToSlide(i);
        }));
    }
    updateProgress();
    console.log('📊 Progress bar initialized');
}

function initializeTextScrolling() {
    // Add CSS for text scrolling
    if (!document.getElementById('slide-scroll-style')) {
      const style = document.createElement('style');
      style.id = 'slide-scroll-style';
      style.textContent = `
          .slide__text.scrolling {
              animation: textScroll var(--scroll-duration, 20s) linear infinite;
              display: block;
              width: 100%;
              transform: translateY(100%);
          }
          .slide__text.scrolling:hover {
              animation-play-state: paused;
              cursor: pause;
          }
          @keyframes textScroll {
              0% {
                  transform: translateY(100%);
              }
              100% {
                  transform: translateY(var(--scroll-end-position, -100%));
              }
          }
      `;
      document.head.appendChild(style);
    }
    checkTextOverflow();
    console.log('📜 Text scrolling initialized');
}

function checkTextOverflow() {
    const slideText = AppState.dom.slideText;
    if (!slideText) {
        console.error('slideText element not found');
        return;
    }
    
    // Clear any existing scroll animation
    slideText.classList.remove('scrolling');
    slideText.style.transform = 'translateY(0)';
    slideText.style.opacity = 1;

    // Wait for layout to stabilize, then force DOM reflow and re-measure text height
    setTimeout(() => {
        // Force reflow by reading offsetHeight
        void slideText.offsetHeight;
        setTimeout(() => {
            const container = slideText.parentElement;
            const textHeight = slideText.scrollHeight;
            const containerHeight = container.clientHeight;
            const scrollDistance = textHeight - containerHeight;

            if (scrollDistance <= 0) {
                // No scroll needed
                slideText.style.transform = 'translateY(0)';
                slideText.classList.remove('scrolling');
                slideText.style.opacity = 1;
                return;
            }

            // Dynamically set scroll duration: 20px/sec, min 12s, max 60s (slower)
            const pxPerSec = 20;
            const scrollDuration = Math.max(12, Math.min(60, scrollDistance / pxPerSec));
            const endPosition = `-${scrollDistance}px`;

            slideText.style.setProperty('--scroll-duration', scrollDuration + 's');
            slideText.style.setProperty('--scroll-end-position', endPosition);

            // Start scrolling after logo flash (2s delay)
            if (AppState.textScrollTimer) clearInterval(AppState.textScrollTimer);
            let position = 0;
            const speed = 0.5; // px per frame (slower, was scrollDistance/(scrollDuration*60))
            const frameRate = 32; // ms per frame (slower, was 1000/60)

            function scrollLoop() {
                position = 0;
                slideText.style.opacity = 1;
                slideText.style.transform = 'translateY(0)';
                slideText.classList.add('scrolling');
                AppState.textScrollTimer = setInterval(() => {
                    position += speed;
                    slideText.style.transform = `translateY(-${position}px)`;
                    // Fade out in last 10%
                    if (position > scrollDistance * 0.9) {
                        const fade = (scrollDistance - position) / (scrollDistance * 0.1);
                        slideText.style.opacity = Math.max(0, fade);
                    } else {
                        slideText.style.opacity = 1;
                    }
                    if (position >= scrollDistance) {
                        clearInterval(AppState.textScrollTimer);
                        slideText.style.transform = `translateY(-${scrollDistance}px)`;
                        slideText.style.opacity = 0;
                        // Loop scroll after 1s pause
                        setTimeout(scrollLoop, 1000);
                    }
                }, frameRate);
            }

            setTimeout(scrollLoop, 2000); // 2s delay for logo flash

            console.log(`Dynamic scrolling enabled: ${scrollDuration}s duration, ${endPosition} end position, slower speed, delayed start, looping`);
        }, 100); // 100ms reflow delay
    }, 500);
}

function initializeLogoFlash() {
    const { logoFlash, logoFlashImage1, logoFlashImage2 } = AppState.dom;
    if (!logoFlash || !logoFlashImage1 || !logoFlashImage2) {
        console.error('Logo flash elements not found');
        return;
    }
    if (!document.getElementById('logo-flash-style')) {
      const style = document.createElement('style');
      style.id = 'logo-flash-style';
      style.textContent = `
          .logo-flash {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.3s ease, visibility 0.3s ease;
          }
          .logo-flash.active {
              opacity: 1;
              visibility: visible;
          }
          .logo-flash img {
              max-width: 80%;
              max-height: 80%;
              object-fit: contain;
          }
      `;
      document.head.appendChild(style);
    }
    console.log('🎭 Logo flash initialized');
}

function showLogoFlash(flashIdx, callback) {
    const { logoFlash, logoFlashImage1, logoFlashImage2 } = AppState.dom;
    if (!logoFlash || !logoFlashImage1 || !logoFlashImage2 || !flashLogoImages || flashLogoImages.length === 0) {
        if (callback) callback();
        return;
    }
    
    // Special case for final slide - show logo-main alone
    if (flashIdx === 6) { // Final slide (7th slide, 0-indexed)
        const mainLogoData = {
            src: "images/logos/logo-main.jpg",
            alt: "Main Cohort Logo"
        };
        
        setImage(logoFlashImage1, mainLogoData);
        logoFlashImage2.style.display = 'none'; // Hide second image
        logoFlash.classList.remove('vertical-layout', 'horizontal-layout');
        logoFlash.classList.add('single-logo');
        
        logoFlash.classList.add('active');
        setTimeout(() => {
            logoFlash.classList.remove('active');
            setTimeout(() => {
                logoFlashImage2.style.display = 'block'; // Restore second image
                if (callback) callback();
            }, 500);
        }, 5500);
        return;
    }
    
    // Regular dual logo display - show logos in sequence as labeled
    const logo1Index = flashIdx * 2; // Logo 1, 3, 5, 7, 9, 11 (0-indexed: 0, 2, 4, 6, 8, 10)
    const logo2Index = flashIdx * 2 + 1; // Logo 2, 4, 6, 8, 10, 12 (0-indexed: 1, 3, 5, 7, 9, 11)
    
    const logo1Data = showLogo('flash', logo1Index);
    const logo2Data = showLogo('flash', logo2Index);
    
    // Set images first
    setImage(logoFlashImage1, logo1Data);
    setImage(logoFlashImage2, logo2Data);
    
    // Determine layout based on aspect ratios after images load
    const checkAndSetLayout = () => {
        const img1 = logoFlashImage1;
        const img2 = logoFlashImage2;
        
        if (img1.naturalWidth && img1.naturalHeight && img2.naturalWidth && img2.naturalHeight) {
            const ratio1 = img1.naturalWidth / img1.naturalHeight;
            const ratio2 = img2.naturalWidth / img2.naturalHeight;
            
            // Remove existing layout classes
            logoFlash.classList.remove('vertical-layout', 'horizontal-layout');
            
            // Smart layout selection for maximum viewing size
            const viewport = { width: window.innerWidth, height: window.innerHeight };
            
            // Calculate potential sizes for both layouts
            const verticalMaxSize = Math.min(viewport.width * 0.9, viewport.height * 0.42);
            const horizontalMaxSize = Math.min(viewport.width * 0.47, viewport.height * 0.85);
            
            // If both images are vertical AND horizontal layout gives bigger display
            if (ratio1 < 1 && ratio2 < 1 && horizontalMaxSize > verticalMaxSize) {
                logoFlash.classList.add('horizontal-layout');
            } else if (ratio1 > 1.5 && ratio2 > 1.5 && verticalMaxSize > horizontalMaxSize) {
                // If both images are very horizontal, stack them vertically
                logoFlash.classList.add('vertical-layout');
            } else {
                // Default based on aspect ratios
                if (ratio1 < 1 && ratio2 < 1) {
                    logoFlash.classList.add('horizontal-layout');
                } else {
                    logoFlash.classList.add('vertical-layout');
                }
            }
        } else {
            // Default to vertical layout if we can't determine aspect ratios
            logoFlash.classList.remove('vertical-layout', 'horizontal-layout');
            logoFlash.classList.add('vertical-layout');
        }
    };
    
    // Set initial layout and make visible
    logoFlash.classList.add('vertical-layout');
    logoFlash.classList.add('active');
    
    // Check layout after a short delay to ensure images are loaded
    setTimeout(checkAndSetLayout, 100);
    setTimeout(() => {
        logoFlash.classList.remove('active');
        setTimeout(() => {
            if (callback) callback();
        }, 500); // Increased from 300ms
    }, 5500); // Changed to 5.5 seconds
}

function updateSlideLogo(index, withTransition = true) {
  const slideLogo = document.getElementById('slideLogoImage');
  if (!slideLogo) return;
  
  const logo = showLogo('display', index);
  
  if (withTransition) {
    // Add fade-out transition
    slideLogo.style.opacity = '0';
    slideLogo.style.transform = 'scale(0.9)';
    
    // After fade-out, update the image and fade back in
    setTimeout(() => {
      setImage(slideLogo, logo);
      slideLogo.style.opacity = '1';
      slideLogo.style.transform = 'scale(1)';
    }, 300);
  } else {
    // Update immediately without transition
    setImage(slideLogo, logo);
  }
}

function showSideLogo(index) {
    const { sideLogoImage, sideLogoContainer } = AppState.dom;
    if (!sideLogoImage) return;
    setImage(sideLogoImage, showLogo('display', index));
    if (sideLogoContainer) sideLogoContainer.style.display = 'block';
}

function displaySlide(index) {
    if (!slideData || index < 0 || index >= slideData.length) return;
    const slide = slideData[index];
    AppState.currentSlideIndex = index;
    const slideTitle = AppState.dom.slideTitle;
    const slideText = AppState.dom.slideText;
    const slideImage = AppState.dom.slideImage;
    const slideLogo = document.getElementById('slideLogoImage');
    
    if (slideTitle) slideTitle.textContent = slide.title;
    if (slideText) {
        console.log('BEFORE assignment - slideText.innerHTML length:', slideText.innerHTML.length);
        console.log('BEFORE assignment - slideText.innerHTML:', slideText.innerHTML.substring(0, 200) + '...');
        slideText.innerHTML = slide.content;
        console.log('AFTER assignment - slideText.innerHTML length:', slideText.innerHTML.length);
        console.log('AFTER assignment - slideText.innerHTML:', slideText.innerHTML.substring(0, 200) + '...');
        console.log('slide.content length:', slide.content.length);
        slideText.classList.remove('scrolling');
        slideText.style.transform = 'translateY(0)';
        setTimeout(checkTextOverflow, 100);
    } else {
        console.error('slideText is null! Cannot assign content');
    }
    if (slideImage) setImage(slideImage, { src: slide.image, alt: slide.imagePlaceholder });
    
    // Update the logo within the slide with smooth transition
    updateSlideLogo(index);
    
    // Still update the side logo for compatibility
    showSideLogo(index);
    
    updateProgress();
    console.log(`📖 Displaying slide ${index + 1}: ${slide.title}`);
}

function updateProgress() {
    const { currentSlideIndex } = AppState;
    const progress = ((currentSlideIndex + 1) / slideData.length) * 100;
    const { progressFill, progressLabel, progressPercentage, progressSegments, progressBar } = AppState.dom;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressLabel) progressLabel.textContent = `Slide ${currentSlideIndex + 1} of ${slideData.length}`;
    if (progressPercentage) progressPercentage.textContent = `${Math.round(progress)}%`;
    if (progressSegments) {
        const segments = progressSegments.querySelectorAll('.progress-segment');
        segments.forEach((segment, idx) => {
            segment.classList.toggle('active', idx === currentSlideIndex);
        });
    }
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', currentSlideIndex + 1);
        progressBar.setAttribute('aria-valuetext', `Slide ${currentSlideIndex + 1} of ${slideData.length}, ${Math.round(progress)}% complete`);
    }
}

function nextSlide() {
    const { currentSlideIndex } = AppState;
    const nextIndex = (currentSlideIndex + 1) % slideData.length;
    showLogoFlash(currentSlideIndex, () => {
        displaySlide(nextIndex);
    });
}

function previousSlide() {
    const { currentSlideIndex } = AppState;
    const prevIndex = (currentSlideIndex - 1 + slideData.length) % slideData.length;
    showLogoFlash(currentSlideIndex, () => {
        displaySlide(prevIndex);
    });
}

function goToSlide(index) {
    if (index >= 0 && index < slideData.length) {
        showLogoFlash();
        setTimeout(() => {
            displaySlide(index);
        }, 3000);
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
            previousSlide();
            break;
        case 'ArrowRight':
            event.preventDefault();
            nextSlide();
            break;
        case ' ':
        case 'Spacebar':
            event.preventDefault();
            togglePlayPause();
            break;
    }
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
    if (AppState.logoFlashTimer) {
        clearTimeout(AppState.logoFlashTimer);
    }
    if (AppState.textScrollTimer) {
        clearTimeout(AppState.textScrollTimer);
    }
});

console.log('🎓 Lock, Stock, and Two Smoking Servers - Ready for presentation!');