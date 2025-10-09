#!/usr/bin/env node

/**
 * Fix Deprecated Packages Script
 * Updates deprecated packages to latest versions
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing Deprecated Packages...');

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Package updates to apply
const packageUpdates = {
  // Update deprecated packages
  'rimraf': '^5.0.0', // Update from 3.0.2
  'eslint': '^9.0.0', // Update from 8.57.1
  'glob': '^10.0.0', // Update from 7.2.3
  
  // Replace deprecated packages
  'domexception': null, // Remove - use native DOMException
  'inflight': null, // Remove - use lru-cache
  'abab': null, // Remove - use native atob/btoa
  '@humanwhocodes/config-array': null, // Remove - use @eslint/config-array
  '@humanwhocodes/object-schema': null, // Remove - use @eslint/object-schema
  
  // Add replacements
  'lru-cache': '^10.0.0', // Replacement for inflight
  '@eslint/config-array': '^0.18.0', // Replacement for @humanwhocodes/config-array
  '@eslint/object-schema': '^2.1.0' // Replacement for @humanwhocodes/object-schema
};

function updatePackageJson() {
  log(colors.blue, '📦 Updating package.json...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    let updated = false;
    
    // Update dependencies
    ['dependencies', 'devDependencies'].forEach(depType => {
      if (packageJson[depType]) {
        Object.entries(packageUpdates).forEach(([packageName, newVersion]) => {
          if (packageJson[depType][packageName]) {
            if (newVersion === null) {
              // Remove deprecated package
              log(colors.yellow, `   Removing deprecated package: ${packageName}`);
              delete packageJson[depType][packageName];
              updated = true;
            } else {
              // Update package version
              const currentVersion = packageJson[depType][packageName];
              if (currentVersion !== newVersion) {
                log(colors.blue, `   Updating ${packageName}: ${currentVersion} → ${newVersion}`);
                packageJson[depType][packageName] = newVersion;
                updated = true;
              }
            }
          } else if (newVersion !== null) {
            // Add new package
            log(colors.green, `   Adding new package: ${packageName}@${newVersion}`);
            packageJson[depType][packageName] = newVersion;
            updated = true;
          }
        });
      }
    });
    
    if (updated) {
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
      log(colors.green, '✅ package.json updated successfully');
      return true;
    } else {
      log(colors.blue, 'ℹ️  No package updates needed');
      return false;
    }
  } catch (error) {
    log(colors.red, '❌ Failed to update package.json:', error.message);
    return false;
  }
}

function installPackages() {
  log(colors.blue, '📥 Installing updated packages...');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    log(colors.green, '✅ Packages installed successfully');
    return true;
  } catch (error) {
    log(colors.red, '❌ Failed to install packages:', error.message);
    return false;
  }
}

function updateESLintConfig() {
  log(colors.blue, '🔧 Updating ESLint configuration...');
  
  try {
    // Check if .eslintrc.json exists
    if (fs.existsSync('.eslintrc.json')) {
      const eslintConfig = JSON.parse(fs.readFileSync('.eslintrc.json', 'utf8'));
      
      // Update ESLint configuration for v9
      if (eslintConfig.extends) {
        eslintConfig.extends = eslintConfig.extends.map(ext => {
          if (ext === '@next/eslint-config-next') {
            return 'next/core-web-vitals';
          }
          return ext;
        });
      }
      
      // Add new ESLint v9 configuration
      eslintConfig.parserOptions = {
        ...eslintConfig.parserOptions,
        ecmaVersion: 'latest',
        sourceType: 'module'
      };
      
      fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2) + '\n');
      log(colors.green, '✅ ESLint configuration updated for v9');
    } else {
      log(colors.yellow, '⚠️  No .eslintrc.json found, creating new configuration...');
      
      const newConfig = {
        extends: ['next/core-web-vitals'],
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module'
        },
        rules: {
          'react-hooks/exhaustive-deps': 'warn',
          'jsx-a11y/alt-text': 'warn',
          '@next/next/no-img-element': 'warn'
        }
      };
      
      fs.writeFileSync('.eslintrc.json', JSON.stringify(newConfig, null, 2) + '\n');
      log(colors.green, '✅ New ESLint configuration created');
    }
    
    return true;
  } catch (error) {
    log(colors.red, '❌ Failed to update ESLint configuration:', error.message);
    return false;
  }
}

function createNextConfigUpdate() {
  log(colors.blue, '⚙️  Updating Next.js configuration...');
  
  try {
    const nextConfigPath = 'next.config.js';
    let nextConfig = '';
    
    if (fs.existsSync(nextConfigPath)) {
      nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    }
    
    // Add configuration to handle deprecated packages
    const additionalConfig = `
// Configuration to handle deprecated packages
const nextConfig = {
  // ... existing config ...
  
  // Handle deprecated packages
  webpack: (config, { isServer }) => {
    // Handle domexception deprecation
    config.resolve.alias = {
      ...config.resolve.alias,
      'domexception': false,
      'inflight': false,
      'abab': false
    };
    
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  }
};

module.exports = nextConfig;
`;
    
    if (!nextConfig.includes('webpack')) {
      fs.writeFileSync(nextConfigPath, additionalConfig);
      log(colors.green, '✅ Next.js configuration updated');
    } else {
      log(colors.blue, 'ℹ️  Next.js configuration already has webpack config');
    }
    
    return true;
  } catch (error) {
    log(colors.red, '❌ Failed to update Next.js configuration:', error.message);
    return false;
  }
}

// Main function
async function fixDeprecatedPackages() {
  log(colors.bold, '🔧 FIXING DEPRECATED PACKAGES');
  log(colors.bold, '============================');
  
  const steps = [
    { name: 'Update package.json', fn: updatePackageJson },
    { name: 'Update ESLint configuration', fn: updateESLintConfig },
    { name: 'Update Next.js configuration', fn: createNextConfigUpdate },
    { name: 'Install packages', fn: installPackages }
  ];
  
  let success = true;
  
  for (const step of steps) {
    log(colors.blue, `\n🔄 ${step.name}...`);
    const result = step.fn();
    if (!result) {
      success = false;
      log(colors.red, `❌ ${step.name} failed`);
    }
  }
  
  if (success) {
    log(colors.green, '\n🎉 All deprecated packages fixed successfully!');
    log(colors.blue, '\n💡 Next steps:');
    log(colors.blue, '   1. Run: npm run build');
    log(colors.blue, '   2. Run: node scripts/validate-build.js');
    log(colors.blue, '   3. Test your application');
  } else {
    log(colors.red, '\n❌ Some fixes failed. Please check the errors above.');
  }
  
  return success;
}

// Run the fix
fixDeprecatedPackages().catch(error => {
  log(colors.red, '💥 Fix failed:', error);
  process.exit(1);
});
