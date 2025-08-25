# Smart Sign Setup Checklist

**Complete Clerk + Supabase Integration**

## 🎯 **Phase 1: Environment Setup**

### ✅ **1. Install Dependencies**
```bash
npm install @clerk/nextjs @supabase/supabase-js svix
```

### ✅ **2. Environment Variables**
Create `.env.local`:
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 🎯 **Phase 2: Clerk Dashboard Setup**

### ✅ **3. Create Clerk Application**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Choose "Next.js" framework
4. Copy your publishable and secret keys

### ✅ **4. Configure Clerk Webhooks**
1. Go to Webhooks in Clerk dashboard
2. Create webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `organization.created`
   - `organization.updated`
   - `organization.deleted`
   - `organizationMembership.created`
   - `organizationMembership.updated`
   - `organizationMembership.deleted`
4. Copy webhook secret

## 🎯 **Phase 3: Supabase Dashboard Setup**

### ✅ **5. Create Supabase Project**
1. Go to [Supabase Dashboard](https://supabase.com)
2. Create new project
3. Copy your project URL and keys

### ✅ **6. Enable Clerk Integration in Supabase**
1. Go to Authentication → Sign-in methods → Third-party
2. Click "Add provider" → Select "Clerk"
3. Click the link to "Connect with Supabase"
4. Select your Clerk application and development instance
5. Click "Activate Supabase integration"
6. Copy the Clerk domain back to Supabase
7. Click "Create connection"

### ✅ **7. Run Database Schema**
1. Go to SQL Editor in Supabase
2. Copy and paste contents of `supabase/complete-setup.sql`
3. Run the script
4. Verify all tables, functions, and policies are created

## 🎯 **Phase 4: Test the Integration**

### ✅ **8. Test Authentication Flow**
```bash
npm run dev
# Navigate to http://localhost:3000
# Try signing up/signing in
# Verify user profile is created in Supabase
```

### ✅ **9. Test RLS Policies**
In Supabase SQL Editor, test as a specific user:
```sql
-- Replace 'user_abc123' with a real Clerk user ID
SELECT public.test_as_user('user_abc123');

-- Test RLS policies
SELECT * FROM public.test_rls();
```

### ✅ **10. Test Artist Profiles**
1. Go to `/artists` - should show artist directory
2. Go to `/artists/claim` - should show claim interface
3. Try claiming a profile (if you have admin access)

## 🎯 **Phase 5: Seed Data**

### ✅ **11. Insert Artist Profiles**
Run this SQL to insert Bakehouse artists:
```sql
-- Insert artist profiles (run this after setting up member types)
INSERT INTO public.artist_profiles (id, organization_id, name, studio_number, studio_type, studio_location, is_active)
SELECT 
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001',
  name,
  studio_number,
  studio_type,
  studio_location,
  true
FROM (VALUES
  ('Daniel Arturo Almeida', NULL, 'Associate', NULL),
  ('Susan Alvarez', '12', 'Studio', 'Studio 12'),
  ('Alyssa Andrews', NULL, 'Associate', NULL),
  ('Jason Aponte', '38', 'Studio', 'Studio 38'),
  ('Maria Theresa Barbist', '14', 'Studio', 'Studio 14'),
  ('Javier Barrera', NULL, 'Associate', NULL),
  ('Tom Bils', '46', 'Studio', 'Studio 46'),
  ('Bookleggers Library', 'A', 'Studio', 'Studio A'),
  ('Maritza Caneca', '41', 'Studio', 'Studio 41'),
  ('Lujan Candria', '8', 'Studio', 'Studio 8'),
  ('Leo Castañeda', '55', 'Studio', 'Studio 55'),
  ('Alain Castoriano', '16', 'Studio', 'Studio 16'),
  ('Beatriz Chachamovitz', '30', 'Studio', 'Studio 30'),
  ('Robert Chambers', '7U', 'Studio', 'Studio 7U'),
  ('Robert Colom', 'J', 'Studio', 'Studio J'),
  ('Nicole Combeau', '9U', 'Studio', 'Studio 9U'),
  ('Christine Cortes', NULL, 'Associate', NULL),
  ('Woosler Delisfort', '48', 'Studio', 'Studio 48'),
  ('Morel Doucet', '18', 'Studio', 'Studio 18'),
  ('Agua Dulce', NULL, 'Associate', NULL),
  ('Jenna Efrein', '58', 'Studio', 'Studio 58'),
  ('Augusto Esquivel', '4U', 'Studio', 'Studio 4U / Audrey Love Gallery'),
  ('Diana Espín', NULL, 'Associate', NULL),
  ('Diana Eusebio', '6U', 'Studio', 'Studio 6U'),
  ('Ian Fichman', '1,15', 'Studio', 'Studios 1 / 15'),
  ('Joel Gaitan', '10', 'Studio', 'Studio 10'),
  ('Gabriela Gamboa', '13', 'Studio', 'Studio 13'),
  ('Gabriela García D''Alta', '20', 'Studio', 'Studio 20'),
  ('Jose Luis García', NULL, 'Associate', NULL),
  ('Juan Pablo Garza', '1A', 'Studio', 'Studio 1A'),
  ('GeoVanna Gonzalez', '29', 'Studio', 'Studio 29'),
  ('Adler Guerrier', '11U', 'Studio', 'Studio 11U'),
  ('Maria-Alejandra Icaza Paredes', NULL, 'Associate', NULL),
  ('Maru Jensen', '33', 'Studio', 'Studio 33'),
  ('Judith Berk King', '31', 'Studio', 'Studio 31'),
  ('Katelyn Kopenhaver', '45', 'Studio', 'Studio 45'),
  ('Fabiola Larios', '40', 'Studio', 'Studio 40'),
  ('Malcolm Lauredo', '42', 'Studio', 'Studio 42'),
  ('Monique Lazard', '12', 'Studio', 'Studio 12'),
  ('Juan Ledesma', '10U', 'Studio', 'Studio 10U'),
  ('Rhea Leonard', '32', 'Studio', 'Studio 32'),
  ('Amanda Linares', NULL, 'Associate', NULL),
  ('Philip Lique', '21', 'Studio', 'Studio 21'),
  ('Tara Long', '56A', 'Studio', 'Studio 56A'),
  ('Monica Lopez de Victoria', '28', 'Studio', 'Studio 28'),
  ('Xavier Lujan', '37', 'Studio', 'Studio 37'),
  ('Juan Matos', '44', 'Studio', 'Studio 44'),
  ('Jillian Mayer', '65', 'Studio', 'Studio 65'),
  ('Cici McGonigle', '12', 'Studio', 'Studio 12'),
  ('Sean Mick', NULL, 'Associate', NULL),
  ('Pati Monclus', '25', 'Studio', 'Studio 25'),
  ('Lauren Monzón', '55', 'Studio', 'Studio 55'),
  ('Najja Moon', '1U', 'Studio', 'Studio 1U / Audrey Love Gallery'),
  ('Shawna Moulton', '33', 'Studio', 'Studio 33'),
  ('Isabela Muci', NULL, 'Associate', NULL),
  ('Cristina Muller Karger', NULL, 'Associate', NULL),
  ('Bryan Palmer', NULL, 'Associate', NULL),
  ('Christina Pettersson', '47', 'Studio', 'Studio 47'),
  ('Lee Pivnik', NULL, 'Associate', NULL),
  ('Jennifer Printz', '36', 'Studio', 'Studio 36'),
  ('Sandra Ramos', '54', 'Studio', 'Studio 54'),
  ('Sterling Rook', '26', 'Studio', 'Studio 26'),
  ('Mark Russell Jr.', NULL, 'Associate', NULL),
  ('Nicole Salcedo', '27', 'Studio', 'Studio 27'),
  ('Smita Sen', NULL, 'Associate', NULL),
  ('Carmen Smith', NULL, 'Associate', NULL),
  ('Moises Sanabria', '43', 'Studio', 'Studio 43'),
  ('Mateo Serna Zapata', '8U', 'Studio', 'Studio 8U'),
  ('Mary Ellen Scherl', '24', 'Studio', 'Studio 24'),
  ('Zoe Schweiger', '11', 'Studio', 'Studio 11'),
  ('Lauren Shapiro', '22', 'Studio', 'Studio 22'),
  ('Troy Simmons', '3', 'Studio', 'Studio 3'),
  ('Monica Sorelle', '8U', 'Studio', 'Studio 8U'),
  ('Andrea Spiridonakos', '19', 'Studio', 'Studio 19'),
  ('Clara Toro', '48', 'Studio', 'Studio 48'),
  ('Gerbi Tsesarskaia', '23', 'Studio', 'Studio 23'),
  ('Martina Tuaty', '2U', 'Studio', 'Studio 2U'),
  ('Cornelius Tulloch', '9', 'Studio', 'Studio 9'),
  ('Juana Valdes', NULL, 'Associate', NULL),
  ('Tonya Vegas', '35', 'Studio', 'Studio 35'),
  ('Tom Virgin / Extra Virgin Press', '2', 'Studio', 'Studio 2'),
  ('Pedro Wazzan', NULL, 'Associate', NULL),
  ('Valeria Yamamoto', '4', 'Studio', 'Studio 4'),
  ('Avi Young', NULL, 'Associate', NULL)
) AS v(name, studio_number, studio_type, studio_location);
```

### ✅ **12. Create Super Admin User**
After signing up with Clerk, run this SQL to make yourself a super admin:
```sql
-- Replace 'your_clerk_user_id' with your actual Clerk user ID
INSERT INTO public.org_memberships (org_id, clerk_user_id, role)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'your_clerk_user_id',
  'super_admin'
);
```

## 🎯 **Phase 6: Test Complete Flow**

### ✅ **13. Test Artist Claiming**
1. Sign in as super admin
2. Go to `/artists` - should see all artists
3. Go to `/artists/claim` - should see claim interface
4. Try claiming a profile

### ✅ **14. Test Announcements**
1. Create an announcement
2. Verify it shows as pending
3. Approve it as admin
4. Verify it shows on homepage

### ✅ **15. Test Multi-Organization**
1. Verify homepage shows multiple organizations
2. Test that users can only see their own organization's data
3. Verify RLS is working correctly

## 🎯 **Phase 7: Production Deployment**

### ✅ **16. Deploy to Production**
1. Set up production environment variables
2. Deploy to Vercel/Netlify
3. Update Clerk webhook URL to production domain
4. Test all functionality in production

### ✅ **17. Set Up Monitoring**
1. Monitor webhook deliveries in Clerk
2. Check Supabase logs for errors
3. Set up error tracking (Sentry, etc.)

## 🎯 **Troubleshooting**

### **Common Issues:**

1. **"not authorized" errors** - Check RLS policies and user roles
2. **Webhook failures** - Verify webhook secret and endpoint URL
3. **JWT not being passed** - Check Supabase client configuration
4. **User profiles not created** - Check webhook handler and database schema

### **Debug Commands:**

```sql
-- Check if user exists in memberships
SELECT * FROM public.org_memberships WHERE clerk_user_id = 'your_user_id';

-- Check RLS policies
SELECT * FROM public.test_rls();

-- Check artist profiles
SELECT * FROM public.artist_profiles WHERE organization_id = '550e8400-e29b-41d4-a716-446655440001';
```

## 🎯 **Success Criteria**

✅ **Authentication works** - Users can sign up/sign in  
✅ **RLS is enforced** - Users only see their organization's data  
✅ **Artist claiming works** - Artists can claim their profiles  
✅ **Announcements work** - Create, approve, display announcements  
✅ **Multi-org works** - Homepage shows multiple organizations  
✅ **Admin functions work** - Super admins can manage everything  

## 🎯 **Next Steps After Setup**

1. **Customize the UI** - Add your branding and styling
2. **Add more organizations** - Scale to other art communities
3. **Implement image uploads** - Add profile image functionality
4. **Add analytics** - Track engagement and usage
5. **Set up billing** - Implement subscription tiers

---

**🎉 Congratulations!** You now have a complete Smart Sign system with Clerk + Supabase integration that gives you control over communication infrastructure for multiple art organizations.
