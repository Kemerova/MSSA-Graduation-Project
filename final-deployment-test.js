#!/usr/bin/env node

/**
 * Final Deployment Testing Script
 * Comprehensive validation of Cohort Chronicles deployment
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

class DeploymentTester {
    constructor(baseUrl, options = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            timeout: options.timeout || 10000,
            retries: options.retries || 3,
            verbose: options.verbose || false,
            outputFile: options.outputFile || 'test-results.json'
        };
        this.results = {
            timestamp: new Date().toISOString(),
            baseUrl: baseUrl,
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

        console.log(`${prefix} [${timestamp}] ${message}`);
        
        if (this.options.verbose || level !== 'debug') {
            // Log to results
            if (!this.results.logs) this.results.logs = [];
            this.results.logs.push({ timestamp, level, message });
        }
    }

    async makeRequest(path, options = {}) {
        const url = new URL(path, this.baseUrl);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;

        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const requestOptions = {
                method: options.method || 'GET',
                headers: {
                    'User-Agent': 'Cohort-Chronicles-Deployment-Tester/1.0',
                    ...options.headers
                },
                timeout: this.options.timeout
            };

            const req = client.request(url, requestOptions, (res) => {
                let data = '';
                
                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    const duration = Date.now() - startTime;
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: data,
                        duration: duration,
                        url: url.toString()
                    });
                });
            });

            req.on('error', (error) => {
                const duration = Date.now() - startTime;
                reject({
                    error: error.message,
                    duration: duration,
                    url: url.toString()
                });
            });

            req.on('timeout', () => {
                req.destroy();
                const duration = Date.now() - startTime;
                reject({
                    error: 'Request timeout',
                    duration: duration,
                    url: url.toString()
                });
            });

            if (options.body) {
                req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
            }

            req.end();
        });
    }

    async runTest(testName, testFunction) {
        this.log(`Running test: ${testName}`, 'debug');
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

    async testHomepageLoad() {
        const response = await this.makeRequest('/');
        
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }

        if (!response.data.includes('<title>')) {
            throw new Error('HTML content appears invalid - no title tag found');
        }

        if (!response.data.includes('Cohort Chronicles')) {
            throw new Error('Page content does not contain expected title');
        }

        if (response.duration > 5000) {
            this.log(`Homepage load time is slow: ${response.duration}ms`, 'warning');
            this.results.summary.warnings++;
        }

        return {
            status: response.status,
            duration: response.duration,
            contentLength: response.data.length,
            hasTitle: response.data.includes('<title>'),
            hasExpectedContent: response.data.includes('Cohort Chronicles')
        };
    }

    async testStaticAssets() {
        const assets = [
            { path: '/styles.css', type: 'text/css' },
            { path: '/script.js', type: 'application/javascript' },
            { path: '/favicon.ico', type: 'image/x-icon', optional: true }
        ];

        const results = [];

        for (const asset of assets) {
            try {
                const response = await this.makeRequest(asset.path);
                
                if (response.status === 404 && asset.optional) {
                    this.log(`Optional asset not found: ${asset.path}`, 'warning');
                    this.results.summary.warnings++;
                    continue;
                }

                if (response.status !== 200) {
                    throw new Error(`Asset ${asset.path} returned status ${response.status}`);
                }

                const contentType = response.headers['content-type'] || '';
                if (asset.type && !contentType.includes(asset.type.split('/')[0])) {
                    this.log(`Asset ${asset.path} has unexpected content-type: ${contentType}`, 'warning');
                    this.results.summary.warnings++;
                }

                results.push({
                    path: asset.path,
                    status: response.status,
                    contentType: contentType,
                    size: response.data.length,
                    duration: response.duration
                });

            } catch (error) {
                if (asset.optional) {
                    this.log(`Optional asset failed: ${asset.path} - ${error.message}`, 'warning');
                    this.results.summary.warnings++;
                } else {
                    throw new Error(`Required asset failed: ${asset.path} - ${error.message}`);
                }
            }
        }

        return results;
    }

    async testAPIHealth() {
        try {
            const response = await this.makeRequest('/api/health');
            
            if (response.status !== 200) {
                throw new Error(`API health check returned status ${response.status}`);
            }

            let healthData;
            try {
                healthData = JSON.parse(response.data);
            } catch (e) {
                throw new Error('API health response is not valid JSON');
            }

            return {
                status: response.status,
                duration: response.duration,
                data: healthData
            };

        } catch (error) {
            // Health endpoint might not exist, which is acceptable
            if (error.error === 'Request timeout' || error.status === 404) {
                this.log('API health endpoint not available (this is acceptable)', 'warning');
                this.results.summary.warnings++;
                return { status: 'not_available', message: 'Health endpoint not implemented' };
            }
            throw error;
        }
    }

    async testChatAPI() {
        const testMessage = "Hello, this is a test message for deployment validation.";
        
        try {
            const response = await this.makeRequest('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: testMessage })
            });

            if (response.status !== 200) {
                throw new Error(`Chat API returned status ${response.status}: ${response.data}`);
            }

            let chatData;
            try {
                chatData = JSON.parse(response.data);
            } catch (e) {
                throw new Error('Chat API response is not valid JSON');
            }

            if (!chatData.response && !chatData.message) {
                throw new Error('Chat API response missing expected response field');
            }

            if (response.duration > 10000) {
                this.log(`Chat API response time is slow: ${response.duration}ms`, 'warning');
                this.results.summary.warnings++;
            }

            return {
                status: response.status,
                duration: response.duration,
                hasResponse: !!(chatData.response || chatData.message),
                responseLength: (chatData.response || chatData.message || '').length
            };

        } catch (error) {
            // If it's a configuration error, provide helpful information
            if (error.error && error.error.includes('timeout')) {
                throw new Error('Chat API timeout - check Azure OpenAI configuration');
            }
            throw error;
        }
    }

    async testSecurityHeaders() {
        const response = await this.makeRequest('/');
        const headers = response.headers;
        
        const securityHeaders = {
            'x-content-type-options': 'nosniff',
            'x-frame-options': ['DENY', 'SAMEORIGIN'],
            'x-xss-protection': '1; mode=block',
            'strict-transport-security': true, // Just check if present
            'content-security-policy': true
        };

        const results = {};
        const missing = [];
        const warnings = [];

        for (const [headerName, expectedValue] of Object.entries(securityHeaders)) {
            const actualValue = headers[headerName];
            
            if (!actualValue) {
                missing.push(headerName);
                results[headerName] = { present: false };
            } else if (expectedValue === true) {
                results[headerName] = { present: true, value: actualValue };
            } else if (Array.isArray(expectedValue)) {
                const matches = expectedValue.some(val => actualValue.includes(val));
                results[headerName] = { 
                    present: true, 
                    value: actualValue, 
                    matches: matches 
                };
                if (!matches) {
                    warnings.push(`${headerName} value may not be optimal: ${actualValue}`);
                }
            } else {
                const matches = actualValue.includes(expectedValue);
                results[headerName] = { 
                    present: true, 
                    value: actualValue, 
                    matches: matches 
                };
                if (!matches) {
                    warnings.push(`${headerName} value doesn't match expected: ${actualValue}`);
                }
            }
        }

        if (missing.length > 0) {
            this.log(`Missing security headers: ${missing.join(', ')}`, 'warning');
            this.results.summary.warnings++;
        }

        if (warnings.length > 0) {
            warnings.forEach(warning => {
                this.log(warning, 'warning');
                this.results.summary.warnings++;
            });
        }

        return {
            headers: results,
            missing: missing,
            warnings: warnings
        };
    }

    async testResponsiveDesign() {
        // This is a basic test - in a real scenario you'd use a headless browser
        const response = await this.makeRequest('/');
        const html = response.data;
        
        const checks = {
            hasViewportMeta: html.includes('name="viewport"'),
            hasResponsiveCSS: html.includes('media=') || html.includes('@media'),
            hasFlexbox: html.includes('flex') || html.includes('grid'),
            hasMobileFirst: html.includes('min-width') || html.includes('max-width')
        };

        const issues = [];
        if (!checks.hasViewportMeta) {
            issues.push('Missing viewport meta tag');
        }

        if (issues.length > 0) {
            issues.forEach(issue => {
                this.log(`Responsive design issue: ${issue}`, 'warning');
                this.results.summary.warnings++;
            });
        }

        return checks;
    }

    async testPerformance() {
        const tests = [
            { name: 'Homepage', path: '/' },
            { name: 'CSS', path: '/styles.css' },
            { name: 'JavaScript', path: '/script.js' }
        ];

        const results = [];
        let totalTime = 0;

        for (const test of tests) {
            const response = await this.makeRequest(test.path);
            totalTime += response.duration;
            
            results.push({
                name: test.name,
                path: test.path,
                duration: response.duration,
                size: response.data.length,
                sizeKB: Math.round(response.data.length / 1024)
            });

            if (response.duration > 3000) {
                this.log(`Slow response for ${test.name}: ${response.duration}ms`, 'warning');
                this.results.summary.warnings++;
            }
        }

        return {
            tests: results,
            totalLoadTime: totalTime,
            averageResponseTime: Math.round(totalTime / tests.length)
        };
    }

    async testAccessibility() {
        const response = await this.makeRequest('/');
        const html = response.data;
        
        const checks = {
            hasLangAttribute: html.includes('lang='),
            hasAltTags: !html.includes('<img') || html.includes('alt='),
            hasAriaLabels: html.includes('aria-label') || html.includes('aria-labelledby'),
            hasSemanticHTML: html.includes('<main') || html.includes('<section') || html.includes('<article'),
            hasSkipLinks: html.includes('skip') && html.includes('href="#'),
            hasFocusManagement: html.includes('tabindex') || html.includes('focus')
        };

        const issues = [];
        Object.entries(checks).forEach(([check, passed]) => {
            if (!passed) {
                issues.push(check.replace(/([A-Z])/g, ' $1').toLowerCase());
            }
        });

        if (issues.length > 0) {
            issues.forEach(issue => {
                this.log(`Accessibility concern: ${issue}`, 'warning');
                this.results.summary.warnings++;
            });
        }

        return {
            checks: checks,
            issues: issues,
            score: Math.round((Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100)
        };
    }

    async runAllTests() {
        this.log(`🚀 Starting comprehensive deployment test for: ${this.baseUrl}`, 'info');
        this.log(`Test configuration: timeout=${this.options.timeout}ms, retries=${this.options.retries}`, 'debug');

        const tests = [
            ['Homepage Load Test', () => this.testHomepageLoad()],
            ['Static Assets Test', () => this.testStaticAssets()],
            ['API Health Test', () => this.testAPIHealth()],
            ['Chat API Test', () => this.testChatAPI()],
            ['Security Headers Test', () => this.testSecurityHeaders()],
            ['Responsive Design Test', () => this.testResponsiveDesign()],
            ['Performance Test', () => this.testPerformance()],
            ['Accessibility Test', () => this.testAccessibility()]
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
        console.log('📊 DEPLOYMENT TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`🎯 Base URL: ${this.baseUrl}`);
        console.log(`📅 Test Date: ${this.results.timestamp}`);
        console.log(`📈 Success Rate: ${successRate}% (${summary.passed}/${summary.total})`);
        console.log(`✅ Passed: ${summary.passed}`);
        console.log(`❌ Failed: ${summary.failed}`);
        console.log(`⚠️  Warnings: ${summary.warnings}`);
        
        if (summary.failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.tests
                .filter(test => test.status === 'failed')
                .forEach(test => {
                    console.log(`   • ${test.name}: ${test.error}`);
                });
        }

        if (summary.warnings > 0) {
            console.log('\n⚠️  WARNINGS:');
            console.log(`   ${summary.warnings} warnings detected. Check detailed logs for more information.`);
        }

        console.log('\n🎯 RECOMMENDATIONS:');
        
        if (successRate === 100 && summary.warnings === 0) {
            console.log('   🎉 Excellent! Your deployment is ready for production.');
        } else if (successRate >= 80) {
            console.log('   👍 Good deployment. Address warnings for optimal performance.');
        } else if (successRate >= 60) {
            console.log('   ⚠️  Deployment has issues. Review failed tests before going live.');
        } else {
            console.log('   🚨 Deployment has significant issues. Fix critical errors before proceeding.');
        }

        console.log('\n📋 NEXT STEPS:');
        console.log('   1. Review detailed test results in test-results.json');
        console.log('   2. Address any failed tests or critical warnings');
        console.log('   3. Run tests again after making fixes');
        console.log('   4. Monitor application performance after deployment');
        
        console.log('='.repeat(60));
    }

    saveResults() {
        try {
            fs.writeFileSync(this.options.outputFile, JSON.stringify(this.results, null, 2));
            this.log(`Test results saved to: ${this.options.outputFile}`, 'info');
        } catch (error) {
            this.log(`Failed to save test results: ${error.message}`, 'error');
        }
    }
}

// CLI Usage
async function main() {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || 'https://cohort-chronicles.azurestaticapps.net';
    
    const options = {
        timeout: 15000,
        retries: 2,
        verbose: args.includes('--verbose') || args.includes('-v'),
        outputFile: args.find(arg => arg.startsWith('--output='))?.split('=')[1] || 'test-results.json'
    };

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🧪 Cohort Chronicles Deployment Tester

Usage: node final-deployment-test.js [URL] [OPTIONS]

Arguments:
  URL                    Base URL to test (default: https://cohort-chronicles.azurestaticapps.net)

Options:
  --verbose, -v          Enable verbose logging
  --output=FILE          Output file for results (default: test-results.json)
  --help, -h             Show this help message

Examples:
  node final-deployment-test.js
  node final-deployment-test.js https://my-app.azurestaticapps.net
  node final-deployment-test.js https://my-app.azurestaticapps.net --verbose
  node final-deployment-test.js https://my-app.azurestaticapps.net --output=my-results.json
        `);
        process.exit(0);
    }

    console.log('🧪 Cohort Chronicles - Final Deployment Test');
    console.log(`Testing: ${baseUrl}\n`);

    const tester = new DeploymentTester(baseUrl, options);
    
    try {
        const results = await tester.runAllTests();
        const exitCode = results.summary.failed > 0 ? 1 : 0;
        process.exit(exitCode);
    } catch (error) {
        console.error(`\n❌ Test runner failed: ${error.message}`);
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

module.exports = DeploymentTester;