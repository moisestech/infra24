import { Briefcase, Package, Cloud, Shield, Wrench, Building, Radio, Mic, Users } from 'lucide-react'

export interface BudgetLineItem {
  id: string
  name: string
  category: string
  amount: number
  imageUrl: string
  date: string
  vendor?: string
  notes?: string
}

export interface BudgetMonth {
  month: string // "2025-01"
  budget: number
  spent: number
  lineItems: BudgetLineItem[]
}

export interface BudgetCategory {
  id: string
  name: string
  icon: typeof Users
  color: string
  description: string
}

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'room-build-out',
    name: 'Room Build-Out',
    icon: Building,
    color: '#3B82F6', // blue
    description: 'Renovation, construction, and space preparation work'
  },
  {
    id: 'hardware-materials',
    name: 'Hardware & Materials',
    icon: Package,
    color: '#8B5CF6', // purple
    description: 'Hardware fleet including equipment and materials'
  },
  {
    id: 'equipment-maintenance',
    name: 'Equipment Maintenance',
    icon: Wrench,
    color: '#10B981', // green
    description: 'Maintenance, repairs, and upkeep of equipment'
  },
  {
    id: 'streaming',
    name: 'Streaming',
    icon: Radio,
    color: '#06B6D4', // cyan
    description: 'Streaming infrastructure, cabling, and IT services'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Mic,
    color: '#EC4899', // pink
    description: 'Audio equipment, microphones, and sound systems'
  },
  {
    id: 'contingency',
    name: 'Contingency & Spare Parts',
    icon: Shield,
    color: '#F59E0B', // orange
    description: 'Backup equipment and contingency funds'
  }
]

// Generate Unsplash image URL based on category and item name
export function getBudgetItemImage(category: string, itemName: string): string {
  const searchTerms: Record<string, string> = {
    'room-build-out': 'construction+renovation',
    'hardware-materials': 'computer+equipment',
    'equipment-maintenance': 'tools+repair',
    'streaming': 'cabling+network',
    'audio': 'microphone+audio',
    'contingency': 'tools+equipment'
  }
  
  const term = searchTerms[category] || 'business'
  const width = 800
  const height = 600
  const seed = itemName.toLowerCase().replace(/\s+/g, '-')
  
  return `https://source.unsplash.com/${width}x${height}/?${term}&sig=${seed}`
}

