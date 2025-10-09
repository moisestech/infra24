#!/usr/bin/env node

/**
 * Fix Badge Component Import Issues
 * Ensures all Badge imports are using the correct case
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Badge component imports...');

// Files that are failing in the build
const failingFiles = [
  'app/admin/workshop-sharing/page.tsx',
  'app/announcements/page.tsx',
  'app/artists/[id]/page.tsx',
  'app/artists/claim/page.tsx',
  'app/book/page.tsx'
];

function fixBadgeImport(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix any potential case issues with Badge imports
    const badgeImportRegex = /from ['"]@\/components\/ui\/[Bb]adge['"]/g;
    const matches = content.match(badgeImportRegex);
    
    if (matches) {
      matches.forEach(match => {
        const fixed = match.replace(/[Bb]adge/, 'badge');
        content = content.replace(match, fixed);
        modified = true;
        console.log(`   Fixed import: ${match} → ${fixed}`);
      });
    }

    // Also check for any other potential issues
    if (content.includes("from '@/components/ui/Badge'")) {
      content = content.replace(/from ['"]@\/components\/ui\/Badge['"]/g, "from '@/components/ui/badge'");
      modified = true;
      console.log(`   Fixed uppercase Badge import`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Fix all failing files
let fixedCount = 0;
failingFiles.forEach(file => {
  if (fixBadgeImport(file)) {
    fixedCount++;
  }
});

console.log(`\n🎉 Fixed ${fixedCount} out of ${failingFiles.length} files`);

// Also check if the badge component exists and is properly exported
const badgePath = 'components/ui/badge.tsx';
if (fs.existsSync(badgePath)) {
  const badgeContent = fs.readFileSync(badgePath, 'utf8');
  if (badgeContent.includes('export { Badge')) {
    console.log('✅ Badge component exists and is properly exported');
  } else {
    console.log('❌ Badge component missing export');
  }
} else {
  console.log('❌ Badge component file not found');
}

console.log('\n💡 If issues persist, try:');
console.log('   1. Delete .next folder: rm -rf .next');
console.log('   2. Clear npm cache: npm cache clean --force');
console.log('   3. Reinstall: npm install');
console.log('   4. Rebuild: npm run build');
