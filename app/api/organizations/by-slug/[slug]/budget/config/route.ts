import { NextRequest, NextResponse } from 'next/server'
import { fetchBudgetFromAirtable, type OoliteBudgetType } from '@/lib/airtable/budget-service'
import { getBudgetConfig } from '@/lib/budget/budget-data'

/**
 * GET /api/organizations/by-slug/[slug]/budget/config
 *
 * Returns budget config (totalBudget, description, items) for the organization.
 * For Oolite: fetches from Airtable when configured, otherwise falls back to budget-data.ts.
 * Query: ?budgetType=digital-lab|summit (for Oolite)
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

    // For Oolite, try Airtable first
    if (slug === 'oolite') {
      const airtableConfig = await fetchBudgetFromAirtable(slug, effectiveBudgetType)
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
