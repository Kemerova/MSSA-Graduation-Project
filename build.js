#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process for Cohort Chronicles...');

// Configuration
const config = {
  minifyAssets: process.env.NODE_ENV === 'production' || process.env.MINIFY_ASSETS === 'true',
  outputDir: process.env.OUTPUT_DIR || 'dist',
  apiEndpoint: process.env.API_ENDPOINT || '/api'
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Copy and process HTML files
function processHTML() {
  console.log('📄 Processing HTML files...');
  
  let htmlContent = fs.readFileSync('index.html', 'utf8');
  
  // Replace API endpoint placeholder if needed
  htmlContent = htmlContent.replace(/\/api\//g, `${config.apiEndpoint}/`);
  
  // Update asset references if minified versions exist
  if (config.minifyAssets) {
    if (fs.existsSync('styles.min.css')) {
      htmlContent = htmlContent.replace('styles.css', 'styles.min.css');
    }
    if (fs.existsSync('script.min.js')) {
      htmlContent = htmlContent.replace('script.js', 'script.min.js');
    }
  }
  
  fs.writeFileSync(path.join(config.outputDir, 'index.html'), htmlContent);
  console.log('✅ HTML processing complete');
}

// Copy static assets
function copyAssets() {
  console.log('📁 Copying static assets...');
  
  const assetsToCopy = [
    'styles.css',
    'script.js',
    'staticwebapp.config.json'
  ];
  
  // Copy minified versions if they exist and minification is enabled
  if (config.minifyAssets) {
    if (fs.existsSync('styles.min.css')) {
      assetsToCopy.push('styles.min.css');
    }
    if (fs.existsSync('script.min.js')) {
      assetsToCopy.push('script.min.js');
    }
  }
  
  assetsToCopy.forEach(asset => {
    if (fs.existsSync(asset)) {
      fs.copyFileSync(asset, path.join(config.outputDir, asset));
      console.log(`  ✓ Copied ${asset}`);
    }
  });
  
  // Copy images directory if it exists
  if (fs.existsSync('images')) {
    const imagesDir = path.join(config.outputDir, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    const images = fs.readdirSync('images');
    images.forEach(image => {
      fs.copyFileSync(
        path.join('images', image),
        path.join(imagesDir, image)
      );
    });
    console.log(`  ✓ Copied images directory (${images.length} files)`);
  }
  
  console.log('✅ Asset copying complete');
}

// Generate environment configuration
function generateEnvConfig() {
  console.log('⚙️  Generating environment configuration...');
  
  const envConfig = {
    apiEndpoint: config.apiEndpoint,
    buildTime: new Date().toISOString(),
    version: require('./api/package.json').version,
    environment: process.env.NODE_ENV || 'development'
  };
  
  // Create a JavaScript file that can be included in the HTML
  const configJs = `
// Auto-generated build configuration
window.APP_CONFIG = ${JSON.stringify(envConfig, null, 2)};
console.log('🔧 App configuration loaded:', window.APP_CONFIG);
`;
  
  fs.writeFileSync(path.join(config.outputDir, 'config.js'), configJs);
  console.log('✅ Environment configuration generated');
}

// Main build process
async function build() {
  try {
    console.log(`📦 Building for ${process.env.NODE_ENV || 'development'} environment`);
    console.log(`🎯 Output directory: ${config.outputDir}`);
    console.log(`🔗 API endpoint: ${config.apiEndpoint}`);
    console.log(`⚡ Minify assets: ${config.minifyAssets}`);
    
    processHTML();
    copyAssets();
    generateEnvConfig();
    
    console.log('🎉 Build process completed successfully!');
    
    // Display build summary
    const stats = fs.statSync(path.join(config.outputDir, 'index.html'));
    console.log(`📊 Build summary:`);
    console.log(`   - Output directory: ${config.outputDir}`);
    console.log(`   - Main HTML size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   - Build time: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build if this script is executed directly
if (require.main === module) {
  build();
}

module.exports = { build, config };