const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runPhase2Migration() {
  // Use Supabase connection string format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase environment variables are not set.');
    console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Convert Supabase URL to PostgreSQL connection string
  // For local Supabase: http://127.0.0.1:54321 -> postgresql://postgres:postgres@127.0.0.1:54322/postgres
  const host = supabaseUrl.replace('http://', '').replace('https://', '').replace(':54321', '');
  const databaseUrl = `postgresql://postgres:postgres@${host}:54322/postgres`;

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    console.log('🚀 Starting Phase 2 database migration...');
    console.log('📋 This migration will add:');
    console.log('   - Event management system (materials, feedback)');
    console.log('   - Content management system (MDX-based)');
    console.log('   - Course management system');
    console.log('   - Media file management');
    console.log('   - Enhanced workshop capabilities');
    console.log('');

    console.log('🔌 Attempting to connect to the database...');
    await pool.connect();
    console.log('✅ Successfully connected to the database.');

    const migrationFilePath = path.join(__dirname, 'phase2-database-migration.sql');
    const migrationSql = fs.readFileSync(migrationFilePath, 'utf8');

    console.log(`📄 Running migration from ${migrationFilePath}...`);
    console.log('⏳ This may take a few minutes...');
    
    await pool.query(migrationSql);
    
    console.log('');
    console.log('🎉 Phase 2 database migration completed successfully!');
    console.log('');
    console.log('📊 What was added:');
    console.log('   ✅ Extended workshops table with event management fields');
    console.log('   ✅ Created event_materials table for file management');
    console.log('   ✅ Created event_feedback table for feedback collection');
    console.log('   ✅ Created content_items table for MDX content management');
    console.log('   ✅ Created content_versions table for content versioning');
    console.log('   ✅ Created courses table for course management');
    console.log('   ✅ Created course_lessons table for lesson organization');
    console.log('   ✅ Created course_enrollments table for user progress');
    console.log('   ✅ Created media_files table for media management');
    console.log('   ✅ Added Row Level Security policies');
    console.log('   ✅ Added triggers for data integrity');
    console.log('   ✅ Added sample data for testing');
    console.log('');
    console.log('🚀 Ready to start Phase 2 implementation!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Extend existing workshop API for event management');
    console.log('   2. Create event materials management system');
    console.log('   3. Implement event feedback collection');
    console.log('   4. Set up MDX content management system');
    console.log('   5. Build course management interface');
    console.log('   6. Create media upload system');
    console.log('   7. Enhance analytics dashboard');
    console.log('');

  } catch (error) {
    console.error('❌ Error running Phase 2 migration:', error);
    console.error('');
    console.error('🔍 Troubleshooting:');
    console.error('   - Check that DATABASE_URL is correct in .env.local');
    console.error('   - Ensure database is accessible');
    console.error('   - Check for any existing table conflicts');
    console.error('   - Review the migration SQL for syntax errors');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
runPhase2Migration();
