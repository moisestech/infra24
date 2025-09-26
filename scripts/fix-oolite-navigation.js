#!/usr/bin/env node

/**
 * Fix Oolite Navigation Script
 * 
 * This script fixes the getNavigationConfig() issue in Oolite-specific pages
 * by replacing it with ooliteConfig directly.
 */

const fs = require('fs');
const path = require('path');

const oolitePages = [
  'app/o/oolite/map/page.tsx',
  'app/o/oolite/roadmap/page.tsx',
  'app/o/oolite/digital-lab/page.tsx',
  'app/o/oolite/digital/page.tsx',
  'app/o/oolite/submissions/page.tsx',
  'app/o/oolite/bookings/page.tsx',
  'app/o/oolite/impact-roi/page.tsx',
  'app/o/oolite/ai-tools/page.tsx',
  'app/o/oolite/budget/page.tsx',
  'app/o/oolite/analytics/page.tsx',
  'app/o/oolite/workshops/[id]/page.tsx',
  'app/o/oolite/budget/prognosis/page.tsx',
  'app/o/oolite/surveys/digital-lab/page.tsx'
];

const rootDir = path.resolve(__dirname, '..');

let fixedCount = 0;
let errorCount = 0;

async function fixOolitePage(filePath) {
  const fullPath = path.join(rootDir, filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    
    // Replace getNavigationConfig() with ooliteConfig
    if (content.includes('getNavigationConfig()')) {
      content = content.replace(/getNavigationConfig\(\)/g, 'ooliteConfig');
      changed = true;
      console.log(`✅ Fixed: ${filePath}`);
    }
    
    if (changed) {
      fs.writeFileSync(fullPath, content, 'utf8');
      fixedCount++;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    errorCount++;
  }
}

async function fixAllOolitePages() {
  console.log('🔧 Fixing Oolite Navigation Issues...\n');
  
  for (const filePath of oolitePages) {
    await fixOolitePage(filePath);
  }
  
  console.log('\n📊 Fix Summary:');
  console.log(`✅ Fixed: ${fixedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`📁 Total: ${oolitePages.length} files`);
  
  if (fixedCount > 0) {
    console.log('\n🎉 All Oolite navigation issues fixed!');
    console.log('The getNavigationConfig() error should now be resolved.');
  }
}

// Run if called directly
if (require.main === module) {
  fixAllOolitePages().catch(console.error);
}

module.exports = { fixAllOolitePages, fixOolitePage };
