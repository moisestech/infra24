# Infra24 Testing Guide

## 🧪 Testing Overview

Infra24 uses a comprehensive testing strategy with multiple layers:

- **Unit Tests**: Individual components and functions
- **Integration Tests**: API endpoints and database operations
- **End-to-End Tests**: Complete user workflows
- **API Tests**: Comprehensive API endpoint testing
- **System Tests**: Full booking system validation

## 🚀 Quick Start

### Run All Tests
```bash
npm run test:all
```

### Run Specific Test Types
```bash
# Unit tests
npm test

# API endpoint tests
npm run test:api

# Booking system tests
npm run test:booking

# End-to-end tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## 📋 Test Structure

### Unit Tests (`__tests__/`)
- **Components**: React component testing
- **Utils**: Utility function testing
- **API**: API route testing

### Integration Tests (`__tests__/integration/`)
- **Booking Flow**: Complete booking workflow
- **User Journeys**: End-to-end user scenarios

### API Tests (`scripts/`)
- **test-api-endpoints.js**: Comprehensive API testing
- **test-booking-system.js**: Booking system validation

## 🔧 Test Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  }
}
```

### Playwright Configuration
```javascript
// playwright.config.ts
export default defineConfig({
  testDir: './__tests__/integration',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
})
```

## 🧪 Unit Testing

### Component Testing
```typescript
// __tests__/components/BookingForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { BookingForm } from '@/components/booking/BookingForm'

describe('BookingForm', () => {
  it('renders booking form with resource selection', async () => {
    render(<BookingForm />)
    expect(screen.getByText('Select Equipment')).toBeInTheDocument()
  })
})
```

### API Route Testing
```typescript
// __tests__/api/availability.test.ts
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/availability/route'

describe('/api/availability', () => {
  it('should return available slots for a resource', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/availability?resource_id=test&start_date=2025-01-15&end_date=2025-01-15'
    )
    const response = await GET(request)
    expect(response.status).toBe(200)
  })
})
```

### Utility Testing
```typescript
// __tests__/utils/ics-generator.test.ts
import { generateICS } from '@/lib/ics-generator'

describe('ICS Generator', () => {
  it('should generate valid ICS content', () => {
    const icsContent = generateICS(mockBooking)
    expect(icsContent).toContain('BEGIN:VCALENDAR')
    expect(icsContent).toContain('END:VCALENDAR')
  })
})
```

## 🔗 Integration Testing

### API Endpoint Testing
```bash
# Test all API endpoints
npm run test:api

# Test specific endpoint
node scripts/test-api-endpoints.js
```

### Booking System Testing
```bash
# Test complete booking system
npm run test:booking

# Test specific component
node scripts/test-booking-system.js
```

## 🎭 End-to-End Testing

### Playwright Tests
```typescript
// __tests__/integration/booking-flow.test.ts
import { test, expect } from '@playwright/test'

test('complete booking flow from public page to confirmation', async ({ page }) => {
  await page.goto('/book')
  await expect(page.getByText('Book a Consultation')).toBeVisible()
  
  // Complete booking flow...
  await page.getByRole('button', { name: /book consultation/i }).click()
  await expect(page).toHaveURL(/\/bookings\/confirmation\/.*/)
})
```

### Running E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific test
npx playwright test booking-flow.test.ts
```

## 📊 Test Coverage

### Generate Coverage Report
```bash
npm run test:coverage
```

### Coverage Targets
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🐛 Debugging Tests

### Debug Unit Tests
```bash
# Run tests in watch mode
npm run test:watch

# Debug specific test
npm test -- --testNamePattern="BookingForm"
```

### Debug E2E Tests
```bash
# Run with debug mode
npx playwright test --debug

# Run with headed browser
npx playwright test --headed
```

### Debug API Tests
```bash
# Run with verbose output
node scripts/test-api-endpoints.js --verbose

# Test specific endpoint
node scripts/test-api-endpoints.js --endpoint=availability
```

## 🔧 Test Data Management

### Mock Data
```typescript
// __tests__/setup.ts
const mockResources = [
  {
    id: 'test-resource-id',
    name: 'Remote Studio Visit',
    is_bookable: true,
    metadata: {
      availability_rules: {
        timezone: 'America/New_York',
        slot_minutes: 30
      }
    }
  }
]
```

### Database Seeding
```bash
# Seed test data
npm run db:resources
npm run db:artists

# Reset test database
npm run db:setup
```

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:all
```

### Pre-commit Hooks
```bash
# Install husky
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run test"
```

## 📈 Performance Testing

### Load Testing
```bash
# Test API performance
npm run test:api -- --load

# Test booking system under load
npm run test:booking -- --load
```

### Memory Testing
```bash
# Test memory usage
npm run test -- --detectLeaks

# Profile performance
npm run test -- --profile
```

## 🔍 Test Monitoring

### Test Results
- **Unit Tests**: Jest HTML reporter
- **E2E Tests**: Playwright HTML report
- **API Tests**: Console output with detailed results

### Test Reports
```bash
# Generate test reports
npm run test:coverage
npm run test:e2e

# View reports
open coverage/lcov-report/index.html
open playwright-report/index.html
```

## 🛠️ Troubleshooting

### Common Issues

#### Tests Failing
```bash
# Check test environment
npm run test -- --verbose

# Clear test cache
npm test -- --clearCache
```

#### E2E Tests Failing
```bash
# Check browser installation
npx playwright install

# Run with debug mode
npx playwright test --debug
```

#### API Tests Failing
```bash
# Check server is running
npm run dev

# Test database connection
npm run db:test
```

### Debug Commands
```bash
# Debug specific test
npm test -- --testNamePattern="specific test"

# Debug with console logs
npm run test:api -- --verbose

# Debug E2E with browser
npx playwright test --headed --debug
```

## 📚 Best Practices

### Writing Tests
1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear test descriptions
3. **Single Responsibility**: Test one thing per test
4. **Mock External Dependencies**: Isolate units under test
5. **Test Edge Cases**: Cover error scenarios

### Test Organization
1. **Group Related Tests**: Use describe blocks
2. **Setup and Teardown**: Use beforeEach/afterEach
3. **Shared Utilities**: Create test helpers
4. **Consistent Naming**: Follow naming conventions

### Performance
1. **Parallel Execution**: Run tests in parallel
2. **Selective Testing**: Run only changed tests
3. **Mock Heavy Operations**: Mock database calls
4. **Clean Test Data**: Reset state between tests

## 🎯 Testing Checklist

### Before Committing
- [ ] All unit tests pass
- [ ] API tests pass
- [ ] E2E tests pass
- [ ] Test coverage meets targets
- [ ] No test warnings or errors

### Before Deployment
- [ ] Full test suite passes
- [ ] Performance tests pass
- [ ] Load tests pass
- [ ] Security tests pass
- [ ] Integration tests pass

---

*Last updated: September 30, 2025*














