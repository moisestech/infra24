#!/usr/bin/env node

/**
 * Security Audit Script
 * Checks for potential exposed secrets in the codebase
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Security Audit Starting...');

// Patterns to check for exposed secrets
const secretPatterns = [
  // API Keys
  { pattern: /re_[a-zA-Z0-9_-]{40,}/g, name: 'Resend API Key' },
  { pattern: /sk_live_[a-zA-Z0-9_-]{40,}/g, name: 'Stripe Live Secret Key' },
  { pattern: /sk_test_[a-zA-Z0-9_-]{40,}/g, name: 'Stripe Test Secret Key' },
  { pattern: /pk_live_[a-zA-Z0-9_-]{40,}/g, name: 'Stripe Live Publishable Key' },
  { pattern: /pk_test_[a-zA-Z0-9_-]{40,}/g, name: 'Stripe Test Publishable Key' },
  
  // Clerk Keys
  { pattern: /sk_live_[a-zA-Z0-9_-]{40,}/g, name: 'Clerk Secret Key' },
  { pattern: /pk_live_[a-zA-Z0-9_-]{40,}/g, name: 'Clerk Publishable Key' },
  
  // Supabase
  { pattern: /eyJ[a-zA-Z0-9_-]{100,}/g, name: 'Supabase JWT Token' },
  
  // Generic API Keys
  { pattern: /[a-zA-Z0-9_-]{32,}/g, name: 'Potential API Key' },
];

// Files to exclude from scanning
const excludePatterns = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /dist/,
  /build/,
  /coverage/,
  /\.env\.example/,
  /package-lock\.json/,
  /yarn\.lock/,
  /bun\.lock/,
];

// File extensions to scan
const includeExtensions = ['.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.env', '.env.local', '.env.production'];

function shouldScanFile(filePath) {
  // Check if file should be excluded
  if (excludePatterns.some(pattern => pattern.test(filePath))) {
    return false;
  }
  
  // Check if file has included extension
  const ext = path.extname(filePath);
  return includeExtensions.includes(ext);
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const findings = [];
    
    secretPatterns.forEach(({ pattern, name }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Skip obvious placeholders
          if (match.includes('your_') || match.includes('placeholder') || match.includes('...')) {
            return;
          }
          
          findings.push({
            type: name,
            value: match,
            file: filePath,
            line: content.substring(0, content.indexOf(match)).split('\n').length
          });
        });
      }
    });
    
    return findings;
  } catch (error) {
    console.log(`❌ Error reading ${filePath}: ${error.message}`);
    return [];
  }
}

function scanDirectory(dirPath) {
  const findings = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findings.push(...scanDirectory(fullPath));
      } else if (stat.isFile() && shouldScanFile(fullPath)) {
        findings.push(...scanFile(fullPath));
      }
    }
  } catch (error) {
    console.log(`❌ Error scanning directory ${dirPath}: ${error.message}`);
  }
  
  return findings;
}

// Main audit function
function runAudit() {
  console.log('📁 Scanning codebase for exposed secrets...');
  
  const findings = scanDirectory('.');
  
  console.log('\n🔍 AUDIT RESULTS:');
  console.log('==================');
  
  if (findings.length === 0) {
    console.log('✅ No exposed secrets found in current codebase!');
  } else {
    console.log(`⚠️  Found ${findings.length} potential secret(s):`);
    console.log('');
    
    findings.forEach((finding, index) => {
      console.log(`${index + 1}. ${finding.type}`);
      console.log(`   File: ${finding.file}`);
      console.log(`   Line: ${finding.line}`);
      console.log(`   Value: ${finding.value.substring(0, 20)}...`);
      console.log('');
    });
    
    console.log('🚨 IMMEDIATE ACTIONS REQUIRED:');
    console.log('1. Revoke any exposed API keys immediately');
    console.log('2. Remove secrets from git history');
    console.log('3. Generate new API keys');
    console.log('4. Update environment variables');
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('- Use .env files for local development');
  console.log('- Add .env* to .gitignore');
  console.log('- Use environment variables in production');
  console.log('- Consider using a secrets management service');
}

// Run the audit
runAudit();
