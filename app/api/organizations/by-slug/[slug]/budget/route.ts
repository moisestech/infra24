import { NextRequest, NextResponse } from 'next/server'
import { generateMockBudgetData, BudgetMonth } from '@/lib/budget/budget-utils'
import { fetchBudgetFromAirtable } from '@/lib/airtable/budget-service'
import { getBudgetConfig } from '@/lib/budget/budget-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    console.log('🌐 API - Budget route called:', { slug })
    
    // For Oolite, try Airtable first; otherwise use static config
    let budgetConfig = getBudgetConfig(slug)
    if (slug === 'oolite') {
      const airtableConfig = await fetchBudgetFromAirtable(slug, 'digital-lab')
      if (airtableConfig) budgetConfig = airtableConfig
    }
    
    const year = '2025'
    const months = generateMockBudgetData(year, slug, budgetConfig)
    const totalBudget = budgetConfig.totalBudget
    const totalSpent = months.reduce((sum, m) => sum + m.spent, 0)
    
    console.log('🌐 API - Budget response:', {
      organizationSlug: slug,
      year,
      monthsCount: months.length,
      totalBudget,
      totalSpent
    })
    console.log('🌐 API - First month sample:', months[0])
    
    const response = NextResponse.json({
      organizationSlug: slug,
      year,
      months,
      totalBudget,
      totalSpent
    })
    
    console.log('🌐 API - Response created, status:', response.status)
    return response
  } catch (error) {
    console.error('❌ API - Error fetching budget data:', error)
    console.error('❌ API - Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { error: 'Failed to fetch budget data' },
      { status: 500 }
    )
  }
}

// Future: POST endpoint for creating/updating budget items
// Future: DELETE endpoint for removing budget items

