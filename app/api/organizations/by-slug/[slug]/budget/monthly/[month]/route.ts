import { NextRequest, NextResponse } from 'next/server'
import { generateMockBudgetData, BudgetMonth } from '@/lib/budget/budget-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; month: string }> }
) {
  try {
    const { slug, month } = await params
    
    // Validate month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month format. Expected YYYY-MM' },
        { status: 400 }
      )
    }
    
    // In the future, this would fetch from database
    // For now, return mock data and find the specific month
    const year = month.split('-')[0]
    const months = generateMockBudgetData(year)
    const monthData = months.find(m => m.month === month)
    
    if (!monthData) {
      return NextResponse.json(
        { error: 'Month not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      organizationSlug: slug,
      month: monthData
    })
  } catch (error) {
    console.error('Error fetching monthly budget data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monthly budget data' },
      { status: 500 }
    )
  }
}






