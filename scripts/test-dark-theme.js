#!/usr/bin/env node

/**
 * Dark Theme Test Script
 * 
 * This script tests the dark theme implementation on the workshops page
 * to ensure proper dark blue colors are used.
 */

const fs = require('fs');
const path = require('path');

function testDarkThemeColors() {
  const filePath = path.join(__dirname, '..', 'components/page/OoliteWorkshopsPage.tsx');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log('🌙 Testing Dark Theme Implementation...\n');
    
    // Check for proper dark colors
    const darkColors = {
      darkBackground: content.includes('#0f172a'), // Slate 900
      darkSecondary: content.includes('#1e293b'), // Dark slate
      darkSurface: content.includes('#334155'), // Slate 700
      darkBorder: content.includes('#475569'), // Slate 600
      darkAccent: content.includes('#1e40af'), // Blue 800
    };
    
    console.log('🎨 Dark Color Palette:');
    Object.entries(darkColors).forEach(([color, found]) => {
      console.log(`${found ? '✅' : '❌'} ${color}: ${found ? 'Found' : 'Missing'}`);
    });
    
    // Check for proper text colors
    const textColors = {
      textPrimary: content.includes("textPrimary: '#ffffff'"),
      textSecondary: content.includes("textSecondary: '#cbd5e1'"), // Slate 300
      textMuted: content.includes("textMuted: '#94a3b8'"), // Slate 400
    };
    
    console.log('\n📝 Text Colors:');
    Object.entries(textColors).forEach(([color, found]) => {
      console.log(`${found ? '✅' : '❌'} ${color}: ${found ? 'Found' : 'Missing'}`);
    });
    
    // Check for gradient implementation
    const gradientCheck = content.includes('linear-gradient(135deg, ${ooliteColors.darkBackground} 0%, ${ooliteColors.darkSecondary} 50%, ${ooliteColors.darkAccent} 100%)');
    console.log(`\n🌈 Dark Gradient: ${gradientCheck ? '✅ Found' : '❌ Missing'}`);
    
    // Check for no hard-coded colors
    const hardCodedColors = [
      'text-gray-900',
      'text-gray-600', 
      'text-gray-700',
      'bg-white',
      'bg-gray-50',
      'bg-gray-100'
    ];
    
    console.log('\n🚫 Hard-coded Colors Check:');
    let hasHardCoded = false;
    hardCodedColors.forEach(color => {
      if (content.includes(color)) {
        console.log(`❌ Found hard-coded: ${color}`);
        hasHardCoded = true;
      }
    });
    
    if (!hasHardCoded) {
      console.log('✅ No hard-coded colors found');
    }
    
    // Summary
    const allColorsFound = Object.values(darkColors).every(found => found);
    const allTextColorsFound = Object.values(textColors).every(found => found);
    
    console.log('\n📊 Summary:');
    if (allColorsFound && allTextColorsFound && gradientCheck && !hasHardCoded) {
      console.log('🎉 Dark theme implementation is complete!');
      console.log('✅ Proper dark blue colors used');
      console.log('✅ White text for readability');
      console.log('✅ No hard-coded colors');
      console.log('✅ Beautiful dark gradient background');
    } else {
      console.log('⚠️  Some issues found:');
      if (!allColorsFound) console.log('❌ Missing dark colors');
      if (!allTextColorsFound) console.log('❌ Missing text colors');
      if (!gradientCheck) console.log('❌ Missing gradient');
      if (hasHardCoded) console.log('❌ Hard-coded colors found');
    }
    
    console.log('\n🧪 Manual Testing:');
    console.log('1. Open http://localhost:3001/o/oolite/workshops');
    console.log('2. Toggle to dark mode');
    console.log('3. Verify:');
    console.log('   - Background is dark blue gradient (not black/gray)');
    console.log('   - Header text is white');
    console.log('   - All text is readable');
    console.log('   - Cards have proper dark backgrounds');
    console.log('   - Buttons maintain organization branding');
    
  } catch (error) {
    console.error('❌ Error reading file:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  testDarkThemeColors();
}

module.exports = { testDarkThemeColors };
