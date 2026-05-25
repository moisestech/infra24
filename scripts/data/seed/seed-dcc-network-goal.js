/**
 * Seed DCC Network Readiness MVP goal in Supabase network_goals.
 *
 *   node scripts/data/seed/seed-dcc-network-goal.js
 *   node scripts/data/seed/seed-dcc-network-goal.js --apply
 */

const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })

const { createClient } = require('@supabase/supabase-js')

const GOAL = {
  goal_loop: 'network_readiness',
  title: 'dcc_network_readiness_mvp',
  metric_name: 'network_ready_percent',
  target_value: 70,
  current_value: null,
  status: 'active',
  config: {
    artist_target_mvp: 100,
    total_contacts_stretch_12mo: 1000,
    allowed_actions: [
      'ask_for_missing_info',
      'invite_to_dcc_index',
      'invite_to_workshop',
      'create_followup_task',
      'draft_partner_followup',
      'draft_program_invite',
      'draft_public_signal_post',
    ],
    approval_phase: 1,
    approver: 'moises',
  },
}

async function main() {
  const apply = process.argv.includes('--apply')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url?.trim() || !key?.trim()) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  console.log('Goal to seed:', JSON.stringify(GOAL, null, 2))

  if (!apply) {
    console.log('\nDry-run. Pass --apply to upsert into network_goals.')
    return
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', 'dcc')
    .maybeSingle()

  if (orgErr || !org) {
    console.error('DCC organization not found. Create organizations.slug=dcc first.')
    process.exit(1)
  }

  const { data, error } = await supabase
    .from('network_goals')
    .upsert(
      {
        organization_id: org.id,
        ...GOAL,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'organization_id,goal_loop' }
    )
    .select('id, title')
    .single()

  if (error) {
    console.error('Upsert failed:', error.message)
    console.error('Ensure migration 20260524120000_network_builder.sql is applied.')
    process.exit(1)
  }

  console.log(`Seeded goal: ${data.title} (${data.id})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
