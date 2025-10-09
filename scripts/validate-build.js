#!/usr/bin/env node

/**
 * Build Validation Script
 * Catches build issues locally before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Build Validation Starting...');

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

// Check for deprecated packages
function checkDeprecatedPackages() {
  log(colors.blue, '\n📦 Checking for deprecated packages...');
  
  try {
    const output = execSync('npm audit --audit-level=moderate', { encoding: 'utf8' });
    
    if (output.includes('found 0 vulnerabilities')) {
      log(colors.green, '✅ No security vulnerabilities found');
    } else {
      log(colors.yellow, '⚠️  Security vulnerabilities found:');
      console.log(output);
    }
  } catch (error) {
    log(colors.yellow, '⚠️  npm audit failed, checking package.json manually...');
  }
  
  // Check for known deprecated packages
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deprecatedPackages = {
    'rimraf': '3.0.2',
    'domexception': '4.0.0',
    'inflight': '1.0.6',
    'abab': '2.0.6',
    '@humanwhocodes/config-array': '0.13.0',
    '@humanwhocodes/object-schema': '2.0.3',
    'glob': '7.2.3',
    'eslint': '8.57.1'
  };
  
  const issues = [];
  
  // Check dependencies
  ['dependencies', 'devDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      Object.entries(packageJson[depType]).forEach(([name, version]) => {
        if (deprecatedPackages[name]) {
          issues.push({
            type: 'deprecated',
            package: name,
            current: version,
            issue: `Deprecated version detected`
          });
        }
      });
    }
  });
  
  if (issues.length > 0) {
    log(colors.yellow, '⚠️  Deprecated packages found:');
    issues.forEach(issue => {
      console.log(`   - ${issue.package}: ${issue.current} (${issue.issue})`);
    });
  } else {
    log(colors.green, '✅ No deprecated packages found');
  }
  
  return issues;
}

// Check for build warnings
function checkBuildWarnings() {
  log(colors.blue, '\n🔨 Checking for build warnings...');
  
  try {
    // Run build and capture output
    const output = execSync('npm run build 2>&1', { encoding: 'utf8' });
    
    const warnings = [];
    
    // Check for common warning patterns
    const warningPatterns = [
      { pattern: /Warning:/g, type: 'general' },
      { pattern: /deprecated/g, type: 'deprecated' },
      { pattern: /missing dependency/g, type: 'react-hooks' },
      { pattern: /alt prop/g, type: 'accessibility' },
      { pattern: /Image.*img/g, type: 'performance' },
      { pattern: /Dynamic server usage/g, type: 'nextjs' }
    ];
    
    warningPatterns.forEach(({ pattern, type }) => {
      const matches = output.match(pattern);
      if (matches) {
        warnings.push({
          type,
          count: matches.length,
          pattern: pattern.source
        });
      }
    });
    
    if (warnings.length > 0) {
      log(colors.yellow, '⚠️  Build warnings found:');
      warnings.forEach(warning => {
        console.log(`   - ${warning.type}: ${warning.count} warnings`);
      });
    } else {
      log(colors.green, '✅ No build warnings found');
    }
    
    return warnings;
  } catch (error) {
    log(colors.red, '❌ Build failed:');
    console.log(error.message);
    return [{ type: 'build-failure', error: error.message }];
  }
}

// Check for TypeScript errors
function checkTypeScriptErrors() {
  log(colors.blue, '\n📝 Checking TypeScript errors...');
  
  try {
    const output = execSync('npx tsc --noEmit', { encoding: 'utf8' });
    log(colors.green, '✅ No TypeScript errors found');
    return [];
  } catch (error) {
    log(colors.red, '❌ TypeScript errors found:');
    console.log(error.stdout || error.message);
    return [{ type: 'typescript', error: error.stdout || error.message }];
  }
}

// Check for ESLint errors
function checkESLintErrors() {
  log(colors.blue, '\n🔍 Checking ESLint errors...');
  
  try {
    const output = execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0', { encoding: 'utf8' });
    log(colors.green, '✅ No ESLint errors found');
    return [];
  } catch (error) {
    log(colors.yellow, '⚠️  ESLint warnings/errors found:');
    console.log(error.stdout || error.message);
    return [{ type: 'eslint', error: error.stdout || error.message }];
  }
}

// Check for security vulnerabilities
function checkSecurityVulnerabilities() {
  log(colors.blue, '\n🔒 Checking security vulnerabilities...');
  
  try {
    const output = execSync('npm audit --audit-level=high', { encoding: 'utf8' });
    
    if (output.includes('found 0 vulnerabilities')) {
      log(colors.green, '✅ No high-severity vulnerabilities found');
      return [];
    } else {
      log(colors.red, '❌ Security vulnerabilities found:');
      console.log(output);
      return [{ type: 'security', error: output }];
    }
  } catch (error) {
    log(colors.yellow, '⚠️  Security check failed:');
    console.log(error.message);
    return [{ type: 'security-check-failed', error: error.message }];
  }
}

// Generate recommendations
function generateRecommendations(issues) {
  log(colors.blue, '\n💡 Recommendations:');
  
  const recommendations = {
    'deprecated': [
      'Update deprecated packages to latest versions',
      'Run: npm update',
      'Check package.json for specific version updates'
    ],
    'react-hooks': [
      'Fix missing dependencies in useEffect hooks',
      'Add missing dependencies to dependency arrays',
      'Use useCallback for functions in dependencies'
    ],
    'accessibility': [
      'Add alt props to all images',
      'Use semantic HTML elements',
      'Ensure proper ARIA labels'
    ],
    'performance': [
      'Replace <img> with <Image /> from next/image',
      'Optimize image loading and sizing',
      'Use proper image formats (WebP, AVIF)'
    ],
    'nextjs': [
      'Add export const dynamic = "force-dynamic" to API routes',
      'Use proper Next.js patterns for dynamic content',
      'Consider static generation where possible'
    ],
    'typescript': [
      'Fix TypeScript type errors',
      'Add proper type annotations',
      'Update type definitions'
    ],
    'eslint': [
      'Fix ESLint rule violations',
      'Update ESLint configuration',
      'Add missing dependencies'
    ],
    'security': [
      'Update vulnerable packages immediately',
      'Run: npm audit fix',
      'Review and update dependencies'
    ]
  };
  
  const issueTypes = [...new Set(issues.map(issue => issue.type))];
  
  issueTypes.forEach(type => {
    if (recommendations[type]) {
      console.log(`\n${colors.bold}${type.toUpperCase()}:${colors.reset}`);
      recommendations[type].forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }
  });
}

// Main validation function
async function runValidation() {
  log(colors.bold, '🚀 BUILD VALIDATION REPORT');
  log(colors.bold, '========================');
  
  const allIssues = [];
  
  // Run all checks
  allIssues.push(...checkDeprecatedPackages());
  allIssues.push(...checkTypeScriptErrors());
  allIssues.push(...checkESLintErrors());
  allIssues.push(...checkSecurityVulnerabilities());
  allIssues.push(...checkBuildWarnings());
  
  // Summary
  log(colors.bold, '\n📊 SUMMARY:');
  log(colors.bold, '===========');
  
  if (allIssues.length === 0) {
    log(colors.green, '🎉 All checks passed! Your build is ready for deployment.');
  } else {
    log(colors.yellow, `⚠️  Found ${allIssues.length} issue(s) that should be addressed:`);
    
    const issueCounts = {};
    allIssues.forEach(issue => {
      issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
    });
    
    Object.entries(issueCounts).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count} issue(s)`);
    });
    
    generateRecommendations(allIssues);
    
    log(colors.yellow, '\n⚠️  Consider fixing these issues before deployment for better performance and security.');
  }
  
  // Exit with appropriate code
  process.exit(allIssues.length > 0 ? 1 : 0);
}

// Run validation
runValidation().catch(error => {
  log(colors.red, '💥 Validation failed:', error);
  process.exit(1);
});
