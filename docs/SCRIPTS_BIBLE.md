# Scripts Bible 🛠️

> **The definitive guide to Infra24 scripts and automation**

## 📁 Scripts Directory Structure

```
scripts/
├── database/           # Database management scripts
├── booking/           # Booking system scripts
├── testing/           # Testing and validation scripts
├── utilities/         # General utility scripts
├── data/             # Data population scripts
├── sql-reference/    # SQL query references
└── README.md         # Main scripts documentation
```

## 🗄️ Database Scripts

### Core Database Management
- **`setup-database-data.js`** - Initial database setup and data population
- **`run-migration.js`** - Run database migrations
- **`database-sync.js`** - Sync local and production databases
- **`audit-database-schema.js`** - Audit database schema consistency

### Schema Management
- **`create-*-table.js`** - Create specific tables
- **`add-*-column.sql`** - Add columns to existing tables
- **`fix-*-constraints.sql`** - Fix database constraints

### Data Population
- **`populate-*-resources.js`** - Populate resource data
- **`populate-*-organizations.js`** - Set up organization data
- **`populate-*-workshops.js`** - Create workshop content
- **`populate-*-surveys.js`** - Set up survey templates

## 🎯 Booking System Scripts

### Resource Management
- **`populate-digital-lab-resources.js`** - Digital lab equipment
- **`update-digital-lab-resources.js`** - Update existing resources
- **`add-sample-resources.js`** - Add test resources

### Booking Testing
- **`test-booking-flow.js`** - Test complete booking process
- **`test-booking-api.js`** - Test booking API endpoints
- **`validate-booking-data.js`** - Validate booking data integrity

## 🧪 Testing Scripts

### System Testing
- **`comprehensive-system-test.js`** - Full system test suite
- **`test-api-endpoints.js`** - API endpoint testing
- **`test-database-connection.js`** - Database connectivity tests
- **`test-email-integration.js`** - Email system testing

### Feature Testing
- **`test-survey-flow.js`** - Survey system testing
- **`test-workshop-creation.js`** - Workshop creation testing
- **`test-booking-conflicts.js`** - Conflict detection testing
- **`test-calendar-integration.js`** - Calendar sync testing

### Performance Testing
- **`test-performance.js`** - Performance benchmarking
- **`test-load.js`** - Load testing
- **`test-concurrent-bookings.js`** - Concurrent booking testing

## 🔧 Utility Scripts

### Development Utilities
- **`fix-build-errors.js`** - Fix common build issues
- **`update-dependencies.js`** - Update package dependencies
- **`cleanup-old-structure.js`** - Clean up deprecated code
- **`validate-build.js`** - Validate build integrity

### Data Utilities
- **`backup-database.js`** - Database backup
- **`restore-database.js`** - Database restore
- **`export-data.js`** - Export data to various formats
- **`import-data.js`** - Import data from external sources

### Security Utilities
- **`security-audit.js`** - Security vulnerability scanning
- **`validate-permissions.js`** - Permission validation
- **`audit-user-access.js`** - User access auditing

## 📊 Organization-Specific Scripts

### Oolite Arts
- **`setup-oolite-organization.js`** - Oolite organization setup
- **`populate-oolite-artists.js`** - Oolite artist data
- **`update-oolite-theme.js`** - Oolite theme configuration
- **`verify-oolite-survey-setup.js`** - Oolite survey validation

### MadArts
- **`setup-madarts-organization.js`** - MadArts organization setup
- **`create-madarts-workshops.js`** - MadArts workshop creation
- **`update-madarts-banner.js`** - MadArts branding updates

### Bakehouse
- **`populate-bakehouse-artists.js`** - Bakehouse artist data
- **`setup-bakehouse-resources.js`** - Bakehouse resource setup

## 🚀 Deployment Scripts

### Environment Setup
- **`setup-vercel-env.sh`** - Vercel environment configuration
- **`setup-local-environment.js`** - Local development setup
- **`setup-production.js`** - Production environment setup

### Deployment Automation
- **`quick-deploy.sh`** - Quick deployment script
- **`deploy-with-tests.js`** - Deploy with automated testing
- **`rollback-deployment.js`** - Rollback deployment

## 📋 Common Script Patterns

### Database Script Template
```javascript
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  try {
    console.log('🔄 Starting script...')
    
    // Your script logic here
    
    console.log('✅ Script completed successfully')
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

main()
```

### Testing Script Template
```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function runTests() {
  const tests = [
    { name: 'Test 1', fn: test1 },
    { name: 'Test 2', fn: test2 },
    // Add more tests
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    try {
      await test.fn()
      console.log(`✅ ${test.name} passed`)
      passed++
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message)
      failed++
    }
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`)
  process.exit(failed > 0 ? 1 : 0)
}

runTests()
```

## 🎯 Script Usage Guidelines

### Running Scripts
```bash
# Run a database script
node scripts/setup-database-data.js

# Run with environment variables
NODE_ENV=production node scripts/deploy-with-tests.js

# Run with specific organization
ORG_ID=123 node scripts/populate-resources.js
```

### Environment Variables
```bash
# Required for most scripts
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional
NODE_ENV=development|staging|production
ORG_ID=specific_organization_id
DRY_RUN=true  # For testing without making changes
```

### Error Handling
- All scripts should use try-catch blocks
- Log errors with descriptive messages
- Exit with appropriate codes (0 for success, 1 for failure)
- Include rollback procedures for destructive operations

## 📚 Script Documentation

### Required Documentation
Each script should include:
- **Purpose**: What the script does
- **Prerequisites**: Required setup or data
- **Usage**: How to run the script
- **Parameters**: Command line arguments
- **Output**: What the script produces
- **Side Effects**: Any changes made to the system

### Example Documentation
```javascript
/**
 * Populate Digital Lab Resources
 * 
 * Purpose: Creates sample resources for the digital lab booking system
 * Prerequisites: Organizations must exist in database
 * Usage: node scripts/populate-digital-lab-resources.js [orgId]
 * Parameters: orgId (optional) - specific organization ID
 * Output: Creates resources in the database
 * Side Effects: Adds new resources to the resources table
 */
```

## 🔍 Script Validation

### Pre-commit Checks
- [ ] Script has proper error handling
- [ ] Script includes logging
- [ ] Script has documentation
- [ ] Script follows naming conventions
- [ ] Script includes rollback procedures

### Testing Requirements
- [ ] Script can be run in dry-run mode
- [ ] Script handles missing dependencies gracefully
- [ ] Script validates input parameters
- [ ] Script produces expected output
- [ ] Script can be safely re-run

## 🚨 Safety Guidelines

### Destructive Operations
- Always include confirmation prompts
- Implement dry-run modes
- Create backups before destructive operations
- Include rollback procedures
- Log all changes made

### Data Integrity
- Validate data before insertion
- Use transactions for multi-step operations
- Check for existing data before creating duplicates
- Implement data validation rules
- Include data cleanup procedures

## 📈 Performance Considerations

### Database Operations
- Use batch operations for large datasets
- Implement pagination for large queries
- Use appropriate indexes
- Monitor query performance
- Implement connection pooling

### Memory Management
- Process data in chunks for large datasets
- Clean up resources after use
- Monitor memory usage
- Implement garbage collection
- Use streaming for large files

## 🔄 Maintenance

### Regular Tasks
- [ ] Review and update scripts monthly
- [ ] Test scripts in staging environment
- [ ] Update documentation as needed
- [ ] Remove deprecated scripts
- [ ] Optimize slow-running scripts

### Version Control
- All scripts should be in version control
- Use meaningful commit messages
- Tag releases appropriately
- Maintain changelog
- Document breaking changes

---

## 🎯 Quick Reference

### Most Used Scripts
```bash
# Database setup
node scripts/setup-database-data.js

# Add sample data
node scripts/add-sample-resources.js

# Test the system
node scripts/comprehensive-system-test.js

# Deploy to production
node scripts/quick-deploy.sh
```

### Emergency Scripts
```bash
# Database backup
node scripts/backup-database.js

# Rollback deployment
node scripts/rollback-deployment.js

# Security audit
node scripts/security-audit.js
```

### Development Scripts
```bash
# Fix build errors
node scripts/fix-build-errors.js

# Update dependencies
node scripts/update-dependencies.js

# Clean up old code
node scripts/cleanup-old-structure.js
```

---

*Last updated: January 2025*
*Version: 2.0.0*
*Maintainer: Development Team*