// Generate budget data using organization-specific budget configurations
// Data source: lib/budget/budget-data.ts
// Generates months from September 2025 to September 2026 (13 months)
export function generateMockBudgetData(year: string = '2025', orgSlug: string = 'oolite'): BudgetMonth[] {
  console.log('📊 generateMockBudgetData() called:', { year, orgSlug })
  
  const months: BudgetMonth[] = []
  
  // Import organization-specific budget config
  const { getBudgetConfig } = require('./budget-data')
  const budgetConfig = getBudgetConfig(orgSlug)
  const totalBudget = budgetConfig.totalBudget
  const allItems = budgetConfig.items
  
  console.log('📊 Budget Config loaded:', {
    orgSlug,
    totalBudget,
    itemCount: allItems.length,
    description: budgetConfig.description,
    itemsTotal: allItems.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0)
  })
  
  // Generate months from September 2025 to September 2026 (13 months)
  // Start month: September 2025 (month 9)
  // End month: September 2026 (month 9 of next year)
  const startYear = parseInt(year)
  const startMonth = 9 // September
  
  // Distribute total budget across 13 months
  // More spending in initial months (Sep-Dec 2025), less in later months
  // Calculate monthly budgets proportionally
  const monthlyBudgetPercentages = [
    0.12, 0.10, 0.09, 0.08,  // Sep, Oct, Nov, Dec 2025 - 39%
    0.08, 0.07, 0.06, 0.05,  // Jan, Feb, Mar, Apr 2026 - 26%
    0.05, 0.04, 0.03, 0.03,  // May, Jun, Jul, Aug 2026 - 15%
    0.02                      // Sep 2026 - 2% (final month)
  ]
  
  const monthlyBudgets = monthlyBudgetPercentages.map(pct => Math.floor(totalBudget * pct))
  
  // Distribute items across months
  // Spread items evenly across the year, with more items in early months
  let itemIndex = 0
  
  // Get current date to determine which months should have spending
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // JavaScript months are 0-indexed
  
  for (let i = 0; i < 13; i++) {
    let monthNum = startMonth + i
    let monthYear = startYear
    
    // Handle year rollover
    if (monthNum > 12) {
      monthNum = monthNum - 12
      monthYear = startYear + 1
    }
    
    const monthStr = `${monthYear}-${String(monthNum).padStart(2, '0')}`
    const budget = monthlyBudgets[i] || 200
    
    // Check if this month has already occurred or is the current month
    const monthHasPassed = monthYear < currentYear || 
                          (monthYear === currentYear && monthNum < currentMonth)
    const isCurrentMonth = monthYear === currentYear && monthNum === currentMonth
    
    // Only assign spending to past or current months
    let itemsThisMonth: typeof allItems = []
    let spent = 0
    let lineItems: BudgetLineItem[] = []
    
    if (monthHasPassed || isCurrentMonth) {
      // Assign items per month (more in early months)
      // Distribute items: first 7 months get more items, later months get fewer
      const itemsPerMonth = i < 7 
        ? Math.ceil(allItems.length / 9)  // First 7 months: ~9 items each
        : Math.ceil(allItems.length / 13) // Last 6 months: ~3 items each
      
      for (let j = 0; j < itemsPerMonth && itemIndex < allItems.length; j++) {
        itemsThisMonth.push(allItems[itemIndex])
        itemIndex++
      }
      
      // Calculate spent based on items assigned
      spent = itemsThisMonth.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0)
      
      // Convert to BudgetLineItem format
      lineItems = itemsThisMonth.map((item: { name: string; category: string; amount: number; vendor?: string; notes?: string }, idx: number) => ({
        id: `${monthStr}-${idx}`,
        name: item.name,
        category: item.category,
        amount: item.amount,
        imageUrl: getBudgetItemImage(item.category, item.name),
        date: `${monthStr}-${String(Math.floor(1 + (idx * 7))).padStart(2, '0')}`, // Spread dates within month
        vendor: item.vendor,
        notes: item.notes
      }))
    }
    // Future months: no spending, no items, only budget
    
    months.push({
      month: monthStr,
      budget,
      spent: Math.min(spent, budget), // Don't exceed budget, or 0 for future months
      lineItems
    })
    
    console.log(`📅 Month ${monthStr}:`, {
      budget,
      spent: Math.min(spent, budget),
      itemCount: lineItems.length,
      itemsTotal: lineItems.reduce((sum: number, item: BudgetLineItem) => sum + item.amount, 0),
      isPastOrCurrent: monthHasPassed || isCurrentMonth
    })
  }
  
  // If there are remaining items, add them to the last month that has already occurred
  if (itemIndex < allItems.length) {
    // Find the last month that has passed or is current (has lineItems)
    const lastMonthWithSpending = [...months].reverse().find(m => m.lineItems.length > 0)
    
    if (lastMonthWithSpending) {
      console.log(`⚠️ Remaining items (${allItems.length - itemIndex}) being added to last month with spending: ${lastMonthWithSpending.month}`)
      const remainingItems = allItems.slice(itemIndex)
      
      remainingItems.forEach((item: { name: string; category: string; amount: number; vendor?: string; notes?: string }, idx: number) => {
        lastMonthWithSpending.lineItems.push({
          id: `${lastMonthWithSpending.month}-${lastMonthWithSpending.lineItems.length}`,
          name: item.name,
          category: item.category,
          amount: item.amount,
          imageUrl: getBudgetItemImage(item.category, item.name),
          date: `${lastMonthWithSpending.month}-${String(20 + idx).padStart(2, '0')}`,
          vendor: item.vendor,
          notes: item.notes
        })
      })
      
      // Update spent amount
      lastMonthWithSpending.spent = lastMonthWithSpending.lineItems.reduce((sum: number, item: BudgetLineItem) => sum + item.amount, 0)
      lastMonthWithSpending.budget = Math.max(lastMonthWithSpending.budget, lastMonthWithSpending.spent)
      
      console.log(`📅 Last month updated:`, {
        month: lastMonthWithSpending.month,
        budget: lastMonthWithSpending.budget,
        spent: lastMonthWithSpending.spent,
        itemCount: lastMonthWithSpending.lineItems.length
      })
    } else {
      console.log(`⚠️ No past/current months found to assign remaining items (${allItems.length - itemIndex})`)
    }
  }
  
  // Add specific month-assigned items (invoices, contracts, etc.)
  // November 2025: Digital Lab Paint Floor Space Renovation Contractors - $1200
  const november2025 = months.find(m => m.month === '2025-11')
  if (november2025) {
    const renovationItem: BudgetLineItem = {
      id: '2025-11-renovation',
      name: 'Digital Lab Paint Floor Space Renovation Contractors',
      category: 'room-build-out', // Changed to room-build-out category
      amount: 1200,
      imageUrl: getBudgetItemImage('room-build-out', 'renovation'),
      date: '2025-11-15',
      vendor: 'Contractors',
      notes: 'Paint and floor space renovation work'
    }
    november2025.lineItems.push(renovationItem)
    november2025.spent += 1200
    november2025.budget = Math.max(november2025.budget, november2025.spent)
    console.log('✅ Added November 2025 renovation item:', renovationItem)
  }
  
  // December 2025: Digital Lab Surface Touch-ups - $360
  const december2025 = months.find(m => m.month === '2025-12')
  if (december2025) {
    const touchupItem: BudgetLineItem = {
      id: '2025-12-touchups',
      name: 'Digital Lab Surface Touch-ups',
      category: 'room-build-out', // Changed to room-build-out category
      amount: 360,
      imageUrl: getBudgetItemImage('room-build-out', 'touch-ups'),
      date: '2025-12-10',
      vendor: 'Contractors',
      notes: 'Surface touch-ups and finishing work'
    }
    december2025.lineItems.push(touchupItem)
    december2025.spent += 360
    december2025.budget = Math.max(december2025.budget, december2025.spent)
    console.log('✅ Added December 2025 touch-ups item:', touchupItem)
    
    // December 2025: Verity IT - Cabling Service - $4,941
    const verityItem: BudgetLineItem = {
      id: '2025-12-verity-cabling',
      name: 'Verity IT - Cabling Service',
      category: 'streaming',
      amount: 4941,
      imageUrl: getBudgetItemImage('streaming', 'cabling'),
      date: '2025-12-15',
      vendor: 'Verity',
      notes: 'Install the conduit and rub fiver line. Labor. Install 130 ft or EMT conduit. Clean up 3 old cables'
    }
    december2025.lineItems.push(verityItem)
    december2025.spent += 4941
    december2025.budget = Math.max(december2025.budget, december2025.spent)
    console.log('✅ Added December 2025 Verity IT cabling item:', verityItem)
  }
  
  const finalTotal = months.reduce((sum: number, m: BudgetMonth) => sum + m.budget, 0)
  const finalSpent = months.reduce((sum: number, m: BudgetMonth) => sum + m.spent, 0)
  const totalItems = months.reduce((sum: number, m: BudgetMonth) => sum + m.lineItems.length, 0)
  
  console.log('✅ generateMockBudgetData() complete:', {
    orgSlug,
    year,
    monthsGenerated: months.length,
    totalBudget: finalTotal,
    totalSpent: finalSpent,
    totalLineItems: totalItems,
    expectedBudget: totalBudget
  })
  
  return months
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function getCategoryById(categoryId: string): BudgetCategory | undefined {
  return BUDGET_CATEGORIES.find(c => c.id === categoryId)
}

export function getTotalBudget(months: BudgetMonth[]): number {
  return months.reduce((sum: number, month: BudgetMonth) => sum + month.budget, 0)
}

export function getTotalSpent(months: BudgetMonth[]): number {
  return months.reduce((sum: number, month: BudgetMonth) => sum + month.spent, 0)
}

export function getCategoryTotal(months: BudgetMonth[], categoryId: string): number {
  return months.reduce((sum: number, month: BudgetMonth) => {
    return sum + month.lineItems
      .filter((item: BudgetLineItem) => item.category === categoryId)
      .reduce((itemSum: number, item: BudgetLineItem) => itemSum + item.amount, 0)
  }, 0)
}

