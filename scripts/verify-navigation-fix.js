#!/usr/bin/env node

/**
 * Navigation Fix Verification Script
 * 
 * This script verifies that all navigation issues have been resolved
 * and provides a comprehensive report.
 */

const fs = require('fs');
const path = require('path');

// Test URLs for different page types
const testUrls = [
  // Oolite specific pages (should use ooliteConfig directly)
  'http://localhost:3001/o/oolite/workshops',
  'http://localhost:3001/o/oolite/analytics',
  'http://localhost:3001/o/oolite/digital-lab',
  'http://localhost:3001/o/oolite/announcements',
  'http://localhost:3001/o/oolite/users',
  
  // Bakehouse specific pages (should use bakehouseConfig directly)
  'http://localhost:3001/o/bakehouse/workshops',
  'http://localhost:3001/o/bakehouse/artists',
  
  // Dynamic pages (should have getNavigationConfig function)
  'http://localhost:3001/o/oolite',
  'http://localhost:3001/o/bakehouse',
  
  // Other pages
  'http://localhost:3001/dashboard',
  'http://localhost:3001/profile'
];

// Function to make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          hasError: data.includes('getNavigationConfig is not defined') || 
                   data.includes('ReferenceError') ||
                   data.includes('TypeError')
        });
      });
    });
    
    req.on('error', (error) => {
      reject({ url, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject({ url, error: 'Request timeout' });
    });
  });
}

// Function to check file content
function checkFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for getNavigationConfig usage
    const hasGetNavigationConfig = content.includes('getNavigationConfig()');
    const hasGetNavigationConfigFunction = content.includes('const getNavigationConfig = () => {');
    
    // Check for direct config usage
    const hasOoliteConfig = content.includes('ooliteConfig');
    const hasBakehouseConfig = content.includes('bakehouseConfig');
    
    return {
      hasGetNavigationConfig,
      hasGetNavigationConfigFunction,
      hasOoliteConfig,
      hasBakehouseConfig,
      isOoliteSpecific: filePath.includes('/o/oolite/'),
      isBakehouseSpecific: filePath.includes('/o/bakehouse/'),
      isDynamic: filePath.includes('/o/[slug]/')
    };
  } catch (error) {
    return { error: error.message };
  }
}

// Main verification function
async function verifyNavigationFix() {
  console.log('🔍 Verifying Navigation Fix...\n');
  
  // Check file contents
  console.log('📁 Checking file contents...');
  const filesToCheck = [
    'app/o/oolite/workshops/page.tsx',
    'app/o/oolite/analytics/page.tsx',
    'app/o/bakehouse/workshops/page.tsx',
    'app/o/[slug]/workshops/page.tsx',
    'app/o/[slug]/page.tsx'
  ];
  
  const fileResults = [];
  for (const file of filesToCheck) {
    const fullPath = path.join(__dirname, '..', file);
    const result = checkFileContent(fullPath);
    fileResults.push({ file, ...result });
    
    if (result.error) {
      console.log(`❌ Error reading ${file}: ${result.error}`);
    } else if (result.isOoliteSpecific && result.hasGetNavigationConfig && !result.hasGetNavigationConfigFunction) {
      console.log(`❌ ${file}: Missing getNavigationConfig function but using it`);
    } else if (result.isOoliteSpecific && result.hasOoliteConfig && !result.hasGetNavigationConfig) {
      console.log(`✅ ${file}: Correctly using ooliteConfig directly`);
    } else if (result.isBakehouseSpecific && result.hasBakehouseConfig && !result.hasGetNavigationConfig) {
      console.log(`✅ ${file}: Correctly using bakehouseConfig directly`);
    } else if (result.isDynamic && result.hasGetNavigationConfigFunction) {
      console.log(`✅ ${file}: Has getNavigationConfig function for dynamic routing`);
    } else {
      console.log(`ℹ️  ${file}: Status unclear`);
    }
  }
  
  console.log('\n🌐 Testing page responses...');
  const responseResults = [];
  
  for (const url of testUrls) {
    try {
      const result = await makeRequest(url);
      responseResults.push(result);
      
      if (result.status === 200 && !result.hasError) {
        console.log(`✅ ${url}: Working correctly`);
      } else if (result.status === 200 && result.hasError) {
        console.log(`❌ ${url}: Has navigation errors`);
      } else {
        console.log(`⚠️  ${url}: Status ${result.status}`);
      }
    } catch (error) {
      console.log(`❌ ${url}: ${error.error}`);
      responseResults.push({ url, error: error.error });
    }
  }
  
  // Summary
  console.log('\n📊 Verification Summary:');
  
  const workingPages = responseResults.filter(r => r.status === 200 && !r.hasError).length;
  const errorPages = responseResults.filter(r => r.hasError).length;
  const totalPages = responseResults.length;
  
  console.log(`✅ Working pages: ${workingPages}`);
  console.log(`❌ Pages with errors: ${errorPages}`);
  console.log(`📁 Total pages tested: ${totalPages}`);
  
  // File analysis
  const ooliteFilesCorrect = fileResults.filter(f => 
    f.isOoliteSpecific && f.hasOoliteConfig && !f.hasGetNavigationConfig
  ).length;
  
  const bakehouseFilesCorrect = fileResults.filter(f => 
    f.isBakehouseSpecific && f.hasBakehouseConfig && !f.hasGetNavigationConfig
  ).length;
  
  const dynamicFilesCorrect = fileResults.filter(f => 
    f.isDynamic && f.hasGetNavigationConfigFunction
  ).length;
  
  console.log(`\n📁 File Analysis:`);
  console.log(`✅ Oolite files correct: ${ooliteFilesCorrect}`);
  console.log(`✅ Bakehouse files correct: ${bakehouseFilesCorrect}`);
  console.log(`✅ Dynamic files correct: ${dynamicFilesCorrect}`);
  
  if (errorPages === 0 && workingPages === totalPages) {
    console.log('\n🎉 All navigation issues resolved!');
    console.log('✅ No getNavigationConfig errors detected');
    console.log('✅ All pages loading correctly');
  } else {
    console.log('\n⚠️  Some issues remain:');
    if (errorPages > 0) {
      console.log(`❌ ${errorPages} pages still have navigation errors`);
    }
    if (workingPages < totalPages) {
      console.log(`⚠️  ${totalPages - workingPages} pages not responding correctly`);
    }
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    fileResults,
    responseResults,
    summary: {
      workingPages,
      errorPages,
      totalPages,
      ooliteFilesCorrect,
      bakehouseFilesCorrect,
      dynamicFilesCorrect
    }
  };
  
  const reportPath = path.join(__dirname, '..', 'navigation-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Run if called directly
if (require.main === module) {
  verifyNavigationFix().catch(console.error);
}

module.exports = { verifyNavigationFix, checkFileContent, makeRequest };
