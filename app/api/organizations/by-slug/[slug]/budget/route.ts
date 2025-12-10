import { NextRequest, NextResponse } from 'next/server'
import { generateMockBudgetData, BudgetMonth } from '@/lib/budget/budget-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    console.log('🌐 API - Budget route called:', { slug })
    console.log('🌐 API - Request URL:', request.url)
    console.log('🌐 API - Request method:', request.method)
    console.log('🌐 API - Request headers:', Object.fromEntries(request.headers.entries()))
    
    // In the future, this would fetch from database
    // For now, return mock data based on organization
    // Budget period: September 2025 to September 2026
    const year = '2025'
    console.log('🌐 API - Generating budget data for year:', year, '(Sep 2025 - Sep 2026)')
    
    const months = generateMockBudgetData(year, slug)
    console.log('🌐 API - Generated months:', months.length)
    
    // Use the config totalBudget ($80k) instead of summing months
    const { getBudgetConfig } = require('@/lib/budget/budget-data')
    const budgetConfig = getBudgetConfig(slug)
    const totalBudget = budgetConfig.totalBudget // Use $80k from config
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

