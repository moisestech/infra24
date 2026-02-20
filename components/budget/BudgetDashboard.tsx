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

interface BudgetDashboardProps {
  months: BudgetMonth[]
  organizationSlug: string
}

export function BudgetDashboard({ months, organizationSlug }: BudgetDashboardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [selectedYear, setSelectedYear] = useState<string>('2025')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Use the config totalBudget ($80k) instead of summing months
  // This ensures consistency with the main budget page
  const budgetConfig = getBudgetConfig(organizationSlug)
  const totalBudget = budgetConfig.totalBudget // Use $80k from config
  const totalSpent = getTotalSpent(months)
  const remaining = totalBudget - totalSpent
  
  // Chart data for monthly spending
  const monthlyChartData = useMemo(() => {
    return months.map(month => ({
      month: new Date(month.month).toLocaleDateString('en-US', { month: 'short' }),
      budget: month.budget,
      spent: month.spent,
      remaining: month.budget - month.spent
    }))
  }, [months])
  
  // Pie chart data for categories
  const categoryChartData = useMemo(() => {
    return BUDGET_CATEGORIES.map(category => ({
      name: category.name,
      value: getCategoryTotal(months, category.id),
      color: category.color
    })).filter(item => item.value > 0)
  }, [months])
  
  const COLORS = categoryChartData.map(item => item.color)
  
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              Total Spent
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
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
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
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-100">
              Months Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{months.length}</p>
              <Calendar className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts - Stacked vertically for better readability */}
      <div className="grid grid-cols-1 gap-6">
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

