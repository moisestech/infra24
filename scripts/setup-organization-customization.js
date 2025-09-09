const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupOrganizationCustomization() {
  try {
    console.log('🚀 Setting up organization customization system...');

    // Read the SQL file
    const fs = require('fs');
    const sqlContent = fs.readFileSync('./scripts/create-organization-customization.sql', 'utf8');

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error);
            // Continue with other statements
          } else {
            console.log(`  ✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Error executing statement ${i + 1}:`, err.message);
        }
      }
    }

    console.log('🎉 Organization customization setup completed!');

    // Verify the setup by checking if tables exist
    console.log('\n🔍 Verifying setup...');
    
    const { data: themes, error: themesError } = await supabase
      .from('organization_themes')
      .select('*')
      .limit(1);

    if (themesError) {
      console.error('❌ Error checking organization_themes table:', themesError);
    } else {
      console.log('✅ organization_themes table exists');
    }

    const { data: types, error: typesError } = await supabase
      .from('organization_announcement_types')
      .select('*')
      .limit(1);

    if (typesError) {
      console.error('❌ Error checking organization_announcement_types table:', typesError);
    } else {
      console.log('✅ organization_announcement_types table exists');
    }

    // Check if Bakehouse theme was created
    const { data: bakehouseTheme, error: bakehouseError } = await supabase
      .from('organization_themes')
      .select('*')
      .eq('organization_id', (await supabase.from('organizations').select('id').eq('slug', 'bakehouse').single()).data?.id);

    if (bakehouseError) {
      console.error('❌ Error checking Bakehouse theme:', bakehouseError);
    } else if (bakehouseTheme && bakehouseTheme.length > 0) {
      console.log('✅ Bakehouse theme created with colors:', {
        primary: bakehouseTheme[0].primary_color,
        secondary: bakehouseTheme[0].secondary_color,
        accent: bakehouseTheme[0].accent_color,
        date_text: bakehouseTheme[0].date_text_color
      });
    } else {
      console.log('⚠️  Bakehouse theme not found');
    }

    // Check if Bakehouse announcement types were created
    const { data: bakehouseTypes, error: bakehouseTypesError } = await supabase
      .from('organization_announcement_types')
      .select('*')
      .eq('organization_id', (await supabase.from('organizations').select('id').eq('slug', 'bakehouse').single()).data?.id);

    if (bakehouseTypesError) {
      console.error('❌ Error checking Bakehouse announcement types:', bakehouseTypesError);
    } else if (bakehouseTypes && bakehouseTypes.length > 0) {
      console.log('✅ Bakehouse announcement types created:', bakehouseTypes.map(t => t.type_label));
    } else {
      console.log('⚠️  Bakehouse announcement types not found');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Alternative approach: Execute SQL directly using Supabase client
async function setupOrganizationCustomizationDirect() {
  try {
    console.log('🚀 Setting up organization customization system (direct approach)...');

    // Create organization_themes table
    console.log('📝 Creating organization_themes table...');
    const { error: themesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.organization_themes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          primary_color TEXT DEFAULT '#3b82f6',
          secondary_color TEXT DEFAULT '#10b981',
          accent_color TEXT DEFAULT '#f59e0b',
          background_color TEXT DEFAULT '#ffffff',
          text_color TEXT DEFAULT '#1f2937',
          date_text_color TEXT DEFAULT '#ffffff',
          badge_color TEXT DEFAULT '#3b82f6',
          highlight_color TEXT DEFAULT '#fbbf24',
          background_pattern TEXT DEFAULT 'geometric',
          pattern_intensity DECIMAL(3,2) DEFAULT 0.3,
          pattern_color TEXT DEFAULT '#e5e7eb',
          heading_font TEXT DEFAULT 'Inter',
          body_font TEXT DEFAULT 'Inter',
          font_weight_heading TEXT DEFAULT 'bold',
          font_weight_body TEXT DEFAULT 'normal',
          card_style TEXT DEFAULT 'rounded',
          shadow_intensity DECIMAL(3,2) DEFAULT 0.1,
          border_radius DECIMAL(3,2) DEFAULT 0.5,
          animation_speed TEXT DEFAULT 'normal',
          hover_effects BOOLEAN DEFAULT true,
          transition_duration INTEGER DEFAULT 300,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(organization_id)
        );
      `
    });

    if (themesError) {
      console.error('❌ Error creating organization_themes table:', themesError);
    } else {
      console.log('✅ organization_themes table created');
    }

    // Create organization_announcement_types table
    console.log('📝 Creating organization_announcement_types table...');
    const { error: typesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.organization_announcement_types (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          type_key TEXT NOT NULL,
          type_label TEXT NOT NULL,
          type_description TEXT,
          icon_name TEXT,
          color TEXT DEFAULT '#3b82f6',
          background_color TEXT DEFAULT '#f3f4f6',
          text_color TEXT DEFAULT '#1f2937',
          priority INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          is_public BOOLEAN DEFAULT true,
          requires_approval BOOLEAN DEFAULT false,
          show_in_carousel BOOLEAN DEFAULT true,
          show_in_list BOOLEAN DEFAULT true,
          show_in_dashboard BOOLEAN DEFAULT true,
          is_promotional BOOLEAN DEFAULT false,
          is_fun_fact BOOLEAN DEFAULT true,
          is_urgent BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(organization_id, type_key)
        );
      `
    });

    if (typesError) {
      console.error('❌ Error creating organization_announcement_types table:', typesError);
    } else {
      console.log('✅ organization_announcement_types table created');
    }

    // Get Bakehouse organization ID
    const { data: bakehouseOrg, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', 'bakehouse')
      .single();

    if (orgError || !bakehouseOrg) {
      console.error('❌ Error finding Bakehouse organization:', orgError);
      return;
    }

    console.log('🏢 Found Bakehouse organization:', bakehouseOrg.id);

    // Insert Bakehouse theme
    console.log('🎨 Inserting Bakehouse theme...');
    const { error: themeInsertError } = await supabase
      .from('organization_themes')
      .upsert({
        organization_id: bakehouseOrg.id,
        primary_color: '#1e40af', // Bright primary blue
        secondary_color: '#dc2626', // Bright primary red
        accent_color: '#fbbf24', // Bright yellow
        date_text_color: '#fbbf24', // Bright yellow for dates
        badge_color: '#1e40af', // Blue for badges
        highlight_color: '#fbbf24', // Yellow for highlights
        background_pattern: 'bauhaus', // Bauhaus pattern
        pattern_intensity: 0.4, // Medium intensity
        pattern_color: '#e5e7eb', // Light gray pattern
        card_style: 'rounded', // Rounded cards
        shadow_intensity: 0.15, // Slightly more shadow
        border_radius: 0.75 // More rounded corners
      });

    if (themeInsertError) {
      console.error('❌ Error inserting Bakehouse theme:', themeInsertError);
    } else {
      console.log('✅ Bakehouse theme inserted');
    }

    // Insert Bakehouse announcement types
    console.log('📢 Inserting Bakehouse announcement types...');
    const announcementTypes = [
      {
        organization_id: bakehouseOrg.id,
        type_key: 'attention_artists',
        type_label: 'Attention Artists',
        type_description: 'Important announcements specifically for artists',
        icon_name: 'Palette',
        color: '#1e40af',
        background_color: '#dbeafe',
        text_color: '#1e40af',
        priority: 10,
        is_promotional: false,
        is_fun_fact: false,
        is_urgent: false
      },
      {
        organization_id: bakehouseOrg.id,
        type_key: 'attention_public',
        type_label: 'Attention Public',
        type_description: 'Important announcements for the general public',
        icon_name: 'Users',
        color: '#dc2626',
        background_color: '#fee2e2',
        text_color: '#dc2626',
        priority: 9,
        is_promotional: false,
        is_fun_fact: false,
        is_urgent: false
      },
      {
        organization_id: bakehouseOrg.id,
        type_key: 'fun_fact',
        type_label: 'Fun Fact',
        type_description: 'Interesting facts about Bakehouse history and community',
        icon_name: 'Lightbulb',
        color: '#fbbf24',
        background_color: '#fef3c7',
        text_color: '#92400e',
        priority: 5,
        is_promotional: false,
        is_fun_fact: true,
        is_urgent: false
      },
      {
        organization_id: bakehouseOrg.id,
        type_key: 'promotion',
        type_label: 'Promotion',
        type_description: 'Special promotions, events, and announcements',
        icon_name: 'Gift',
        color: '#7c3aed',
        background_color: '#ede9fe',
        text_color: '#7c3aed',
        priority: 8,
        is_promotional: true,
        is_fun_fact: false,
        is_urgent: false
      },
      {
        organization_id: bakehouseOrg.id,
        type_key: 'gala_announcement',
        type_label: 'Gala Announcement',
        type_description: 'Special announcements about the annual gala',
        icon_name: 'Crown',
        color: '#dc2626',
        background_color: '#fee2e2',
        text_color: '#dc2626',
        priority: 15,
        is_promotional: true,
        is_fun_fact: false,
        is_urgent: true
      }
    ];

    const { error: typesInsertError } = await supabase
      .from('organization_announcement_types')
      .upsert(announcementTypes);

    if (typesInsertError) {
      console.error('❌ Error inserting Bakehouse announcement types:', typesInsertError);
    } else {
      console.log('✅ Bakehouse announcement types inserted');
    }

    // Insert sample announcements
    console.log('📝 Inserting sample announcements...');
    const sampleAnnouncements = [
      {
        id: crypto.randomUUID(),
        org_id: bakehouseOrg.id,
        author_clerk_id: 'system',
        title: 'Did you know Bakehouse used to make Merita Bread?',
        body: 'Before becoming Miami\'s premier artist community, the Bakehouse Art Complex was originally a commercial bakery that produced Merita Bread. The building\'s industrial architecture and large open spaces made it perfect for conversion into artist studios and galleries. This rich history is part of what makes Bakehouse such a unique and inspiring place for artists to create and collaborate.',
        type: 'fun_fact',
        sub_type: 'historical',
        status: 'published',
        priority: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['history', 'merita', 'bread', 'bakery', 'fun_fact'],
        visibility: 'both',
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        org_id: bakehouseOrg.id,
        author_clerk_id: 'system',
        title: 'Did you know our Birthday is coming up? We accept gifts!',
        body: 'Bakehouse Art Complex is celebrating another year of supporting Miami\'s vibrant arts community! As we approach our anniversary, we\'re grateful for the incredible artists, supporters, and community members who make this place special. If you\'d like to show your support, we welcome donations, sponsorships, and of course, your continued participation in our community events and programs.',
        type: 'promotion',
        sub_type: 'gala',
        status: 'published',
        priority: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['birthday', 'anniversary', 'gala', 'gifts', 'donations', 'celebration'],
        visibility: 'both',
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { error: announcementsInsertError } = await supabase
      .from('announcements')
      .upsert(sampleAnnouncements);

    if (announcementsInsertError) {
      console.error('❌ Error inserting sample announcements:', announcementsInsertError);
    } else {
      console.log('✅ Sample announcements inserted');
    }

    console.log('🎉 Organization customization setup completed successfully!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupOrganizationCustomizationDirect();
