#!/usr/bin/env node

/**
 * Production Verification Script
 * 
 * This script helps verify that the production deployment is working correctly
 * after the navigation migration and environment variable updates.
 */

const https = require('https');
const http = require('http');

// Production URL
const PRODUCTION_URL = 'https://infra24.vercel.app';

// Pages to test
const pagesToTest = [
  '/',
  '/o/oolite',
  '/o/oolite/surveys',
  '/o/oolite/announcements',
  '/o/oolite/users',
  '/o/oolite/digital-lab',
  '/o/oolite/analytics',
  '/o/oolite/workshops',
  '/o/bakehouse/workshops',
  '/sign-in',
  '/sign-up'
];

// Function to make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          content: data.substring(0, 500) // First 500 chars
        });
      });
    });
    
    req.on('error', (error) => {
      reject({ url, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject({ url, error: 'Request timeout' });
    });
  });
}

// Function to check for specific issues
function checkForIssues(response) {
  const issues = [];
  
  // Check for development keys warning
  if (response.content.includes('development keys')) {
    issues.push('❌ Clerk development keys detected');
  }
  
  // Check for CORS errors
  if (response.content.includes('CORS') || response.content.includes('Access-Control-Allow-Origin')) {
    issues.push('❌ CORS issues detected');
  }
  
  // Check for old navigation references
  if (response.content.includes('OoliteNavigation') || response.content.includes('surveys/dashboard')) {
    issues.push('❌ Old navigation references detected');
  }
  
  // Check for unified navigation
  if (response.content.includes('UnifiedNavigation')) {
    issues.push('✅ Unified navigation detected');
  }
  
  return issues;
}

// Main verification function
async function verifyProduction() {
  console.log('🚀 Starting Production Verification...\n');
  console.log(`Testing: ${PRODUCTION_URL}\n`);
  
  const results = [];
  let successCount = 0;
  let failureCount = 0;
  
  for (const page of pagesToTest) {
    const url = `${PRODUCTION_URL}${page}`;
    console.log(`📝 Testing: ${page}`);
    
    try {
      const response = await makeRequest(url);
      const issues = checkForIssues(response);
      
      if (response.status === 200) {
        console.log(`✅ Success (${response.status})`);
        successCount++;
      } else {
        console.log(`⚠️  Warning (${response.status})`);
      }
      
      if (issues.length > 0) {
        issues.forEach(issue => console.log(`   ${issue}`));
      }
      
      results.push({
        page,
        status: response.status,
        issues,
        success: response.status === 200
      });
      
    } catch (error) {
      console.log(`❌ Failed: ${error.error || error.message}`);
      failureCount++;
      
      results.push({
        page,
        status: 'ERROR',
        issues: [`❌ ${error.error || error.message}`],
        success: false
      });
    }
    
    console.log('');
  }
  
  // Summary
  console.log('📊 Verification Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📁 Total pages: ${pagesToTest.length}`);
  
  // Check for common issues
  const allIssues = results.flatMap(r => r.issues);
  const hasDevKeys = allIssues.some(issue => issue.includes('development keys'));
  const hasCorsIssues = allIssues.some(issue => issue.includes('CORS'));
  const hasOldNav = allIssues.some(issue => issue.includes('Old navigation'));
  
  console.log('\n🔍 Issue Analysis:');
  if (hasDevKeys) {
    console.log('❌ Clerk development keys detected - Update to production keys');
  } else {
    console.log('✅ No development keys detected');
  }
  
  if (hasCorsIssues) {
    console.log('❌ CORS issues detected - Check Clerk configuration');
  } else {
    console.log('✅ No CORS issues detected');
  }
  
  if (hasOldNav) {
    console.log('❌ Old navigation references detected - Check for cached content');
  } else {
    console.log('✅ No old navigation references detected');
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  if (hasDevKeys || hasCorsIssues) {
    console.log('1. Update Clerk environment variables to production keys');
    console.log('2. Redeploy the application');
    console.log('3. Clear browser cache and test again');
  }
  
  if (hasOldNav) {
    console.log('1. Clear browser cache completely');
    console.log('2. Test in incognito/private window');
    console.log('3. Check for any remaining old navigation references');
  }
  
  if (!hasDevKeys && !hasCorsIssues && !hasOldNav) {
    console.log('🎉 Production deployment looks good!');
    console.log('✅ All major issues resolved');
  }
  
  // Save detailed report
  const reportPath = './production-verification-report.json';
  require('fs').writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Run if called directly
if (require.main === module) {
  verifyProduction().catch(console.error);
}

module.exports = { verifyProduction, makeRequest, checkForIssues };
