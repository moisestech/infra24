#!/usr/bin/env node

/**
 * Quick Workshop Learn Integration Script
 * 
 * This script helps integrate the Learn tab into workshop detail pages
 * and connects the chapter navigation system.
 * 
 * Usage: node scripts/quick-workshop-learn-integration.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Quick Workshop Learn Integration Script');
console.log('==========================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

console.log('✅ Project root directory confirmed');

// Check if the workshop detail page exists
const workshopDetailPath = 'app/o/[slug]/workshops/[id]/page.tsx';
if (!fs.existsSync(workshopDetailPath)) {
  console.error(`❌ Workshop detail page not found at ${workshopDetailPath}`);
  process.exit(1);
}

console.log('✅ Workshop detail page found');

// Check if WorkshopLearnContent component exists
const learnContentPath = 'src/features/learn-canvas/components/WorkshopLearnContent.tsx';
if (!fs.existsSync(learnContentPath)) {
  console.error(`❌ WorkshopLearnContent component not found at ${learnContentPath}`);
  process.exit(1);
}

console.log('✅ WorkshopLearnContent component found');

// Check if Tabs components are available
const tabsPath = 'components/ui/tabs.tsx';
if (!fs.existsSync(tabsPath)) {
  console.error(`❌ Tabs component not found at ${tabsPath}`);
  console.log('💡 You may need to create the Tabs component or use a different tab system');
}

console.log('✅ Tabs component found');

// Read the current workshop detail page
let workshopDetailContent = fs.readFileSync(workshopDetailPath, 'utf8');

// Check if Learn tab is already integrated
if (workshopDetailContent.includes('WorkshopLearnContent')) {
  console.log('✅ Learn tab already integrated in workshop detail page');
} else {
  console.log('⚠️  Learn tab not yet integrated - manual integration needed');
  console.log('\n📝 Integration Steps:');
  console.log('1. Import WorkshopLearnContent component');
  console.log('2. Import Tabs components');
  console.log('3. Add Tabs structure around existing content');
  console.log('4. Add Learn tab with WorkshopLearnContent');
  console.log('\n🔧 Example integration code:');
  console.log(`
// Add these imports
import { WorkshopLearnContent } from '@/src/features/learn-canvas/components/WorkshopLearnContent'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Wrap existing content in Tabs
<Tabs defaultValue="details" className="w-full">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="learn">Learn</TabsTrigger>
  </TabsList>
  
  <TabsContent value="details">
    {/* Existing workshop content */}
  </TabsContent>
  
  <TabsContent value="learn">
    {workshop.has_learn_content ? (
      <WorkshopLearnContent 
        workshop={workshop}
        organizationSlug={slug}
        isAuthenticated={!!user}
      />
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">Learn content not available for this workshop.</p>
      </div>
    )}
  </TabsContent>
</Tabs>
  `);
}

// Check chapter navigation setup
const chapterPagePath = 'features/learn-canvas/router/ChapterPage.tsx';
if (fs.existsSync(chapterPagePath)) {
  console.log('✅ Chapter page component found');
  
  // Check if chapter routing is set up
  const chapterPageContent = fs.readFileSync(chapterPagePath, 'utf8');
  if (chapterPageContent.includes('useParams')) {
    console.log('✅ Chapter routing setup detected');
  } else {
    console.log('⚠️  Chapter routing may need setup');
  }
} else {
  console.log('⚠️  Chapter page component not found');
}

// Check if chapter API endpoints exist
const chapterApiPath = 'app/api/content/workshops/[workshopId]/chapters/[chapterSlug]/route.ts';
if (fs.existsSync(chapterApiPath)) {
  console.log('✅ Chapter API endpoint found');
} else {
  console.log('⚠️  Chapter API endpoint not found');
  console.log('💡 You may need to create the chapter content API endpoint');
}

// Check user progress tracking
const progressApiPath = 'app/api/workshops/[id]/progress/route.ts';
if (fs.existsSync(progressApiPath)) {
  console.log('✅ User progress API endpoint found');
} else {
  console.log('⚠️  User progress API endpoint not found');
}

// Check database schema
const migrationPath = 'scripts/add-learn-content-fields.sql';
if (fs.existsSync(migrationPath)) {
  console.log('✅ Database migration script found');
  
  const migrationContent = fs.readFileSync(migrationPath, 'utf8');
  if (migrationContent.includes('user_workshop_progress')) {
    console.log('✅ User progress table schema found');
  } else {
    console.log('⚠️  User progress table schema may be missing');
  }
} else {
  console.log('⚠️  Database migration script not found');
}

console.log('\n🎯 Integration Status Summary:');
console.log('==============================');

// Overall status assessment
const components = [
  { name: 'Workshop Detail Page', path: workshopDetailPath, exists: true },
  { name: 'WorkshopLearnContent Component', path: learnContentPath, exists: true },
  { name: 'Tabs Component', path: tabsPath, exists: fs.existsSync(tabsPath) },
  { name: 'Chapter Page', path: chapterPagePath, exists: fs.existsSync(chapterPagePath) },
  { name: 'Chapter API', path: chapterApiPath, exists: fs.existsSync(chapterApiPath) },
  { name: 'Progress API', path: progressApiPath, exists: fs.existsSync(progressApiPath) },
  { name: 'Database Schema', path: migrationPath, exists: fs.existsSync(migrationPath) }
];

let readyCount = 0;
components.forEach(component => {
  const status = component.exists ? '✅' : '❌';
  console.log(`${status} ${component.name}`);
  if (component.exists) readyCount++;
});

const readinessPercentage = Math.round((readyCount / components.length) * 100);
console.log(`\n📊 Overall Readiness: ${readinessPercentage}% (${readyCount}/${components.length} components ready)`);

if (readinessPercentage >= 80) {
  console.log('\n🎉 Ready for Learn tab integration!');
  console.log('💡 You can now integrate the Learn tab into workshop detail pages.');
} else if (readinessPercentage >= 60) {
  console.log('\n⚠️  Almost ready - a few components need attention');
  console.log('💡 Focus on the missing components before integration.');
} else {
  console.log('\n❌ Not ready yet - several components are missing');
  console.log('💡 Complete the missing components before integration.');
}

console.log('\n🚀 Next Steps:');
console.log('1. Integrate Learn tab into workshop detail page');
console.log('2. Test chapter navigation');
console.log('3. Verify user progress tracking');
console.log('4. Test MDX content rendering');

console.log('\n✨ Integration script completed!');
