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

async function setupTables() {
  console.log('🚀 Setting up Infra24 tables...');

  try {
    // 1. Insert sample organizations
    console.log('🏢 Creating sample organizations...');
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .upsert([
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
      ], { onConflict: 'slug' })
      .select();

    if (orgError) {
      console.error('❌ Error creating organizations:', orgError);
    } else {
      console.log('✅ Organizations created/updated');
    }

    // 2. Get organization IDs
    const { data: organizations } = await supabase
      .from('organizations')
      .select('id, slug')
      .in('slug', ['bakehouse', 'oolite']);

    if (!organizations || organizations.length === 0) {
      console.error('❌ No organizations found');
      return;
    }

    // 3. Create sample resources
    console.log('📦 Creating sample resources...');
    const resources = [];
    
    for (const org of organizations) {
      resources.push(
        {
          organization_id: org.id,
          type: 'workshop',
          title: 'AI Art Fundamentals',
          description: 'Learn the basics of AI-generated art and creative tools',
          category: 'Digital Art',
          capacity: 15,
          duration_minutes: 120,
          price: 50.00,
          currency: 'USD',
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
          currency: 'USD',
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
          currency: 'USD',
          location: 'Digital Lab',
          requirements: ['Valid ID', 'Lab orientation'],
          created_by: 'system',
          updated_by: 'system'
        }
      );
    }

    const { error: resourceError } = await supabase
      .from('resources')
      .insert(resources);

    if (resourceError) {
      console.error('❌ Error creating resources:', resourceError);
    } else {
      console.log('✅ Resources created');
    }

    // 4. Create sample submission forms
    console.log('📝 Creating sample submission forms...');
    const forms = [];
    
    for (const org of organizations) {
      forms.push(
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
      );
    }

    const { error: formError } = await supabase
      .from('submission_forms')
      .insert(forms);

    if (formError) {
      console.error('❌ Error creating submission forms:', formError);
    } else {
      console.log('✅ Submission forms created');
    }

    console.log('🎉 Setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Organizations: Created with sample data');
    console.log('- Resources: Workshops, equipment, and spaces');
    console.log('- Submission Forms: Artist residency and workshop proposals');
    console.log('\n🔗 Next steps:');
    console.log('1. Test the booking and submission systems');
    console.log('2. Set up Row Level Security (RLS) policies');
    console.log('3. Create API endpoints for frontend integration');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupTables();
