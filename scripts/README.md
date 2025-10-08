# Scripts Directory

This directory contains utility scripts for database management, testing, and system maintenance.

## 🎉 **Latest Updates**

### **Build Success Milestone Scripts**
- ✅ `quick-workshop-learn-integration.js` - Assesses workshop MDX system readiness
- ✅ All build-related scripts updated for Next.js 14.2.25 compatibility

## 📁 **Script Categories**

### **Database Management**
- `setup-complete-database-schema.sql` - Complete database schema setup
- `add-learn-content-fields.sql` - Workshop learning content fields
- `run-local-database-setup.js` - Local database initialization
- `simple-migration.js` - Basic database migration
- `run-direct-sql-migration.js` - Direct SQL execution

### **Workshop System**
- `create-sample-workshops-with-learn-content.js` - Sample workshop data
- `test-learn-canvas-system.js` - Learn canvas system testing
- `quick-workshop-learn-integration.js` - Integration readiness assessment

### **Testing & Validation**
- `test-build-and-dev.sh` - Build and development testing
- `comprehensive-system-test.js` - Full system validation
- `test-api-endpoints.js` - API endpoint testing
- `verify-production.js` - Production deployment verification

### **Data Population**
- `populate-oolite-artists.js` - Oolite artist data
- `populate-sample-workshops.js` - Sample workshop data
- `populate-oolite-announcements.js` - Oolite announcements
- `create-survey-templates.js` - Survey template creation

## 🚀 **Quick Start Scripts**

### **1. Workshop Learn Integration Assessment**
```bash
node scripts/quick-workshop-learn-integration.js
```
**Purpose**: Assesses readiness for workshop learning system integration  
**Output**: Detailed status report and integration recommendations

### **2. Database Setup**
```bash
node scripts/run-local-database-setup.js
```
**Purpose**: Sets up complete database schema with all tables  
**Requirements**: Supabase connection configured

### **3. Build Testing**
```bash
./scripts/utilities/build/test-build-and-dev.sh
```
**Purpose**: Tests build process and development server  
**Output**: Build success/failure report

### **4. System Validation**
```bash
node scripts/comprehensive-system-test.js
```
**Purpose**: Validates entire system functionality  
**Output**: Comprehensive test results

## 📊 **Workshop MDX System Scripts**

### **Integration Assessment**
The `quick-workshop-learn-integration.js` script provides:

- ✅ **Component Readiness**: Checks all required components exist
- ✅ **API Endpoint Validation**: Verifies all APIs are functional
- ✅ **Database Schema Check**: Confirms all tables are created
- ✅ **Integration Guidance**: Provides step-by-step integration instructions

### **Sample Data Creation**
```bash
node scripts/create-sample-workshops-with-learn-content.js
```
**Purpose**: Creates sample workshops with learning content  
**Output**: Test workshops with chapters and MDX content

### **System Testing**
```bash
node scripts/test-learn-canvas-system.js
```
**Purpose**: Tests the complete learning canvas system  
**Output**: Detailed test results for all components

## 🔧 **Maintenance Scripts**

### **Database Maintenance**
- `audit-database-schema.js` - Database schema validation
- `database-sync.js` - Database synchronization
- `cleanup-old-structure.js` - Cleanup deprecated structures

### **Performance Testing**
- `test-performance.js` - Performance benchmarking
- `test-load.js` - Load testing
- `test-memory.js` - Memory usage testing

### **Deployment Scripts**
- `quick-deploy.sh` - Quick deployment script
- `setup-vercel-env.sh` - Vercel environment setup
- `verify-production.js` - Production verification

## 📋 **Script Usage Guidelines**

### **Before Running Scripts**
1. **Check Prerequisites**: Ensure all dependencies are installed
2. **Environment Setup**: Verify environment variables are configured
3. **Database Connection**: Confirm database connectivity
4. **Backup Data**: Backup important data before migrations

### **Script Execution**
```bash
# Make script executable (if needed)
chmod +x scripts/script-name.js

# Run script
node scripts/script-name.js

# Run with verbose output
DEBUG=true node scripts/script-name.js
```

### **Error Handling**
- All scripts include comprehensive error handling
- Check console output for detailed error messages
- Use `--verbose` flag for detailed logging
- Check log files in `logs/` directory

## 🎯 **Current Focus: Workshop Learning System**

### **Ready for Integration**
The workshop learning system is **85% complete** and ready for final integration:

1. **Run Integration Assessment**:
   ```bash
   node scripts/quick-workshop-learn-integration.js
   ```

2. **Create Sample Data** (if needed):
   ```bash
   node scripts/create-sample-workshops-with-learn-content.js
   ```

3. **Test System**:
   ```bash
   node scripts/test-learn-canvas-system.js
   ```

### **Integration Steps**
1. Add Learn tab to workshop detail pages
2. Connect chapter navigation
3. Integrate progress tracking UI
4. Test MDX content rendering

## 📚 **Documentation**

- **API Reference**: `docs/API_REFERENCE.md`
- **Database Schema**: `docs/DATABASE_SCHEMA.md`
- **Workshop System**: `docs/WORKSHOP_MDX_SYSTEM_STATUS.md`
- **Build Status**: `docs/BUILD_SUCCESS_MILESTONE.md`

## 🆘 **Troubleshooting**

### **Common Issues**
1. **Permission Denied**: Run `chmod +x scripts/script-name.js`
2. **Module Not Found**: Run `npm install --legacy-peer-deps`
3. **Database Connection**: Check environment variables
4. **Build Errors**: Run `npm run build` to check for issues

### **Getting Help**
- Check script output for error messages
- Review documentation in `docs/` directory
- Run integration assessment script for system status
- Check build status with `npm run build`

---

**Last Updated**: January 2025  
**Status**: Production Ready with Workshop Learning System 85% Complete