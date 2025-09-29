const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createSampleWorkshops() {
  try {
    console.log('🚀 Creating sample workshops with learn content...')

    // First, let's check if we have the Oolite organization
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'oolite')

    if (orgError) {
      console.error('❌ Error fetching organizations:', orgError.message)
      return
    }

    if (!orgs || orgs.length === 0) {
      console.error('❌ Oolite organization not found')
      return
    }

    const ooliteOrg = orgs[0]
    console.log(`✅ Found organization: ${ooliteOrg.name} (${ooliteOrg.id})`)

    // Check if workshops already exist
    const { data: existingWorkshops, error: existingError } = await supabase
      .from('workshops')
      .select('id, title')
      .eq('organization_id', ooliteOrg.id)
      .in('title', ['SEO Workshop', 'Digital Presence Workshop'])

    if (existingError) {
      console.error('❌ Error checking existing workshops:', existingError.message)
      return
    }

    console.log(`📊 Found ${existingWorkshops?.length || 0} existing workshops`)

    // Create SEO Workshop
    const seoWorkshopData = {
      title: 'SEO Workshop',
      description: 'Learn the fundamentals of search engine optimization to improve your website\'s visibility and attract more organic traffic.',
      instructor: 'Digital Marketing Expert',
      duration_minutes: 120,
      max_participants: 20,
      price: 150,
      status: 'published',
      featured: true,
      organization_id: ooliteOrg.id,
      has_learn_content: true,
      learning_objectives: [
        'Understand the fundamentals of SEO',
        'Learn keyword research techniques',
        'Master on-page optimization',
        'Analyze website performance with analytics'
      ],
      estimated_learn_time: 120,
      learn_difficulty: 'beginner',
      prerequisites: [
        'Basic understanding of websites',
        'Access to a website or blog'
      ],
      materials_needed: [
        'Computer with internet access',
        'Google Analytics account (free)',
        'Google Search Console account (free)'
      ]
    }

    // Create Digital Presence Workshop
    const digitalPresenceWorkshopData = {
      title: 'Digital Presence Workshop',
      description: 'Build a strong online identity and create engaging content that establishes your professional brand across digital platforms.',
      instructor: 'Brand Strategy Specialist',
      duration_minutes: 180,
      max_participants: 15,
      price: 200,
      status: 'published',
      featured: true,
      organization_id: ooliteOrg.id,
      has_learn_content: true,
      learning_objectives: [
        'Build a strong online identity',
        'Create engaging content strategies',
        'Develop effective social media presence',
        'Build meaningful professional relationships'
      ],
      estimated_learn_time: 150,
      learn_difficulty: 'intermediate',
      prerequisites: [
        'Basic computer skills',
        'Access to social media accounts'
      ],
      materials_needed: [
        'Computer or smartphone',
        'Social media accounts (LinkedIn, Instagram, Twitter)',
        'Portfolio or work samples'
      ]
    }

    const workshopsToCreate = []

    // Check if SEO Workshop exists
    const seoExists = existingWorkshops?.find(w => w.title === 'SEO Workshop')
    if (!seoExists) {
      workshopsToCreate.push(seoWorkshopData)
    } else {
      console.log('✅ SEO Workshop already exists')
    }

    // Check if Digital Presence Workshop exists
    const dpExists = existingWorkshops?.find(w => w.title === 'Digital Presence Workshop')
    if (!dpExists) {
      workshopsToCreate.push(digitalPresenceWorkshopData)
    } else {
      console.log('✅ Digital Presence Workshop already exists')
    }

    if (workshopsToCreate.length === 0) {
      console.log('✅ All workshops already exist')
      return
    }

    // Create workshops
    const { data: newWorkshops, error: createError } = await supabase
      .from('workshops')
      .insert(workshopsToCreate)
      .select('id, title')

    if (createError) {
      console.error('❌ Error creating workshops:', createError.message)
      return
    }

    console.log(`✅ Created ${newWorkshops.length} workshops:`)
    newWorkshops.forEach(workshop => {
      console.log(`   - ${workshop.title} (${workshop.id})`)
    })

    // Now create chapters for each workshop
    for (const workshop of newWorkshops) {
      await createChaptersForWorkshop(workshop)
    }

    console.log('🎉 Sample workshops with learn content created successfully!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

async function createChaptersForWorkshop(workshop) {
  console.log(`📚 Creating chapters for ${workshop.title}...`)

  let chapters = []

  if (workshop.title === 'SEO Workshop') {
    chapters = [
      {
        workshop_id: workshop.id,
        chapter_slug: 'introduction-to-seo',
        title: 'Introduction to SEO',
        description: 'Learn the basics of search engine optimization and why it matters for your business.',
        order_index: 1,
        estimated_time: 30
      },
      {
        workshop_id: workshop.id,
        chapter_slug: 'keyword-research',
        title: 'Keyword Research',
        description: 'Discover how to find and analyze keywords that your audience is searching for.',
        order_index: 2,
        estimated_time: 45
      },
      {
        workshop_id: workshop.id,
        chapter_slug: 'on-page-optimization',
        title: 'On-Page Optimization',
        description: 'Learn how to optimize your website content and structure for better search rankings.',
        order_index: 3,
        estimated_time: 30
      },
      {
        workshop_id: workshop.id,
        chapter_slug: 'analytics-and-tracking',
        title: 'Analytics and Tracking',
        description: 'Set up and use Google Analytics and Search Console to measure your SEO success.',
        order_index: 4,
        estimated_time: 15
      }
    ]
  } else if (workshop.title === 'Digital Presence Workshop') {
    chapters = [
      {
        workshop_id: workshop.id,
        chapter_slug: 'building-your-online-identity',
        title: 'Building Your Online Identity',
        description: 'Learn how to create a strong, consistent digital presence across all platforms.',
        order_index: 1,
        estimated_time: 40
      },
      {
        workshop_id: workshop.id,
        chapter_slug: 'content-creation-strategies',
        title: 'Content Creation Strategies',
        description: 'Learn how to create engaging, valuable content that builds your digital presence.',
        order_index: 2,
        estimated_time: 50
      },
      {
        workshop_id: workshop.id,
        chapter_slug: 'social-media-strategy',
        title: 'Social Media Strategy',
        description: 'Build and engage with your community across different platforms to maximize your digital presence.',
        order_index: 3,
        estimated_time: 45
      },
      {
        workshop_id: workshop.id,
        chapter_slug: 'networking-and-relationship-building',
        title: 'Networking and Relationship Building',
        description: 'Leverage your digital presence to build meaningful professional relationships and grow your network.',
        order_index: 4,
        estimated_time: 35
      }
    ]
  }

  if (chapters.length > 0) {
    const { error: chaptersError } = await supabase
      .from('workshop_chapters')
      .insert(chapters)

    if (chaptersError) {
      console.error(`❌ Error creating chapters for ${workshop.title}:`, chaptersError.message)
    } else {
      console.log(`✅ Created ${chapters.length} chapters for ${workshop.title}`)
    }
  }
}

// Run the script
createSampleWorkshops()
