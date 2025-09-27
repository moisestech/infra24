#!/usr/bin/env node

/**
 * Database Schema Audit Script
 * Audits database schema consistency and identifies issues
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Audit results tracking
const auditResults = {
  tables: [],
  issues: [],
  recommendations: []
};

// Expected schema definitions
const expectedSchema = {
  resources: {
    columns: [
      'id', 'organization_id', 'type', 'title', 'description', 'category',
      'capacity', 'duration_minutes', 'price', 'currency', 'location',
      'requirements', 'availability_rules', 'metadata', 'is_active',
      'is_bookable', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ],
    types: {
      type: ['space', 'equipment', 'person', 'workshop'],
      status: ['active', 'inactive', 'maintenance']
    }
  },
  bookings: {
    columns: [
      'id', 'organization_id', 'resource_id', 'user_id', 'title',
      'description', 'start_time', 'end_time', 'status', 'capacity',
      'current_participants', 'price', 'currency', 'location', 'notes',
      'metadata', 'created_at', 'updated_at', 'created_by_clerk_id', 'updated_by_clerk_id'
    ],
    types: {
      status: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show']
    }
  },
  organizations: {
    columns: [
      'id', 'name', 'slug', 'description', 'logo_url', 'website_url',
      'contact_email', 'contact_phone', 'address', 'timezone',
      'settings', 'theme', 'is_active', 'created_at', 'updated_at'
    ]
  }
};

// Helper function to check if table exists
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
}

// Helper function to get table schema
async function getTableSchema(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      return { error: error.message };
    }
    
    if (data && data.length > 0) {
      return { columns: Object.keys(data[0]) };
    }
    
    return { columns: [] };
  } catch (error) {
    return { error: error.message };
  }
}

// Audit table schema
async function auditTable(tableName, expectedColumns) {
  console.log(`\n🔍 Auditing table: ${tableName}`);
  
  const exists = await tableExists(tableName);
  if (!exists) {
    console.log(`  ❌ Table ${tableName} does not exist`);
    auditResults.issues.push(`Table ${tableName} does not exist`);
    return;
  }
  
  console.log(`  ✅ Table ${tableName} exists`);
  
  const schema = await getTableSchema(tableName);
  if (schema.error) {
    console.log(`  ❌ Error getting schema: ${schema.error}`);
    auditResults.issues.push(`Error getting schema for ${tableName}: ${schema.error}`);
    return;
  }
  
  const actualColumns = schema.columns;
  console.log(`  📋 Actual columns: ${actualColumns.join(', ')}`);
  console.log(`  📋 Expected columns: ${expectedColumns.join(', ')}`);
  
  // Check for missing columns
  const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
  if (missingColumns.length > 0) {
    console.log(`  ⚠️  Missing columns: ${missingColumns.join(', ')}`);
    auditResults.issues.push(`Table ${tableName} missing columns: ${missingColumns.join(', ')}`);
  }
  
  // Check for extra columns
  const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col));
  if (extraColumns.length > 0) {
    console.log(`  ℹ️  Extra columns: ${extraColumns.join(', ')}`);
  }
  
  auditResults.tables.push({
    name: tableName,
    exists: true,
    actualColumns,
    expectedColumns,
    missingColumns,
    extraColumns
  });
}

// Test data insertion
async function testDataInsertion() {
  console.log('\n🧪 Testing data insertion...');
  
  // Test resource insertion
  console.log('  Testing resource insertion...');
  try {
    const { data: orgData } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
      .single();
    
    if (!orgData) {
      console.log('  ⚠️  No organizations found, skipping resource test');
      return;
    }
    
    const testResource = {
      organization_id: orgData.id,
      type: 'space',
      title: 'Test Studio',
      capacity: 10,
      is_active: true,
      is_bookable: true,
      created_by: 'test-user',
      updated_by: 'test-user'
    };
    
    const { data: resourceData, error: resourceError } = await supabase
      .from('resources')
      .insert(testResource)
      .select()
      .single();
    
    if (resourceError) {
      console.log(`  ❌ Resource insertion failed: ${resourceError.message}`);
      auditResults.issues.push(`Resource insertion failed: ${resourceError.message}`);
    } else {
      console.log('  ✅ Resource insertion successful');
      
      // Test booking insertion
      console.log('  Testing booking insertion...');
      const testBooking = {
        organization_id: orgData.id,
        resource_id: resourceData.id,
        user_id: 'test-user',
        title: 'Test Booking',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        created_by_clerk_id: 'test-user',
        updated_by_clerk_id: 'test-user'
      };
      
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert(testBooking)
        .select()
        .single();
      
      if (bookingError) {
        console.log(`  ❌ Booking insertion failed: ${bookingError.message}`);
        auditResults.issues.push(`Booking insertion failed: ${bookingError.message}`);
      } else {
        console.log('  ✅ Booking insertion successful');
        
        // Clean up test data
        await supabase.from('bookings').delete().eq('id', bookingData.id);
        await supabase.from('resources').delete().eq('id', resourceData.id);
        console.log('  🧹 Test data cleaned up');
      }
    }
  } catch (error) {
    console.log(`  ❌ Data insertion test failed: ${error.message}`);
    auditResults.issues.push(`Data insertion test failed: ${error.message}`);
  }
}

// Check resource type consistency
async function checkResourceTypes() {
  console.log('\n🔍 Checking resource type consistency...');
  
  try {
    const { data: resources, error } = await supabase
      .from('resources')
      .select('type')
      .not('type', 'is', null);
    
    if (error) {
      console.log(`  ❌ Error fetching resource types: ${error.message}`);
      return;
    }
    
    const types = [...new Set(resources.map(r => r.type))];
    console.log(`  📋 Found resource types: ${types.join(', ')}`);
    
    const expectedTypes = ['space', 'equipment', 'person', 'workshop'];
    const invalidTypes = types.filter(type => !expectedTypes.includes(type));
    
    if (invalidTypes.length > 0) {
      console.log(`  ⚠️  Invalid resource types found: ${invalidTypes.join(', ')}`);
      auditResults.issues.push(`Invalid resource types: ${invalidTypes.join(', ')}`);
    } else {
      console.log('  ✅ All resource types are valid');
    }
  } catch (error) {
    console.log(`  ❌ Resource type check failed: ${error.message}`);
    auditResults.issues.push(`Resource type check failed: ${error.message}`);
  }
}

// Generate recommendations
function generateRecommendations() {
  console.log('\n💡 Generating recommendations...');
  
  if (auditResults.issues.length === 0) {
    console.log('  ✅ No issues found - database schema is consistent');
    return;
  }
  
  auditResults.issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`);
  });
  
  // Add specific recommendations
  auditResults.recommendations.push('Run database migration to standardize schema');
  auditResults.recommendations.push('Update API endpoints to match database schema');
  auditResults.recommendations.push('Update component interfaces to match API responses');
  auditResults.recommendations.push('Add proper error handling for schema mismatches');
  
  console.log('\n📋 Recommendations:');
  auditResults.recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec}`);
  });
}

// Main audit execution
async function runAudit() {
  console.log('🚀 Starting Database Schema Audit...');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Service Role Key: ${supabaseKey.substring(0, 10)}...`);

  // Audit each table
  for (const [tableName, tableSchema] of Object.entries(expectedSchema)) {
    await auditTable(tableName, tableSchema.columns);
  }
  
  // Test data insertion
  await testDataInsertion();
  
  // Check resource types
  await checkResourceTypes();
  
  // Generate recommendations
  generateRecommendations();
  
  // Print summary
  console.log('\n📊 Audit Summary:');
  console.log(`📋 Tables audited: ${auditResults.tables.length}`);
  console.log(`🚨 Issues found: ${auditResults.issues.length}`);
  console.log(`💡 Recommendations: ${auditResults.recommendations.length}`);
  
  if (auditResults.issues.length > 0) {
    console.log('\n❌ Schema audit completed with issues. Review recommendations above.');
    process.exit(1);
  } else {
    console.log('\n✅ Schema audit completed successfully. Database schema is consistent.');
    process.exit(0);
  }
}

// Run audit if this script is executed directly
if (require.main === module) {
  runAudit().catch(error => {
    console.error('💥 Audit execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runAudit, auditResults };
