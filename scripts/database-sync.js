#!/usr/bin/env node

/**
 * Database Sync Script
 *
 * DATA_SEED_SAFETY: DESTRUCTIVE when clearExisting is true
 * ---------------------------------------------------------
 * importTableData(..., clearExisting) issues a table-wide DELETE on the target
 * before insert. See scripts/DATA_SEED_REGISTRY.md before syncing production.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Environment configurations
const environments = {
  local: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    name: 'Local'
  },
  production: {
    url: process.env.PRODUCTION_SUPABASE_URL,
    key: process.env.PRODUCTION_SUPABASE_SERVICE_ROLE_KEY,
    name: 'Production'
  }
};

// Oolite organization ID
const OOLITE_ORG_ID = '2133fe94-fb12-41f8-ab37-ea4acd4589f6';

class DatabaseSync {
  constructor(sourceEnv, targetEnv) {
    this.sourceEnv = sourceEnv;
    this.targetEnv = targetEnv;
    this.sourceClient = createClient(
      environments[sourceEnv].url,
      environments[sourceEnv].key,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    this.targetClient = createClient(
      environments[targetEnv].url,
      environments[targetEnv].key,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }

  async exportTableData(tableName, orgId = null) {
    console.log(`📤 Exporting ${tableName} from ${environments[this.sourceEnv].name}...`);
    
    let query = this.sourceClient.from(tableName).select('*');
    
    if (orgId) {
      query = query.eq('organization_id', orgId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`❌ Error exporting ${tableName}:`, error);
      return null;
    }
    
    console.log(`✅ Exported ${data?.length || 0} records from ${tableName}`);
    return data;
  }

  async importTableData(tableName, data, clearExisting = false) {
    console.log(`📥 Importing ${data?.length || 0} records to ${tableName} in ${environments[this.targetEnv].name}...`);
    
    if (clearExisting) {
      console.warn(`\n⚠️  DESTRUCTIVE: Clearing ALL rows from ${tableName} on target before import.`);
      console.warn('    See scripts/DATA_SEED_REGISTRY.md\n');
      console.log(`🗑️  Clearing existing data from ${tableName}...`);
      const { error: deleteError } = await this.targetClient
        .from(tableName)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (deleteError) {
        console.error(`❌ Error clearing ${tableName}:`, deleteError);
        return false;
      }
    }
    
    if (!data || data.length === 0) {
      console.log(`⚠️  No data to import for ${tableName}`);
      return true;
    }
    
    const { error } = await this.targetClient
      .from(tableName)
      .insert(data);
    
    if (error) {
      console.error(`❌ Error importing to ${tableName}:`, error);
      return false;
    }
    
    console.log(`✅ Successfully imported ${data.length} records to ${tableName}`);
    return true;
  }

  async syncTable(tableName, orgId = null, clearExisting = false) {
    console.log(`\n🔄 Syncing ${tableName}...`);
    
    const data = await this.exportTableData(tableName, orgId);
    if (data === null) return false;
    
    const success = await this.importTableData(tableName, data, clearExisting);
    return success;
  }

  async exportToFile(tableName, orgId = null, filename = null) {
    console.log(`\n💾 Exporting ${tableName} to file...`);
    
    const data = await this.exportTableData(tableName, orgId);
    if (data === null) return false;
    
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    const filePath = path.join(exportDir, filename || `${tableName}_${this.sourceEnv}_${new Date().toISOString().split('T')[0]}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Exported to ${filePath}`);
    return true;
  }

  async importFromFile(tableName, filePath, clearExisting = false) {
    console.log(`\n📂 Importing ${tableName} from file...`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return false;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const success = await this.importTableData(tableName, data, clearExisting);
    return success;
  }

  async syncAllTables(orgId = null) {
    console.log(`\n🚀 Starting full database sync from ${environments[this.sourceEnv].name} to ${environments[this.targetEnv].name}...`);
    
    const tables = [
      'organizations',
      'artist_profiles',
      'workshops',
      'workshop_chapters',
      'surveys',
      'survey_templates',
      'announcements',
      'resources',
      'bookings',
      'equipment_options',
      'equipment_votes',
      'workshop_category_votes',
      'user_workshop_progress',
      'workshop_interest'
    ];
    
    let successCount = 0;
    let totalCount = tables.length;
    
    for (const table of tables) {
      const success = await this.syncTable(table, orgId, true);
      if (success) successCount++;
    }
    
    console.log(`\n📊 Sync Summary: ${successCount}/${totalCount} tables synced successfully`);
    return successCount === totalCount;
  }

  async verifySync(orgId = null) {
    console.log(`\n🔍 Verifying sync between ${environments[this.sourceEnv].name} and ${environments[this.targetEnv].name}...`);
    
    const tables = ['organizations', 'artist_profiles', 'workshops', 'surveys', 'announcements'];
    
    for (const table of tables) {
      console.log(`\n📋 Checking ${table}...`);
      
      // Get counts from both environments
      let sourceQuery = this.sourceClient.from(table).select('id', { count: 'exact', head: true });
      let targetQuery = this.targetClient.from(table).select('id', { count: 'exact', head: true });
      
      if (orgId) {
        sourceQuery = sourceQuery.eq('organization_id', orgId);
        targetQuery = targetQuery.eq('organization_id', orgId);
      }
      
      const { count: sourceCount } = await sourceQuery;
      const { count: targetCount } = await targetQuery;
      
      console.log(`   ${environments[this.sourceEnv].name}: ${sourceCount || 0} records`);
      console.log(`   ${environments[this.targetEnv].name}: ${targetCount || 0} records`);
      
      if (sourceCount === targetCount) {
        console.log(`   ✅ Counts match`);
      } else {
        console.log(`   ⚠️  Counts differ`);
      }
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log(`
🔄 Database Sync Utility

Usage:
  node scripts/database-sync.js <command> [options]

Commands:
  sync-all <source> <target> [orgId]     - Sync all tables between environments
  sync-table <table> <source> <target>   - Sync specific table
  export <table> <env> [orgId] [file]    - Export table data to file
  import <table> <env> <file>            - Import table data from file
  verify <source> <target> [orgId]       - Verify sync between environments
  populate-local                         - Populate local database with sample data

Environments: local, production

Examples:
  node scripts/database-sync.js sync-all production local
  node scripts/database-sync.js sync-table artist_profiles production local
  node scripts/database-sync.js export artist_profiles production ${OOLITE_ORG_ID}
  node scripts/database-sync.js verify production local ${OOLITE_ORG_ID}
  node scripts/database-sync.js populate-local
    `);
    return;
  }
  
  try {
    switch (command) {
      case 'sync-all': {
        const [source, target, orgId] = args.slice(1);
        if (!source || !target) {
          console.error('❌ Usage: sync-all <source> <target> [orgId]');
          return;
        }
        
        const sync = new DatabaseSync(source, target);
        await sync.syncAllTables(orgId);
        break;
      }
      
      case 'sync-table': {
        const [table, source, target] = args.slice(1);
        if (!table || !source || !target) {
          console.error('❌ Usage: sync-table <table> <source> <target>');
          return;
        }
        
        const sync = new DatabaseSync(source, target);
        await sync.syncTable(table, OOLITE_ORG_ID, true);
        break;
      }
      
      case 'export': {
        const [table, env, orgId, filename] = args.slice(1);
        if (!table || !env) {
          console.error('❌ Usage: export <table> <env> [orgId] [filename]');
          return;
        }
        
        const sync = new DatabaseSync(env, env); // Same env for export
        await sync.exportToFile(table, orgId, filename);
        break;
      }
      
      case 'import': {
        const [table, env, filePath] = args.slice(1);
        if (!table || !env || !filePath) {
          console.error('❌ Usage: import <table> <env> <filePath>');
          return;
        }
        
        const sync = new DatabaseSync(env, env); // Same env for import
        await sync.importFromFile(table, filePath, true);
        break;
      }
      
      case 'verify': {
        const [source, target, orgId] = args.slice(1);
        if (!source || !target) {
          console.error('❌ Usage: verify <source> <target> [orgId]');
          return;
        }
        
        const sync = new DatabaseSync(source, target);
        await sync.verifySync(orgId);
        break;
      }
      
      case 'populate-local': {
        console.log('🎨 Populating local database with sample data...');
        
        // Import the populate script
        const { populateArtists } = require('./populate-oolite-artists.js');
        await populateArtists();
        
        console.log('✅ Local database populated successfully!');
        break;
      }
      
      default:
        console.error(`❌ Unknown command: ${command}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { DatabaseSync };
