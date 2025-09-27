# Infra24 Platform - Comprehensive Testing Plan

**Date**: December 2024  
**Status**: 🧪 **TESTING PLAN**  
**Priority**: 🚨 **CRITICAL - BEFORE DEPLOYMENT**

## 🎯 Testing Objectives

1. **Verify API Functionality**: Ensure all endpoints work correctly
2. **Validate Data Flow**: Confirm data flows correctly between frontend and backend
3. **Test User Interactions**: Verify all user-facing features work
4. **Check Resource Management**: Validate booking system for different resource types
5. **Schedule Visualization**: Ensure calendar and scheduling work correctly

## 🧪 Testing Strategy

### **1. API Endpoint Testing**

#### **Resources API** (`/api/resources`)
```bash
# Test GET - List resources
curl -X GET "http://localhost:3000/api/resources?organizationId=test-org-id" \
  -H "Authorization: Bearer test-token"

# Test POST - Create resource
curl -X POST "http://localhost:3000/api/resources" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "organizationId": "test-org-id",
    "title": "Studio A",
    "type": "space",
    "capacity": 10,
    "description": "Main studio space"
  }'

# Test with different resource types
curl -X POST "http://localhost:3000/api/resources" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "organizationId": "test-org-id",
    "title": "VR Headset",
    "type": "equipment",
    "capacity": 1,
    "description": "Oculus Quest 3"
  }'
```

#### **Bookings API** (`/api/bookings`)
```bash
# Test GET - List bookings
curl -X GET "http://localhost:3000/api/bookings?organizationId=test-org-id" \
  -H "Authorization: Bearer test-token"

# Test POST - Create booking
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "organizationId": "test-org-id",
    "resourceId": "resource-id",
    "title": "Studio Booking",
    "startTime": "2024-01-01T10:00:00Z",
    "endTime": "2024-01-01T12:00:00Z"
  }'
```

### **2. Database Schema Testing**

#### **Test Resource Types**
```sql
-- Test inserting different resource types
INSERT INTO resources (organization_id, type, title, capacity) VALUES
  ('org-id', 'space', 'Studio A', 10),
  ('org-id', 'equipment', 'VR Headset', 1),
  ('org-id', 'person', 'Photography Instructor', 1),
  ('org-id', 'workshop', 'Digital Art Workshop', 15);

-- Test booking creation
INSERT INTO bookings (organization_id, resource_id, user_id, title, start_time, end_time) VALUES
  ('org-id', 'resource-id', 'user-id', 'Studio Booking', '2024-01-01 10:00:00', '2024-01-01 12:00:00');
```

#### **Test Data Relationships**
```sql
-- Test foreign key relationships
SELECT r.title, r.type, b.title as booking_title, b.start_time
FROM resources r
JOIN bookings b ON r.id = b.resource_id
WHERE r.organization_id = 'org-id';
```

### **3. Component Testing**

#### **BookingForm Component**
```typescript
// Test with different resource types
const testResources = [
  { id: '1', title: 'Studio A', type: 'space', capacity: 10 },
  { id: '2', title: 'VR Headset', type: 'equipment', capacity: 1 },
  { id: '3', title: 'Instructor', type: 'person', capacity: 1 }
];

// Test booking creation
const testBooking = {
  resource_id: '1',
  title: 'Test Booking',
  start_time: new Date('2024-01-01T10:00:00Z'),
  end_time: new Date('2024-01-01T12:00:00Z'),
  status: 'pending'
};
```

#### **ResourceCalendar Component**
```typescript
// Test calendar rendering with different resource types
const testResources = [
  { id: '1', title: 'Studio A', type: 'space', capacity: 10 },
  { id: '2', title: 'VR Headset', type: 'equipment', capacity: 1 }
];

const testBookings = [
  {
    id: '1',
    resource_id: '1',
    title: 'Studio Booking',
    start_time: new Date('2024-01-01T10:00:00Z'),
    end_time: new Date('2024-01-01T12:00:00Z'),
    status: 'confirmed'
  }
];
```

### **4. User Flow Testing**

#### **Complete Booking Workflow**
1. **Navigate to booking page**
2. **Select resource type** (space, equipment, person)
3. **Choose time slot**
4. **Fill booking details**
5. **Submit booking**
6. **Verify booking appears in calendar**
7. **Test booking modification**
8. **Test booking cancellation**

#### **Resource Management Workflow**
1. **Navigate to admin panel**
2. **Create new resource**
3. **Set resource properties**
4. **Test resource availability**
5. **Modify resource settings**
6. **Delete resource**

### **5. Schedule Visualization Testing**

#### **Calendar Views**
1. **Resource View**: Test showing all resources with bookings
2. **Time View**: Test showing all bookings across resources
3. **User View**: Test showing user's personal bookings
4. **Admin View**: Test showing all bookings with management controls

#### **Visual Differentiation**
1. **Test color coding** for different resource types
2. **Test status colors** for different booking statuses
3. **Test icons** for different resource types
4. **Test hover states** and interactions

## 🔍 Specific Test Cases

### **Resource Type Differentiation**

#### **Space Resources**
- ✅ **Test**: Create space resource with capacity > 1
- ✅ **Test**: Book space for multiple people
- ✅ **Test**: Check capacity limits
- ✅ **Test**: Visual representation (blue color, room icon)

