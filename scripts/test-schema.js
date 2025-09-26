require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testSchema() {
  console.log('🔍 Testing database schema...')
  
  try {
    // Test resources table
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .limit(1)
    
    if (resourcesError) {
      console.log('❌ Resources table error:', resourcesError.message)
    } else {
      console.log('✅ Resources table accessible')
      if (resources && resources.length > 0) {
        console.log('📋 Sample resource:', resources[0])
      }
    }

    // Test workshops table
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('*')
      .limit(1)
    
    if (workshopsError) {
      console.log('❌ Workshops table error:', workshopsError.message)
    } else {
      console.log('✅ Workshops table accessible')
      if (workshops && workshops.length > 0) {
        console.log('📋 Sample workshop:', workshops[0])
      }
    }

    // Test bookings table
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1)
    
    if (bookingsError) {
      console.log('❌ Bookings table error:', bookingsError.message)
    } else {
      console.log('✅ Bookings table accessible')
      if (bookings && bookings.length > 0) {
        console.log('📋 Sample booking:', bookings[0])
      }
    }

  } catch (error) {
    console.error('❌ Schema test error:', error)
  }
}

async function getBookingFields() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching booking fields:', error)
    return []
  }

  if (data && data.length > 0) {
    return Object.keys(data[0])
  }
  return []
}

async function getWorkshopSessionFields() {
  const { data, error } = await supabase
    .from('workshop_sessions')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching workshop session fields:', error)
    return []
  }

  if (data && data.length > 0) {
    return Object.keys(data[0])
  }
  return []
}

// testSchema()
// getBookingFields().then(fields => console.log('Booking fields:', fields))
getWorkshopSessionFields().then(fields => console.log('Workshop session fields:', fields))
