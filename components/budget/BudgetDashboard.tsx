'use client'

import React, { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  BudgetMonth, 
  formatCurrency, 
  formatMonth, 
  getTotalBudget, 
  getTotalSpent,
  getCategoryTotal,
  BUDGET_CATEGORIES
} from '@/lib/budget/budget-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Calendar, TrendingUp, DollarSign, ArrowRight, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
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

interface BudgetDashboardProps {
  months: BudgetMonth[]
  organizationSlug: string
}

export function BudgetDashboard({ months, organizationSlug }: BudgetDashboardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [selectedYear, setSelectedYear] = useState<string>('2025')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)
  
  // Use the config totalBudget ($80k) instead of summing months
  // This ensures consistency with the main budget page
  const budgetConfig = getBudgetConfig(organizationSlug)
  const totalBudget = budgetConfig.totalBudget // Use $80k from config
  
  // Filter months to only show up to December 2025
  const filteredMonths = months.filter(month => {
    const [year, monthNum] = month.month.split('-').map(Number)
    return year < 2026 || (year === 2025 && monthNum <= 12)
  })
  
  const totalSpent = getTotalSpent(filteredMonths)
  const remaining = totalBudget - totalSpent
  
  // Chart data for monthly spending - use filtered months
  const monthlyChartData = useMemo(() => {
    return filteredMonths.map(month => {
      // Parse month string (YYYY-MM) and format for display
      const [year, monthNum] = month.month.split('-').map(Number)
      const date = new Date(year, monthNum - 1, 1) // monthNum - 1 because Date months are 0-indexed
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        budget: month.budget,
        spent: month.spent,
        remaining: month.budget - month.spent
      }
    })
  }, [filteredMonths])
  
  // Pie chart data for categories - use filtered months
  const categoryChartData = useMemo(() => {
    return BUDGET_CATEGORIES.map(category => ({
      name: category.name,
      value: getCategoryTotal(filteredMonths, category.id),
      color: category.color
    })).filter(item => item.value > 0)
  }, [filteredMonths])
  
  const COLORS = categoryChartData.map(item => item.color)
  
  return (
    <div className="space-y-8">
      {/* Monthly Spending Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Overview</CardTitle>
          <CardDescription>
            Budget vs. Spent by month
          </CardDescription>
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
              <Bar dataKey="spent" fill="#10B981" name="Spent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
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
          {filteredMonths.map((month) => {
            const monthSpent = selectedCategory === 'all' 
              ? month.spent 
              : month.lineItems
                  .filter(item => item.category === selectedCategory)
                  .reduce((sum, item) => sum + item.amount, 0)
            
            const monthBudget = selectedCategory === 'all' 
              ? month.budget 
              : month.budget * 0.2 // Rough estimate for category
            
            const spentPercentage = (monthSpent / monthBudget) * 100
            const isExpanded = expandedMonth === month.month
            const filteredLineItems = selectedCategory === 'all'
              ? month.lineItems
              : month.lineItems.filter(item => item.category === selectedCategory)
            
            return (
              <motion.div
                key={month.month}
                initial={false}
              >
                <Card className={cn(
                  "hover:shadow-lg transition-all duration-200 h-full",
                  isExpanded && "shadow-lg"
                )}>
                  <CardHeader 
                    className="pb-3 cursor-pointer"
                    onClick={() => setExpandedMonth(isExpanded ? null : month.month)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {formatMonth(month.month)}
                      </CardTitle>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
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
                        {filteredLineItems.length} line items
                      </p>
                    </div>

                    {/* Expanded Line Items */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2 max-h-96 overflow-y-auto"
                      >
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Line Items:
                        </p>
                        {filteredLineItems.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No items found for this category
                          </p>
                        ) : (
                          filteredLineItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                  </p>
                                  {item.category && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {BUDGET_CATEGORIES.find(c => c.id === item.category)?.name || item.category}
                                    </p>
                                  )}
                                  {item.notes && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                      {item.notes}
                                    </p>
                                  )}
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white ml-2">
                                  {formatCurrency(item.amount)}
                                </p>
                              </div>
                              {item.vendor && (
                                <div className="flex items-center gap-1 mt-1">
                                  {item.vendor.startsWith('http') ? (
                                    <a
                                      href={item.vendor}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View vendor
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Vendor: {item.vendor}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
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
              const total = getCategoryTotal(filteredMonths, category.id)
              const percentage = totalSpent > 0 ? (total / totalSpent) * 100 : 0
              
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

