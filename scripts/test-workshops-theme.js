#!/usr/bin/env node

/**
 * Workshops Theme Test Script
 * 
 * This script tests the theme implementation on the workshops page
 * to ensure all components are properly theme-aware.
 */

const http = require('http');

const testUrl = 'http://localhost:3001/o/oolite/workshops';

// Function to make HTTP request and check for theme-related content
function testWorkshopsTheme() {
  return new Promise((resolve, reject) => {
    const req = http.get(testUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const results = {
          status: res.statusCode,
          hasThemeStyles: false,
          hasDynamicBackground: false,
          hasThemeAwareCards: false,
          hasThemeAwareText: false,
          hasThemeAwareButtons: false,
          issues: []
        };
        
        // Check for theme-related styles
        if (data.includes('style={{ background: themeStyles.background }}')) {
          results.hasDynamicBackground = true;
        } else {
          results.issues.push('❌ Missing dynamic background styles');
        }
        
        if (data.includes('style={{ color: themeStyles.textPrimary }}')) {
          results.hasThemeAwareText = true;
        } else {
          results.issues.push('❌ Missing theme-aware text colors');
        }
        
        if (data.includes('style={{ backgroundColor: themeStyles.cardBg }}')) {
          results.hasThemeAwareCards = true;
        } else {
          results.issues.push('❌ Missing theme-aware card backgrounds');
        }
        
        if (data.includes('style={{ backgroundColor: themeStyles.buttonBg }}')) {
          results.hasThemeAwareButtons = true;
        } else {
          results.issues.push('❌ Missing theme-aware button styles');
        }
        
        // Check for theme context usage
        if (data.includes('useTheme') || data.includes('theme={resolvedTheme}')) {
          results.hasThemeStyles = true;
        } else {
          results.issues.push('❌ Missing theme context usage');
        }
        
        // Check for hard-coded styles that should be dynamic
        if (data.includes('bg-gray-50') || data.includes('bg-white') || data.includes('text-gray-900')) {
          results.issues.push('⚠️  Found hard-coded styles that should be theme-aware');
        }
        
        resolve(results);
      });
    });
    
    req.on('error', (error) => {
      reject({ error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject({ error: 'Request timeout' });
    });
  });
}

// Function to check component files for theme implementation
function checkComponentFiles() {
  const fs = require('fs');
  const path = require('path');
  
  const filesToCheck = [
    'app/o/oolite/workshops/page.tsx',
    'components/page/OoliteWorkshopsPage.tsx'
  ];
  
  const results = [];
  
  for (const file of filesToCheck) {
    try {
      const fullPath = path.join(__dirname, '..', file);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const fileResult = {
        file,
        hasUseTheme: content.includes('useTheme'),
        hasThemeProp: content.includes('theme={resolvedTheme}'),
        hasThemeStyles: content.includes('getThemeStyles'),
        hasOoliteColors: content.includes('ooliteColors'),
        hasDynamicStyles: content.includes('style={{'),
        issues: []
      };
      
      if (!fileResult.hasUseTheme && file.includes('page.tsx')) {
        fileResult.issues.push('❌ Missing useTheme import');
      }
      
      if (!fileResult.hasThemeProp && file.includes('page.tsx')) {
        fileResult.issues.push('❌ Missing theme prop passing');
      }
      
      if (!fileResult.hasThemeStyles && file.includes('OoliteWorkshopsPage.tsx')) {
        fileResult.issues.push('❌ Missing getThemeStyles function');
      }
      
      if (!fileResult.hasOoliteColors && file.includes('OoliteWorkshopsPage.tsx')) {
        fileResult.issues.push('❌ Missing Oolite color definitions');
      }
      
      if (!fileResult.hasDynamicStyles && file.includes('OoliteWorkshopsPage.tsx')) {
        fileResult.issues.push('❌ Missing dynamic style implementations');
      }
      
      results.push(fileResult);
      
    } catch (error) {
      results.push({
        file,
        error: error.message,
        issues: [`❌ Error reading file: ${error.message}`]
      });
    }
  }
  
  return results;
}

// Main test function
async function runThemeTest() {
  console.log('🎨 Testing Workshops Page Theme Implementation...\n');
  
  try {
    // Test page response
    console.log('📄 Testing page response...');
    const pageResults = await testWorkshopsTheme();
    
    if (pageResults.status === 200) {
      console.log('✅ Page loads successfully');
    } else {
      console.log(`❌ Page returned status: ${pageResults.status}`);
    }
    
    // Check theme implementation
    console.log('\n🎨 Checking theme implementation...');
    
    if (pageResults.hasDynamicBackground) {
      console.log('✅ Dynamic background styles implemented');
    } else {
      console.log('❌ Dynamic background styles missing');
    }
    
    if (pageResults.hasThemeAwareText) {
      console.log('✅ Theme-aware text colors implemented');
    } else {
      console.log('❌ Theme-aware text colors missing');
    }
    
    if (pageResults.hasThemeAwareCards) {
      console.log('✅ Theme-aware card backgrounds implemented');
    } else {
      console.log('❌ Theme-aware card backgrounds missing');
    }
    
    if (pageResults.hasThemeAwareButtons) {
      console.log('✅ Theme-aware button styles implemented');
    } else {
      console.log('❌ Theme-aware button styles missing');
    }
    
    if (pageResults.hasThemeStyles) {
      console.log('✅ Theme context usage implemented');
    } else {
      console.log('❌ Theme context usage missing');
    }
    
    // Check component files
    console.log('\n📁 Checking component files...');
    const fileResults = checkComponentFiles();
    
    for (const result of fileResults) {
      console.log(`\n📄 ${result.file}:`);
      
      if (result.error) {
        console.log(`❌ Error: ${result.error}`);
      } else {
        if (result.hasUseTheme) console.log('✅ useTheme imported');
        if (result.hasThemeProp) console.log('✅ Theme prop passed');
        if (result.hasThemeStyles) console.log('✅ getThemeStyles function');
        if (result.hasOoliteColors) console.log('✅ Oolite colors defined');
        if (result.hasDynamicStyles) console.log('✅ Dynamic styles implemented');
        
        if (result.issues.length > 0) {
          result.issues.forEach(issue => console.log(issue));
        }
      }
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    const allIssues = [
      ...pageResults.issues,
      ...fileResults.flatMap(r => r.issues || [])
    ];
    
    if (allIssues.length === 0) {
      console.log('🎉 All theme implementations are working correctly!');
      console.log('✅ Dark/light mode switching should work properly');
      console.log('✅ All components are theme-aware');
      console.log('✅ Organization colors are properly applied');
    } else {
      console.log(`⚠️  Found ${allIssues.length} issues:`);
      allIssues.forEach(issue => console.log(issue));
    }
    
    // Manual testing instructions
    console.log('\n🧪 Manual Testing Instructions:');
    console.log('1. Open http://localhost:3001/o/oolite/workshops');
    console.log('2. Toggle between light and dark mode using the theme toggle');
    console.log('3. Verify that:');
    console.log('   - Background changes from light to dark gradient');
    console.log('   - Text colors change appropriately');
    console.log('   - Card backgrounds adapt to theme');
    console.log('   - Button colors remain consistent with organization theme');
    console.log('   - All text remains readable in both modes');
    
  } catch (error) {
    console.error('❌ Test failed:', error.error || error.message);
  }
}

// Run if called directly
if (require.main === module) {
  runThemeTest().catch(console.error);
}

module.exports = { runThemeTest, testWorkshopsTheme, checkComponentFiles };
