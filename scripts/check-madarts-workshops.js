const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkMadArtsWorkshops() {
  console.log('🎓 Checking MadArts workshops in database...');

  try {
    // First, get the MadArts organization ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'madarts')
      .single();

    if (orgError || !org) {
      console.error('❌ Error fetching MadArts organization:', orgError);
      return;
    }

    console.log('🏢 MadArts Organization:', {
      id: org.id,
      name: org.name,
      slug: org.slug
    });

    // Get all workshops for MadArts
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', org.id)
      .order('created_at', { ascending: false });

    if (workshopsError) {
      console.error('❌ Error fetching workshops:', workshopsError);
      return;
    }

    console.log('🎓 Total workshops found for MadArts:', workshops?.length || 0);

    if (workshops && workshops.length > 0) {
      workshops.forEach((workshop, index) => {
        console.log(`\n🎓 Workshop ${index + 1}:`);
        console.log(`   ID: ${workshop.id}`);
        console.log(`   Title: ${workshop.title}`);
        console.log(`   Description: ${workshop.description?.substring(0, 100)}...`);
        console.log(`   Level: ${workshop.level}`);
        console.log(`   Duration: ${workshop.duration} minutes`);
        console.log(`   Organization ID: ${workshop.organization_id}`);
        console.log(`   Created: ${workshop.created_at}`);
        console.log(`   Image URL: ${workshop.image_url || 'None'}`);
      });

      // Check specifically for Video Performance workshop
      const videoPerformanceWorkshop = workshops.find(w => 
        w.title.toLowerCase().includes('video') || 
        w.title.toLowerCase().includes('performance') ||
        w.title.toLowerCase().includes('tere')
      );

      if (videoPerformanceWorkshop) {
        console.log('\n🎬 ✅ Video Performance Workshop Found!');
        console.log('   Title:', videoPerformanceWorkshop.title);
        console.log('   ID:', videoPerformanceWorkshop.id);
        console.log('   Description:', videoPerformanceWorkshop.description);
        console.log('   Level:', videoPerformanceWorkshop.level);
        console.log('   Duration:', videoPerformanceWorkshop.duration, 'minutes');
      } else {
        console.log('\n❌ Video Performance Workshop NOT found');
        console.log('Available workshop titles:');
        workshops.forEach(w => console.log(`   - ${w.title}`));
      }
    } else {
      console.log('❌ No workshops found for MadArts organization');
    }

    // Also check if there are any workshops with "video" or "performance" in the title across all organizations
    console.log('\n🔍 Checking for Video Performance workshops across all organizations...');
    const { data: allVideoWorkshops, error: allVideoError } = await supabase
      .from('workshops')
      .select('id, title, organization_id, created_at')
      .or('title.ilike.%video%,title.ilike.%performance%,title.ilike.%tere%')
      .order('created_at', { ascending: false });

    if (allVideoError) {
      console.error('❌ Error fetching all video workshops:', allVideoError);
    } else {
      console.log('🎬 Video-related workshops across all organizations:', allVideoWorkshops?.length || 0);
      if (allVideoWorkshops && allVideoWorkshops.length > 0) {
        allVideoWorkshops.forEach(workshop => {
          console.log(`   - ${workshop.title} (Org ID: ${workshop.organization_id})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Failed to check MadArts workshops:', error.message);
  }
}

// Run the check
checkMadArtsWorkshops();
