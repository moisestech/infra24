# Tipping and Donation System - Step-by-Step Guide

## 🎯 **Overview**

The Infra24 platform now includes a comprehensive tipping and donation system that allows:
- **Artist Tipping**: Support individual artists with one-time tips
- **Organization Donations**: Support organizations with one-time or recurring donations
- **Booking Integration**: Bookings are per artist with instructor assignment
- **Multi-tenant Support**: Works across all organization tenants

## 📋 **Step-by-Step Implementation**

### **Step 1: Database Setup**

1. **Run the Migration File**
   ```bash
   # Copy the migration file to your Supabase dashboard
   # File: scripts/database/migrations/20241220000001_create_infra24_tables.sql
   ```

2. **Execute in Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the migration file content
   - Click "Run" to execute

3. **Verify Tables Created**
   - `artist_tips` - For individual artist tips
   - `organization_donations` - For organization donations
   - `resources` - For booking resources (workshops, equipment, spaces)
   - `bookings` - For artist-specific bookings
   - `booking_participants` - For multi-participant bookings

### **Step 2: Artist Tipping System**

#### **2.1 Tip Button Component**
- **Location**: `components/ui/TipButton.tsx`
- **Features**:
  - Pre-set tip amounts ($5, $10, $25, $50, $100)
  - Custom amount input
  - Optional message (500 characters max)
  - Anonymous tipping option
  - Real-time total calculation

#### **2.2 Integration Points**
- **Artist Profile Pages**: `/artists/[id]`
- **Workshop Pages**: When viewing artist-led workshops
- **Booking Pages**: After booking with an artist

#### **2.3 API Endpoints**
- **POST** `/api/tips` - Create a new tip
- **GET** `/api/tips?org_id=X&artist_id=Y` - Get tips for organization/artist

#### **2.4 Usage Example**
```tsx
import { TipButton } from '@/components/ui/TipButton';

<TipButton
  artistId="artist-123"
  artistName="Sarah Johnson"
  organizationId="bakehouse"
  onTipSubmitted={(tip) => console.log('Tip submitted:', tip)}
/>
```

### **Step 3: Organization Donation System**

#### **3.1 Donation Button Component**
- **Location**: `components/ui/DonateButton.tsx`
- **Features**:
  - Pre-set donation amounts ($25, $50, $100, $250, $500)
  - Custom amount input
  - Recurring donation options (monthly, quarterly, yearly)
  - Optional message (500 characters max)
  - Anonymous donation option

#### **3.2 Integration Points**
- **Organization Homepages**: `/o/[slug]`
- **About Pages**: Organization information pages
- **Event Pages**: After attending organization events

#### **3.3 API Endpoints**
- **POST** `/api/donations` - Create a new donation
- **GET** `/api/donations?org_id=X` - Get donations for organization

#### **3.4 Usage Example**
```tsx
import { DonateButton } from '@/components/ui/DonateButton';

<DonateButton
  organizationId="oolite"
  organizationName="Oolite Arts"
  onDonationSubmitted={(donation) => console.log('Donation submitted:', donation)}
/>
```

### **Step 4: Artist-Specific Booking System**

#### **4.1 Booking Form Features**
- **Location**: `components/booking/BookingForm.tsx`
- **Artist Integration**:
  - Instructor selection from organization artists
  - Artist skills and mediums display
  - Artist bio and contact information
  - Per-artist booking capacity

#### **4.2 Booking Flow**
1. **Select Resource**: Choose workshop, equipment, or space
2. **Select Artist**: Choose instructor from available artists
3. **Set Details**: Date, time, capacity, requirements
4. **Contact Info**: Name, email, phone for booking
5. **Submit**: Create booking with artist assignment

#### **4.3 Database Schema**
```sql
-- Bookings are linked to artists via instructor_id
bookings (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  instructor_id TEXT, -- Artist profile ID
  resource_type TEXT, -- workshop, equipment, space, event
  title TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  capacity INTEGER,
  current_participants INTEGER,
  -- ... other fields
)
```

### **Step 5: Multi-tenant Integration**

#### **5.1 Tenant-Specific Features**
- **Bakehouse**: Artist tipping, equipment booking
- **Oolite**: Artist tipping, workshop booking, donations
- **Edge Zones**: Artist tipping, space booking
- **Locust Projects**: Artist tipping, event booking

#### **5.2 Organization Pages**
Each organization gets:
- **Donation Button**: Fixed position on all pages
- **Artist Integration**: All bookings require artist assignment
- **Tip Buttons**: On artist profile pages

### **Step 6: Payment Integration (Future)**

#### **6.1 Stripe Integration**
- **Payment Intents**: For one-time tips and donations
- **Subscriptions**: For recurring donations
- **Webhooks**: For payment status updates

#### **6.2 Implementation Steps**
1. Set up Stripe account
2. Add Stripe keys to environment variables
3. Create payment processing endpoints
4. Add webhook handlers for status updates
5. Update tip/donation status based on payment

