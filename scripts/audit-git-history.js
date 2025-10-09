#!/usr/bin/env node

/**
 * Git History Audit Script
 * Checks git history for exposed secrets
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Git History Audit Starting...');

// Patterns to search for in git history
const secretPatterns = [
  { pattern: /re_[a-zA-Z0-9_-]{40,}/g, name: 'Resend API Key' },
  { pattern: /sk_live_[a-zA-Z0-9_-]{40,}/g, name: 'Stripe Live Secret Key' },
  { pattern: /sk_test_[a-zA-Z0-9_-]{40,}/g, name: 'Stripe Test Secret Key' },
  { pattern: /pk_live_[a-zA-Z0-9_-]{40,}/g, name: 'Stripe Live Publishable Key' },
  { pattern: /pk_test_[a-zA-Z0-9_-]{40,}/g, name: 'Stripe Test Publishable Key' },
  { pattern: /sk_live_[a-zA-Z0-9_-]{40,}/g, name: 'Clerk Secret Key' },
  { pattern: /pk_live_[a-zA-Z0-9_-]{40,}/g, name: 'Clerk Publishable Key' },
  { pattern: /eyJ[a-zA-Z0-9_-]{100,}/g, name: 'Supabase JWT Token' },
];

// Function to run git command safely
function runGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 });
  } catch (error) {
    console.log(`❌ Git command failed: ${command}`);
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

// Function to search git history for secrets
function searchGitHistory() {
  console.log('📚 Searching git history for exposed secrets...');
  
  const findings = [];
  
  // Search in all commits
  for (const { pattern, name } of secretPatterns) {
    console.log(`🔍 Searching for ${name}...`);
    
    try {
      // Search in commit messages and diffs
      const command = `git log -p --all -S "${pattern.source}" -- .`;
      const output = runGitCommand(command);
      
      if (output) {
        const matches = output.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Skip obvious placeholders
            if (match.includes('your_') || match.includes('placeholder') || match.includes('...')) {
              return;
            }
            
            findings.push({
              type: name,
              value: match,
              source: 'git history'
            });
          });
        }
      }
    } catch (error) {
      console.log(`⚠️  Error searching for ${name}: ${error.message}`);
    }
  }
  
  return findings;
}

// Function to check recent commits
function checkRecentCommits() {
  console.log('📅 Checking recent commits...');
  
  try {
    const output = runGitCommand('git log --oneline -10');
    if (output) {
      console.log('Recent commits:');
      console.log(output);
    }
  } catch (error) {
    console.log('❌ Failed to get recent commits');
  }
}

// Function to check for environment files in git history
function checkEnvFilesInHistory() {
  console.log('📁 Checking for environment files in git history...');
  
  try {
    const output = runGitCommand('git log --name-only --all | grep -E "\\.env" | sort | uniq');
    if (output && output.trim()) {
      console.log('⚠️  Found environment files in git history:');
      console.log(output);
      return true;
    } else {
      console.log('✅ No environment files found in git history');
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to check for environment files');
    return false;
  }
}

// Function to check current working directory for secrets
function checkCurrentFiles() {
  console.log('📂 Checking current files for secrets...');
  
  const findings = [];
  
  try {
    // Get list of files to check
    const files = runGitCommand('git ls-files');
    if (!files) return findings;
    
    const fileList = files.split('\n').filter(file => 
      file && 
      !file.includes('node_modules') && 
      !file.includes('.git') &&
      (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || 
       file.endsWith('.json') || file.endsWith('.md') || file.endsWith('.env'))
    );
    
    for (const file of fileList) {
      if (!fs.existsSync(file)) continue;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        for (const { pattern, name } of secretPatterns) {
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
                file: file,
                source: 'current files'
              });
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  } catch (error) {
    console.log('❌ Failed to check current files');
  }
  
  return findings;
}

// Main audit function
async function runAudit() {
  console.log('');
  console.log('🔍 GIT HISTORY AUDIT:');
  console.log('====================');
  
  // Check recent commits
  checkRecentCommits();
  
  console.log('');
  
  // Check for environment files in history
  const envFilesFound = checkEnvFilesInHistory();
  
  console.log('');
  
  // Search git history for secrets
  const historyFindings = searchGitHistory();
  
  console.log('');
  
  // Check current files
  const currentFindings = checkCurrentFiles();
  
  // Combine all findings
  const allFindings = [...historyFindings, ...currentFindings];
  
  console.log('');
  console.log('📋 AUDIT RESULTS:');
  console.log('=================');
  
  if (allFindings.length === 0) {
    console.log('✅ No exposed secrets found in git history or current files!');
  } else {
    console.log(`⚠️  Found ${allFindings.length} potential secret(s):`);
    console.log('');
    
    allFindings.forEach((finding, index) => {
      console.log(`${index + 1}. ${finding.type}`);
      console.log(`   Source: ${finding.source}`);
      if (finding.file) {
        console.log(`   File: ${finding.file}`);
      }
      console.log(`   Value: ${finding.value.substring(0, 20)}...`);
      console.log('');
    });
    
    console.log('🚨 IMMEDIATE ACTIONS REQUIRED:');
    console.log('1. Revoke any exposed API keys immediately');
    console.log('2. Remove secrets from git history (if found)');
    console.log('3. Generate new API keys');
    console.log('4. Update environment variables');
  }
  
  if (envFilesFound) {
    console.log('');
    console.log('⚠️  ENVIRONMENT FILES FOUND IN GIT HISTORY:');
    console.log('1. Check if these files contain secrets');
    console.log('2. Remove them from git history if needed');
    console.log('3. Ensure .env* files are in .gitignore');
  }
  
  console.log('');
  console.log('💡 RECOMMENDATIONS:');
  console.log('- Use .env files for local development only');
  console.log('- Never commit .env files to git');
  console.log('- Use environment variables in production');
  console.log('- Regular security audits');
  console.log('- Consider using git-secrets or similar tools');
}

// Run the audit
runAudit().catch(error => {
  console.error('💥 Audit failed:', error);
  process.exit(1);
});
