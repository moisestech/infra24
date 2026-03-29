'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  BudgetMonth, 
  formatCurrency, 
  formatMonth, 
  getTotalBudget, 
  getTotalSpent,
  getTotalPlanned,
  getCategoryTotal,
  BUDGET_CATEGORIES
} from '@/lib/budget/budget-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Calendar, TrendingUp, DollarSign, ArrowRight } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { CategoryIcon } from './CategoryIcon'
import { cn } from '@/lib/utils'
import { getBudgetConfig } from '@/lib/budget/budget-data'

export interface CategoryChartItem {
  name: string
  value: number
  color: string
  [key: string]: unknown // Recharts compatibility
}

interface BudgetDashboardProps {
  months: BudgetMonth[]
  organizationSlug: string
  totalBudget?: number // When provided (e.g. from API/Airtable), use instead of getBudgetConfig
  /** When provided (e.g. for Oolite/Airtable), use for category pie instead of BUDGET_CATEGORIES */
  categoryChartData?: CategoryChartItem[]
}

export function BudgetDashboard({ months, organizationSlug, totalBudget: totalBudgetProp, categoryChartData: categoryChartDataProp }: BudgetDashboardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [selectedYear, setSelectedYear] = useState<string>('2025')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [chartMode, setChartMode] = useState<'spent' | 'planned' | 'both'>('spent')
  
  // Use passed totalBudget (from API/Airtable) or fall back to getBudgetConfig
  const budgetConfig = getBudgetConfig(organizationSlug)
  const totalBudget = totalBudgetProp ?? budgetConfig.totalBudget
  const totalSpent = getTotalSpent(months)
  const totalPlanned = getTotalPlanned(months)
  const remaining = totalBudget - totalSpent
  
  // Chart data for monthly spending (spent = actuals only, planned = forecast)
  const monthlyChartData = useMemo(() => {
    return months.map(month => ({
      month: new Date(month.month).toLocaleDateString('en-US', { month: 'short' }),
      monthKey: month.month,
      budget: month.budget,
      spent: month.spent,
      planned: month.planned ?? 0,
      remaining: month.budget - month.spent
    }))
  }, [months])
  
  // Pie chart data for categories - when chartMode planned/both, build from plannedLineItems (display categories)
  const categoryChartData = useMemo(() => {
    const plannedByCat: Record<string, number> = {}
    months.forEach(month => {
      (month.plannedLineItems || []).forEach(item => {
        const cat = item.category || 'Other'
        plannedByCat[cat] = (plannedByCat[cat] ?? 0) + item.amount
      })
    })
    const spentByCat: Record<string, number> = {}
    months.forEach(month => {
      month.lineItems.forEach(item => {
        const cat = item.category || 'Other'
        spentByCat[cat] = (spentByCat[cat] ?? 0) + item.amount
      })
    })
    const allCats = new Set([...Object.keys(spentByCat), ...Object.keys(plannedByCat)])
    const getColor = (name: string) => BUDGET_CATEGORIES.find(c => c.name === name)?.color ?? '#6B7280'
    if (chartMode === 'spent') {
      if (categoryChartDataProp && categoryChartDataProp.length > 0) {
        return categoryChartDataProp
      }
      return BUDGET_CATEGORIES.map(c => ({ name: c.name, value: getCategoryTotal(months, c.id), color: c.color })).filter(i => i.value > 0)
    }
    if (chartMode === 'planned') {
      return Array.from(allCats)
        .filter(cat => (plannedByCat[cat] ?? 0) > 0)
        .map(cat => ({ name: cat, value: plannedByCat[cat] ?? 0, color: getColor(cat) }))
    }
    return Array.from(allCats)
      .filter(cat => ((spentByCat[cat] ?? 0) + (plannedByCat[cat] ?? 0)) > 0)
      .map(cat => ({ name: cat, value: (spentByCat[cat] ?? 0) + (plannedByCat[cat] ?? 0), color: getColor(cat) }))
  }, [months, categoryChartDataProp, chartMode])
  
  const COLORS = categoryChartData.map(item => item.color)
  
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-100">
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{formatCurrency(totalBudget)}</p>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-100">
              Total Spent (Actuals only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
            <p className="text-sm text-green-100 mt-2">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </p>
            <p className="text-xs text-green-200 mt-1">Posted/confirmed spend only — Planned excluded</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-100">
              Total Planned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{formatCurrency(totalPlanned)}</p>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
            <p className="text-xs text-purple-200 mt-1">Forecast — not yet spent</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-100">
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className={cn(
                'text-3xl font-bold',
                remaining >= 0 ? 'text-white' : 'text-red-200'
              )}>
                {formatCurrency(remaining)}
              </p>
              <Calendar className="h-8 w-8 text-orange-200" />
            </div>
            <p className="text-xs text-orange-200 mt-1">Cap − Spent (Actuals)</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-cyan-100">
              Months Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{months.length}</p>
              <Calendar className="h-8 w-8 text-cyan-200" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts - Stacked vertically for better readability */}
      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Spending Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>Monthly Spending Overview</CardTitle>
                <CardDescription>
                  Toggle to show Spent (actuals), Planned (forecast), or Both
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {(['spent', 'planned', 'both'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setChartMode(mode)}
                    className={cn(
                      'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                      chartMode === mode
                        ? 'bg-blue-600 text-white'
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    )}
                  >
                    {mode === 'spent' ? 'Spent' : mode === 'planned' ? 'Planned' : 'Both'}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fill: isDark ? '#D1D5DB' : '#374151' }}
                />
                <YAxis 
                  tick={{ fill: isDark ? '#D1D5DB' : '#374151' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    color: isDark ? '#F9FAFB' : '#111827'
                  }}
                />
                <Legend />
                <Bar dataKey="budget" fill="#3B82F6" name="Budget" radius={[4, 4, 0, 0]} />
                {(chartMode === 'spent' || chartMode === 'both') && (
                  <Bar dataKey="spent" fill="#10B981" name="Spent (Actuals)" radius={[4, 4, 0, 0]} stackId={chartMode === 'both' ? 'a' : undefined} />
                )}
                {(chartMode === 'planned' || chartMode === 'both') && (
                  <Bar dataKey="planned" fill="#8B5CF6" name="Planned" radius={[4, 4, 0, 0]} stackId={chartMode === 'both' ? 'a' : undefined} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Category Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Spending by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    color: isDark ? '#F9FAFB' : '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Monthly Breakdown
          </h2>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <SelectItem value="all" className={isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}>
                All Categories
              </SelectItem>
              {BUDGET_CATEGORIES.map(category => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className={isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((month) => {
            const monthSpent = selectedCategory === 'all' 
              ? month.spent 
              : month.lineItems
                  .filter(item => item.category === selectedCategory)
                  .reduce((sum, item) => sum + item.amount, 0)
            
            const monthBudget = selectedCategory === 'all' 
              ? month.budget 
              : month.budget * 0.2 // Rough estimate for category
            
            const spentPercentage = (monthSpent / monthBudget) * 100
            
            return (
              <Link 
                key={month.month}
                href={`/o/${organizationSlug}/budget/monthly/${month.month}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {formatMonth(month.month)}
                        </CardTitle>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Budget</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(monthBudget)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Spent</span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {formatCurrency(monthSpent)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div 
                            className={cn(
                              'h-2 rounded-full transition-all duration-500',
                              spentPercentage > 100 ? 'bg-red-500' : 'bg-blue-500'
                            )}
                            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {month.lineItems.length} line items
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Category Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Category Summary</CardTitle>
          <CardDescription>
            Total spending by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {BUDGET_CATEGORIES.map(category => {
              const total = getCategoryTotal(months, category.id)
              const percentage = (total / totalSpent) * 100
              
              if (total === 0) return null
              
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CategoryIcon categoryId={category.id} size="md" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(total)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

