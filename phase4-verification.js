#!/usr/bin/env node

/**
 * Phase 4 Verification Script - The Cohort Chronicles
 * 
 * This script performs comprehensive verification of existing functionality
 * following the VERIFICATION-FIRST approach of Phase 4.
 * 
 * Usage: node phase4-verification.js
 */

console.log('🎓 Phase 4 Verification - The Cohort Chronicles');
console.log('================================================');

class Phase4Verifier {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: 0
            },
            issues: [],
            recommendations: []
        };
        
        this.testResults = {
            slideshow: {},
            chatbot: {},
            responsive: {},
            performance: {},
            content: {}
        };
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const prefix = {
            info: '📋',
            success: '✅',
            error: '❌',
            warning: '⚠️',
            debug: '🔍'
        }[level] || '📋';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async runTest(testName, testFunction) {
        this.log(`Running: ${testName}`, 'debug');
        const startTime = Date.now();
        
        try {
            const result = await testFunction.call(this);
            const duration = Date.now() - startTime;
            
            const testResult = {
                name: testName,
                status: 'passed',
                duration,
                details: result,
                timestamp: new Date().toISOString()
            };
            
            this.results.tests.push(testResult);
            this.results.summary.passed++;
            this.log(`${testName} - PASSED (${duration}ms)`, 'success');
            
            return testResult;
        } catch (error) {
            const duration = Date.now() - startTime;
            
            const testResult = {
                name: testName,
                status: 'failed',
                duration,
                error: error.message || error,
                timestamp: new Date().toISOString()
            };
            
            this.results.tests.push(testResult);
            this.results.summary.failed++;
            this.log(`${testName} - FAILED (${duration}ms): ${error.message || error}`, 'error');
            
            this.results.issues.push({
                category: 'functionality',
                severity: 'high',
                description: `${testName}: ${error.message || error}`,
                recommendation: 'Requires immediate repair'
            });
            
            return testResult;
        } finally {
            this.results.summary.total++;
        }
    }

    async verifyFileStructure() {
        const fs = require('fs').promises;
        const path = require('path');
        
        const requiredFiles = [
            'index.html',
            'script.js',
            'styles.css',
            'package.json'
        ];
        
        const results = {
            allFilesExist: true,
            missingFiles: [],
            fileDetails: {}
        };
        
        for (const file of requiredFiles) {
            try {
                const stats = await fs.stat(file);
                results.fileDetails[file] = {
                    exists: true,
                    size: stats.size,
                    modified: stats.mtime
                };
                this.log(`✓ ${file} exists (${stats.size} bytes)`, 'debug');
            } catch (error) {
                results.allFilesExist = false;
                results.missingFiles.push(file);
                results.fileDetails[file] = {
                    exists: false,
                    error: error.message
                };
                this.log(`✗ ${file} missing`, 'warning');
            }
        }
        
        if (!results.allFilesExist) {
            throw new Error(`Missing required files: ${results.missingFiles.join(', ')}`);
        }
        
        return results;
    }

    async verifyHTMLStructure() {
        const fs = require('fs').promises;
        const htmlContent = await fs.readFile('index.html', 'utf8');
        
        const requiredElements = [
            // Slideshow elements
            { selector: '.slideshow-container', description: 'Slideshow container' },
            { selector: '#slideshow', description: 'Main slideshow element' },
            { selector: '.slide', description: 'Slide elements' },
            { selector: '#prevBtn', description: 'Previous button' },
            { selector: '#nextBtn', description: 'Next button' },
            { selector: '#playPauseBtn', description: 'Play/Pause button' },
            
            // Progress elements
            { selector: '#progressBar', description: 'Progress bar' },
            { selector: '#progress-fill', description: 'Progress fill' },
            { selector: '#progress-segments', description: 'Progress segments' },
            
            // Chat elements
            { selector: '#chatTriggerBtn', description: 'Chat trigger button' },
            { selector: '#chatModal', description: 'Chat modal' },
            { selector: '#chat-messages', description: 'Chat messages container' },
            { selector: '#chat-input', description: 'Chat input field' },
            { selector: '#chat-send', description: 'Chat send button' }
        ];
        
        const results = {
            allElementsPresent: true,
            missingElements: [],
            foundElements: []
        };
        
        for (const element of requiredElements) {
            const found = htmlContent.includes(`id="${element.selector.replace('#', '')}"`) ||
                         htmlContent.includes(`class="${element.selector.replace('.', '')}"`) ||
                         htmlContent.includes(element.selector);
            
            if (found) {
                results.foundElements.push(element);
                this.log(`✓ ${element.description} found`, 'debug');
            } else {
                results.allElementsPresent = false;
                results.missingElements.push(element);
                this.log(`✗ ${element.description} missing`, 'warning');
            }
        }
        
        // Check for slide data
        const hasSlideData = htmlContent.includes('slideData') || 
                            htmlContent.includes('Power-Hell Chronicles') ||
                            htmlContent.includes('Lock, Stock, and Two Smoking Servers');
        
        if (!hasSlideData) {
            this.log('⚠️ Slide data may be missing from HTML', 'warning');
            this.results.summary.warnings++;
        }
        
        return results;
    }

    async verifyJavaScriptStructure() {
        const fs = require('fs').promises;
        const jsContent = await fs.readFile('script.js', 'utf8');
        
        const requiredFunctions = [
            'slideData',
            'characterProfiles',
            'ContentManager',
            'AccessibilityManager',
            'PerformanceOptimizer'
        ];
        
        const results = {
            allFunctionsPresent: true,
            missingFunctions: [],
            foundFunctions: []
        };
        
        for (const func of requiredFunctions) {
            if (jsContent.includes(func)) {
                results.foundFunctions.push(func);
                this.log(`✓ ${func} found in JavaScript`, 'debug');
            } else {
                results.allFunctionsPresent = false;
                results.missingFunctions.push(func);
                this.log(`✗ ${func} missing from JavaScript`, 'warning');
            }
        }
        
        // Check for slide data structure
        const slideDataMatch = jsContent.match(/const slideData = \[([\s\S]*?)\];/);
        if (slideDataMatch) {
            const slideCount = (slideDataMatch[1].match(/\{/g) || []).length;
            this.log(`✓ Found ${slideCount} slides in slideData`, 'debug');
            
            if (slideCount !== 6) {
                this.log(`⚠️ Expected 6 slides, found ${slideCount}`, 'warning');
                this.results.summary.warnings++;
            }
        } else {
            this.log('✗ slideData structure not found', 'error');
            results.allFunctionsPresent = false;
        }
        
        return results;
    }

    async verifyCSSStructure() {
        const fs = require('fs').promises;
        const cssContent = await fs.readFile('styles.css', 'utf8');
        
        const requiredClasses = [
            '.slideshow-container',
            '.slide',
            '.nav-btn',
            '.progress-bar',
            '.modal',
            '.chat__messages',
            '.image-placeholder'
        ];
        
        const results = {
            allClassesPresent: true,
            missingClasses: [],
            foundClasses: []
        };
        
        for (const className of requiredClasses) {
            if (cssContent.includes(className)) {
                results.foundClasses.push(className);
                this.log(`✓ ${className} styles found`, 'debug');
            } else {
                results.allClassesPresent = false;
                results.missingClasses.push(className);
                this.log(`✗ ${className} styles missing`, 'warning');
            }
        }
        
        // Check for responsive design
        const hasResponsive = cssContent.includes('@media') && 
                             cssContent.includes('max-width');
        
        if (hasResponsive) {
            this.log('✓ Responsive design CSS found', 'debug');
        } else {
            this.log('⚠️ Responsive design CSS may be missing', 'warning');
            this.results.summary.warnings++;
        }
        
        return results;
    }

    async verifySlideContent() {
        const fs = require('fs').promises;
        const jsContent = await fs.readFile('script.js', 'utf8');
        
        const expectedSlides = [
            { title: 'Power-Hell Chronicles', weekRange: '1-2' },
            { title: 'Dave\'s Artistic Server Lessons', weekRange: '3-8' },
            { title: 'Professional Development Intensive', weekRange: '9' },
            { title: 'Azure Enlightenment', weekRange: '10-14' },
            { title: 'Microsoft 365 Mastery', weekRange: '15-16' },
            { title: 'Lock, Stock, and Two Smoking Servers', weekRange: '17' }
        ];
        
        const results = {
            allSlidesPresent: true,
            missingSlides: [],
            foundSlides: [],
            contentIssues: []
        };
        
        for (const slide of expectedSlides) {
            if (jsContent.includes(slide.title)) {
                results.foundSlides.push(slide);
                this.log(`✓ Slide "${slide.title}" found`, 'debug');
                
                // Check for week range
                if (!jsContent.includes(`"${slide.weekRange}"`)) {
                    results.contentIssues.push(`Week range "${slide.weekRange}" missing for "${slide.title}"`);
                    this.log(`⚠️ Week range missing for "${slide.title}"`, 'warning');
                }
            } else {
                results.allSlidesPresent = false;
                results.missingSlides.push(slide);
                this.log(`✗ Slide "${slide.title}" missing`, 'error');
            }
        }
        
        // Check for character profiles
        const expectedCharacters = [
            'Mike Howell',
            'David Hodson', 
            'Fiona Jones',
            'Godfrey Chatira'
        ];
        
        for (const character of expectedCharacters) {
            if (jsContent.includes(character)) {
                this.log(`✓ Character "${character}" found`, 'debug');
            } else {
                results.contentIssues.push(`Character "${character}" missing from profiles`);
                this.log(`⚠️ Character "${character}" missing`, 'warning');
            }
        }
        
        return results;
    }

    async verifyPackageJson() {
        const fs = require('fs').promises;
        
        try {
            const packageContent = await fs.readFile('package.json', 'utf8');
            const packageData = JSON.parse(packageContent);
            
            const results = {
                valid: true,
                name: packageData.name,
                version: packageData.version,
                scripts: packageData.scripts || {},
                dependencies: packageData.dependencies || {},
                devDependencies: packageData.devDependencies || {}
            };
            
            this.log(`✓ Package.json valid - ${packageData.name} v${packageData.version}`, 'debug');
            
            // Check for common scripts
            const expectedScripts = ['start', 'build', 'test'];
            for (const script of expectedScripts) {
                if (results.scripts[script]) {
                    this.log(`✓ Script "${script}" found`, 'debug');
                } else {
                    this.log(`⚠️ Script "${script}" missing`, 'warning');
                    this.results.summary.warnings++;
                }
            }
            
            return results;
        } catch (error) {
            throw new Error(`Package.json error: ${error.message}`);
        }
    }

    async checkForConsoleErrors() {
        // This would normally require a browser environment
        // For now, we'll do static analysis
        const fs = require('fs').promises;
        const jsContent = await fs.readFile('script.js', 'utf8');
        
        const potentialIssues = [];
        
        // Check for common JavaScript issues
        if (jsContent.includes('console.error')) {
            potentialIssues.push('Console.error statements found - may indicate error handling');
        }
        
        if (jsContent.includes('throw new Error')) {
            potentialIssues.push('Error throwing found - ensure proper error handling');
        }
        
        // Check for undefined variables
        const undefinedChecks = ['window.', 'document.'];
        for (const check of undefinedChecks) {
            if (jsContent.includes(check)) {
                this.log(`✓ ${check} usage found - browser environment expected`, 'debug');
            }
        }
        
        return {
            potentialIssues,
            hasErrorHandling: jsContent.includes('try') && jsContent.includes('catch'),
            hasConsoleLogging: jsContent.includes('console.log')
        };
    }

    generateReport() {
        const report = {
            ...this.results,
            testResults: this.testResults,
            summary: {
                ...this.results.summary,
                successRate: this.results.summary.total > 0 ? 
                    (this.results.summary.passed / this.results.summary.total * 100).toFixed(1) : 0
            }
        };
        
        return report;
    }

    async saveReport() {
        const fs = require('fs').promises;
        const report = this.generateReport();
        
        await fs.writeFile('phase4-verification-report.json', JSON.stringify(report, null, 2));
        this.log('✓ Verification report saved to phase4-verification-report.json', 'success');
        
        // Also create a human-readable summary
        const summary = this.generateSummary(report);
        await fs.writeFile('phase4-verification-summary.md', summary);
        this.log('✓ Verification summary saved to phase4-verification-summary.md', 'success');
    }

    generateSummary(report) {
        const timestamp = new Date().toLocaleString();
        
        return `# Phase 4 Verification Summary - The Cohort Chronicles

**Generated:** ${timestamp}
**Success Rate:** ${report.summary.successRate}%

## Test Results Summary

- **Total Tests:** ${report.summary.total}
- **Passed:** ${report.summary.passed} ✅
- **Failed:** ${report.summary.failed} ❌
- **Warnings:** ${report.summary.warnings} ⚠️

## Test Details

${report.tests.map(test => 
    `### ${test.name}
- **Status:** ${test.status === 'passed' ? '✅ PASSED' : '❌ FAILED'}
- **Duration:** ${test.duration}ms
${test.error ? `- **Error:** ${test.error}` : ''}
${test.details ? `- **Details:** ${JSON.stringify(test.details, null, 2)}` : ''}
`).join('\n')}

## Issues Found

${report.issues.length > 0 ? 
    report.issues.map(issue => 
        `### ${issue.category.toUpperCase()} - ${issue.severity.toUpperCase()}
- **Description:** ${issue.description}
- **Recommendation:** ${issue.recommendation}
`).join('\n') : 'No critical issues found! 🎉'}

## Recommendations

${report.recommendations.length > 0 ?
    report.recommendations.map(rec => `- ${rec}`).join('\n') :
    '- Continue with Phase 4 repair and polish tasks\n- All core functionality appears to be in place'}

## Next Steps

1. **If tests passed:** Proceed to browser-based testing and user interaction verification
2. **If tests failed:** Address the issues listed above before proceeding
3. **Review warnings:** Consider addressing warnings for optimal performance

---
*This report was generated by the Phase 4 Verification Script*
`;
    }

    async run() {
        this.log('Starting Phase 4 Verification Process...', 'info');
        this.log('This will verify existing functionality before making any changes', 'info');
        
        try {
            // File Structure Verification
            await this.runTest('File Structure Verification', this.verifyFileStructure);
            
            // HTML Structure Verification  
            await this.runTest('HTML Structure Verification', this.verifyHTMLStructure);
            
            // JavaScript Structure Verification
            await this.runTest('JavaScript Structure Verification', this.verifyJavaScriptStructure);
            
            // CSS Structure Verification
            await this.runTest('CSS Structure Verification', this.verifyCSSStructure);
            
            // Content Verification
            await this.runTest('Slide Content Verification', this.verifySlideContent);
            
            // Package.json Verification
            await this.runTest('Package.json Verification', this.verifyPackageJson);
            
            // Console Error Check
            await this.runTest('Console Error Check', this.checkForConsoleErrors);
            
            // Generate final report
            await this.saveReport();
            
            this.log('Phase 4 Verification Complete!', 'success');
            this.log(`Results: ${this.results.summary.passed}/${this.results.summary.total} tests passed`, 'info');
            
            if (this.results.summary.failed > 0) {
                this.log('⚠️ Some tests failed - review the report before proceeding', 'warning');
                this.results.recommendations.push('Address failed tests before proceeding to browser testing');
            } else {
                this.log('🎉 All structural tests passed! Ready for browser testing', 'success');
                this.results.recommendations.push('Proceed to browser-based functionality testing');
                this.results.recommendations.push('Test slideshow navigation and auto-advance');
                this.results.recommendations.push('Test chatbot modal and interactions');
                this.results.recommendations.push('Test responsive design on multiple devices');
            }
            
        } catch (error) {
            this.log(`Verification failed: ${error.message}`, 'error');
            throw error;
        }
    }
}

// Run verification if called directly
if (require.main === module) {
    const verifier = new Phase4Verifier();
    verifier.run().catch(error => {
        console.error('❌ Verification failed:', error.message);
        process.exit(1);
    });
}

module.exports = Phase4Verifier;