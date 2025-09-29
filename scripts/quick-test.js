const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function quickTest() {
  console.log('🧪 Quick Learn Canvas Test...\n')

  try {
    // Test 1: Check organizations
    console.log('1️⃣ Testing organizations...')
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .limit(3)

    if (orgError) {
      console.error('❌ Organizations error:', orgError.message)
      return
    }
    console.log(`✅ Found ${orgs?.length || 0} organizations`)

    // Test 2: Check workshops with learn content
    console.log('\n2️⃣ Testing workshops...')
    const { data: workshops, error: workshopError } = await supabase
      .from('workshops')
      .select('id, title, has_learn_content, learning_objectives')
      .eq('has_learn_content', true)
      .limit(5)

    if (workshopError) {
      console.error('❌ Workshops error:', workshopError.message)
      return
    }
    console.log(`✅ Found ${workshops?.length || 0} workshops with learn content`)
    workshops?.forEach(w => console.log(`   - ${w.title}`))

    // Test 3: Check chapters
    console.log('\n3️⃣ Testing chapters...')
    const { data: chapters, error: chapterError } = await supabase
      .from('workshop_chapters')
      .select('id, title, chapter_slug, order_index')
      .limit(10)

    if (chapterError) {
      console.error('❌ Chapters error:', chapterError.message)
      return
    }
    console.log(`✅ Found ${chapters?.length || 0} chapters`)
    chapters?.forEach(c => console.log(`   - ${c.title} (Ch. ${c.order_index})`))

    // Test 4: Check content files
    console.log('\n4️⃣ Testing content files...')
    const fs = require('fs')
    const path = require('path')
    
    const contentDirs = [
      'content/workshops/oolite/seo-workshop/chapters',
      'content/workshops/oolite/digital-presence-workshop/chapters'
    ]

    let totalFiles = 0
    contentDirs.forEach(dir => {
      try {
        const fullPath = path.join(process.cwd(), dir)
        if (fs.existsSync(fullPath)) {
          const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.md'))
          console.log(`✅ ${dir}: ${files.length} files`)
          totalFiles += files.length
        } else {
          console.log(`❌ ${dir}: Not found`)
        }
      } catch (error) {
        console.log(`❌ ${dir}: Error`)
      }
    })

    // Summary
    console.log('\n🎯 Test Summary:')
    console.log(`✅ Organizations: ${orgs?.length || 0}`)
    console.log(`✅ Workshops with learn content: ${workshops?.length || 0}`)
    console.log(`✅ Chapters: ${chapters?.length || 0}`)
    console.log(`✅ Content files: ${totalFiles}`)

    if (orgs && orgs.length > 0 && workshops && workshops.length > 0 && chapters && chapters.length > 0 && totalFiles > 0) {
      console.log('\n🎉 Learn Canvas System is ready!')
      console.log('\n📋 Next steps:')
      console.log('1. Start your development server: npm run dev')
      console.log('2. Navigate to /content to test content management')
      console.log('3. Visit a workshop page to test Learn tab integration')
    } else {
      console.log('\n⚠️  Some components need attention. Check the errors above.')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the test
quickTest()
