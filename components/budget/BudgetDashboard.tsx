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
  getCategoryTotal
} from '@/lib/budget/budget-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  categories?: Array<{ id: string; name: string; emoji: string }>
  getCategoryColor?: (categoryId: string) => string
}

export function BudgetDashboard({ months, organizationSlug, categories, getCategoryColor }: BudgetDashboardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [selectedYear, setSelectedYear] = useState<string>('2025')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)
  const [showPercentageInChart, setShowPercentageInChart] = useState(false)
  
  // Use the config totalBudget ($80k) instead of summing months
  // This ensures consistency with the main budget page
  const budgetConfig = getBudgetConfig(organizationSlug)
  const totalBudget = budgetConfig.totalBudget // Use $80k from config
  
  // Map dashboard category IDs to display category names (same as overview)
  const categoryIdToDisplayName: Record<string, string> = {
    'room-build-out': 'Room Build-Out',
    'hardware-materials': 'Hardware & Materials',
    'equipment-maintenance': 'Equipment Maintenance',
    'streaming': 'Streaming',
    'virtual-reality': 'Virtual and Augmented Reality',
    '3d-printing': '3D Printing',
    'large-format-printer': 'Large Format Printer',
    'furniture': 'Furniture & Fixtures'
  }
  
  // Default color function if not provided
  const defaultGetCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      'Room Build-Out': '#3B82F6',
      'Furniture & Fixtures': '#10B981',
      'Compute': '#8B5CF6',
      'Displays & Projection': '#F59E0B',
      'Virtual and Augmented Reality': '#8B5CF6',
      '3D Printing': '#EC4899',
      'Streaming': '#06B6D4',
      'Large Format Printer': '#F97316'
    }
    return colors[categoryId] || '#6B7280'
  }
  
  const categoryColorFn = getCategoryColor || defaultGetCategoryColor
  
  // Filter months to only show up to December 2025
  const filteredMonths = months.filter(month => {
    const [year, monthNum] = month.month.split('-').map(Number)
    return year < 2026 || (year === 2025 && monthNum <= 12)
  })
  
  const totalSpent = getTotalSpent(filteredMonths)
  const remaining = totalBudget - totalSpent
  
  // Get active categories from overview (excluding 'all')
  const activeCategories = categories?.slice(1) || []
  
  // Get categories that actually have spending, sorted by total spending (descending)
  const categoriesWithSpending = useMemo(() => {
    const categoryTotals: Record<string, number> = {}
    filteredMonths.forEach(month => {
      month.lineItems.forEach(item => {
        const displayName = categoryIdToDisplayName[item.category] || item.category
        categoryTotals[displayName] = (categoryTotals[displayName] || 0) + item.amount
      })
    })
    
    // Return only categories that have spending and are in activeCategories, sorted by total (descending)
    return activeCategories
      .filter(cat => {
        const total = categoryTotals[cat.name] || 0
        return total > 0
      })
      .sort((a, b) => {
        const totalA = categoryTotals[a.name] || 0
        const totalB = categoryTotals[b.name] || 0
        return totalB - totalA // Descending order
      })
  }, [filteredMonths, activeCategories, categoryIdToDisplayName])
  
  // Chart data for cumulative spending by month (spending only, no remaining)
  const cumulativeChartData = useMemo(() => {
    let cumulativeSpent = 0
    return filteredMonths.map(month => {
      cumulativeSpent += month.spent
      const [year, monthNum] = month.month.split('-').map(Number)
      const date = new Date(year, monthNum - 1, 1)
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        monthKey: month.month,
        'Cumulative Spent': cumulativeSpent
      }
    })
  }, [filteredMonths])
  
  // Calculate category breakdown per month using display category names
  const monthlyCategoryData = useMemo(() => {
    return filteredMonths.map(month => {
      const [year, monthNum] = month.month.split('-').map(Number)
      const date = new Date(year, monthNum - 1, 1)
      const categoryBreakdown: Record<string, number> = {}
      
      // Group line items by category using display names
      month.lineItems.forEach(item => {
        const displayName = categoryIdToDisplayName[item.category] || item.category
        // Only include categories that are actively used
        if (categoriesWithSpending.some(cat => cat.name === displayName)) {
          categoryBreakdown[displayName] = (categoryBreakdown[displayName] || 0) + item.amount
        }
      })
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        monthKey: month.month,
        ...categoryBreakdown
      }
    })
  }, [filteredMonths, categoriesWithSpending, categoryIdToDisplayName])
  
  // Pie chart data for categories - use categoriesWithSpending
  const categoryChartData = useMemo(() => {
    return categoriesWithSpending.map(category => {
      let total = 0
      filteredMonths.forEach(month => {
        month.lineItems.forEach(item => {
          const displayName = categoryIdToDisplayName[item.category] || item.category
          if (displayName === category.name) {
            total += item.amount
          }
        })
      })
      return {
        name: category.name,
        value: total,
        color: categoryColorFn(category.name)
      }
    }).filter(item => item.value > 0)
  }, [filteredMonths, categoriesWithSpending, categoryIdToDisplayName, categoryColorFn])
  
  const COLORS = categoryChartData.map(item => item.color)
  
  return (
    <div className="space-y-8">
      {/* Cumulative Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Overview</CardTitle>
          <CardDescription>
            Cumulative spending by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cumulativeChartData}>
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
              <Bar dataKey="Cumulative Spent" fill="#10B981" name="Cumulative Spent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Stacked Chart by Category per Month */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Spending by Category</CardTitle>
              <CardDescription>
                Spending breakdown by category for each month
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Values:
              </span>
              <Button
                variant={showPercentageInChart ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPercentageInChart(true)}
                className={showPercentageInChart ? '' : (isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')}
              >
                %
              </Button>
              <Button
                variant={!showPercentageInChart ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPercentageInChart(false)}
                className={!showPercentageInChart ? '' : (isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')}
              >
                $
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: isDark ? '#D1D5DB' : '#374151' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: isDark ? '#D1D5DB' : '#374151' }}
                tickFormatter={(value) => {
                  if (showPercentageInChart) {
                    // Calculate percentage of total spent for the month
                    const monthData = monthlyCategoryData.find(m => {
                      const monthTotal = Object.entries(m)
                        .filter(([key]) => key !== 'month' && key !== 'monthKey')
                        .reduce((sum, [, val]) => sum + Number(val), 0)
                      return monthTotal > 0 && (value / monthTotal) * 100 <= 100
                    })
                    if (monthData) {
                      const monthTotal = Object.entries(monthData)
                        .filter(([key]) => key !== 'month' && key !== 'monthKey')
                        .reduce((sum, [, val]) => sum + Number(val), 0)
                      return monthTotal > 0 ? `${((value / monthTotal) * 100).toFixed(0)}%` : '0%'
                    }
                    return '0%'
                  }
                  return `$${(value / 1000).toFixed(0)}k`
                }}
              />
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  if (showPercentageInChart) {
                    const monthData = props.payload
                    const monthTotal = Object.entries(monthData)
                      .filter(([key]) => key !== 'month' && key !== 'monthKey')
                      .reduce((sum, [, val]) => sum + (val as number), 0)
                    const percentage = monthTotal > 0 ? ((value / monthTotal) * 100).toFixed(1) : '0.0'
                    return [`${name}: ${percentage}%`, '']
                  }
                  return [formatCurrency(value), '']
                }}
                contentStyle={{
                  backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '0.5rem',
                  color: isDark ? '#F9FAFB' : '#111827'
                }}
              />
              <Legend />
              {categoriesWithSpending.map((category, index) => {
                const color = categoryColorFn(category.name)
                return (
                  <Bar 
                    key={category.id}
                    dataKey={category.name} 
                    stackId="a"
                    fill={color} 
                    name={category.name}
                    radius={index === categoriesWithSpending.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                )
              })}
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
              {categoriesWithSpending.map(category => (
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
            
            const isExpanded = expandedMonth === month.month
            const filteredLineItems = selectedCategory === 'all'
              ? month.lineItems
              : month.lineItems.filter(item => item.category === selectedCategory)
            
            // Group line items by category
            const itemsByCategory = filteredLineItems.reduce((acc, item) => {
              // Map category ID to display name
              const categoryName = categoryIdToDisplayName[item.category] || item.category || 'Other'
              
              // Only include categories that are actively used
              if (!categoriesWithSpending.some(cat => cat.name === categoryName)) {
                return acc
              }
              
              if (!acc[categoryName]) {
                acc[categoryName] = []
              }
              acc[categoryName].push(item)
              return acc
            }, {} as Record<string, typeof filteredLineItems>)
            
            // Sort categories by total spending for this month (descending)
            const sortedCategoryEntries = Object.entries(itemsByCategory).sort(([nameA, itemsA], [nameB, itemsB]) => {
              const totalA = itemsA.reduce((sum, item) => sum + item.amount, 0)
              const totalB = itemsB.reduce((sum, item) => sum + item.amount, 0)
              return totalB - totalA // Descending order
            })
            
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
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-600 dark:text-gray-400">Spent</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(monthSpent)}
                        </span>
                      </div>
                      
                      {/* Category Breakdown - Always Visible */}
                      <div className="space-y-2">
                        {sortedCategoryEntries.length === 0 ? (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            No items found
                          </p>
                        ) : (
                          sortedCategoryEntries.map(([categoryName, items]) => {
                            const category = categoriesWithSpending.find(c => c.name === categoryName)
                            const categoryTotal = items.reduce((sum, item) => sum + item.amount, 0)
                            const categoryPercentage = monthSpent > 0 ? (categoryTotal / monthSpent) * 100 : 0
                            const color = categoryColorFn(categoryName)
                            
                            return (
                              <div key={categoryName} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {category && (
                                      <CategoryIcon categoryId={category.id} size="sm" />
                                    )}
                                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                                      {categoryName}
                                    </p>
                                  </div>
                                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(categoryTotal)}
                                  </p>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div 
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${categoryPercentage}%`,
                                      backgroundColor: color
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    {/* Expanded Line Items by Category */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-4 max-h-[600px] overflow-y-auto"
                      >
                        {sortedCategoryEntries.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No items found for this category
                          </p>
                        ) : (
                          sortedCategoryEntries.map(([categoryName, items]) => {
                            const category = categoriesWithSpending.find(c => c.name === categoryName)
                            const categoryTotal = items.reduce((sum, item) => sum + item.amount, 0)
                            const categoryPercentage = monthSpent > 0 ? (categoryTotal / monthSpent) * 100 : 0
                            const color = categoryColorFn(categoryName)
                            
                            return (
                              <div key={categoryName} className="space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b-2" style={{ borderColor: color }}>
                                  <div className="flex items-center gap-2">
                                    {category && (
                                      <CategoryIcon categoryId={category.id} size="md" />
                                    )}
                                    <div>
                                      <p 
                                        className="text-sm font-semibold"
                                        style={{ color: color }}
                                      >
                                        {categoryName}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {items.length} {items.length === 1 ? 'item' : 'items'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                      {formatCurrency(categoryTotal)}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {categoryPercentage.toFixed(1)}% of month
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2 pl-2">
                                  {items.map((item, idx) => {
                                    const itemPercentage = categoryTotal > 0 ? (item.amount / categoryTotal) * 100 : 0
                                    return (
                                      <div
                                        key={item.id}
                                        className="p-3 rounded-lg border transition-all hover:shadow-md"
                                        style={{
                                          backgroundColor: `${color}08`,
                                          borderColor: `${color}40`
                                        }}
                                      >
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2">
                                              <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">
                                                #{idx + 1}
                                              </span>
                                              <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                                  {item.name}
                                                </p>
                                                {item.notes && (
                                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                                                    {item.notes}
                                                  </p>
                                                )}
                                                {item.date && (
                                                  <div className="flex items-center gap-1 mb-2">
                                                    <Calendar className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                      {new Date(item.date).toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric', 
                                                        year: 'numeric' 
                                                      })}
                                                    </span>
                                                  </div>
                                                )}
                                                {item.vendor && (
                                                  <div className="flex items-center gap-1">
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
                                            </div>
                                          </div>
                                          <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                              {formatCurrency(item.amount)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              {itemPercentage.toFixed(1)}%
                                            </p>
                                          </div>
                                        </div>
                                        {/* Progress bar for item within category */}
                                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                          <div 
                                            className="h-1 rounded-full transition-all duration-300"
                                            style={{ 
                                              width: `${itemPercentage}%`,
                                              backgroundColor: color
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })
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
            {categoriesWithSpending.map(category => {
              // Calculate total for this category by mapping IDs to display names
              let total = 0
              filteredMonths.forEach(month => {
                month.lineItems.forEach(item => {
                  const displayName = categoryIdToDisplayName[item.category] || item.category
                  if (displayName === category.name) {
                    total += item.amount
                  }
                })
              })
              
              const percentage = totalSpent > 0 ? (total / totalSpent) * 100 : 0
              const color = categoryColorFn(category.name)
              
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
                        backgroundColor: color
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

