import { NextRequest, NextResponse } from 'next/server'
import { fetchAllBudgetItemsFromAirtable, type OoliteBudgetType } from '@/lib/airtable/budget-service'
import { getBudgetConfig } from '@/lib/budget/budget-data'

export const dynamic = 'force-dynamic';

/**
 * GET /api/organizations/by-slug/[slug]/budget/config
 *
 * Returns budget config (totalBudget, description, items) for the organization.
 * For Oolite: fetches ALL items from Airtable (Digital Lab + Digital Conference) when configured.
 * Query: ?budgetType=digital-lab|summit (legacy; when combined=1, returns all items)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const budgetType = searchParams.get('budgetType') as OoliteBudgetType | null
    const effectiveBudgetType: OoliteBudgetType | undefined =
      budgetType === 'digital-lab' || budgetType === 'summit' ? budgetType : undefined

    // For Oolite, fetch ALL items from Airtable (Digital Lab + Digital Conference)
    if (slug === 'oolite') {
      const airtableConfig = await fetchAllBudgetItemsFromAirtable(slug)
      if (airtableConfig) {
        return NextResponse.json(airtableConfig)
      }
    }

    // Fallback: use static config from budget-data.ts
    const config = getBudgetConfig(slug, effectiveBudgetType)
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching budget config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budget config' },
      { status: 500 }
    )
  }
}
