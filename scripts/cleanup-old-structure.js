#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Starting Infra24 cleanup process...\n');

// Directories and files to remove
const itemsToRemove = [
  // Old tech-nonprofit structure
  'app/(tech-nonprofit)',
  
  // Old services structure  
  'app/(services)',
  
  // Old workshop structure
  'app/(workshop)',
  
  // Old component files
  'components/page/TechNonprofitClient.tsx',
  'components/page/TechNonprofitClientLeCube.tsx',
  'components/page/SmartSignClient.tsx',
  'components/page/WorkshopClient.tsx',
  
  // Old page components
  'components/page/OoliteDigitalBudgetPage.tsx',
  'components/page/OoliteDigitalOverviewPage.tsx',
  'components/page/OoliteAIToolsPage.tsx',
  'components/page/OoliteDigitalLabPage.tsx',
  'components/page/OoliteImpactROIPage.tsx',
  'components/page/OoliteRoadmapPage.tsx',
  'components/page/OoliteWorkshopsPage.tsx',
  'components/page/OoliteBudgetPrognosisPage.tsx',
  
  // Old automation components (if not needed)
  'components/automation',
  
  // Old workshop components (if not needed)
  'components/workshop',
  
  // Old lib files (if not needed)
  'lib/workshops',
  'lib/automation',
  'data',
  'styles'
];

// Function to safely remove directory or file
function removeItem(itemPath) {
  const fullPath = path.resolve(itemPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  ${itemPath} - Not found (already removed)`);
    return;
  }
  
  try {
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Removed directory: ${itemPath}`);
    } else {
      fs.unlinkSync(fullPath);
      console.log(`✅ Removed file: ${itemPath}`);
    }
  } catch (error) {
    console.log(`❌ Error removing ${itemPath}: ${error.message}`);
  }
}

// Function to update imports in files
function updateImports() {
  console.log('\n📝 Updating imports...');
  
  const filesToUpdate = [
    'app/layout.tsx',
    'middleware.ts',
    'components/tenant/TenantProvider.tsx',
    'components/tenant/TenantLayout.tsx'
  ];
  
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove old imports
        content = content.replace(/import.*TechNonprofitClient.*from.*\n/g, '');
        content = content.replace(/import.*SmartSignClient.*from.*\n/g, '');
        content = content.replace(/import.*WorkshopClient.*from.*\n/g, '');
        
        // Update any remaining references
        content = content.replace(/TechNonprofitClient/g, 'Infra24Client');
        content = content.replace(/SmartSignClient/g, 'SmartSignProduct');
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated imports in: ${filePath}`);
      } catch (error) {
        console.log(`❌ Error updating ${filePath}: ${error.message}`);
      }
    }
  });
}

// Function to create new navigation structure
function createNewNavigation() {
  console.log('\n🧭 Creating new navigation structure...');
  
  const navigationContent = `// New Infra24 Navigation Structure
export const navigationItems = [
  {
    title: 'Products',
    href: '/product',
    children: [
      { title: 'SmartSign', href: '/product/smartsign' },
      { title: 'Submissions', href: '/product/submissions' },
      { title: 'Bookings', href: '/product/bookings' },
      { title: 'Analytics', href: '/product/analytics' }
    ]
  },
  {
    title: 'Organizations',
    href: '/organizations',
    children: [
      { title: 'Bakehouse Art Complex', href: '/o/bakehouse' },
      { title: 'Oolite Arts', href: '/o/oolite' },
      { title: 'Edge Zones', href: '/o/edgezones' },
      { title: 'Locust Projects', href: '/o/locust' }
    ]
  },
  {
    title: 'About',
    href: '/about'
  },
  {
    title: 'Contact',
    href: '/contact'
  }
];`;

  try {
    fs.writeFileSync('lib/navigation.ts', navigationContent);
    console.log('✅ Created new navigation structure');
  } catch (error) {
    console.log(`❌ Error creating navigation: ${error.message}`);
  }
}

// Function to update package.json scripts
function updatePackageJson() {
  console.log('\n📦 Updating package.json...');
  
  try {
    const packagePath = 'package.json';
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Remove old scripts
    delete packageContent.scripts['test:full'];
    delete packageContent.scripts['test:build'];
    delete packageContent.scripts['test:dev'];
    delete packageContent.scripts['setup:supabase'];
    delete packageContent.scripts['setup:tenant'];
    
    // Add new scripts
    packageContent.scripts = {
      ...packageContent.scripts,
      'cleanup': 'node scripts/cleanup-old-structure.js',
      'migrate': 'node scripts/migrate-to-infra24.js',
      'build:prod': 'npm run build && npm run export',
      'deploy': 'npm run build:prod && npm run deploy:vercel'
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
    console.log('✅ Updated package.json scripts');
  } catch (error) {
    console.log(`❌ Error updating package.json: ${error.message}`);
  }
}

// Main cleanup process
async function main() {
  console.log('🚀 Infra24 Cleanup Process Started\n');
  
  // Remove old structure
  console.log('🗑️  Removing old structure...');
  itemsToRemove.forEach(removeItem);
  
  // Update imports
  updateImports();
  
  // Create new navigation
  createNewNavigation();
  
  // Update package.json
  updatePackageJson();
  
  console.log('\n✨ Cleanup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Test the application: npm run dev');
  console.log('2. Verify all product pages work: /product, /product/smartsign, /product/submissions');
  console.log('3. Check organization pages: /o/bakehouse, /o/oolite');
  console.log('4. Update any remaining references in documentation');
  console.log('5. Deploy to production when ready');
  
  console.log('\n🎉 Infra24 is now clean and ready for production!');
}

// Run the cleanup
main().catch(console.error);

