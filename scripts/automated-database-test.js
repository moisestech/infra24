#!/usr/bin/env node

/**
 * Automated Database Testing Script
 * Tests database setup, data population, and API endpoints
 * Run with: node scripts/automated-database-test.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Test configurations
const configs = {
  local: {
    url: 'http://127.0.0.1:54321',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
    name: 'Local Supabase'
  }
};

class DatabaseTester {
  constructor(config) {
    this.config = config;
    this.supabase = createClient(config.url, config.key);
    this.results = {
      connection: false,
      organizations: 0,
      workshops: 0,
      artists: 0,
      announcements: 0,
      errors: []
    };
  }

  async testConnection() {
    console.log(`\n🔍 Testing ${this.config.name} connection...`);
    try {
      const { data, error } = await this.supabase
        .from('organizations')
        .select('count')
        .limit(1);
      
      if (error) {
        this.results.errors.push(`Connection failed: ${error.message}`);
        return false;
      }
      
      this.results.connection = true;
      console.log('✅ Database connection successful');
      return true;
    } catch (err) {
      this.results.errors.push(`Connection error: ${err.message}`);
      console.log('❌ Database connection failed');
      return false;
    }
  }

  async testOrganizations() {
    console.log('\n🏢 Testing organizations...');
    try {
      const { data, error } = await this.supabase
        .from('organizations')
        .select('id, name, slug, is_active');
      
      if (error) {
        this.results.errors.push(`Organizations query failed: ${error.message}`);
        return;
      }
      
      this.results.organizations = data.length;
      console.log(`✅ Found ${data.length} organizations:`);
      data.forEach(org => {
        console.log(`  - ${org.name} (${org.slug}) - ${org.is_active ? 'Active' : 'Inactive'}`);
      });
      
      return data;
    } catch (err) {
      this.results.errors.push(`Organizations error: ${err.message}`);
      console.log('❌ Organizations test failed');
    }
  }

  async testWorkshops() {
    console.log('\n📚 Testing workshops...');
    try {
      const { data, error } = await this.supabase
        .from('workshops')
        .select('id, title, status, featured, has_learn_content, organization_id');
      
      if (error) {
        this.results.errors.push(`Workshops query failed: ${error.message}`);
        return;
      }
      
      this.results.workshops = data.length;
      console.log(`✅ Found ${data.length} workshops:`);
      data.forEach(workshop => {
        console.log(`  - ${workshop.title} (${workshop.status}) - Featured: ${workshop.featured}`);
      });
      
      return data;
    } catch (err) {
      this.results.errors.push(`Workshops error: ${err.message}`);
      console.log('❌ Workshops test failed');
    }
  }

  async testArtists() {
    console.log('\n👨‍🎨 Testing artists...');
    try {
      const { data, error } = await this.supabase
        .from('artists')
        .select('id, name, studio_number, organization_id');
      
      if (error) {
        this.results.errors.push(`Artists query failed: ${error.message}`);
        return;
      }
      
      this.results.artists = data.length;
      console.log(`✅ Found ${data.length} artists:`);
      data.slice(0, 5).forEach(artist => {
        console.log(`  - ${artist.name} (Studio: ${artist.studio_number || 'N/A'})`);
      });
      if (data.length > 5) {
        console.log(`  ... and ${data.length - 5} more`);
      }
      
      return data;
    } catch (err) {
      this.results.errors.push(`Artists error: ${err.message}`);
      console.log('❌ Artists test failed');
    }
  }

  async testAnnouncements() {
    console.log('\n📢 Testing announcements...');
    try {
      const { data, error } = await this.supabase
        .from('announcements')
        .select('id, title, status, organization_id');
      
      if (error) {
        this.results.errors.push(`Announcements query failed: ${error.message}`);
        return;
      }
      
      this.results.announcements = data.length;
      console.log(`✅ Found ${data.length} announcements:`);
      data.slice(0, 3).forEach(announcement => {
        console.log(`  - ${announcement.title} (${announcement.status})`);
      });
      if (data.length > 3) {
        console.log(`  ... and ${data.length - 3} more`);
      }
      
      return data;
    } catch (err) {
      this.results.errors.push(`Announcements error: ${err.message}`);
      console.log('❌ Announcements test failed');
    }
  }

  async testAPIEndpoints() {
    console.log('\n🌐 Testing API endpoints...');
    const endpoints = [
      '/rest/v1/organizations?select=id,name,slug',
      '/rest/v1/workshops?select=id,title,status',
      '/rest/v1/artists?select=id,name,studio_number',
      '/rest/v1/announcements?select=id,title,status'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.config.url}${endpoint}`, {
          headers: {
            'apikey': this.config.key,
            'Authorization': `Bearer ${this.config.key}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${endpoint} - ${data.length} records`);
        } else {
          console.log(`❌ ${endpoint} - ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.log(`❌ ${endpoint} - ${err.message}`);
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Automated Database Tests');
    console.log('=====================================');
    
    // Test connection first
    const connected = await this.testConnection();
    if (!connected) {
      console.log('\n❌ Cannot proceed - database connection failed');
      return this.results;
    }
    
    // Run all tests
    await this.testOrganizations();
    await this.testWorkshops();
    await this.testArtists();
    await this.testAnnouncements();
    await this.testAPIEndpoints();
    
    // Generate report
    this.generateReport();
    
    return this.results;
  }

  generateReport() {
    console.log('\n📋 TEST SUMMARY');
    console.log('================');
    console.log(`Database Connection: ${this.results.connection ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Organizations: ${this.results.organizations} found`);
    console.log(`Workshops: ${this.results.workshops} found`);
    console.log(`Artists: ${this.results.artists} found`);
    console.log(`Announcements: ${this.results.announcements} found`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.results.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }
    
    // Save results to file
    const reportPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed results saved to: ${reportPath}`);
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (this.results.organizations === 0) {
      console.log('  - Run: node scripts/populate-organizations.js');
    }
    if (this.results.workshops === 0) {
      console.log('  - Run: node scripts/populate-sample-workshops.js');
    }
    if (this.results.artists === 0) {
      console.log('  - Run: node scripts/populate-oolite-artists.js');
    }
    if (this.results.announcements === 0) {
      console.log('  - Run: node scripts/populate-oolite-announcements.js');
    }
  }
}

// Main execution
async function main() {
  const tester = new DatabaseTester(configs.local);
  const results = await tester.runAllTests();
  
  // Exit with appropriate code
  process.exit(results.connection && results.organizations > 0 ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { DatabaseTester };


