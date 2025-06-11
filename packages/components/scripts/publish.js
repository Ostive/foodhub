#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the script is run from the components directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: This script must be run from the components directory');
  process.exit(1);
}

// Read the package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log(`Publishing ${packageJson.name} version ${packageJson.version}...`);

try {
  // Build the package
  console.log('Building the package...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Run tests if available
  console.log('Running tests...');
  execSync('npm test', { stdio: 'inherit' });
  
  // Publish to npm
  console.log('Publishing to npm...');
  execSync('npm publish', { stdio: 'inherit' });
  
  console.log(`Successfully published ${packageJson.name}@${packageJson.version}`);
} catch (error) {
  console.error('Error during publishing:', error.message);
  process.exit(1);
}
