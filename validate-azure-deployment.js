#!/usr/bin/env node

/**
 * Azure Deployment Validation Script
 * Comprehensive testing of deployed Cohort Chronicles application
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class AzureDeploymentValidator {
    constructor(baseUrl, options = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            timeout: options.timeout || 15000,
            retries: options.retries || 3,
            verbose: options.verbose || false
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

    async makeRequest(path, options = {}) {
        const url = new URL(path, this.baseUrl);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;

        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const requestOptions = {
                method: options.method || 'GET',
                headers: {
                    'User-Agent': 'Azure-Deployment-Validator/1.0',
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

    async testHomepageDeployment() {
        const response = await this.makeRequest('/');
        
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }

        if (!response.data.includes('The Cohort Chronicles')) {
            throw new Error('Page does not contain expected title');
        }

        if (!response.data.includes('Lock, Stock, and Two Smoking Servers')) {
            throw new Error('Page does not contain cohort name');
        }

        if (!response.data.includes('slideshow')) {
            throw new Error('Page does not contain slideshow elements');
        }

        if (response.duration > 5000) {
            this.log(`Homepage load time is slow: ${response.duration}ms`, 'warning');
            this.results.summary.warnings++;
        }

        return {
            status: response.status,
            duration: response.duration,
            contentLength: response.data.length,
            hasTitle: response.data.includes('The Cohort Chronicles'),
            hasCohortName: response.data.includes('Lock, Stock, and Two Smoking Servers'),
            hasSlideshow: response.data.includes('slideshow')
        };
    }

    async testStaticAssets() {
        const assets = [
            { path: '/styles.css', type: 'text/css', required: true },
            { path: '/script.js', type: 'application/javascript', required: true },
            { path: '/staticwebapp.config.json', type: 'application/json', required: true },
            { path: '/favicon.ico', type: 'image/x-icon', required: false }
        ];

        const results = [];

        for (const asset of assets) {
            try {
                const response = await this.makeRequest(asset.path);
                
                if (response.status === 404 && !asset.required) {
                    this.log(`Optional asset not found: ${asset.path}`, 'warning');
                    this.results.summary.warnings++;
                    continue;
                }

                if (response.status !== 200) {
                    if (asset.required) {
                        throw new Error(`Required asset ${asset.path} returned status ${response.status}`);
                    } else {
                        this.log(`Optional asset ${asset.path} returned status ${response.status}`, 'warning');
                        this.results.summary.warnings++;
                        continue;
                    }
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
                    duration: response.duration,
                    required: asset.required
                });

            } catch (error) {
                if (asset.required) {
                    throw new Error(`Required asset failed: ${asset.path} - ${error.message}`);
                } else {
                    this.log(`Optional asset failed: ${asset.path} - ${error.message}`, 'warning');
                    this.results.summary.warnings++;
                }
            }
        }

        return results;
    }

    async testAPIHealthEndpoint() {
        try {
            const response = await this.makeRequest('/api/health');
            
            if (response.status !== 200) {
                throw new Error(`Health endpoint returned status ${response.status}`);
            }

            let healthData;
            try {
                healthData = JSON.parse(response.data);
            } catch (e) {
                throw new Error('Health endpoint response is not valid JSON');
            }

            if (!healthData.status) {
                throw new Error('Health response missing status field');
            }

            if (healthData.status !== 'healthy' && healthData.status !== 'degraded') {
                throw new Error(`Health status is: ${healthData.status}`);
            }

            return {
                status: response.status,
                duration: response.duration,
                healthStatus: healthData.status,
                timestamp: healthData.timestamp,
                checks: healthData.checks || {}
            };

        } catch (error) {
            if (error.status === 404) {
                this.log('Health endpoint not available (this is acceptable)', 'warning');
                this.results.summary.warnings++;
                return { status: 'not_available', message: 'Health endpoint not implemented' };
            }
            throw error;
        }
    }

    async testChatAPIEndpoint() {
        const testMessage = "Hello, this is a deployment validation test. Can you tell me about the MSSA program?";
        
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

            const responseText = chatData.response || chatData.message || '';
            if (responseText.length < 10) {
                throw new Error('Chat API response too short, may indicate an error');
            }

            if (response.duration > 15000) {
                this.log(`Chat API response time is slow: ${response.duration}ms`, 'warning');
                this.results.summary.warnings++;
            }

            return {
                status: response.status,
                duration: response.duration,
                hasResponse: !!responseText,
                responseLength: responseText.length,
                responsePreview: responseText.substring(0, 100) + (responseText.length > 100 ? '...' : ''),
                metadata: chatData.metadata || {}
            };

        } catch (error) {
            if (error.error && error.error.includes('timeout')) {
                throw new Error('Chat API timeout - check Azure OpenAI configuration and quota');
            }
            throw error;
        }
    }

    async testSecurityHeaders() {
        const response = await this.makeRequest('/');
        const headers = response.headers;
        
        const requiredSecurityHeaders = {
            'x-content-type-options': 'nosniff',
            'x-frame-options': ['DENY', 'SAMEORIGIN'],
            'strict-transport-security': true,
            'content-security-policy': true
        };

        const results = {};
        const missing = [];
        const warnings = [];

        for (const [headerName, expectedValue] of Object.entries(requiredSecurityHeaders)) {
            const actualValue = headers[headerName];
            
            if (!actualValue) {
                missing.push(headerName);
                results[headerName] = { present: false };
            } else if (expectedValue === true) {
                results[headerName] = { present: true, value: actualValue };
            } else if (Array.isArray(expectedValue)) {
                const matches = expectedValue.some(val => actualValue.toLowerCase().includes(val.toLowerCase()));
                results[headerName] = { 
                    present: true, 
                    value: actualValue, 
                    matches: matches 
                };
                if (!matches) {
                    warnings.push(`${headerName} value may not be optimal: ${actualValue}`);
                }
            } else {
                const matches = actualValue.toLowerCase().includes(expectedValue.toLowerCase());
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
            warnings: warnings,
            httpsEnabled: response.url.startsWith('https://')
        };
    }

    async testPerformanceMetrics() {
        const tests = [
            { name: 'Homepage', path: '/', target: 3000 },
            { name: 'CSS Assets', path: '/styles.css', target: 2000 },
            { name: 'JavaScript Assets', path: '/script.js', target: 2000 }
        ];

        const results = [];
        let totalTime = 0;
        let slowRequests = 0;

        for (const test of tests) {
            const response = await this.makeRequest(test.path);
            totalTime += response.duration;
            
            if (response.duration > test.target) {
                slowRequests++;
                this.log(`Slow response for ${test.name}: ${response.duration}ms (target: ${test.target}ms)`, 'warning');
                this.results.summary.warnings++;
            }
            
            results.push({
                name: test.name,
                path: test.path,
                duration: response.duration,
                target: test.target,
                size: response.data.length,
                sizeKB: Math.round(response.data.length / 1024),
                withinTarget: response.duration <= test.target
            });
        }

        return {
            tests: results,
            totalLoadTime: totalTime,
            averageResponseTime: Math.round(totalTime / tests.length),
            slowRequests: slowRequests,
            performanceGrade: slowRequests === 0 ? 'A' : slowRequests <= 1 ? 'B' : 'C'
        };
    }

    async testAzureStaticWebAppFeatures() {
        const response = await this.makeRequest('/');
        
        // Test SPA routing
        const spaTest = await this.makeRequest('/nonexistent-page');
        const spaWorking = spaTest.status === 200 && spaTest.data.includes('The Cohort Chronicles');
        
        // Test API routing
        let apiRouting = false;
        try {
            const apiResponse = await this.makeRequest('/api/health');
            apiRouting = apiResponse.status === 200 || apiResponse.status === 404;
        } catch (error) {
            apiRouting = false;
        }

        return {
            spaRoutingWorking: spaWorking,
            apiRoutingWorking: apiRouting,
            httpsEnabled: response.url.startsWith('https://'),
            azureStaticWebAppDomain: response.url.includes('azurestaticapps.net'),
            customDomain: !response.url.includes('azurestaticapps.net')
        };
    }

    async testMSSAContentValidation() {
        const response = await this.makeRequest('/');
        const content = response.data;
        
        const requiredContent = [
            'The Cohort Chronicles',
            'Lock, Stock, and Two Smoking Servers',
            'Microsoft Software & Systems Academy',
            'MSSA',
            'slideshow',
            'Ask the Cohort'
        ];

        const foundContent = [];
        const missingContent = [];

        requiredContent.forEach(item => {
            if (content.includes(item)) {
                foundContent.push(item);
            } else {
                missingContent.push(item);
            }
        });

        if (missingContent.length > 0) {
            this.log(`Missing expected content: ${missingContent.join(', ')}`, 'warning');
            this.results.summary.warnings++;
        }

        return {
            foundContent: foundContent,
            missingContent: missingContent,
            contentCompleteness: Math.round((foundContent.length / requiredContent.length) * 100),
            hasSlideshow: content.includes('slideshow'),
            hasChatbot: content.includes('Ask the Cohort'),
            hasProgressBar: content.includes('progress')
        };
    }

    async runAllTests() {
        this.log(`🚀 Starting Azure deployment validation for: ${this.baseUrl}`, 'info');
        this.log(`Validating Cohort Chronicles deployment...`, 'info');

        const tests = [
            ['Homepage Deployment Test', () => this.testHomepageDeployment()],
            ['Static Assets Validation', () => this.testStaticAssets()],
            ['API Health Endpoint Test', () => this.testAPIHealthEndpoint()],
            ['Chat API Integration Test', () => this.testChatAPIEndpoint()],
            ['Security Headers Validation', () => this.testSecurityHeaders()],
            ['Performance Metrics Test', () => this.testPerformanceMetrics()],
            ['Azure Static Web App Features', () => this.testAzureStaticWebAppFeatures()],
            ['MSSA Content Validation', () => this.testMSSAContentValidation()]
        ];

        for (const [testName, testFunction] of tests) {
            await this.runTest(testName, testFunction);
        }

        this.generateDeploymentReport();
        this.saveResults();

        return this.results;
    }

    generateDeploymentReport() {
        const { summary } = this.results;
        const successRate = Math.round((summary.passed / summary.total) * 100);
        
        console.log('\n' + '='.repeat(70));
        console.log('🎯 AZURE DEPLOYMENT VALIDATION REPORT');
        console.log('='.repeat(70));
        console.log(`🌐 Deployment URL: ${this.baseUrl}`);
        console.log(`📅 Validation Date: ${this.results.timestamp}`);
        console.log(`📈 Success Rate: ${successRate}% (${summary.passed}/${summary.total})`);
        console.log(`✅ Passed Tests: ${summary.passed}`);
        console.log(`❌ Failed Tests: ${summary.failed}`);
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
            console.log('\n⚠️  WARNINGS DETECTED:');
            console.log(`   ${summary.warnings} warnings found. Review detailed logs for more information.`);
        }

        console.log('\n🎯 DEPLOYMENT STATUS:');
        
        if (successRate === 100 && summary.warnings === 0) {
            console.log('   🎉 EXCELLENT! Deployment is production-ready.');
            console.log('   ✅ All tests passed with no warnings.');
            console.log('   🚀 Ready for graduation ceremony presentation!');
        } else if (successRate === 100 && summary.warnings <= 3) {
            console.log('   👍 GOOD! Deployment is ready with minor warnings.');
            console.log('   ✅ All critical functionality working.');
            console.log('   ⚠️  Address warnings for optimal performance.');
        } else if (successRate >= 80) {
            console.log('   ⚠️  ACCEPTABLE! Deployment has some issues.');
            console.log('   🔧 Review failed tests and warnings before go-live.');
        } else {
            console.log('   🚨 CRITICAL ISSUES! Deployment needs attention.');
            console.log('   ❌ Fix critical errors before using in production.');
        }

        console.log('\n📋 NEXT STEPS:');
        if (summary.failed === 0) {
            console.log('   1. ✅ Share deployment URL with cohort for testing');
            console.log('   2. 🎓 Prepare for graduation ceremony presentation');
            console.log('   3. 📊 Monitor application performance');
            console.log('   4. 🔄 Set up regular health checks');
        } else {
            console.log('   1. 🔧 Fix failed tests and critical issues');
            console.log('   2. 🔄 Re-run validation after fixes');
            console.log('   3. 📖 Refer to troubleshooting guide');
            console.log('   4. 🆘 Contact support if issues persist');
        }
        
        console.log('\n🎓 COHORT CHRONICLES DEPLOYMENT VALIDATION COMPLETE');
        console.log('='.repeat(70));
    }

    saveResults() {
        const fs = require('fs');
        try {
            fs.writeFileSync('azure-deployment-validation.json', JSON.stringify(this.results, null, 2));
            this.log('Validation results saved to: azure-deployment-validation.json', 'info');
        } catch (error) {
            this.log(`Failed to save validation results: ${error.message}`, 'error');
        }
    }
}

// CLI Usage
async function main() {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || 'https://cohort-chronicles-app.azurestaticapps.net';
    
    const options = {
        timeout: 20000,
        retries: 2,
        verbose: args.includes('--verbose') || args.includes('-v')
    };

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🧪 Azure Deployment Validator for Cohort Chronicles

Usage: node validate-azure-deployment.js [URL] [OPTIONS]

Arguments:
  URL                    Deployment URL to validate (default: https://cohort-chronicles-app.azurestaticapps.net)

Options:
  --verbose, -v          Enable verbose logging
  --help, -h             Show this help message

Examples:
  node validate-azure-deployment.js
  node validate-azure-deployment.js https://my-app.azurestaticapps.net
  node validate-azure-deployment.js https://my-app.azurestaticapps.net --verbose
        `);
        process.exit(0);
    }

    console.log('🧪 Cohort Chronicles - Azure Deployment Validation');
    console.log(`Validating deployment: ${baseUrl}\n`);

    const validator = new AzureDeploymentValidator(baseUrl, options);
    
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

module.exports = AzureDeploymentValidator;