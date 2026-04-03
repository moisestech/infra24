import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { getOrgBySlug, assertOrgRole, CONTROL_MUTATE_ROLES } from '@/lib/control-plane/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const org = await getOrgBySlug(supabase, slug)
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const role = await assertOrgRole(supabase, userId, org.id, CONTROL_MUTATE_ROLES)
    if (!role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('control_identities')
      .select('id, telegram_user_id, clerk_user_id, created_at')
      .eq('organization_id', org.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('control_identities list', error)
      return NextResponse.json({ error: 'Failed to load mappings' }, { status: 500 })
    }

    return NextResponse.json({ identities: data || [] })
  } catch (e) {
    console.error('control-identities GET', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const telegram_user_id = String(body?.telegram_user_id || '').trim()
    const clerk_user_id = String(body?.clerk_user_id || '').trim()
    if (!telegram_user_id || !clerk_user_id) {
      return NextResponse.json({ error: 'telegram_user_id and clerk_user_id required' }, { status: 400 })
    }

    const supabase = createClient()
    const org = await getOrgBySlug(supabase, slug)
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const role = await assertOrgRole(supabase, userId, org.id, CONTROL_MUTATE_ROLES)
    if (!role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: member } = await supabase
      .from('org_memberships')
      .select('clerk_user_id')
      .eq('org_id', org.id)
      .eq('clerk_user_id', clerk_user_id)
      .eq('is_active', true)
      .maybeSingle()

    if (!member) {
      return NextResponse.json(
        { error: 'clerk_user_id must be an active member of this organization' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('control_identities')
      .insert({
        organization_id: org.id,
        telegram_user_id,
        clerk_user_id,
      })
      .select('id, telegram_user_id, clerk_user_id, created_at')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'This Telegram id is already mapped for this org' }, { status: 409 })
      }
      console.error('control_identities insert', error)
      return NextResponse.json({ error: 'Failed to create mapping' }, { status: 500 })
    }

    return NextResponse.json({ identity: data })
  } catch (e) {
    console.error('control-identities POST', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const id = request.nextUrl.searchParams.get('id')?.trim()
    if (!id) {
      return NextResponse.json({ error: 'id query parameter required' }, { status: 400 })
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const org = await getOrgBySlug(supabase, slug)
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const role = await assertOrgRole(supabase, userId, org.id, CONTROL_MUTATE_ROLES)
    if (!role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('control_identities')
      .delete()
      .eq('id', id)
      .eq('organization_id', org.id)

    if (error) {
      console.error('control_identities delete', error)
      return NextResponse.json({ error: 'Failed to delete mapping' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('control-identities DELETE', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
