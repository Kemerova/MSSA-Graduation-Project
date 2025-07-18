# Cohort Chronicles Customization Guide

## 📁 **File Structure - What Controls What**

```
Your Project/
├── index.html          ← Main page structure & content
├── script.js           ← Slideshow logic & chatbot responses  
├── styles.css          ← All styling, colors, fonts, layout
├── staticwebapp.config.json ← Azure routing config
├── package.json        ← Project info
└── api/               ← Chatbot AI functions
    ├── chat/
    │   ├── function.json
    │   └── index.js    ← Chatbot AI logic
    └── host.json
```

## 🖼️ **Adding Images**

### **Option 1: Replace Image Placeholders with Real Images**

1. **Create an `images/` folder** in your project
2. **Add your images** (cohort-photo.jpg, instructor-mike.jpg, etc.)
3. **Update the slideshow data** in `script.js`:

```javascript
// In script.js, find slideData array and update:
const slideData = [
    {
        week: 1,
        weekRange: "1-2",
        title: "The Power-Hell Chronicles",
        content: "Our journey began with PowerShell...",
        imageUrl: "images/powershell-week.jpg",  // ← Add this line
        imagePlaceholder: "PowerShell Week - Military veterans learning to code"
    },
    // ... repeat for other slides
];
```

4. **Update the HTML to use real images** in `index.html`:

```html
<!-- Find this section and replace: -->
<div class="image-placeholder" role="img">
    <span class="image-placeholder__text">PowerShell Week</span>
</div>

<!-- With this: -->
<img src="images/powershell-week.jpg" 
     alt="PowerShell Week - Military veterans learning to code"
     class="slide__image">
```

### **Option 2: Keep Placeholders but Customize Text**

In `script.js`, update the `imagePlaceholder` text:

```javascript
imagePlaceholder: "Your custom description here"
```

## ✏️ **Editing Slide Content**

### **Change Slide Titles & Content**

In `script.js`, find the `slideData` array:

```javascript
const slideData = [
    {
        week: 1,
        weekRange: "1-2",
        title: "Your Custom Title Here",           // ← Change this
        content: "Your custom story content here...", // ← Change this
        imagePlaceholder: "Your image description"
    },
    // ... add more slides or modify existing ones
];
```

### **Add More Slides**

```javascript
// Add to the slideData array:
{
    week: 18,
    weekRange: "18",
    title: "Post-Graduation Success",
    content: "Six months later, we're all working in amazing IT roles...",
    imagePlaceholder: "Cohort members in their new IT jobs"
}
```

## 🎨 **Changing Colors & Styling**

### **Main Colors**

In `styles.css`, find the `:root` section:

```css
:root {
    --primary-color: #1E3A8A;      /* Main blue - change this */
    --secondary-color: #3B82F6;    /* Light blue */
    --accent-color: #10B981;       /* Green accent */
    --text-color: #1F2937;         /* Dark text */
    --background-color: #F8FAFC;   /* Light background */
}
```

### **Popular Color Schemes:**

**Military Green Theme:**
```css
--primary-color: #2D5016;    /* Army green */
--secondary-color: #4A7C59;  /* Light green */
--accent-color: #FFD700;     /* Gold accent */
```

**Navy Theme:**
```css
--primary-color: #000080;    /* Navy blue */
--secondary-color: #4169E1;  /* Royal blue */
--accent-color: #FFD700;     /* Gold accent */
```

**Air Force Theme:**
```css
--primary-color: #00308F;    /* Air Force blue */
--secondary-color: #72A0C1;  /* Light blue */
--accent-color: #FFC72C;     /* Yellow accent */
```

## 📝 **Editing Header Information**

In `index.html`, find the header section:

```html
<h1 class="logo__title">The Cohort Chronicles</h1>
<p class="logo__subtitle">Lock, Stock, and Two Smoking Servers</p>

<!-- And: -->
<h2 class="program-info__title">Microsoft Software & Systems Academy</h2>
<p class="program-info__date">April 7 - August 1, 2025</p>
<p class="program-info__duration">17-Week Journey</p>
```

