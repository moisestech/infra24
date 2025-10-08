# Booking System Scripts

This directory contains all scripts related to the booking system functionality.

## Scripts Overview

### Database Setup & Migration
- `run-booking-migration.sql` - Initial booking system migration
- `run-booking-migration-fixed.sql` - Fixed version of booking migration
- `create-booking-resources.js` - Creates booking resources and equipment

### Data Seeding
- `create-simple-bookings.js` - Creates simple test booking data
- `seed-demo-booking-data.js` - Seeds comprehensive demo booking data
- `create-bakehouse-bookings.js` - Creates Bakehouse-specific booking data
- `create-real-booking-data.js` - Creates realistic booking scenarios
- `create-mock-booking-data.js` - Creates mock booking data for testing

### Testing
- `test-booking-system.js` - Comprehensive booking system tests

## Usage

### Setup Booking System
```bash
# Run the booking migration
npm run db:migrate

# Create booking resources
node scripts/booking/create-booking-resources.js

# Seed demo data
node scripts/booking/seed-demo-booking-data.js
```

### Testing
```bash
# Test booking system
npm run test:booking

# Or run directly
node scripts/booking/test-booking-system.js
```

### Data Management
```bash
# Create simple bookings
node scripts/booking/create-simple-bookings.js

# Create organization-specific bookings
node scripts/booking/create-bakehouse-bookings.js
```

## Script Dependencies

All scripts require:
- Node.js environment
- Supabase connection configured
- Database schema properly set up

## Testing Strategy

The booking system includes comprehensive testing:
1. **Unit Tests** - Individual component testing
2. **Integration Tests** - End-to-end booking flow testing
3. **API Tests** - Booking API endpoint testing
4. **Database Tests** - Data integrity and constraint testing

## Related Documentation

- [Booking System Implementation](../docs/BOOKING_SYSTEM_IMPLEMENTATION.md)
- [Booking System Testing Guide](../docs/TESTING_GUIDE.md)
- [API Reference](../docs/API_REFERENCE.md)

