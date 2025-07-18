#!/usr/bin/env node

// Comprehensive test runner for the Cohort Chronicles project
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test configuration
const testSuites = [
  {
    name: 'Unit Tests',
    command: 'npm',
    args: ['run', 'test:unit'],
    description: 'Testing individual components and classes'
  },
  {
    name: 'Integration Tests',
    command: 'npm',
    args: ['run', 'test:integration'],
    description: 'Testing API endpoints and service integration'
  },
  {
    name: 'End-to-End Tests',
    command: 'npm',
    args: ['run', 'test:e2e'],
    description: 'Testing complete user workflows'
  },
  {
    name: 'Performance Tests',
    command: 'npm',
    args: ['run', 'test:performance'],
    description: 'Testing load times and animation performance'
  }
];

// Utility functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
  const border = '='.repeat(message.length + 4);
  log(border, colors.cyan);
  log(`  ${message}  `, colors.cyan);
  log(border, colors.cyan);
}

function logSection(message) {
  log(`\n${colors.bright}${message}${colors.reset}`);
  log('-'.repeat(message.length), colors.blue);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function checkPrerequisites() {
  logSection('Checking Prerequisites');
  
  // Check if Node.js is installed
  try {
    await runCommand('node', ['--version'], { stdio: 'pipe' });
    log('✓ Node.js is installed', colors.green);
  } catch (error) {
    log('✗ Node.js is not installed', colors.red);
    throw new Error('Node.js is required to run tests');
  }

  // Check if npm is installed
  try {
    await runCommand('npm', ['--version'], { stdio: 'pipe' });
    log('✓ npm is installed', colors.green);
  } catch (error) {
    log('✗ npm is not installed', colors.red);
    throw new Error('npm is required to run tests');
  }

  // Check if package.json exists
  if (fs.existsSync('package.json')) {
    log('✓ package.json found', colors.green);
  } else {
    log('✗ package.json not found', colors.red);
    throw new Error('package.json is required');
  }

  // Check if dependencies are installed
  if (fs.existsSync('node_modules')) {
    log('✓ Dependencies are installed', colors.green);
  } else {
    log('! Dependencies not found, installing...', colors.yellow);
    await runCommand('npm', ['install']);
    log('✓ Dependencies installed', colors.green);
  }
}

async function startTestServer() {
  logSection('Starting Test Server');
  
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'serve'], {
      stdio: 'pipe',
      shell: true
    });

    let serverReady = false;
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('8000') && !serverReady) {
        serverReady = true;
        log('✓ Test server started on port 8000', colors.green);
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('EADDRINUSE')) {
        log('! Port 8000 already in use, assuming server is running', colors.yellow);
        serverReady = true;
        resolve(null); // No need to kill server we didn't start
      }
    });

    setTimeout(() => {
      if (!serverReady) {
        server.kill();
        reject(new Error('Failed to start test server'));
      }
    }, 10000);
  });
}

async function runTestSuite(suite) {
  logSection(`Running ${suite.name}`);
  log(suite.description, colors.blue);
  
  try {
    const startTime = Date.now();
    await runCommand(suite.command, suite.args);
    const duration = Date.now() - startTime;
    log(`✓ ${suite.name} completed in ${duration}ms`, colors.green);
    return { name: suite.name, status: 'passed', duration };
  } catch (error) {
    log(`✗ ${suite.name} failed: ${error.message}`, colors.red);
    return { name: suite.name, status: 'failed', error: error.message };
  }
}

async function generateTestReport(results) {
  logSection('Test Report');
  
  const passed = results.filter(r => r.status === 'passed');
  const failed = results.filter(r => r.status === 'failed');
  
  log(`Total test suites: ${results.length}`, colors.blue);
  log(`Passed: ${passed.length}`, colors.green);
  log(`Failed: ${failed.length}`, failed.length > 0 ? colors.red : colors.green);
  
  if (failed.length > 0) {
    log('\nFailed test suites:', colors.red);
    failed.forEach(result => {
      log(`  - ${result.name}: ${result.error}`, colors.red);
    });
  }
  
  if (passed.length > 0) {
    log('\nPassed test suites:', colors.green);
    passed.forEach(result => {
      log(`  - ${result.name} (${result.duration}ms)`, colors.green);
    });
  }
  
  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: passed.length,
      failed: failed.length,
      success: failed.length === 0
    },
    results: results
  };
  
  fs.writeFileSync('test-results.json', JSON.stringify(report, null, 2));
  log('\n✓ Test report saved to test-results.json', colors.green);
  
  return failed.length === 0;
}

async function main() {
  try {
    logHeader('Cohort Chronicles - Comprehensive Test Suite');
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const runAll = args.length === 0 || args.includes('--all');
    const specificSuite = args.find(arg => !arg.startsWith('--'));
    
    if (specificSuite && !runAll) {
      const suite = testSuites.find(s => s.name.toLowerCase().includes(specificSuite.toLowerCase()));
      if (!suite) {
        log(`Unknown test suite: ${specificSuite}`, colors.red);
        log('Available test suites:', colors.blue);
        testSuites.forEach(s => log(`  - ${s.name}`, colors.blue));
        process.exit(1);
      }
    }
    
    // Check prerequisites
    await checkPrerequisites();
    
    // Start test server for E2E tests
    let testServer = null;
    if (runAll || (specificSuite && specificSuite.toLowerCase().includes('e2e'))) {
      testServer = await startTestServer();
    }
    
    // Run test suites
    const results = [];
    
    if (runAll) {
      for (const suite of testSuites) {
        const result = await runTestSuite(suite);
        results.push(result);
      }
    } else if (specificSuite) {
      const suite = testSuites.find(s => s.name.toLowerCase().includes(specificSuite.toLowerCase()));
      const result = await runTestSuite(suite);
      results.push(result);
    }
    
    // Stop test server
    if (testServer) {
      testServer.kill();
      log('✓ Test server stopped', colors.green);
    }
    
    // Generate report
    const success = await generateTestReport(results);
    
    if (success) {
      logHeader('All Tests Passed! 🎉');
      process.exit(0);
    } else {
      logHeader('Some Tests Failed 😞');
      process.exit(1);
    }
    
  } catch (error) {
    log(`\nError: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\nTest execution interrupted', colors.yellow);
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('\nTest execution terminated', colors.yellow);
  process.exit(1);
});

// Run the main function
if (require.main === module) {
  main();
}

module.exports = { runTestSuite, checkPrerequisites, generateTestReport };