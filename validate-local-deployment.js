#!/usr/bin/env node

/**
 * Local Deployment Validation Script
 * Tests the application functionality locally before deployment
 */

const fs = require('fs');
const path = require('path');

class LocalDeploymentValidator {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: 0
            }
        };
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '📋',
            success: '✅',
            error: '❌',
            warning: '⚠️',
            debug: '🔍'
        }[level] || '📋';

        console.log(`${prefix} [${timestamp.split('T')[1].split('.')[0]}] ${message}`);
    }

    async runTest(testName, testFunction) {
        this.log(`Running: ${testName}`, 'debug');
        const startTime = Date.now();
        
        try {
            const result = await testFunction();
            const duration = Date.now() - startTime;
            
            const testResult = {
                name: testName,
                status: 'passed',
                duration: duration,
                details: result,
                timestamp: new Date().toISOString()
            };
            
            this.results.tests.push(testResult);
            this.results.summary.passed++;
            this.log(`✅ ${testName} - PASSED (${duration}ms)`, 'success');
            
            return testResult;
        } catch (error) {
            const duration = Date.now() - startTime;
            
            const testResult = {
                name: testName,
                status: 'failed',
                duration: duration,
                error: error.message || error,
                details: error.details || null,
                timestamp: new Date().toISOString()
            };
            
            this.results.tests.push(testResult);
            this.results.summary.failed++;
            this.log(`❌ ${testName} - FAILED (${duration}ms): ${error.message || error}`, 'error');
            
            return testResult;
        } finally {
            this.results.summary.total++;
        }
    }

    async testFileStructure() {
        const requiredFiles = [
            'index.html',
            'styles.css',
            'script.js',
            'package.json',
            'staticwebapp.config.json',
            'api/package.json',
            'api/chat.js',
            'api/function.json'
        ];

        const optionalFiles = [
            'DEPLOYMENT-COMPLETE.md',
            'TROUBLESHOOTING.md',
            'final-deployment-test.js',
            'validate-local-deployment.js'
        ];

        const results = {
            required: {},
            optional: {},
            missing: [],
            present: []
        };

        for (const file of requiredFiles) {
            const exists = fs.existsSync(file);
            results.required[file] = exists;
            
            if (exists) {
                results.present.push(file);
            } else {
                results.missing.push(file);
                throw new Error(`Required file missing: ${file}`);
            }
        }

        for (const file of optionalFiles) {
            const exists = fs.existsSync(file);
            results.optional[file] = exists;
            
            if (exists) {
                results.present.push(file);
            } else {
                this.log(`Optional file missing: ${file}`, 'warning');
                this.results.summary.warnings++;
            }
        }

        return results;
    }

    async testHTMLStructure() {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        const checks = {
            hasDoctype: htmlContent.includes('<!DOCTYPE html>'),
            hasTitle: htmlContent.includes('<title>'),
            hasViewport: htmlContent.includes('name="viewport"'),
            hasCharset: htmlContent.includes('charset='),
            hasMainContent: htmlContent.includes('main') || htmlContent.includes('id="slideshow-container"'),
            hasChatbotModal: htmlContent.includes('chatbot') || htmlContent.includes('modal'),
            hasNavigation: htmlContent.includes('nav') || htmlContent.includes('button'),
            hasProgressBar: htmlContent.includes('progress') || htmlContent.includes('progress-bar'),
            hasSemanticHTML: htmlContent.includes('<main') || htmlContent.includes('<section'),
            hasAccessibility: htmlContent.includes('aria-') || htmlContent.includes('role=')
        };

        const issues = [];
        Object.entries(checks).forEach(([check, passed]) => {
            if (!passed) {
                issues.push(check.replace(/([A-Z])/g, ' $1').toLowerCase());
            }
        });

        if (issues.length > 0) {
            issues.forEach(issue => {
                this.log(`HTML structure issue: ${issue}`, 'warning');
                this.results.summary.warnings++;
            });
        }

        return {
            checks: checks,
            issues: issues,
            contentLength: htmlContent.length,
            hasExpectedContent: htmlContent.includes('Cohort Chronicles')
        };
    }

    async testCSSStructure() {
        const cssContent = fs.readFileSync('styles.css', 'utf8');
        
        const checks = {
            hasCustomProperties: cssContent.includes('--') || cssContent.includes(':root'),
            hasResponsiveDesign: cssContent.includes('@media'),
            hasFlexbox: cssContent.includes('flex') || cssContent.includes('grid'),
            hasAnimations: cssContent.includes('@keyframes') || cssContent.includes('transition'),
            hasColorScheme: cssContent.includes('color:') && cssContent.includes('background'),
            hasProfessionalStyling: cssContent.includes('navy') || cssContent.includes('blue') || cssContent.includes('#'),
            hasAccessibilityStyles: cssContent.includes('focus') || cssContent.includes('outline'),
            hasModernCSS: cssContent.includes('rem') || cssContent.includes('vh') || cssContent.includes('vw')
        };

        const issues = [];
        Object.entries(checks).forEach(([check, passed]) => {
            if (!passed) {
                issues.push(check.replace(/([A-Z])/g, ' $1').toLowerCase());
            }
        });

        if (issues.length > 0) {
            issues.forEach(issue => {
                this.log(`CSS structure issue: ${issue}`, 'warning');
                this.results.summary.warnings++;
            });
        }

        return {
            checks: checks,
            issues: issues,
            contentLength: cssContent.length,
            hasMinification: cssContent.includes('/*') === false && cssContent.split('\n').length < 50
        };
    }

    async testJavaScriptStructure() {
        const jsContent = fs.readFileSync('script.js', 'utf8');
        
        const checks = {
            hasClasses: jsContent.includes('class '),
            hasModernJS: jsContent.includes('const ') || jsContent.includes('let '),
            hasAsyncCode: jsContent.includes('async ') || jsContent.includes('await '),
            hasEventListeners: jsContent.includes('addEventListener'),
            hasErrorHandling: jsContent.includes('try') && jsContent.includes('catch'),
            hasSlideshowLogic: jsContent.includes('slideshow') || jsContent.includes('Slideshow'),
            hasChatbotLogic: jsContent.includes('chatbot') || jsContent.includes('Chatbot'),
            hasNavigationLogic: jsContent.includes('navigation') || jsContent.includes('Navigation'),
            hasAPIIntegration: jsContent.includes('fetch') || jsContent.includes('XMLHttpRequest'),
            hasAccessibilityCode: jsContent.includes('aria-') || jsContent.includes('focus')
        };

        const issues = [];
        Object.entries(checks).forEach(([check, passed]) => {
            if (!passed) {
                issues.push(check.replace(/([A-Z])/g, ' $1').toLowerCase());
            }
        });

        if (issues.length > 0) {
            issues.forEach(issue => {
                this.log(`JavaScript structure issue: ${issue}`, 'warning');
                this.results.summary.warnings++;
            });
        }

        return {
            checks: checks,
            issues: issues,
            contentLength: jsContent.length,
            hasMinification: jsContent.includes('//') === false && jsContent.split('\n').length < 100
        };
    }

    async testAPIStructure() {
        const apiFiles = ['api/package.json', 'api/chat.js', 'api/function.json'];
        const results = {};

        for (const file of apiFiles) {
            if (!fs.existsSync(file)) {
                throw new Error(`API file missing: ${file}`);
            }

            const content = fs.readFileSync(file, 'utf8');
            
            if (file.endsWith('.json')) {
                try {
                    const parsed = JSON.parse(content);
                    results[file] = {
                        valid: true,
                        content: parsed,
                        size: content.length
                    };
                } catch (error) {
                    throw new Error(`Invalid JSON in ${file}: ${error.message}`);
                }
            } else {
                results[file] = {
                    valid: true,
                    size: content.length,
                    hasOpenAI: content.includes('openai') || content.includes('OpenAI'),
                    hasErrorHandling: content.includes('try') && content.includes('catch'),
                    hasExports: content.includes('module.exports') || content.includes('export')
                };
            }
        }

        // Check API dependencies
        const apiPackage = JSON.parse(fs.readFileSync('api/package.json', 'utf8'));
        const hasOpenAIDep = apiPackage.dependencies && 
            (apiPackage.dependencies['@azure/openai'] || apiPackage.dependencies['openai']);

        if (!hasOpenAIDep) {
            this.log('API package.json missing OpenAI dependency', 'warning');
            this.results.summary.warnings++;
        }

        return {
            files: results,
            hasOpenAIDependency: hasOpenAIDep,
            apiPackage: apiPackage
        };
    }

    async testConfigurationFiles() {
        const configs = {
            'staticwebapp.config.json': {
                required: ['routes', 'navigationFallback'],
                optional: ['globalHeaders', 'mimeTypes', 'platform']
            },
            'package.json': {
                required: ['name', 'version', 'scripts'],
                optional: ['dependencies', 'devDependencies', 'jest']
            }
        };

        const results = {};

        for (const [file, schema] of Object.entries(configs)) {
            if (!fs.existsSync(file)) {
                throw new Error(`Configuration file missing: ${file}`);
            }

            const content = JSON.parse(fs.readFileSync(file, 'utf8'));
            const fileResults = {
                valid: true,
                content: content,
                missingRequired: [],
                missingOptional: []
            };

            // Check required fields
            for (const field of schema.required) {
                if (!(field in content)) {
                    fileResults.missingRequired.push(field);
                }
            }

            // Check optional fields
            for (const field of schema.optional) {
                if (!(field in content)) {
                    fileResults.missingOptional.push(field);
                }
            }

            if (fileResults.missingRequired.length > 0) {
                throw new Error(`${file} missing required fields: ${fileResults.missingRequired.join(', ')}`);
            }

            if (fileResults.missingOptional.length > 0) {
                fileResults.missingOptional.forEach(field => {
                    this.log(`${file} missing optional field: ${field}`, 'warning');
                    this.results.summary.warnings++;
                });
            }

            results[file] = fileResults;
        }

        return results;
    }

    async testDocumentation() {
        const docFiles = [
            'DEPLOYMENT-COMPLETE.md',
            'TROUBLESHOOTING.md',
            'README.md'
        ];

        const results = {
            present: [],
            missing: [],
            analysis: {}
        };

        for (const file of docFiles) {
            if (fs.existsSync(file)) {
                results.present.push(file);
                const content = fs.readFileSync(file, 'utf8');
                results.analysis[file] = {
                    size: content.length,
                    sections: (content.match(/^#/gm) || []).length,
                    hasCodeBlocks: content.includes('```'),
                    hasLinks: content.includes('http') || content.includes('['),
                    comprehensive: content.length > 5000
                };
            } else {
                results.missing.push(file);
                if (file === 'README.md') {
                    this.log(`Important documentation missing: ${file}`, 'warning');
                    this.results.summary.warnings++;
                }
            }
        }

        return results;
    }

    async testBuildProcess() {
        const buildFiles = ['build.js', 'dist/'];
        const results = {
            hasBuildScript: fs.existsSync('build.js'),
            hasDistDirectory: fs.existsSync('dist/'),
            buildScriptContent: null,
            distContents: []
        };

        if (results.hasBuildScript) {
            const buildContent = fs.readFileSync('build.js', 'utf8');
            results.buildScriptContent = {
                size: buildContent.length,
                hasMinification: buildContent.includes('minify') || buildContent.includes('terser'),
                hasOptimization: buildContent.includes('optimize') || buildContent.includes('compress'),
                hasAssetProcessing: buildContent.includes('css') && buildContent.includes('js')
            };
        } else {
            this.log('Build script not found - manual optimization may be needed', 'warning');
            this.results.summary.warnings++;
        }

        if (results.hasDistDirectory) {
            try {
                const distFiles = fs.readdirSync('dist/');
                results.distContents = distFiles;
                
                if (distFiles.length === 0) {
                    this.log('Dist directory is empty - run build process', 'warning');
                    this.results.summary.warnings++;
                }
            } catch (error) {
                this.log('Could not read dist directory', 'warning');
                this.results.summary.warnings++;
            }
        }

        return results;
    }

    async testEnvironmentConfiguration() {
        const envFiles = ['.env', '.env.example', 'api/.env', 'api/.env.example'];
        const results = {
            envFiles: {},
            hasExamples: false,
            hasLocalConfig: false
        };

        for (const file of envFiles) {
            const exists = fs.existsSync(file);
            results.envFiles[file] = exists;
            
            if (file.includes('.example')) {
                results.hasExamples = results.hasExamples || exists;
            } else {
                results.hasLocalConfig = results.hasLocalConfig || exists;
            }

            if (exists && file.includes('.example')) {
                const content = fs.readFileSync(file, 'utf8');
                const hasOpenAIConfig = content.includes('AZURE_OPENAI') || content.includes('OPENAI');
                
                if (!hasOpenAIConfig) {
                    this.log(`${file} missing OpenAI configuration examples`, 'warning');
                    this.results.summary.warnings++;
                }
            }
        }

        if (!results.hasExamples) {
            this.log('No .env.example files found - developers may need guidance', 'warning');
            this.results.summary.warnings++;
        }

        return results;
    }

    async runAllTests() {
        this.log('🚀 Starting local deployment validation', 'info');
        this.log('Checking project structure and configuration...', 'info');

        const tests = [
            ['File Structure Validation', () => this.testFileStructure()],
            ['HTML Structure Analysis', () => this.testHTMLStructure()],
            ['CSS Structure Analysis', () => this.testCSSStructure()],
            ['JavaScript Structure Analysis', () => this.testJavaScriptStructure()],
            ['API Structure Validation', () => this.testAPIStructure()],
            ['Configuration Files Check', () => this.testConfigurationFiles()],
            ['Documentation Review', () => this.testDocumentation()],
            ['Build Process Check', () => this.testBuildProcess()],
            ['Environment Configuration', () => this.testEnvironmentConfiguration()]
        ];

        for (const [testName, testFunction] of tests) {
            await this.runTest(testName, testFunction);
        }

        this.generateReport();
        this.saveResults();

        return this.results;
    }

    generateReport() {
        const { summary } = this.results;
        const successRate = Math.round((summary.passed / summary.total) * 100);
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 LOCAL DEPLOYMENT VALIDATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`📅 Validation Date: ${this.results.timestamp}`);
        console.log(`📈 Success Rate: ${successRate}% (${summary.passed}/${summary.total})`);
        console.log(`✅ Passed: ${summary.passed}`);
        console.log(`❌ Failed: ${summary.failed}`);
        console.log(`⚠️  Warnings: ${summary.warnings}`);
        
        if (summary.failed > 0) {
            console.log('\n❌ FAILED VALIDATIONS:');
            this.results.tests
                .filter(test => test.status === 'failed')
                .forEach(test => {
                    console.log(`   • ${test.name}: ${test.error}`);
                });
        }

        if (summary.warnings > 0) {
            console.log('\n⚠️  WARNINGS DETECTED:');
            console.log(`   ${summary.warnings} warnings found. Review logs for details.`);
        }

        console.log('\n🎯 DEPLOYMENT READINESS:');
        
        if (successRate === 100 && summary.warnings === 0) {
            console.log('   🎉 Excellent! Project is ready for deployment.');
            console.log('   ✅ All validations passed with no warnings.');
        } else if (successRate === 100 && summary.warnings <= 3) {
            console.log('   👍 Good! Project is ready for deployment.');
            console.log('   ⚠️  Minor warnings detected - consider addressing them.');
        } else if (successRate >= 80) {
            console.log('   ⚠️  Project has some issues but may be deployable.');
            console.log('   🔧 Address warnings and failed tests for optimal deployment.');
        } else {
            console.log('   🚨 Project has significant issues.');
            console.log('   ❌ Fix critical errors before attempting deployment.');
        }

        console.log('\n📋 NEXT STEPS:');
        
        if (summary.failed === 0) {
            console.log('   1. ✅ Run final deployment test with: node final-deployment-test.js');
            console.log('   2. 🚀 Deploy to Azure Static Web Apps');
            console.log('   3. 🧪 Validate production deployment');
            console.log('   4. 📊 Monitor application performance');
        } else {
            console.log('   1. 🔧 Fix failed validations listed above');
            console.log('   2. 🔄 Re-run this validation script');
            console.log('   3. 📖 Refer to TROUBLESHOOTING.md for guidance');
            console.log('   4. 🚀 Deploy once all validations pass');
        }
        
        console.log('\n📁 DETAILED RESULTS:');
        console.log('   📄 Full results saved to: validation-results.json');
        console.log('   📖 Deployment guide: DEPLOYMENT-COMPLETE.md');
        console.log('   🔧 Troubleshooting: TROUBLESHOOTING.md');
        
        console.log('='.repeat(60));
    }

    saveResults() {
        try {
            fs.writeFileSync('validation-results.json', JSON.stringify(this.results, null, 2));
            this.log('Validation results saved to: validation-results.json', 'info');
        } catch (error) {
            this.log(`Failed to save validation results: ${error.message}`, 'error');
        }
    }
}

// CLI Usage
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🔍 Cohort Chronicles Local Deployment Validator

Usage: node validate-local-deployment.js [OPTIONS]

Options:
  --help, -h             Show this help message

Description:
  Validates the local project structure, configuration, and code quality
  before deployment to Azure Static Web Apps.

Examples:
  node validate-local-deployment.js
        `);
        process.exit(0);
    }

    console.log('🔍 Cohort Chronicles - Local Deployment Validation');
    console.log('Checking project readiness for deployment...\n');

    const validator = new LocalDeploymentValidator();
    
    try {
        const results = await validator.runAllTests();
        const exitCode = results.summary.failed > 0 ? 1 : 0;
        process.exit(exitCode);
    } catch (error) {
        console.error(`\n❌ Validation failed: ${error.message}`);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error(`Fatal error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = LocalDeploymentValidator;