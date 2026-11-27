#!/usr/bin/env node
// Read-only literal consumer inventory for the exact checked-out source tree.
// Print paths only, not source lines, credentials, or row data.
import { execFileSync } from 'node:child_process'

const roots = ['app', 'components', 'lib', 'hooks', 'features', 'services', 'scripts', 'supabase', 'types', '__tests__']
const terms = [
  'artist_tips', 'booking_participants', 'bookings', 'organization_donations',
  'resources', 'submission_forms', 'submissions', 'ArtistBookingForm',
  'artist_booking', 'test-supabase', 'api/artists/',
]
console.log('Legacy consumer inventory commit:', execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim())
for (const term of terms) {
  let output = ''
  try {
    output = execFileSync('git', ['grep', '-I', '-l', '-F', term, '--', ...roots], {
      encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    })
  } catch (error) {
    if (error.status !== 1) throw error
  }
  const paths = output.trim().split('\n').filter(Boolean).sort()
  console.log(JSON.stringify({ term, count: paths.length, paths }))
}
console.log('Literal inventory only: manually classify dynamic table names, indirect SDK calls, RPCs and deployed external consumers before cutover.')