#### **Equipment Resources**
- ✅ **Test**: Create equipment resource with capacity = 1
- ✅ **Test**: Book equipment for individual use
- ✅ **Test**: Check availability conflicts
- ✅ **Test**: Visual representation (green color, tool icon)

#### **Person Resources**
- ✅ **Test**: Create person resource (instructor, consultant)
- ✅ **Test**: Book person for consultation/instruction
- ✅ **Test**: Check schedule conflicts
- ✅ **Test**: Visual representation (purple color, person icon)

#### **Workshop Resources**
- ✅ **Test**: Create workshop resource
- ✅ **Test**: Book workshop for group
- ✅ **Test**: Check registration limits
- ✅ **Test**: Visual representation (orange color, education icon)

### **Booking System Testing**

#### **Time Conflict Detection**
- ✅ **Test**: Overlapping bookings for same resource
- ✅ **Test**: Booking outside resource availability
- ✅ **Test**: Booking in past
- ✅ **Test**: Booking too far in future

#### **Status Management**
- ✅ **Test**: Pending → Confirmed workflow
- ✅ **Test**: Confirmed → Cancelled workflow
- ✅ **Test**: No-show handling
- ✅ **Test**: Completion tracking

### **Schedule Visualization Testing**

#### **Calendar Integration**
- ✅ **Test**: FullCalendar rendering
- ✅ **Test**: Resource time grid view
- ✅ **Test**: Day grid view
- ✅ **Test**: List view

#### **Real-time Updates**
- ✅ **Test**: New booking appears immediately
- ✅ **Test**: Booking modification updates calendar
- ✅ **Test**: Booking cancellation removes from calendar
- ✅ **Test**: Multiple users see updates

## 🚨 Critical Test Scenarios

### **1. Database Schema Mismatch**
```typescript
// Test if API expects different column names than database
const testResource = {
  organizationId: 'org-id', // API expects this
  // But database has organization_id
  title: 'Test Resource',
  type: 'space' // API expects this
  // But some schemas have different type enums
};
```

### **2. Component Interface Mismatch**
```typescript
// Test if components expect different interfaces
const BookingFormResource = {
  id: string,
  title: string,
  type: 'space' | 'equipment' | 'person', // Component expects this
  capacity: number
};

const ResourceCalendarResource = {
  id: string,
  title: string,
  type: 'space' | 'equipment' | 'person', // Different component expects this
  capacity: number,
  organization_id: string // Additional field
};
```

### **3. API Response Mismatch**
```typescript
// Test if API returns different format than components expect
const apiResponse = {
  id: '1',
  organization_id: 'org-id', // API returns this
  title: 'Studio A',
  starts_at: '2024-01-01T10:00:00Z', // API returns this
  ends_at: '2024-01-01T12:00:00Z' // API returns this
};

const componentExpectation = {
  id: '1',
  organizationId: 'org-id', // Component expects this
  title: 'Studio A',
  startTime: '2024-01-01T10:00:00Z', // Component expects this
  endTime: '2024-01-01T12:00:00Z' // Component expects this
};
```

## 📊 Test Results Tracking

### **Test Execution Checklist**

#### **API Testing**
- [ ] Resources API - GET endpoint
- [ ] Resources API - POST endpoint
- [ ] Bookings API - GET endpoint
- [ ] Bookings API - POST endpoint
- [ ] Error handling for invalid requests
- [ ] Authentication and authorization

#### **Database Testing**
- [ ] Resource creation with different types
- [ ] Booking creation and retrieval
- [ ] Foreign key relationships
- [ ] Data integrity constraints
- [ ] Query performance

#### **Component Testing**
- [ ] BookingForm with different resource types
- [ ] ResourceCalendar rendering
- [ ] Schedule visualization
- [ ] User interactions
- [ ] Error states

#### **Integration Testing**
- [ ] Complete booking workflow
- [ ] Resource management workflow
- [ ] Multi-user scenarios
- [ ] Real-time updates
- [ ] Error recovery

## 🎯 Success Criteria

### **Functional Requirements**
- ✅ **All API endpoints respond correctly**
- ✅ **Database operations work without errors**
- ✅ **Components render and interact properly**
- ✅ **Booking system handles all resource types**
- ✅ **Schedule visualization works correctly**

### **Performance Requirements**
- ✅ **API response time < 200ms**
- ✅ **Database query time < 100ms**
- ✅ **Component render time < 50ms**
- ✅ **Page load time < 2 seconds**

### **Quality Requirements**
- ✅ **Error rate < 0.1%**
- ✅ **No critical bugs**
- ✅ **User experience is smooth**
- ✅ **Data integrity maintained**

## 🚀 Next Steps

### **Immediate Actions** (Next 2 hours)
1. **Run API endpoint tests**
2. **Test database schema consistency**
3. **Verify component interfaces**
4. **Document any failures**

### **Short-term Actions** (Next day)
1. **Fix any identified issues**
2. **Re-run tests after fixes**
3. **Test complete user workflows**
4. **Validate schedule visualization**

### **Long-term Actions** (Next week)
1. **Implement automated testing**
2. **Add performance monitoring**
3. **Create test data sets**
4. **Set up continuous testing**

---

**Status**: 🧪 **READY FOR TESTING**  
**Priority**: **CRITICAL - MUST COMPLETE BEFORE DEPLOYMENT**  
**Timeline**: **2-4 hours for initial testing, 1-2 days for fixes**

This testing plan will identify all critical issues before production deployment and ensure the platform works correctly for all users.
