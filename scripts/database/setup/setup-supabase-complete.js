const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSupabase() {
  console.log('🚀 Setting up complete Supabase database for Infra24...');

  try {
    // 1. Create organizations table
    console.log('📋 Creating organizations table...');
    const { error: orgError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS organizations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          website TEXT,
          email TEXT,
          phone TEXT,
          address TEXT,
          city TEXT,
          state TEXT,
          zip_code TEXT,
          country TEXT DEFAULT 'US',
          logo_url TEXT,
          favicon_url TEXT,
          theme JSONB DEFAULT '{}',
          settings JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (orgError) {
      console.error('❌ Error creating organizations table:', orgError);
    } else {
      console.log('✅ Organizations table created');
    }

    // 2. Create org_memberships table
    console.log('👥 Creating org_memberships table...');
    const { error: membershipError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS org_memberships (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member', 'viewer')),
          permissions JSONB DEFAULT '{}',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT true,
          UNIQUE(organization_id, user_id)
        );
      `
    });

    if (membershipError) {
      console.error('❌ Error creating org_memberships table:', membershipError);
    } else {
      console.log('✅ Org memberships table created');
    }

    // 3. Create artist_profiles table
    console.log('🎨 Creating artist_profiles table...');
    const { error: artistError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS artist_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          bio TEXT,
          website TEXT,
          instagram TEXT,
          twitter TEXT,
          facebook TEXT,
          portfolio_url TEXT,
          avatar_url TEXT,
          cover_image_url TEXT,
          skills TEXT[],
          mediums TEXT[],
          location TEXT,
          is_public BOOLEAN DEFAULT true,
          is_featured BOOLEAN DEFAULT false,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(organization_id, user_id)
        );
      `
    });

    if (artistError) {
      console.error('❌ Error creating artist_profiles table:', artistError);
    } else {
      console.log('✅ Artist profiles table created');
    }

    // 4. Create resources table
    console.log('📦 Creating resources table...');
    const { error: resourceError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS resources (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          type TEXT NOT NULL CHECK (type IN ('workshop', 'equipment', 'space', 'event')),
          title TEXT NOT NULL,
          description TEXT,
          category TEXT,
          capacity INTEGER DEFAULT 1,
          duration_minutes INTEGER,
          price DECIMAL(10,2) DEFAULT 0.00,
          currency TEXT DEFAULT 'USD',
          location TEXT,
          requirements TEXT[],
          availability_rules JSONB DEFAULT '{}',
          metadata JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by TEXT NOT NULL,
          updated_by TEXT NOT NULL
        );
      `
    });

    if (resourceError) {
      console.error('❌ Error creating resources table:', resourceError);
    } else {
      console.log('✅ Resources table created');
    }

    // 5. Create bookings table
    console.log('📅 Creating bookings table...');
    const { error: bookingError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL,
          resource_type TEXT NOT NULL CHECK (resource_type IN ('workshop', 'equipment', 'space', 'event')),
          resource_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          start_time TIMESTAMP WITH TIME ZONE NOT NULL,
          end_time TIMESTAMP WITH TIME ZONE NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
          capacity INTEGER DEFAULT 1,
          current_participants INTEGER DEFAULT 0,
          price DECIMAL(10,2) DEFAULT 0.00,
          currency TEXT DEFAULT 'USD',
          location TEXT,
          requirements TEXT[],
          notes TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by TEXT NOT NULL,
          updated_by TEXT NOT NULL
        );
      `
    });

    if (bookingError) {
      console.error('❌ Error creating bookings table:', bookingError);
    } else {
      console.log('✅ Bookings table created');
    }

    // 6. Create booking_participants table
    console.log('👥 Creating booking_participants table...');
    const { error: participantError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS booking_participants (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'waitlisted', 'no_show')),
          registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          confirmed_at TIMESTAMP WITH TIME ZONE,
          cancelled_at TIMESTAMP WITH TIME ZONE,
          notes TEXT,
          metadata JSONB DEFAULT '{}',
          UNIQUE(booking_id, user_id)
        );
      `
    });

    if (participantError) {
      console.error('❌ Error creating booking_participants table:', participantError);
    } else {
      console.log('✅ Booking participants table created');
    }

    // 7. Create submission_forms table
    console.log('📝 Creating submission_forms table...');
    const { error: formError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS submission_forms (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL CHECK (type IN ('application', 'proposal', 'content', 'feedback', 'survey', 'custom')),
          category TEXT,
          form_schema JSONB NOT NULL DEFAULT '{}',
          validation_rules JSONB DEFAULT '{}',
          submission_settings JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          is_public BOOLEAN DEFAULT false,
          requires_authentication BOOLEAN DEFAULT true,
          max_submissions_per_user INTEGER,
          submission_deadline TIMESTAMP WITH TIME ZONE,
          review_deadline TIMESTAMP WITH TIME ZONE,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by TEXT NOT NULL,
          updated_by TEXT NOT NULL
        );
      `
    });

    if (formError) {
      console.error('❌ Error creating submission_forms table:', formError);
    } else {
      console.log('✅ Submission forms table created');
    }

    // 8. Create submissions table
    console.log('📄 Creating submissions table...');
    const { error: submissionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS submissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          form_id UUID NOT NULL REFERENCES submission_forms(id) ON DELETE CASCADE,
          user_id TEXT,
          submitter_name TEXT,
          submitter_email TEXT,
          submitter_phone TEXT,
          title TEXT NOT NULL,
          content JSONB NOT NULL DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision', 'withdrawn')),
          priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
          review_notes TEXT,
          reviewer_id TEXT,
          reviewed_at TIMESTAMP WITH TIME ZONE,
          score DECIMAL(5,2),
          tags TEXT[],
          attachments JSONB DEFAULT '[]',
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          submitted_at TIMESTAMP WITH TIME ZONE
        );
      `
    });

    if (submissionError) {
      console.error('❌ Error creating submissions table:', submissionError);
    } else {
      console.log('✅ Submissions table created');
    }

    // 9. Create announcements table (if not exists)
    console.log('📢 Creating announcements table...');
    const { error: announcementError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS announcements (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          content TEXT,
          type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'event', 'workshop', 'exhibition', 'fun_fact', 'news')),
          priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
          visibility TEXT DEFAULT 'internal' CHECK (visibility IN ('internal', 'public', 'members_only')),
          start_date TIMESTAMP WITH TIME ZONE,
          end_date TIMESTAMP WITH TIME ZONE,
          location TEXT,
          key_people JSONB DEFAULT '[]',
          metadata JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by TEXT NOT NULL,
          updated_by TEXT NOT NULL
        );
      `
    });

    if (announcementError) {
      console.error('❌ Error creating announcements table:', announcementError);
    } else {
      console.log('✅ Announcements table created');
    }

    // 10. Insert sample organizations
    console.log('🏢 Inserting sample organizations...');
    const organizations = [
      {
        name: 'Bakehouse Art Complex',
        slug: 'bakehouse',
        description: 'A contemporary art complex supporting emerging and established artists',
        website: 'https://bakehouseartcomplex.org',
        email: 'info@bakehouseartcomplex.org',
        city: 'Miami',
        state: 'FL',
        theme: {
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          background: '#F7FFF7',
          text: '#2C3E50'
        }
      },
      {
        name: 'Oolite Arts',
        slug: 'oolite',
        description: 'Supporting artists and building community through contemporary art',
        website: 'https://oolitearts.org',
        email: 'info@oolitearts.org',
        city: 'Miami',
        state: 'FL',
        theme: {
          primary: '#007BFF',
          secondary: '#6C757D',
          accent: '#FFC107',
          background: '#F8F9FA',
          text: '#343A40'
        }
      }
    ];

    for (const org of organizations) {
      const { error: insertError } = await supabase
        .from('organizations')
        .upsert(org, { onConflict: 'slug' });

      if (insertError) {
        console.error(`❌ Error inserting organization ${org.slug}:`, insertError);
      } else {
        console.log(`✅ Organization ${org.slug} inserted/updated`);
      }
    }

    // 11. Insert sample resources
    console.log('📦 Inserting sample resources...');
    const { data: orgs } = await supabase.from('organizations').select('id, slug');
    
    if (orgs) {
      for (const org of orgs) {
        const resources = [
          {
            organization_id: org.id,
            type: 'workshop',
            title: 'AI Art Fundamentals',
            description: 'Learn the basics of AI-generated art and creative tools',
            category: 'Digital Art',
            capacity: 15,
            duration_minutes: 120,
            price: 50.00,
            location: 'Digital Lab',
            requirements: ['Laptop', 'Internet connection', 'Basic computer skills'],
            created_by: 'system',
            updated_by: 'system'
          },
          {
            organization_id: org.id,
            type: 'equipment',
            title: '3D Printer - Prusa i3 MK3S+',
            description: 'High-quality 3D printer for prototyping and art projects',
            category: 'Fabrication',
            capacity: 1,
            duration_minutes: 180,
            price: 25.00,
            location: 'Fabrication Lab',
            requirements: ['3D modeling software', 'Safety glasses'],
            created_by: 'system',
            updated_by: 'system'
          },
          {
            organization_id: org.id,
            type: 'space',
            title: 'Digital Lab',
            description: 'Collaborative workspace with high-end computers and software',
            category: 'Workspace',
            capacity: 12,
            duration_minutes: 60,
            price: 15.00,
            location: 'Digital Lab',
            requirements: ['Valid ID', 'Lab orientation'],
            created_by: 'system',
            updated_by: 'system'
          }
        ];

        for (const resource of resources) {
          const { error: resourceInsertError } = await supabase
            .from('resources')
            .insert(resource);

          if (resourceInsertError) {
            console.error(`❌ Error inserting resource for ${org.slug}:`, resourceInsertError);
          } else {
            console.log(`✅ Resource inserted for ${org.slug}`);
          }
        }
      }
    }

    // 12. Insert sample submission forms
    console.log('📝 Inserting sample submission forms...');
    if (orgs) {
      for (const org of orgs) {
        const forms = [
          {
            organization_id: org.id,
            title: 'Artist Residency Application',
            description: 'Apply for our artist residency program',
            type: 'application',
            category: 'Residency',
            form_schema: {
              fields: [
                { name: 'name', type: 'text', label: 'Full Name', required: true },
                { name: 'email', type: 'email', label: 'Email', required: true },
                { name: 'portfolio', type: 'url', label: 'Portfolio Website', required: true },
                { name: 'statement', type: 'textarea', label: 'Artist Statement', required: true },
                { name: 'project_proposal', type: 'textarea', label: 'Project Proposal', required: true }
              ]
            },
            is_public: true,
            requires_authentication: false,
            created_by: 'system',
            updated_by: 'system'
          },
          {
            organization_id: org.id,
            title: 'Workshop Proposal',
            description: 'Propose a new workshop for our community',
            type: 'proposal',
            category: 'Education',
            form_schema: {
              fields: [
                { name: 'workshop_title', type: 'text', label: 'Workshop Title', required: true },
                { name: 'description', type: 'textarea', label: 'Description', required: true },
                { name: 'duration', type: 'number', label: 'Duration (hours)', required: true },
                { name: 'max_participants', type: 'number', label: 'Max Participants', required: true },
                { name: 'materials_needed', type: 'textarea', label: 'Materials Needed', required: false }
              ]
            },
            is_public: true,
            requires_authentication: true,
            created_by: 'system',
            updated_by: 'system'
          }
        ];

        for (const form of forms) {
          const { error: formInsertError } = await supabase
            .from('submission_forms')
            .insert(form);

          if (formInsertError) {
            console.error(`❌ Error inserting form for ${org.slug}:`, formInsertError);
          } else {
            console.log(`✅ Form inserted for ${org.slug}`);
          }
        }
      }
    }

    console.log('🎉 Supabase setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Organizations: Created with sample data');
    console.log('- Resources: Workshops, equipment, and spaces');
    console.log('- Submission Forms: Artist residency and workshop proposals');
    console.log('- All tables: Created with proper relationships and constraints');
    console.log('\n🔗 Next steps:');
    console.log('1. Set up Row Level Security (RLS) policies');
    console.log('2. Create API endpoints for frontend integration');
    console.log('3. Test the booking and submission systems');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupSupabase();
