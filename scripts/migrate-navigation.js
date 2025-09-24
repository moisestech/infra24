#!/usr/bin/env node

/**
 * Navigation Migration Script
 * 
 * This script helps migrate pages from old navigation components to the new unified navigation.
 * It provides automated replacements and generates migration reports.
 */

const fs = require('fs');
const path = require('path');

// Files that need migration (based on our grep results)
const filesToMigrate = [
  'app/o/[slug]/page.tsx',
  'app/o/[slug]/surveys/[id]/page.tsx',
  'app/o/[slug]/announcements/[id]/page.tsx',
  'app/submit/[id]/page.tsx',
  'app/o/oolite/surveys/digital-lab/page.tsx',
  'app/o/oolite/budget/prognosis/page.tsx',
  'app/o/oolite/workshops/[id]/page.tsx',
  'app/o/oolite/analytics/page.tsx',
  'app/o/oolite/budget/page.tsx',
  'app/o/oolite/ai-tools/page.tsx',
  'app/o/oolite/impact-roi/page.tsx',
  'app/dashboard/page.tsx',
  'app/admin/workshop-sharing/page.tsx',
  'app/o/oolite/bookings/page.tsx',
  'app/o/oolite/submissions/page.tsx',
  'app/organizations/[id]/announcements/page.tsx',
  'app/organizations/[id]/users/page.tsx',
  'app/o/oolite/digital/page.tsx',
  'app/o/oolite/digital-lab/page.tsx',
  'app/o/oolite/roadmap/page.tsx',
  'app/o/oolite/workshops/page.tsx',
  'app/o/oolite/map/page.tsx',
  'app/o/bakehouse/workshops/page.tsx',
  'app/o/bakehouse/artists/[slug]/page.tsx',
  'app/o/[slug]/workshops/page.tsx',
  'app/o/[slug]/surveys/analytics/page.tsx',
  'app/o/bakehouse/map/page.tsx',
  'app/o/[slug]/budget/page.tsx',
  'app/o/[slug]/announcements/[id]/edit/page.tsx',
  'app/o/[slug]/xr/page.tsx',
  'app/o/[slug]/announcements/create/page.tsx',
  'app/users/page.tsx',
  'app/o/[slug]/users/[userId]/page.tsx',
  'app/announcements/[id]/page.tsx',
  'app/profile/page.tsx',
  'app/users/[userId]/page.tsx'
];

// Migration patterns
const migrationPatterns = [
  {
    name: 'OoliteNavigation Import',
    pattern: /import\s*{\s*OoliteNavigation\s*}\s*from\s*['"]@\/components\/tenant\/OoliteNavigation['"];?/g,
    replacement: "import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'"
  },
  {
    name: 'Navigation Import',
    pattern: /import\s+Navigation\s+from\s*['"]@\/components\/ui\/Navigation['"];?/g,
    replacement: "import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'"
  },
  {
    name: 'OoliteNavigation Component',
    pattern: /<OoliteNavigation\s*\/>/g,
    replacement: '<UnifiedNavigation config={getNavigationConfig()} userRole="admin" />'
  },
  {
    name: 'Navigation Component',
    pattern: /<Navigation\s*\/>/g,
    replacement: '<UnifiedNavigation config={getNavigationConfig()} userRole="admin" />'
  }
];

// Helper function to add navigation config
function addNavigationConfig(content, functionName) {
  const configHelper = `
  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    const slug = params.slug as string
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  }`;

  // Find the function and add the config helper after the first few lines
  const functionRegex = new RegExp(`(function\\s+${functionName}|export\\s+default\\s+function\\s+${functionName})\\s*\\([^)]*\\)\\s*{([^}]*?)(const\\s+\\w+\\s*=\\s*useParams\\(\\)|const\\s+params\\s*=\\s*useParams\\(\\))`, 's');
  
  if (functionRegex.test(content)) {
    return content.replace(functionRegex, (match, funcStart, beforeParams, paramsLine) => {
      return `${funcStart}${beforeParams}${paramsLine}
  const slug = params.slug as string${configHelper}`;
    });
  }

  // Fallback: add after the first state declaration
  const stateRegex = /(const\s+\[[^]]+\]\s*=\s*useState\([^)]*\)[^;]*;)/;
  if (stateRegex.test(content)) {
    return content.replace(stateRegex, `$1${configHelper}`);
  }

  return content;
}

// Main migration function
function migrateFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return { success: false, reason: 'File not found' };
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changes = [];
    let originalContent = content;

    // Apply migration patterns
    migrationPatterns.forEach(pattern => {
      const matches = content.match(pattern.pattern);
      if (matches) {
        content = content.replace(pattern.pattern, pattern.replacement);
        changes.push(`${pattern.name}: ${matches.length} replacement(s)`);
      }
    });

    // Add navigation config helper if we made changes
    if (changes.length > 0) {
      // Try to extract function name from the file
      const functionMatch = content.match(/export\s+default\s+function\s+(\w+)/);
      if (functionMatch) {
        content = addNavigationConfig(content, functionMatch[1]);
      }
    }

    // Write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      return { success: true, changes };
    } else {
      return { success: true, changes: ['No changes needed'] };
    }

  } catch (error) {
    console.error(`❌ Error migrating ${filePath}:`, error.message);
    return { success: false, reason: error.message };
  }
}

// Main execution
function main() {
  console.log('🚀 Starting Navigation Migration...\n');
  
  const results = [];
  let successCount = 0;
  let failureCount = 0;

  filesToMigrate.forEach(filePath => {
    console.log(`📝 Migrating: ${filePath}`);
    const result = migrateFile(filePath);
    
    if (result.success) {
      console.log(`✅ Success: ${result.changes.join(', ')}`);
      successCount++;
    } else {
      console.log(`❌ Failed: ${result.reason}`);
      failureCount++;
    }
    
    results.push({ file: filePath, ...result });
    console.log('');
  });

  // Generate report
  console.log('📊 Migration Report:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📁 Total files: ${filesToMigrate.length}`);

  // Write detailed report
  const reportPath = path.join(process.cwd(), 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  console.log('\n🎉 Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Review the changes made');
  console.log('2. Test the migrated pages');
  console.log('3. Fix any remaining issues manually');
  console.log('4. Remove old navigation components when ready');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { migrateFile, migrationPatterns };