### **Step 7: Analytics and Reporting**

#### **7.1 Tip Analytics**
- Total tips per artist
- Average tip amount
- Tip frequency
- Anonymous vs. named tips

#### **7.2 Donation Analytics**
- Total donations per organization
- Recurring vs. one-time donations
- Donation trends over time
- Donor retention rates

#### **7.3 Booking Analytics**
- Bookings per artist
- Most popular resources
- Booking completion rates
- Artist utilization rates

## 🚀 **Current Implementation Status**

### **✅ Completed**
- [x] Database schema with tipping and donation tables
- [x] Tip button component with full functionality
- [x] Donation button component with recurring options
- [x] Artist integration in booking system
- [x] API endpoints for tips and donations
- [x] Multi-tenant support
- [x] Mock data system for testing

### **🔄 In Progress**
- [ ] Payment processing integration (Stripe)
- [ ] Email notifications for tips/donations
- [ ] Analytics dashboard for tips/donations
- [ ] Admin panel for managing tips/donations

### **📋 Next Steps**
1. **Set up Supabase tables** using the migration file
2. **Test the mock data system** to ensure everything works
3. **Integrate Stripe** for payment processing
4. **Add email notifications** for successful tips/donations
5. **Create analytics dashboard** for tracking performance

## 🧪 **Testing the System**

### **Test Artist Tipping**
1. Go to any artist profile: `/artists/[id]`
2. Click the "Tip [Artist Name]" button
3. Select amount or enter custom amount
4. Add optional message
5. Choose anonymous or named tip
6. Submit tip (currently creates record, no payment processing)

### **Test Organization Donations**
1. Go to organization homepage: `/o/oolite`
2. Click the "Donate to [Organization]" button (bottom right)
3. Select amount or enter custom amount
4. Choose one-time or recurring donation
5. Add optional message
6. Choose anonymous or named donation
7. Submit donation (currently creates record, no payment processing)

### **Test Artist Bookings**
1. Go to organization bookings page: `/o/oolite/bookings`
2. Click "Create New Booking"
3. Select resource (workshop, equipment, space)
4. Choose artist instructor
5. Set date, time, and details
6. Add contact information
7. Submit booking

## 📊 **Database Tables Overview**

### **artist_tips**
```sql
CREATE TABLE artist_tips (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  artist_profile_id UUID REFERENCES artist_profiles(id),
  tipper_id TEXT, -- Clerk user ID
  amount DECIMAL(10,2),
  message TEXT,
  is_anonymous BOOLEAN,
  status TEXT, -- pending, completed, failed, refunded
  payment_intent_id TEXT, -- Stripe payment intent
  created_at TIMESTAMP
);
```

### **organization_donations**
```sql
CREATE TABLE organization_donations (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  donor_id TEXT, -- Clerk user ID
  amount DECIMAL(10,2),
  message TEXT,
  is_anonymous BOOLEAN,
  is_recurring BOOLEAN,
  recurring_frequency TEXT, -- monthly, quarterly, yearly
  status TEXT, -- pending, completed, failed, refunded, cancelled
  payment_intent_id TEXT, -- Stripe payment intent
  subscription_id TEXT, -- For recurring donations
  created_at TIMESTAMP
);
```

### **bookings (Artist Integration)**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  instructor_id TEXT, -- Artist profile ID
  resource_type TEXT, -- workshop, equipment, space, event
  title TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  capacity INTEGER,
  current_participants INTEGER,
  -- ... other fields
);
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe (for future payment integration)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### **Organization Configuration**
Each organization can configure:
- **Tip amounts**: Custom preset amounts
- **Donation amounts**: Custom preset amounts
- **Recurring options**: Which frequencies to offer
- **Anonymous options**: Whether to allow anonymous tips/donations

## 📱 **Mobile Responsiveness**

Both tip and donation buttons are fully responsive:
- **Desktop**: Full modal with all options
- **Mobile**: Optimized layout with touch-friendly buttons
- **Tablet**: Adaptive layout for medium screens

## 🎨 **Customization**

### **Styling**
- **Tip Button**: Pink to red gradient
- **Donation Button**: Blue to purple gradient
- **Customizable**: Colors, sizes, and positioning

### **Content**
- **Messages**: Customizable placeholder text
- **Amounts**: Configurable preset amounts
- **Options**: Toggle features on/off per organization

## 🚨 **Error Handling**

The system includes comprehensive error handling:
- **Validation**: Amount validation, required field checks
- **API Errors**: Graceful fallbacks for failed requests
- **User Feedback**: Clear error messages and success confirmations
- **Logging**: Console logging for debugging

## 📈 **Performance**

- **Lazy Loading**: Components load only when needed
- **Optimistic Updates**: UI updates immediately, syncs with server
- **Caching**: API responses cached for better performance
- **Debouncing**: Input validation debounced to prevent excessive API calls

This comprehensive system provides a complete solution for artist tipping, organization donations, and artist-specific bookings across the multi-tenant Infra24 platform.

