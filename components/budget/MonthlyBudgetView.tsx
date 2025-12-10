'use client'

import React, { useState, useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { BudgetMonth, BudgetLineItem, BUDGET_CATEGORIES, formatCurrency, formatMonth } from '@/lib/budget/budget-utils'
import { BudgetLineItem as BudgetLineItemComponent } from './BudgetLineItem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MonthlyBudgetViewProps {
  month: BudgetMonth
  onBack?: () => void
}

export function MonthlyBudgetView({ month, onBack }: MonthlyBudgetViewProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const filteredItems = useMemo(() => {
    let items = month.lineItems
    
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory)
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      items = items.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.vendor?.toLowerCase().includes(term) ||
        item.notes?.toLowerCase().includes(term)
      )
    }
    
    return items
  }, [month.lineItems, selectedCategory, searchTerm])
  
  const categoryTotal = useMemo(() => {
    if (selectedCategory === 'all') return month.spent
    return filteredItems.reduce((sum, item) => sum + item.amount, 0)
  }, [filteredItems, selectedCategory, month.spent])
  
  const remaining = month.budget - month.spent
  const spentPercentage = (month.spent / month.budget) * 100
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatMonth(month.month)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Budget Overview
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>
      
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(month.budget)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(month.spent)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {spentPercentage.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn(
              'text-2xl font-bold',
              remaining >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            )}>
              {formatCurrency(remaining)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Line Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredItems.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {selectedCategory !== 'all' && `${filteredItems.length} in category`}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Budget Usage</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(month.spent)} / {formatCurrency(month.budget)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  spentPercentage > 100 ? 'bg-red-500' : 'bg-blue-500'
                )}
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search line items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-64">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {BUDGET_CATEGORIES.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Category Filter Badge */}
      {selectedCategory !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Showing:</span>
          <Badge variant="secondary">
            {BUDGET_CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </Badge>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({formatCurrency(categoryTotal)})
          </span>
        </div>
      )}
      
      {/* Line Items */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No line items found matching your filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        )}>
          {filteredItems.map((item) => (
            <BudgetLineItemComponent
              key={item.id}
              item={item}
              showImage={true}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

