#!/usr/bin/env node

/**
 * Quick verification script to check extension setup
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'manifest.json',
  'background.js',
  'rules-engine.js',
  'transport.js',
  'rules.json',
  'popup.html',
  'popup.js',
  'popup.css',
  'options.html',
  'options.js',
  'options.css',
  'icons/icon16.png',
  'icons/icon48.png',
  'icons/icon128.png'
];

let errors = [];
let warnings = [];

console.log('🔍 Verifying ZoneIn Extension setup...\n');

// Check required files
console.log('Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file}`);
  } else {
    errors.push(`Missing file: ${file}`);
    console.log(`  ✗ ${file} (MISSING)`);
  }
});

// Check manifest.json
console.log('\nChecking manifest.json...');
try {
  const manifestPath = path.join(__dirname, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  if (manifest.manifest_version !== 3) {
    warnings.push('Manifest version should be 3');
  }
  
  if (!manifest.background || !manifest.background.service_worker) {
    errors.push('Missing service_worker in manifest');
  }
  
  console.log(`  ✓ Valid JSON`);
  console.log(`  ✓ Manifest version: ${manifest.manifest_version}`);
  console.log(`  ✓ Extension name: ${manifest.name}`);
} catch (error) {
  errors.push(`Invalid manifest.json: ${error.message}`);
  console.log(`  ✗ ${error.message}`);
}

// Check rules.json
console.log('\nChecking rules.json...');
try {
  const rulesPath = path.join(__dirname, 'rules.json');
  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
  
  if (!rules.rules || !Array.isArray(rules.rules)) {
    errors.push('rules.json missing rules array');
  } else {
    console.log(`  ✓ Found ${rules.rules.length} rules`);
    
    // Check for required classifications
    const classifications = new Set(rules.rules.map(r => r.classification));
    const required = ['productive', 'neutral', 'distracting'];
    required.forEach(cls => {
      if (classifications.has(cls)) {
        console.log(`  ✓ Has ${cls} rules`);
      } else {
        warnings.push(`No ${cls} rules found`);
      }
    });
  }
} catch (error) {
  errors.push(`Invalid rules.json: ${error.message}`);
  console.log(`  ✗ ${error.message}`);
}

// Check native host
console.log('\nChecking native host...');
const nativeHostPath = path.join(__dirname, 'native-host', 'zonein-host.js');
if (fs.existsSync(nativeHostPath)) {
  console.log(`  ✓ Native host script exists`);
  
  // Check if executable
  try {
    fs.accessSync(nativeHostPath, fs.constants.X_OK);
    console.log(`  ✓ Native host is executable`);
  } catch {
    warnings.push('Native host script is not executable (run: chmod +x native-host/zonein-host.js)');
    console.log(`  ⚠ Native host is not executable`);
  }
} else {
  warnings.push('Native host script not found (optional)');
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Extension is ready to load.');
  console.log('\nNext steps:');
  console.log('1. Open Chrome → chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log('4. Select this directory:', __dirname);
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('\n❌ ERRORS (must fix):');
    errors.forEach(err => console.log(`  - ${err}`));
  }
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (optional):');
    warnings.forEach(warn => console.log(`  - ${warn}`));
  }
  console.log('\nFix errors before loading extension.');
  process.exit(errors.length > 0 ? 1 : 0);
}
