console.log('🎓 Phase 4 Verification - The Cohort Chronicles');
console.log('================================================');

const fs = require('fs');
const path = require('path');

function log(message, level = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = {
        info: '📋',
        success: '✅',
        error: '❌',
        warning: '⚠️'
    }[level] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
}

function verifyFileExists(filename) {
    try {
        const stats = fs.statSync(filename);
        log(`${filename} exists (${stats.size} bytes)`, 'success');
        return true;
    } catch (error) {
        log(`${filename} missing`, 'error');
        return false;
    }
}

function verifyHTMLContent() {
    try {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        const requiredElements = [
            'slideshow-container',
            'prevBtn',
            'nextBtn', 
            'playPauseBtn',
            'chatTriggerBtn',
            'chatModal'
        ];
        
        let allFound = true;
        
        for (const element of requiredElements) {
            if (htmlContent.includes(element)) {
                log(`HTML element ${element} found`, 'success');
            } else {
                log(`HTML element ${element} missing`, 'error');
                allFound = false;
            }
        }
        
        return allFound;
    } catch (error) {
        log(`Error reading HTML: ${error.message}`, 'error');
        return false;
    }
}

function verifyJavaScriptContent() {
    try {
        const jsContent = fs.readFileSync('script.js', 'utf8');
        
        const requiredElements = [
            'slideData',
            'characterProfiles',
            'Power-Hell Chronicles',
            'Lock, Stock, and Two Smoking Servers'
        ];
        
        let allFound = true;
        
        for (const element of requiredElements) {
            if (jsContent.includes(element)) {
                log(`JavaScript element ${element} found`, 'success');
            } else {
                log(`JavaScript element ${element} missing`, 'error');
                allFound = false;
            }
        }
        
        // Count slides
        const slideMatches = jsContent.match(/\{[\s\S]*?week:/g);
        if (slideMatches) {
            log(`Found ${slideMatches.length} slides in slideData`, 'info');
        }
        
        return allFound;
    } catch (error) {
        log(`Error reading JavaScript: ${error.message}`, 'error');
        return false;
    }
}

function verifyCSSContent() {
    try {
        const cssContent = fs.readFileSync('styles.css', 'utf8');
        
        const requiredClasses = [
            '.slideshow-container',
            '.nav-btn',
            '.modal',
            '.progress-bar'
        ];
        
        let allFound = true;
        
        for (const className of requiredClasses) {
            if (cssContent.includes(className)) {
                log(`CSS class ${className} found`, 'success');
            } else {
                log(`CSS class ${className} missing`, 'error');
                allFound = false;
            }
        }
        
        // Check for responsive design
        if (cssContent.includes('@media') && cssContent.includes('max-width')) {
            log('Responsive design CSS found', 'success');
        } else {
            log('Responsive design CSS may be missing', 'warning');
        }
        
        return allFound;
    } catch (error) {
        log(`Error reading CSS: ${error.message}`, 'error');
        return false;
    }
}

// Main verification
log('Starting Phase 4 Verification...', 'info');

const results = {
    files: 0,
    html: 0,
    javascript: 0,
    css: 0
};

// Check required files
log('Checking required files...', 'info');
const requiredFiles = ['index.html', 'script.js', 'styles.css', 'package.json'];
for (const file of requiredFiles) {
    if (verifyFileExists(file)) {
        results.files++;
    }
}

// Verify HTML structure
log('Verifying HTML structure...', 'info');
if (verifyHTMLContent()) {
    results.html = 1;
}

// Verify JavaScript structure
log('Verifying JavaScript structure...', 'info');
if (verifyJavaScriptContent()) {
    results.javascript = 1;
}

// Verify CSS structure
log('Verifying CSS structure...', 'info');
if (verifyCSSContent()) {
    results.css = 1;
}

// Summary
console.log('\n📊 VERIFICATION SUMMARY');
console.log('======================');
log(`Files: ${results.files}/${requiredFiles.length} found`, results.files === requiredFiles.length ? 'success' : 'error');
log(`HTML Structure: ${results.html ? 'PASS' : 'FAIL'}`, results.html ? 'success' : 'error');
log(`JavaScript Structure: ${results.javascript ? 'PASS' : 'FAIL'}`, results.javascript ? 'success' : 'error');
log(`CSS Structure: ${results.css ? 'PASS' : 'FAIL'}`, results.css ? 'success' : 'error');

const totalScore = results.files + results.html + results.javascript + results.css;
const maxScore = requiredFiles.length + 3;

console.log(`\n🎯 Overall Score: ${totalScore}/${maxScore} (${Math.round(totalScore/maxScore*100)}%)`);

if (totalScore === maxScore) {
    log('🎉 All structural verification tests PASSED!', 'success');
    log('✅ Ready to proceed with browser-based testing', 'success');
} else {
    log('⚠️ Some verification tests failed', 'warning');
    log('🔧 Address issues before proceeding to browser testing', 'warning');
}

console.log('\n📋 NEXT STEPS:');
console.log('1. If all tests passed: Start browser testing with local server');
console.log('2. If tests failed: Fix structural issues first');
console.log('3. Test slideshow navigation manually');
console.log('4. Test chatbot modal functionality');
console.log('5. Test responsive design on different screen sizes');