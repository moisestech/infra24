# Test Booking Flow with Browser

Use Browser Controls to test the complete booking flow end-to-end.

## Test Scenarios
1. **Basic Booking Flow**
   - Navigate to `/o/oolite/bookings`
   - Test service selection
   - Test date/time selection
   - Test booking submission
   - Verify confirmation modal

2. **Conflict Detection**
   - Create overlapping bookings
   - Verify conflict detection works
   - Test conflict resolution UI

3. **Mobile Responsiveness**
   - Test on mobile viewport
   - Verify mobile booking type selector
   - Test touch interactions

4. **Accessibility Audit**
   - Check keyboard navigation
   - Verify screen reader compatibility
   - Test color contrast

## Browser Commands
```javascript
// Navigate to booking page
await browser.goto('http://localhost:3002/o/oolite/bookings');

// Test service selection
await browser.click('[data-testid="service-selector"]');

// Test date selection
await browser.click('[data-testid="date-picker"]');

// Test booking submission
await browser.click('[data-testid="submit-booking"]');
```

## Expected Results
- All booking flows work correctly
- No JavaScript errors in console
- Proper error handling and user feedback
- Mobile experience is smooth
- Accessibility standards met
