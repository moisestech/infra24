#!/usr/bin/env node

/**
 * Supabase Setup Script for Infra24
 * This script helps set up the Supabase project with all necessary configurations
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupSupabase() {
  console.log('🚀 Starting Supabase setup for Infra24...\n');

  try {
    // Step 1: Read and execute migrations
    console.log('📋 Step 1: Setting up database schema...');
    const migrationsPath = path.join(__dirname, '..', 'docs', 'technical', 'SUPABASE_MIGRATIONS.sql');
    
    if (!fs.existsSync(migrationsPath)) {
      console.error('❌ Migration file not found:', migrationsPath);
      process.exit(1);
    }

    const migrations = fs.readFileSync(migrationsPath, 'utf8');
    
    // Split migrations by comments and execute them
    const migrationBlocks = migrations.split('-- Migration').filter(block => block.trim());
    
    for (let i = 0; i < migrationBlocks.length; i++) {
      const block = migrationBlocks[i];
      if (block.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: block });
          if (error) {
            console.warn(`⚠️  Warning in migration ${i + 1}:`, error.message);
          } else {
            console.log(`✅ Migration ${i + 1} completed`);
          }
        } catch (err) {
          console.warn(`⚠️  Warning in migration ${i + 1}:`, err.message);
        }
      }
    }

    // Step 2: Create default organizations
    console.log('\n🏢 Step 2: Creating default organizations...');
    const organizations = [
      {
        name: 'Bakehouse Art Complex',
        slug: 'bakehouse',
        domain: 'bakehouse.digital',
        subdomain: 'bakehouse',
        primary_color: '#8B4513',
        secondary_color: '#D2691E',
        accent_color: '#CD853F',
        features: {
          smartSign: true,
          bookings: true,
          submissions: true,
          analytics: true,
          workshops: true,
          calendar: true
        }
      },
      {
        name: 'Oolite Arts',
        slug: 'oolite',
        domain: 'oolite.digital',
        subdomain: 'oolite',
        primary_color: '#1E40AF',
        secondary_color: '#3B82F6',
        accent_color: '#60A5FA',
        features: {
          smartSign: true,
          bookings: true,
          submissions: true,
          analytics: true,
          workshops: true,
          calendar: true
        }
      },
      {
        name: 'Edge Zones',
        slug: 'edgezones',
        domain: 'edgezones.digital',
        subdomain: 'edgezones',
        primary_color: '#DC2626',
        secondary_color: '#EF4444',
        accent_color: '#F87171',
        features: {
          smartSign: true,
          bookings: false,
          submissions: true,
          analytics: true,
          workshops: false,
          calendar: false
        }
      },
      {
        name: 'Locust Projects',
        slug: 'locust',
        domain: 'locust.digital',
        subdomain: 'locust',
        primary_color: '#059669',
        secondary_color: '#10B981',
        accent_color: '#34D399',
        features: {
          smartSign: true,
          bookings: true,
          submissions: true,
          analytics: true,
          workshops: true,
          calendar: true
        }
      },
      {
        name: 'AI24',
        slug: 'ai24',
        domain: 'ai24.digital',
        subdomain: 'ai24',
        primary_color: '#7C3AED',
        secondary_color: '#8B5CF6',
        accent_color: '#A78BFA',
        features: {
          smartSign: false,
          bookings: false,
          submissions: false,
          analytics: true,
          workshops: true,
          calendar: false
        }
      }
    ];

    for (const org of organizations) {
      const { data, error } = await supabase
        .from('organizations')
        .upsert(org, { onConflict: 'slug' })
        .select();

      if (error) {
        console.warn(`⚠️  Warning creating organization ${org.name}:`, error.message);
      } else {
        console.log(`✅ Organization created: ${org.name}`);
      }
    }

    // Step 3: Create sample resources
    console.log('\n🔧 Step 3: Creating sample resources...');
    const { data: orgs } = await supabase.from('organizations').select('id, slug');
    
    if (orgs) {
      for (const org of orgs) {
        const resources = [
          {
            organization_id: org.id,
            name: '3D Printer A',
            type: 'equipment',
            description: 'High-resolution 3D printer for prototyping',
            capacity: 1,
            location: 'Digital Lab',
            settings: {
              material_types: ['PLA', 'ABS', 'PETG'],
              max_print_size: '200x200x200mm'
            }
          },
          {
            organization_id: org.id,
            name: 'Workstation 1',
            type: 'computer',
            description: 'High-performance workstation for digital art',
            capacity: 1,
            location: 'Digital Lab',
            settings: {
              specs: {
                cpu: 'Intel i7',
                ram: '32GB',
                gpu: 'RTX 4070'
              }
            }
          },
          {
            organization_id: org.id,
            name: 'Conference Room',
            type: 'space',
            description: 'Meeting and presentation space',
            capacity: 12,
            location: 'Main Building',
            settings: {
              amenities: ['projector', 'whiteboard', 'video_conferencing']
            }
          }
        ];

        for (const resource of resources) {
          const { error } = await supabase
            .from('resources')
            .upsert(resource, { onConflict: 'id' });

          if (error) {
            console.warn(`⚠️  Warning creating resource for ${org.slug}:`, error.message);
          } else {
            console.log(`✅ Resource created for ${org.slug}: ${resource.name}`);
          }
        }
      }
    }

    // Step 4: Create sample forms
    console.log('\n📝 Step 4: Creating sample forms...');
    if (orgs) {
      for (const org of orgs) {
        const forms = [
          {
            organization_id: org.id,
            title: 'Artist Residency Application',
            description: 'Application form for artist residency program',
            fields: [
              {
                name: 'full_name',
                type: 'text',
                label: 'Full Name',
                required: true
              },
              {
                name: 'email',
                type: 'email',
                label: 'Email Address',
                required: true
              },
              {
                name: 'portfolio_url',
                type: 'url',
                label: 'Portfolio Website',
                required: false
              },
              {
                name: 'project_description',
                type: 'textarea',
                label: 'Project Description',
                required: true
              },
              {
                name: 'resume',
                type: 'file',
                label: 'Resume/CV',
                required: true
              }
            ],
            settings: {
              allow_anonymous: false,
              auto_approve: false
            }
          },
          {
            organization_id: org.id,
            title: 'Workshop Registration',
            description: 'Registration form for workshops and events',
            fields: [
              {
                name: 'name',
                type: 'text',
                label: 'Full Name',
                required: true
              },
              {
                name: 'email',
                type: 'email',
                label: 'Email Address',
                required: true
              },
              {
                name: 'phone',
                type: 'tel',
                label: 'Phone Number',
                required: false
              },
              {
                name: 'experience_level',
                type: 'select',
                label: 'Experience Level',
                options: ['Beginner', 'Intermediate', 'Advanced'],
                required: true
              },
              {
                name: 'dietary_restrictions',
                type: 'textarea',
                label: 'Dietary Restrictions (if applicable)',
                required: false
              }
            ],
            settings: {
              allow_anonymous: true,
              auto_approve: true
            }
          }
        ];

        for (const form of forms) {
          const { error } = await supabase
            .from('forms')
            .upsert(form, { onConflict: 'id' });

          if (error) {
            console.warn(`⚠️  Warning creating form for ${org.slug}:`, error.message);
          } else {
            console.log(`✅ Form created for ${org.slug}: ${form.title}`);
          }
        }
      }
    }

    // Step 5: Create sample workshops
    console.log('\n🎓 Step 5: Creating sample workshops...');
    if (orgs) {
      for (const org of orgs) {
        const workshops = [
          {
            organization_id: org.id,
            title: 'Introduction to AI Art',
            description: 'Learn the basics of AI-generated art and creative tools',
            content: 'This workshop covers fundamental concepts of AI art generation, including prompt engineering, style transfer, and ethical considerations.',
            type: 'workshop',
            level: 'beginner',
            duration_minutes: 120,
            max_participants: 15,
            metadata: {
              topics: ['AI art', 'prompt engineering', 'ethics'],
              materials: ['laptop', 'notebook']
            }
          },
          {
            organization_id: org.id,
            title: '3D Printing Basics',
            description: 'Hands-on introduction to 3D printing technology',
            content: 'Learn how to design, prepare, and print 3D models using our lab equipment.',
            type: 'workshop',
            level: 'beginner',
            duration_minutes: 90,
            max_participants: 8,
            metadata: {
              topics: ['3D modeling', 'slicing', 'printing'],
              materials: ['laptop', '3D printer']
            }
          },
          {
            organization_id: org.id,
            title: 'Digital Photography Workshop',
            description: 'Master the fundamentals of digital photography',
            content: 'Learn composition, lighting, and post-processing techniques for digital photography.',
            type: 'workshop',
            level: 'intermediate',
            duration_minutes: 180,
            max_participants: 12,
            metadata: {
              topics: ['composition', 'lighting', 'post-processing'],
              materials: ['camera', 'laptop']
            }
          }
        ];

        for (const workshop of workshops) {
          const { error } = await supabase
            .from('workshops')
            .upsert(workshop, { onConflict: 'id' });

          if (error) {
            console.warn(`⚠️  Warning creating workshop for ${org.slug}:`, error.message);
          } else {
            console.log(`✅ Workshop created for ${org.slug}: ${workshop.title}`);
          }
        }
      }
    }

    // Step 6: Create sample announcements
    console.log('\n📢 Step 6: Creating sample announcements...');
    if (orgs) {
      for (const org of orgs) {
        const announcements = [
          {
            organization_id: org.id,
            title: 'Welcome to Our Digital Lab',
            description: 'Discover our state-of-the-art digital art facilities',
            content: 'Our digital lab is now open with new equipment and resources for artists and creators.',
            type: 'announcement',
            priority: 'normal',
            visibility: 'public',
            status: 'published',
            tags: ['lab', 'equipment', 'welcome'],
            metadata: {
              featured: true,
              image_url: '/images/lab-welcome.jpg'
            }
          },
          {
            organization_id: org.id,
            title: 'Upcoming Workshop: AI Art Fundamentals',
            description: 'Join us for an introduction to AI-generated art',
            content: 'Learn the basics of AI art generation in this hands-on workshop. No experience required.',
            type: 'workshop',
            priority: 'high',
            visibility: 'public',
            status: 'published',
            scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
            tags: ['workshop', 'AI', 'art'],
            metadata: {
              registration_required: true,
              max_participants: 15
            }
          },
          {
            organization_id: org.id,
            title: 'Lab Hours Update',
            description: 'New extended hours for the digital lab',
            content: 'The digital lab will now be open until 10 PM on weekdays to accommodate more artists.',
            type: 'announcement',
            priority: 'normal',
            visibility: 'internal',
            status: 'published',
            tags: ['hours', 'lab', 'schedule'],
            metadata: {
              effective_date: new Date().toISOString()
            }
          }
        ];

        for (const announcement of announcements) {
          const { error } = await supabase
            .from('announcements')
            .upsert(announcement, { onConflict: 'id' });

          if (error) {
            console.warn(`⚠️  Warning creating announcement for ${org.slug}:`, error.message);
          } else {
            console.log(`✅ Announcement created for ${org.slug}: ${announcement.title}`);
          }
        }
      }
    }

    console.log('\n🎉 Supabase setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Verify your environment variables in .env.local');
    console.log('   2. Test the application by running: npm run dev');
    console.log('   3. Check the Supabase dashboard for your data');
    console.log('   4. Configure your domain routing if needed');
    console.log('\n🔗 Useful links:');
    console.log(`   - Supabase Dashboard: ${SUPABASE_URL.replace('/rest/v1', '')}`);
    console.log('   - Documentation: docs/technical/SUPABASE_SETUP.md');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupSupabase();
