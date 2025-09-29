const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleWorkshops = [
  // Featured workshops (SEO and Digital Presence)
  {
    title: 'SEO Workshop',
    description: 'Get found, get seen, and expand your reach with search engine optimization strategies.',
    content: 'Learn the fundamentals of SEO and how to optimize your website for search engines.',
    category: 'Digital Marketing',
    type: 'workshop',
    level: 'beginner',
    status: 'published',
    duration_minutes: 120,
    max_participants: 20,
    price: 0,
    instructor: 'Fabiola Larios',
    prerequisites: ['Basic computer skills'],
    materials: ['Laptop', 'Notebook'],
    outcomes: ['Understand SEO basics', 'Optimize website content', 'Improve search rankings'],
    is_active: true,
    is_public: true,
    is_shared: false,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop',
    metadata: {
      external_link: 'https://fabiola.io/workshop_seo/index.html',
      tags: ['seo', 'marketing', 'digital']
    }
  },
  {
    title: 'Own Your Digital Presence',
    description: 'Build and optimize your online portfolio and website.',
    content: 'Learn how to create a professional online presence that showcases your work effectively.',
    category: 'Digital Marketing',
    type: 'workshop',
    level: 'beginner',
    status: 'published',
    duration_minutes: 180,
    max_participants: 15,
    price: 0,
    instructor: 'Moises Sanabria',
    prerequisites: ['Basic computer skills'],
    materials: ['Laptop', 'Portfolio materials'],
    outcomes: ['Create professional portfolio', 'Optimize online presence', 'Build personal brand'],
    is_active: true,
    is_public: true,
    is_shared: false,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    metadata: {
      external_link: '/workshop/own-your-digital-presence',
      tags: ['portfolio', 'branding', 'digital']
    }
  },
  // Published workshops
  {
    title: 'Scale Tech Non-Profits',
    description: 'Custom software solutions to help your organization and community grow.',
    content: 'Learn how to leverage technology to scale your non-profit organization effectively.',
    category: 'Technology',
    type: 'workshop',
    level: 'intermediate',
    status: 'draft',
    duration_minutes: 150,
    max_participants: 12,
    price: 0,
    instructor: 'Tech Team',
    prerequisites: ['Basic understanding of organizations'],
    materials: ['Laptop', 'Organization materials'],
    outcomes: ['Understand tech scaling', 'Implement solutions', 'Measure impact'],
    is_active: true,
    is_public: true,
    is_shared: false,
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    metadata: {
      external_link: '/workshop/tech-nonprofit',
      tags: ['nonprofit', 'technology', 'scaling']
    }
  },
  // Unpublished workshops (drafts)
  {
    title: 'AI & Art',
    description: 'Learn how to integrate AI tools into your creative process.',
    content: 'Explore the intersection of artificial intelligence and artistic creation.',
    category: 'Creative Technology',
    type: 'workshop',
    level: 'intermediate',
    status: 'draft',
    duration_minutes: 120,
    max_participants: 10,
    price: 0,
    instructor: 'AI Specialist',
    prerequisites: ['Basic art skills', 'Computer literacy'],
    materials: ['Laptop', 'Art supplies'],
    outcomes: ['Understand AI tools', 'Create AI-assisted art', 'Explore new mediums'],
    is_active: true,
    is_public: false,
    is_shared: false,
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    metadata: {
      tags: ['ai', 'art', 'creative', 'technology']
    }
  },
  {
    title: 'The Art of AI Marketing',
    description: 'Learn how to stand out in the age of AI-generated content.',
    content: 'Discover strategies for authentic marketing in an AI-driven world.',
    category: 'Digital Marketing',
    type: 'workshop',
    level: 'advanced',
    status: 'draft',
    duration_minutes: 90,
    max_participants: 8,
    price: 0,
    instructor: 'Marketing Expert',
    prerequisites: ['Marketing experience', 'AI awareness'],
    materials: ['Laptop', 'Marketing materials'],
    outcomes: ['Understand AI marketing', 'Create authentic content', 'Stand out from AI'],
    is_active: true,
    is_public: false,
    is_shared: false,
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
    metadata: {
      tags: ['ai', 'marketing', 'authenticity', 'content']
    }
  }
]

async function populateWorkshops() {
  try {
    // Get Oolite organization ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', 'oolite')
      .single()

    if (orgError || !org) {
      console.error('Error finding Oolite organization:', orgError)
      return
    }

    console.log('Found Oolite organization:', org.id)

    // Insert workshops
    for (const workshop of sampleWorkshops) {
      const { data, error } = await supabase
        .from('workshops')
        .insert({
          organization_id: org.id,
          ...workshop,
          created_by: 'system'
        })
        .select()

      if (error) {
        console.error('Error inserting workshop:', workshop.title, error)
      } else {
        console.log('✅ Inserted workshop:', workshop.title)
      }
    }

    console.log('🎉 Sample workshops populated successfully!')
  } catch (error) {
    console.error('Error populating workshops:', error)
  }
}

populateWorkshops()