Change these to your specific details.

## 🤖 **Customizing Chatbot Responses**

### **Add New Response Topics**

In `script.js`, find the `generateBotResponse` function and add new sections:

```javascript
// Add after existing if statements:
if (lowerMessage.includes('graduation') || lowerMessage.includes('ceremony')) {
    return getRandomResponse([
        "Our graduation ceremony was incredible! 🎓 Seeing everyone in caps and gowns...",
        "The best part of graduation was...",
        "We're so proud to have completed this journey together!"
    ]);
}

if (lowerMessage.includes('job') || lowerMessage.includes('hired')) {
    return getRandomResponse([
        "Great news! Most of our cohort got hired within 3 months! 💼",
        "The job search was easier than expected with our MSSA training...",
        "Companies love hiring MSSA graduates because..."
    ]);
}
```

### **Modify Existing Responses**

Find existing response arrays and customize them:

```javascript
if (lowerMessage.includes('powershell')) {
    return getRandomResponse([
        "Your custom PowerShell story here...",
        "Another custom response...",
        "Third custom response..."
    ]);
}
```

## 🖼️ **Adding a Cohort Logo**

1. **Create your logo** (PNG with transparent background works best)
2. **Save as** `images/cohort-logo.png`
3. **Update the header** in `index.html`:

```html
<!-- Replace the emoji: -->
<div class="logo__icon">🎓</div>

<!-- With your logo: -->
<div class="logo__icon">
    <img src="images/cohort-logo.png" alt="Cohort Logo" style="height: 3rem;">
</div>
```

## 🎵 **Adding Background Music (Optional)**

In `index.html`, add before closing `</body>` tag:

```html
<audio id="backgroundMusic" loop>
    <source src="audio/background-music.mp3" type="audio/mpeg">
</audio>

<script>
// Auto-play background music (user must interact first)
document.addEventListener('click', function() {
    const audio = document.getElementById('backgroundMusic');
    audio.volume = 0.3; // 30% volume
    audio.play().catch(e => console.log('Audio play failed:', e));
}, { once: true });
</script>
```

## 📱 **Making It Mobile-Friendly**

The site is already responsive, but you can customize mobile behavior in `styles.css`:

```css
@media (max-width: 768px) {
    .logo__title {
        font-size: 1.5rem; /* Smaller on mobile */
    }
    
    .slide__content {
        padding: 1rem; /* Less padding on mobile */
    }
}
```

## 🚀 **How to Deploy Changes**

After making any changes:

1. **Save all your files**
2. **Run the deploy command**:

```powershell
swa deploy --app-location . --api-location api --deployment-token "da2cf5baaf2e70f0b5d9f2d79bff6fcccc0cd31e35a672259db9170a24f981a001-f75c896e-f3fa-43e1-85e2-e83a240fa65a00f152109987a80f"
```

3. **Wait 1-2 minutes** for changes to appear
4. **Refresh your browser** to see updates

## 🎯 **Quick Customization Checklist**

- [ ] Update cohort name and dates in header
- [ ] Customize slide titles and content
- [ ] Add real images or update placeholder text
- [ ] Change color scheme to match your preference
- [ ] Add custom chatbot responses
- [ ] Test on mobile devices
- [ ] Deploy changes to Azure

## 💡 **Pro Tips**

1. **Make small changes** and deploy frequently to test
2. **Keep backups** of your original files
3. **Test on different devices** after major changes
4. **Use browser dev tools** (F12) to test changes before editing files
5. **Images should be optimized** (under 1MB each for fast loading)

## 🆘 **Common Issues**

**Images not showing?**
- Check file paths are correct
- Ensure images are in the right folder
- Check image file names match exactly

**Colors not changing?**
- Clear browser cache (Ctrl+F5)
- Check CSS syntax is correct
- Make sure you're editing the right CSS variables

**Chatbot not responding?**
- Check JavaScript console for errors (F12)
- Verify your API is still working
- Test with simple messages first

---

**Happy customizing! Make it uniquely yours! 🎨🚀**