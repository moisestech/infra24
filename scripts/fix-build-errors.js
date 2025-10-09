#!/usr/bin/env node

/**
 * Comprehensive Build Error Fix Script
 * Fixes common Next.js build issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing common build errors...');

// Common build issues and their fixes
const commonFixes = [
  {
    name: 'Badge component imports',
    pattern: /from ['"]@\/components\/ui\/[Bb]adge['"]/g,
    replacement: "from '@/components/ui/badge'",
    description: 'Fix Badge import case sensitivity'
  },
  {
    name: 'Missing alt props',
    pattern: /<img([^>]*?)(?<!alt=)([^>]*?)>/g,
    replacement: '<img$1 alt=""$2>',
    description: 'Add missing alt props to images'
  },
  {
    name: 'Dynamic server usage',
    pattern: /export default function/g,
    replacement: 'export const dynamic = "force-dynamic";\n\nexport default function',
    description: 'Add dynamic export to API routes'
  }
];

function fixFile(filePath, fixes) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    fixes.forEach(fix => {
      if (fix.pattern.test(content)) {
        content = content.replace(fix.pattern, fix.replacement);
        modified = true;
        console.log(`   ✅ Fixed: ${fix.description}`);
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Files that commonly have build issues
const commonProblemFiles = [
  'app/admin/workshop-sharing/page.tsx',
  'app/announcements/page.tsx',
  'app/artists/[id]/page.tsx',
  'app/artists/claim/page.tsx',
  'app/book/page.tsx'
];

console.log('🔍 Checking for common build issues...');

let fixedCount = 0;
commonProblemFiles.forEach(file => {
  if (fixFile(file, commonFixes)) {
    fixedCount++;
    console.log(`✅ Fixed: ${file}`);
  }
});

// Check for specific issues
console.log('\n🔍 Checking for specific issues...');

// Check if Badge component exists
const badgeFiles = ['components/ui/badge.tsx', 'components/ui/Badge.tsx'];
badgeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ Found: ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
  }
});

// Check for duplicate Badge components
if (fs.existsSync('components/ui/badge.tsx') && fs.existsSync('components/ui/Badge.tsx')) {
  console.log('⚠️  Found both badge.tsx and Badge.tsx - this might cause conflicts');
  
  // Remove the duplicate and keep only one
  const badgeContent = fs.readFileSync('components/ui/badge.tsx', 'utf8');
  const BadgeContent = fs.readFileSync('components/ui/Badge.tsx', 'utf8');
  
  if (badgeContent === BadgeContent) {
    console.log('   Removing duplicate Badge.tsx...');
    fs.unlinkSync('components/ui/Badge.tsx');
    console.log('   ✅ Removed duplicate');
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files`);

// Generate a build test command
console.log('\n💡 Next steps:');
console.log('   1. Test build locally: npm run build');
console.log('   2. If successful, commit and push');
console.log('   3. If still failing, check the specific error messages');

// Check for TypeScript errors
console.log('\n🔍 Checking for TypeScript errors...');
try {
  const { execSync } = require('child_process');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ No TypeScript errors found');
} catch (error) {
  console.log('❌ TypeScript errors found:');
  console.log(error.stdout?.toString() || error.message);
}
