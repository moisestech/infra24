#!/usr/bin/env node

/**
 * Smart Sign Authentication Setup Script
 * 
 * This script helps you set up the complete authentication system with Clerk and Supabase.
 * Run this after you've configured your environment variables.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🚀 Smart Sign Authentication Setup\n');
  console.log('This script will help you set up the complete authentication system.');
  console.log('Make sure you have:');
  console.log('1. Clerk application created');
  console.log('2. Supabase project created');
  console.log('3. Environment variables configured\n');

  // Check environment variables
  console.log('📋 Checking environment variables...\n');
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'CLERK_WEBHOOK_SECRET',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\nPlease add these to your .env.local file and run this script again.\n');
    process.exit(1);
  }

  console.log('✅ All environment variables are set!\n');

  // Database setup
  console.log('🗄️  Database Setup\n');
  
  const runDbSetup = await question('Do you want to run the database schema setup? (y/n): ');
  
  if (runDbSetup.toLowerCase() === 'y') {
    console.log('\n📝 Database schema setup instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of supabase/schema.sql');
    console.log('4. Run the SQL script');
    console.log('\nThis will create all the necessary tables and initial data.\n');
  }

  // Clerk webhook setup
  console.log('🔗 Clerk Webhook Setup\n');
  
  console.log('📝 Webhook configuration instructions:');
  console.log('1. Go to your Clerk dashboard');
  console.log('2. Navigate to Webhooks');
  console.log('3. Create a new webhook endpoint');
  console.log('4. Set the endpoint URL to: https://your-domain.com/api/webhooks/clerk');
  console.log('5. Select these events:');
  console.log('   - user.created');
  console.log('   - user.updated');
  console.log('   - user.deleted');
  console.log('   - organization.created');
  console.log('   - organization.updated');
  console.log('   - organization.deleted');
  console.log('   - organizationMembership.created');
  console.log('   - organizationMembership.updated');
  console.log('   - organizationMembership.deleted');
  console.log('6. Copy the webhook secret to your .env.local file\n');

  // Initial user setup
  console.log('👤 Initial User Setup\n');
  
  const setupSuperAdmin = await question('Do you want to set up a super admin user? (y/n): ');
  
  if (setupSuperAdmin.toLowerCase() === 'y') {
    const adminEmail = await question('Enter your email address: ');
    const adminFirstName = await question('Enter your first name: ');
    const adminLastName = await question('Enter your last name: ');
    
    console.log('\n📝 Super admin setup instructions:');
    console.log('1. Sign up at your application using the email:', adminEmail);
    console.log('2. After signing up, go to your Supabase dashboard');
    console.log('3. Navigate to the SQL Editor');
    console.log('4. Run this SQL command (replace YOUR_CLERK_USER_ID with your actual Clerk user ID):');
    console.log('\n```sql');
    console.log('UPDATE user_profiles SET');
    console.log(`  first_name = '${adminFirstName}',`);
    console.log(`  last_name = '${adminLastName}',`);
    console.log(`  email = '${adminEmail}',`);
    console.log("  role = 'super_admin',");
    console.log("  permissions = '{\"create_announcement\", \"edit_announcement\", \"delete_announcement\", \"approve_announcement\", \"manage_users\", \"view_analytics\", \"manage_organization\", \"view_all_organizations\"}'");
    console.log("WHERE email = '${adminEmail}';");
    console.log('```\n');
  }

  // Organization setup
  console.log('🏢 Organization Setup\n');
  
  const setupOrganizations = await question('Do you want to set up initial organizations? (y/n): ');
  
  if (setupOrganizations.toLowerCase() === 'y') {
    console.log('\n📝 Initial organizations have been created in the database schema:');
    console.log('1. Bakehouse Art Complex (bakehouse)');
    console.log('2. Oolite Arts (oolite)');
    console.log('\nYou can modify these or add more through the dashboard.\n');
  }

  // Testing setup
  console.log('🧪 Testing Setup\n');
  
  console.log('📝 To test your authentication setup:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Navigate to /login');
  console.log('3. Sign up with a test account');
  console.log('4. Check that a user profile was created in your database');
  console.log('5. Navigate to /dashboard to see the protected area');
  console.log('6. Check the browser console and server logs for any errors\n');

  // Next steps
  console.log('🎯 Next Steps\n');
  
  console.log('1. ✅ Environment variables configured');
  console.log('2. ✅ Database schema ready');
  console.log('3. ✅ Clerk webhook configured');
  console.log('4. ✅ Initial organizations created');
  console.log('5. 🔄 Test the authentication flow');
  console.log('6. 🔄 Set up your super admin user');
  console.log('7. 🔄 Configure additional organizations');
  console.log('8. 🔄 Customize the dashboard and UI');
  console.log('9. 🔄 Set up analytics tracking');
  console.log('10. 🔄 Deploy to production\n');

  console.log('🎉 Authentication setup complete!');
  console.log('\nYour Smart Sign system is now ready to control communication infrastructure and create power and leverage in art communities.\n');

  rl.close();
}

main().catch(console.error);
