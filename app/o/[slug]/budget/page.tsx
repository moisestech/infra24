'use client'

/**
 * Universal Budget Page for All Organizations
 * 
 * This is the dynamic budget page that works for any organization slug.
 * Route: /o/[slug]/budget
 * 
 * Features:
 * - Loads CSV data from lib/budget/budget-data.ts
 * - Supports multiple organizations (oolite, bakehouse, default)
 * - Comprehensive logging for debugging
 * - Dark/light theme support
 * - Budget comparison and analytics
 * 
 * Usage:
 * - /o/oolite/budget - Oolite Arts budget
 * - /o/bakehouse/budget - Bakehouse Arts budget
 * - /o/[any-slug]/budget - Uses default budget config
 */

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { BudgetDashboard } from '@/components/budget/BudgetDashboard'
import { BudgetMonth, BudgetLineItem } from '@/lib/budget/budget-utils'
import { 
  DollarSign, 
  ExternalLink, 
  Search, 
  Filter, 
  Download, 
  Calculator,
  TrendingUp,
  Package,
  Wrench,
  Monitor,
  Palette,
  Camera,
  Wifi,
  Shield,
  Users,
  Building,
  ChevronDown,
  ChevronRight,
  Wallet,
  TrendingDown
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { getBudgetConfig } from '@/lib/budget/budget-data'

interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  favicon_url?: string
}

interface BudgetItem {
  emoji: string
  lineItem: string
  category: string
  qty: number
  unitCost: number
  subtotal: number
  notes: string
  comments: string
  links: string
  participant: string
  phase: number
  priority: 'high' | 'medium' | 'low'
}

export default function DigitalLabBudgetPage() {
  const params = useParams()
  const slug = params.slug as string
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  
  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  }

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [filteredItems, setFilteredItems] = useState<BudgetItem[]>([])
  const [totalBudget, setTotalBudget] = useState<number>(0) // Store total budget from config
  const [budgetMonths, setBudgetMonths] = useState<BudgetMonth[]>([]) // For dashboard tab
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCosts, setShowCosts] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showPercentageInChart, setShowPercentageInChart] = useState(true)
  const [selectedCategoryForSort, setSelectedCategoryForSort] = useState<string | null>(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [showRemainingInChart, setShowRemainingInChart] = useState(true)

  const categories = [
    { id: 'all', name: 'All Categories', emoji: '📊' },
    { id: 'Room Build-Out', name: 'Room Build-Out', emoji: '🧱' },
    { id: 'Furniture & Fixtures', name: 'Furniture & Fixtures', emoji: '🪑' },
    { id: 'Compute', name: 'Compute', emoji: '💻' },
    { id: 'Displays & Projection', name: 'Displays & Projection', emoji: '📺' },
    { id: 'Peripherals & Creation', name: 'Peripherals & Creation', emoji: '🧰' },
    { id: 'Streaming', name: 'Streaming', emoji: '📡' },
    { id: 'Audio', name: 'Audio', emoji: '🎙️' },
    { id: 'Networking & Storage', name: 'Networking & Storage', emoji: '🔌' },
    { id: 'Large Format Printer', name: 'Large Format Printer', emoji: '🖨️' },
    { id: 'Signage', name: 'Signage', emoji: '🪧' },
    { id: 'Contingency', name: 'Contingency', emoji: '🧮' }
  ]


  useEffect(() => {
    if (slug) {
      loadData()
    } else {
      console.warn('⚠️ Budget Page - No slug available, skipping loadData')
    }
  }, [slug])

  useEffect(() => {
    filterItems()
  }, [budgetItems, searchTerm, selectedCategory])

  // Update date/time every minute for live dashboard feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])


  const loadData = async () => {
    try {
      setLoading(true)
      console.log('📊 Budget Page - Loading data for org:', slug)
      
      // Load organization data
      const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        setOrganization(orgData.organization)
        console.log('✅ Budget Page - Organization loaded:', orgData.organization?.name)
      } else {
        console.warn('⚠️ Budget Page - Failed to load organization:', orgResponse.status)
      }

      // Load budget data from CSV source (lib/budget/budget-data.ts)
      const budgetConfig = getBudgetConfig(slug)
      
      console.log('📊 Budget Page - Budget config loaded:')
      console.log('  - Organization:', slug)
      console.log('  - Total budget (config):', budgetConfig.totalBudget)
      console.log('  - Total items:', budgetConfig.items.length)
      
      // Calculate totals from CSV data
      const csvTotal = budgetConfig.items.reduce((sum, item) => sum + item.amount, 0)
      console.log('  - CSV items total:', csvTotal)
      console.log('  - Difference (config - CSV):', budgetConfig.totalBudget - csvTotal)
      
      // Convert CSV data to BudgetItem format
      const budgetData = convertBudgetConfigToItems(budgetConfig, slug)
      const totalCost = budgetData.reduce((sum, item) => sum + item.subtotal, 0)
      
      console.log('📊 Budget Page - Converted budget data:')
      console.log('  - Total items:', budgetData.length)
      console.log('  - Total cost (calculated):', totalCost)
      console.log('  - Expected total (config):', budgetConfig.totalBudget)
      console.log('  - Difference:', Math.abs(totalCost - budgetConfig.totalBudget))
      
      // Log detailed item comparison for mismatches
      budgetData.forEach((item, idx) => {
        const csvItem = budgetConfig.items[idx]
        if (csvItem && Math.abs(csvItem.amount - item.subtotal) > 0.01) {
          console.warn(`⚠️ MISMATCH Item ${idx + 1}: CSV "${csvItem.name}" = $${csvItem.amount} vs Display "${item.lineItem}" = $${item.subtotal}`)
        }
      })
      
      // Log category summary for budget distribution
      const categorySummary: Record<string, { count: number; total: number }> = {}
      budgetData.forEach(item => {
        if (!categorySummary[item.category]) {
          categorySummary[item.category] = { count: 0, total: 0 }
        }
        categorySummary[item.category].count++
        categorySummary[item.category].total += item.subtotal
      })
      
      console.log('\n📊 Budget Distribution by Category:')
      Object.entries(categorySummary)
        .sort((a, b) => b[1].total - a[1].total)
        .forEach(([category, data]) => {
          const percentage = ((data.total / budgetConfig.totalBudget) * 100).toFixed(1)
          console.log(`  ${category}: ${data.count} items, $${data.total.toLocaleString()} (${percentage}%)`)
        })
      
      setBudgetItems(budgetData)
      setTotalBudget(budgetConfig.totalBudget) // Store the $80k total budget
      
      // Generate budget months directly from budgetItems for consistency
      // This ensures dashboard uses the same data source as the overview
      const generatedMonths = createMonthsFromBudgetItems(budgetData, budgetConfig.totalBudget)
      setBudgetMonths(generatedMonths)
      console.log('📊 Dashboard - Generated months from budgetItems:', generatedMonths.length, 'months (Sep-Dec 2025)')
      
      // Final summary comparison
      console.log('📊 Budget Page - FINAL SUMMARY:')
      console.log(`  Total Budget (config): $${budgetConfig.totalBudget.toLocaleString()}`)
      console.log(`  CSV Items Total: $${csvTotal.toLocaleString()}`)
      console.log(`  Displayed Total: $${totalCost.toLocaleString()}`)
      if (Math.abs(csvTotal - totalCost) > 0.01) {
        console.warn(`  ⚠️ WARNING: CSV total (${csvTotal}) != Display total (${totalCost})`)
      }
    } catch (err) {
      console.error('❌ Budget Page - Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = budgetItems

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.lineItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
  }

  const getTotalCost = () => {
    // Use the config totalBudget ($80k) instead of calculating from items
    return totalBudget || budgetItems.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const getSpentAmount = () => {
    // Calculate total spent from all budget items
    return budgetItems.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const getRemainingBudget = () => {
    // Remaining = Total Budget - Spent
    return getTotalCost() - getSpentAmount()
  }

  // Map dashboard category IDs to display category names
  const mapDashboardCategoryToDisplay = (dashboardCategoryId: string): string => {
    const categoryMap: Record<string, string> = {
      'room-build-out': 'Room Build-Out',
      'hardware-materials': 'Hardware & Materials',
      'equipment-maintenance': 'Equipment Maintenance',
      'contingency': 'Contingency'
    }
    return categoryMap[dashboardCategoryId] || dashboardCategoryId
  }

  const getCategoryTotal = (category: string) => {
    // Use filteredItems when a filter is active, otherwise use all budgetItems
    const itemsToUse = selectedCategory !== 'all' || searchTerm 
      ? filteredItems 
      : budgetItems
    let total = itemsToUse
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.subtotal, 0)
    
    // Also include items from budgetMonths (dashboard data) that map to this category
    if (budgetMonths.length > 0) {
      const dashboardCategoryId = Object.entries({
        'Room Build-Out': 'room-build-out',
        'Hardware & Materials': 'hardware-materials',
        'Equipment Maintenance': 'equipment-maintenance',
        'Streaming': 'streaming',
        'Audio': 'audio',
        'Contingency': 'contingency'
      }).find(([display]) => display === category)?.[1]
      
      if (dashboardCategoryId) {
        const dashboardTotal = budgetMonths.reduce((sum, month) => {
          return sum + month.lineItems
            .filter(item => item.category === dashboardCategoryId)
            .reduce((itemSum, item) => itemSum + item.amount, 0)
        }, 0)
        total += dashboardTotal
      }
    }
    
    return total
  }


  const getPieChartData = () => {
    // Calculate category totals - use same logic as category breakdown for consistency
    const categoryTotals = categories.slice(1).map(category => {
      // Use budgetItems directly (same as category breakdown base calculation)
      let total = budgetItems
        .filter(item => item.category === category.id)
        .reduce((sum, item) => sum + item.subtotal, 0)
      
      // Note: We're NOT including budgetMonths here to match the main data source
      // If you want dashboard data included, add it here too
      
      return {
        name: category.name,
        value: total,
        color: getCategoryColor(category.id),
        percentage: total > 0 ? (total / getTotalCost()) * 100 : 0
      }
    }).filter(item => item.value > 0)

    // Add remaining budget or spent amount based on toggle
    if (showRemainingInChart) {
      const remaining = getRemainingBudget()
      if (remaining > 0) {
        categoryTotals.push({
          name: 'Remaining Budget',
          value: remaining,
          color: '#6B7280', // Gray color for remaining
          percentage: (remaining / getTotalCost()) * 100
        })
      }
    } else {
      // Show spent amount instead
      const spent = getSpentAmount()
      if (spent > 0) {
        categoryTotals.push({
          name: 'Total Spent',
          value: spent,
          color: '#10B981', // Green color for spent
          percentage: (spent / getTotalCost()) * 100
        })
      }
    }

    return categoryTotals
  }

  const resetFilters = () => {
    setSelectedCategory('all')
    setSearchTerm('')
    setSelectedSegment(null)
    setSelectedCategoryForSort(null)
    setExpandedCategories(new Set())
  }

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      'Room Build-Out': '#3B82F6',
      'Furniture & Fixtures': '#10B981',
      'Compute': '#8B5CF6',
      'Displays & Projection': '#F59E0B',
      'Peripherals & Creation': '#EF4444',
      'Streaming': '#06B6D4',
      'Audio': '#EC4899',
      'Networking & Storage': '#84CC16',
      'Large Format Printer': '#F97316',
      'Signage': '#14B8A6',
      'Contingency': '#6B7280'
    }
    return colors[categoryId as keyof typeof colors] || '#6B7280'
  }

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
    // When expanding a category, bring it to the top
    setSelectedCategoryForSort(categoryId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category)
    return categoryData?.emoji || '📦'
  }

  if (loading) {
    return (
      <TenantProvider>
        <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-blue-400' : 'border-blue-600'}`}></div>
            </div>
          </div>
        </div>
      </TenantProvider>
    )
  }

  return (
    <TenantProvider>
      <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          {/* Page Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Digital Lab Budget
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  September 2025 - September 2026
                </p>
              </div>
              <div className="hidden md:block">
                <div className={`text-right ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {currentDateTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentDateTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Budget Summary */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className={`${isDark ? 'bg-gradient-to-r from-blue-700 to-blue-800' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Budget</p>
                    <p className="text-3xl font-bold">{formatCurrency(getTotalCost())}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-r from-green-700 to-green-800' : 'bg-gradient-to-r from-green-600 to-green-700'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Equipment Items</p>
                    <p className="text-3xl font-bold">{budgetItems.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-r from-purple-700 to-purple-800' : 'bg-gradient-to-r from-purple-600 to-purple-700'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Spent</p>
                    <p className="text-3xl font-bold">{formatCurrency(getSpentAmount())}</p>
                    <p className="text-purple-200 text-xs mt-1">
                      {((getSpentAmount() / getTotalCost()) * 100).toFixed(1)}% of budget
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-r from-orange-700 to-orange-800' : 'bg-gradient-to-r from-orange-600 to-orange-700'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Remaining</p>
                    <p className="text-3xl font-bold">{formatCurrency(getRemainingBudget())}</p>
                    <p className="text-orange-200 text-xs mt-1">
                      {((getRemainingBudget() / getTotalCost()) * 100).toFixed(1)}% available
                    </p>
                  </div>
                  <Wallet className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div 
            className="flex flex-col lg:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                  placeholder="Search equipment, categories, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select 
                value={selectedCategory} 
                onValueChange={(value) => {
                  setSelectedCategory(value)
                  if (value === 'all') {
                    // Reset everything when "all" is selected
                    setSelectedSegment(null)
                    setSelectedCategoryForSort(null)
                    setExpandedCategories(new Set())
                  } else {
                    // Find the category name for highlighting
                    const category = categories.find(c => c.id === value)
                    if (category) {
                      // Highlight the pie chart segment (use category name)
                      setSelectedSegment(category.name)
                      // Bring category to top in breakdown (use category id)
                      setSelectedCategoryForSort(value)
                      // Expand the category in the breakdown
                      setExpandedCategories(prev => {
                        const newSet = new Set(prev)
                        newSet.add(value)
                        return newSet
                      })
                    }
                  }
                }}
              >
                <SelectTrigger className={`w-full sm:w-64 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center">
                        <span className="mr-2">{category.emoji}</span>
                        {category.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className={`flex items-center ${isDark ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'}`}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </motion.div>

          {/* Budget Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={`grid w-full grid-cols-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <TabsTrigger 
                  value="overview" 
                  className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="detailed" 
                  className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Detailed
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-8">
                  {/* Circle Chart - Full Width */}
                  <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <TrendingUp className="h-5 w-5 mr-2" />
                            Budget Distribution
                          </CardTitle>
                          <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Click on segments to highlight and expand category
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          {(selectedCategory !== 'all' || searchTerm) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetFilters}
                              className={isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
                            >
                              Reset Filters
                            </Button>
                          )}
                          <div className="flex items-center space-x-2 border-l pl-2 ml-2 border-gray-600">
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
                          <div className="flex items-center space-x-2 border-l pl-2 ml-2 border-gray-600">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Show:
                            </span>
                            <Button
                              variant={showRemainingInChart ? "default" : "outline"}
                              size="sm"
                              onClick={() => setShowRemainingInChart(true)}
                              className={showRemainingInChart ? '' : (isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')}
                            >
                              Remaining
                            </Button>
                            <Button
                              variant={!showRemainingInChart ? "default" : "outline"}
                              size="sm"
                              onClick={() => setShowRemainingInChart(false)}
                              className={!showRemainingInChart ? '' : (isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')}
                            >
                              Spent
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: any) => {
                              const { name, value } = props
                              // Don't show label for summary segments to avoid clutter
                              if (name === 'Remaining Budget' || name === 'Total Spent') {
                                return ''
                              }
                              if (showPercentageInChart) {
                                const total = getTotalCost()
                                const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
                                return `${name}: ${pct}%`
                              } else {
                                return `${name}: ${formatCurrency(value)}`
                              }
                            }}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            onClick={(data) => {
                              if (data && data.name && data.name !== 'Remaining Budget' && data.name !== 'Total Spent') {
                                setSelectedSegment(data.name)
                                const categoryId = categories.find(c => c.name === data.name)?.id
                                if (categoryId) {
                                  // Don't filter - just highlight and expand
                                  // setSelectedCategory(categoryId) // Commented out to prevent filtering
                                  // Set the selected category for sorting
                                  setSelectedCategoryForSort(categoryId)
                                  // Also expand the category in the breakdown
                                  setExpandedCategories(prev => {
                                    const newSet = new Set(prev)
                                    newSet.add(categoryId)
                                    return newSet
                                  })
                                }
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {getPieChartData().map((entry, index) => {
                              const categoryId = categories.find(c => c.name === entry.name)?.id
                              const isRemaining = entry.name === 'Remaining Budget'
                              const isSpent = entry.name === 'Total Spent'
                              const isSummarySegment = isRemaining || isSpent
                              const isSelected = !isSummarySegment && (selectedSegment === entry.name || 
                                selectedCategoryForSort === categoryId ||
                                (selectedCategory !== 'all' && selectedCategory === categoryId))
                              const hasSelection = selectedSegment || selectedCategoryForSort || (selectedCategory !== 'all')
                              return (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.color}
                                  style={{
                                    opacity: isSummarySegment ? 0.6 : (isSelected ? 1 : (hasSelection && !isSelected ? 0.4 : 1)),
                                    stroke: isSummarySegment ? '#9CA3AF' : (isSelected ? '#fff' : 'none'),
                                    strokeWidth: isSummarySegment ? 1 : (isSelected ? 2 : 0),
                                    filter: isSummarySegment ? 'none' : (isSelected ? 'brightness(1.1)' : 'none'),
                                    transition: 'all 0.3s ease',
                                    strokeDasharray: isSummarySegment ? '5 5' : 'none', // Dashed border for summary segments
                                    cursor: isSummarySegment ? 'default' : 'pointer' // No pointer cursor for summary segments
                                  }}
                                />
                              )
                            })}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0]
                                const isRemaining = data.name === 'Remaining Budget'
                                const isSpent = data.name === 'Total Spent'
                                return (
                                  <div
                                    className={`p-3 rounded-lg shadow-lg border ${
                                      isDark
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                  >
                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                      {data.name}
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {formatCurrency(data.value as number)}
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {((data.value as number / getTotalCost()) * 100).toFixed(1)}%
                                    </p>
                                    {isRemaining && (
                                      <p className={`text-xs mt-1 italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Available for future purchases
                                      </p>
                                    )}
                                    {isSpent && (
                                      <p className={`text-xs mt-1 italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Total amount spent on equipment
                                      </p>
                                    )}
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ 
                              color: isDark ? '#F9FAFB' : '#111827',
                              fontSize: '12px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Category Overview - Full Width */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Category Breakdown</h3>
                      {selectedCategoryForSort && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategoryForSort(null)
                            setSelectedSegment(null)
                          }}
                          className={isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
                        >
                          Show All Categories
                        </Button>
                      )}
                    </div>
                    {(() => {
                      // Calculate category totals - use SAME logic as pie chart for consistency
                      // Always show all categories in breakdown (like pie chart), but highlight selected
                      const categoryData = categories.slice(1).map((category) => {
                        // Use budgetItems ONLY (same as pie chart) - no dashboard items to ensure consistency
                        let categoryItems = budgetItems.filter(item => item.category === category.id)
                        
                        // REMOVED: budgetMonths inclusion to match pie chart data source
                        // Both pie chart and breakdown now use ONLY budgetItems for consistency
                        
                        // Calculate total from categoryItems (budgetItems only)
                        const categoryTotal = categoryItems.reduce((sum, item) => sum + item.subtotal, 0)
                        const percentage = categoryTotal > 0 ? (categoryTotal / getTotalCost()) * 100 : 0
                        
                        return {
                          category,
                          categoryItems: categoryItems.sort((a, b) => b.subtotal - a.subtotal), // Sort items within category by cost
                          categoryTotal,
                          percentage
                        }
                      })
                      
                      // Sort categories: selected category first, then by total cost (most to least expensive)
                      const sortedCategories = categoryData.sort((a, b) => {
                        // If a category is selected (from dropdown or pie chart), bring it to the top
                        const aIsSelected = selectedCategoryForSort === a.category.id || 
                          (selectedCategory !== 'all' && selectedCategory === a.category.id)
                        const bIsSelected = selectedCategoryForSort === b.category.id || 
                          (selectedCategory !== 'all' && selectedCategory === b.category.id)
                        
                        if (aIsSelected && !bIsSelected) return -1
                        if (bIsSelected && !aIsSelected) return 1
                        // Otherwise sort by total cost
                        return b.categoryTotal - a.categoryTotal
                      })
                      
                      return sortedCategories.map(({ category, categoryItems, categoryTotal, percentage }) => {
                        const isExpanded = expandedCategories.has(category.id)
                        
                        const categoryColor = getCategoryColor(category.id)
                        const isSelected = selectedCategoryForSort === category.id || 
                          (selectedCategory !== 'all' && selectedCategory === category.id)
                        const isHighlighted = selectedSegment === category.name ||
                          (selectedCategory !== 'all' && selectedCategory === category.id)
                        
                        return (
                          <Card 
                            key={category.id} 
                            className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                              isDark ? 'bg-gray-800' : 'bg-white'
                            } ${
                              isHighlighted || isSelected 
                                ? 'border-2' 
                                : 'border'
                            }`}
                            style={{
                              borderColor: (isHighlighted || isSelected) ? categoryColor : (isDark ? '#374151' : '#E5E7EB')
                            }}
                            onClick={() => toggleCategoryExpansion(category.id)}
                          >
                            <CardContent className="p-4 relative pl-6">
                              {/* Color accent bar */}
                              <div 
                                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                                style={{ backgroundColor: categoryColor }}
                              />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  <span className="text-2xl">{category.emoji}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className={`font-semibold flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {isExpanded ? (
                                          <ChevronDown className="h-4 w-4 mr-2" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 mr-2" />
                                        )}
                                        {category.name}
                                      </h4>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {categoryItems.length} items
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {showCosts && (
                                    <>
                                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {formatCurrency(categoryTotal)}
                                      </p>
                                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {percentage.toFixed(1)}%
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className={`mt-3 w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                                <div 
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: categoryColor
                                  }}
                                />
                              </div>
                              
                              {/* Expanded Items List */}
                              {isExpanded && categoryItems.length > 0 && (
                                <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                  <h5 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Items in {category.name}:
                                  </h5>
                                  <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {categoryItems.map((item, idx) => (
                                      <div 
                                        key={idx}
                                        className={`flex items-center justify-between p-2 rounded ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                          <span className="text-lg">{item.emoji}</span>
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                              {item.lineItem}
                                            </p>
                                            {item.notes && (
                                              <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {item.notes}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        {showCosts && (
                                          <div className="text-right ml-4">
                                            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                              {formatCurrency(item.subtotal)}
                                            </p>
                                            {item.qty > 1 && (
                                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {item.qty} × {formatCurrency(item.unitCost)}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                                    <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      Category Total:
                                    </span>
                                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                      {formatCurrency(categoryTotal)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })
                    })()}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="dashboard" className="mt-6">
                {budgetMonths.length > 0 ? (
                  <BudgetDashboard months={budgetMonths} organizationSlug={slug} />
                ) : (
                  <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>Loading dashboard data...</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="detailed" className="mt-6">
                <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Detailed Equipment List</CardTitle>
                    <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Complete breakdown of all Digital Lab equipment and costs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Item</th>
                            <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Category</th>
                            <th className={`text-center p-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Qty</th>
                            {showCosts && (
                              <>
                                <th className={`text-right p-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Unit Cost</th>
                                <th className={`text-right p-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Subtotal</th>
                              </>
                            )}
                            <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Notes</th>
                            <th className={`text-center p-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Links</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item, index) => (
                            <tr key={index} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                              <td className="p-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{item.emoji}</span>
                                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.lineItem}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge variant="default">
                                  {getCategoryIcon(item.category)} {item.category}
                                </Badge>
                              </td>
                              <td className={`p-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{item.qty}</td>
                              {showCosts && (
                                <>
                                  <td className={`p-3 text-right font-mono ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                                    {formatCurrency(item.unitCost)}
                                  </td>
                                  <td className={`p-3 text-right font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {formatCurrency(item.subtotal)}
                                  </td>
                                </>
                              )}
                              <td className={`p-3 text-sm max-w-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.notes}
                              </td>
                              <td className="p-3 text-center">
                                {item.links && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(item.links, '_blank')}
                                    className={`relative group ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                    onMouseEnter={() => setHoveredItem(item.lineItem)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    {hoveredItem === item.lineItem && (
                                      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 ${isDark ? 'bg-gray-700 text-white' : 'bg-black text-white'} text-xs rounded shadow-lg whitespace-nowrap z-10`}>
                                        Click to view product
                                      </div>
                                    )}
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {showCosts && (
                          <tfoot>
                            <tr className={`border-t-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                              <td colSpan={4} className={`p-3 text-right font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {selectedCategory !== 'all' || searchTerm 
                                  ? 'Filtered Total:' 
                                  : 'Total Budget:'}
                              </td>
                              <td className={`p-3 text-right font-bold text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                {formatCurrency(
                                  selectedCategory !== 'all' || searchTerm
                                    ? filteredItems.reduce((sum, item) => sum + item.subtotal, 0)
                                    : getTotalCost()
                                )}
                              </td>
                              <td colSpan={2}></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </TenantProvider>
  )
}

// Intelligently categorize items based on name and notes
function categorizeItem(itemName: string, itemNotes: string, csvCategory: string): string {
  const nameLower = itemName.toLowerCase()
  const notesLower = (itemNotes || '').toLowerCase()
  const combined = `${nameLower} ${notesLower}`
  
  // Contingency - check first as it's most specific
  if (
    csvCategory === 'contingency' ||
    nameLower.includes('contingency') ||
    nameLower.includes('unallocated') ||
    nameLower.includes('buffer')
  ) {
    return 'Contingency'
  }
  
  // Large Format Printer keywords - check early as it's specific
  if (
    nameLower.includes('epson p-8000') ||
    nameLower.includes('epson p8000') ||
    nameLower.includes('large format printer') ||
    nameLower.includes('large format') ||
    nameLower.includes('service call') && (nameLower.includes('epson') || nameLower.includes('printer')) ||
    nameLower.includes('maintenance agreement') && (nameLower.includes('epson') || nameLower.includes('canon') || nameLower.includes('printer')) ||
    nameLower.includes('ink cartridge') && (nameLower.includes('epson') || nameLower.includes('p-8000') || nameLower.includes('p8000')) ||
    nameLower.includes('ink bundle') && (nameLower.includes('epson') || nameLower.includes('llk') || nameLower.includes('light light black')) ||
    nameLower.includes('paper thickness sensor') ||
    nameLower.includes('llk') ||
    nameLower.includes('light light black') ||
    notesLower.includes('epson p-8000') ||
    notesLower.includes('large format') ||
    notesLower.includes('image pro international') ||
    notesLower.includes('large format printer')
  ) {
    return 'Large Format Printer'
  }
  
  // Room Build-Out keywords
  if (
    nameLower.includes('paint') || 
    nameLower.includes('patching') ||
    nameLower.includes('electrical') ||
    nameLower.includes('outlet') ||
    nameLower.includes('blackout') ||
    nameLower.includes('blind') ||
    nameLower.includes('acoustic panel') ||
    (nameLower.includes('acoustic') && (nameLower.includes('panel') || notesLower.includes('panel'))) ||
    nameLower.includes('security film') ||
    nameLower.includes('flooring') ||
    nameLower.includes('build-out') ||
    nameLower.includes('room build') ||
    (nameLower.includes('lighting strip') && (notesLower.includes('ceiling') || notesLower.includes('floor'))) ||
    nameLower.includes('renovation') ||
    nameLower.includes('touch-up') ||
    nameLower.includes('touch up') ||
    nameLower.includes('surface touch') ||
    (nameLower.includes('digital lab') && (nameLower.includes('paint') || nameLower.includes('floor') || nameLower.includes('surface'))) ||
    notesLower.includes('art week') ||
    notesLower.includes('spot paint') ||
    notesLower.includes('shelf installation')
  ) {
    return 'Room Build-Out'
  }
  
  // Displays & Projection keywords - check before Compute/Peripherals
  if (
    nameLower.includes('monitor') ||
    nameLower.includes('display') && !nameLower.includes('smartsign') ||
    nameLower.includes('projector') ||
    nameLower.includes('screen') ||
    nameLower.includes('calibrator') ||
    nameLower.includes('spyder') ||
    nameLower.includes('x-rite') ||
    nameLower.includes('4k') ||
    nameLower.includes('65"') ||
    nameLower.includes('27"') ||
    nameLower.includes('mount') && (nameLower.includes('monitor') || notesLower.includes('monitor'))
  ) {
    return 'Displays & Projection'
  }
  
  // Furniture & Fixtures keywords
  if (
    nameLower.includes('desk') ||
    nameLower.includes('table') ||
    nameLower.includes('chair') ||
    nameLower.includes('stool') ||
    nameLower.includes('cabinet') ||
    (nameLower.includes('cart') && !nameLower.includes('charging')) ||
    nameLower.includes('trolley') ||
    (nameLower.includes('workstation') && !nameLower.includes('windows') && !nameLower.includes('rtx') && !notesLower.includes('windows') && !notesLower.includes('rtx')) ||
    nameLower.includes('furniture') ||
    nameLower.includes('whiteboard') ||
    nameLower.includes('storage organizer') ||
    nameLower.includes('organizer') ||
    (nameLower.includes('rack') && !nameLower.includes('printer')) ||
    (nameLower.includes('rack') && notesLower.includes('storage'))
  ) {
    return 'Furniture & Fixtures'
  }
  
  // Compute keywords
  if (
    nameLower.includes('raspberry pi') ||
    nameLower.includes('laptop') ||
    (nameLower.includes('workstation') && (nameLower.includes('windows') || nameLower.includes('rtx'))) ||
    nameLower.includes('computer') ||
    nameLower.includes('ups') ||
    nameLower.includes('keyboard') ||
    nameLower.includes('mouse') ||
    nameLower.includes('usb-c hub') ||
    nameLower.includes('card reader')
  ) {
    return 'Compute'
  }
  
  // Audio keywords - check before Streaming
  if (
    nameLower.includes('mic') ||
    nameLower.includes('microphone') ||
    nameLower.includes('lavalier') ||
    nameLower.includes('audio interface') ||
    nameLower.includes('mixer') && (nameLower.includes('audio') || nameLower.includes('pa') || notesLower.includes('audio')) ||
    nameLower.includes('speaker') ||
    nameLower.includes('pa') ||
    (nameLower.includes('audio') && !nameLower.includes('video'))
  ) {
    return 'Audio'
  }
  
  // Streaming keywords - lighting equipment for video
  if (
    nameLower.includes('capture card') ||
    nameLower.includes('hdmi') ||
    nameLower.includes('sdi') ||
    nameLower.includes('led panel') ||
    (nameLower.includes('light') && (nameLower.includes('video') || nameLower.includes('interview') || notesLower.includes('video') || notesLower.includes('interview'))) ||
    nameLower.includes('tripod') ||
    (nameLower.includes('stand') && (nameLower.includes('light') || nameLower.includes('boom') || notesLower.includes('light'))) ||
    nameLower.includes('boom') ||
    nameLower.includes('soft box') ||
    nameLower.includes('amaran') ||
    nameLower.includes('c stand') ||
    (nameLower.includes('lighting') && (notesLower.includes('video') || notesLower.includes('interview') || notesLower.includes('equipment'))) ||
    (nameLower.includes('light') && notesLower.includes('interview')) ||
    nameLower.includes('verity') ||
    nameLower.includes('cabling') && (notesLower.includes('streaming') || notesLower.includes('fiber') || notesLower.includes('conduit')) ||
    notesLower.includes('verity')
  ) {
    return 'Streaming'
  }
  
  // Peripherals & Creation keywords
  if (
    nameLower.includes('3d printer') ||
    (nameLower.includes('printer') && !nameLower.includes('rack') && !nameLower.includes('epson') && !nameLower.includes('canon') && !nameLower.includes('large format')) ||
    nameLower.includes('filament') ||
    nameLower.includes('resin') ||
    nameLower.includes('quest') ||
    nameLower.includes('vr') ||
    nameLower.includes('headset') ||
    nameLower.includes('ipad') ||
    nameLower.includes('pencil') ||
    nameLower.includes('wacom') ||
    nameLower.includes('tablet') ||
    nameLower.includes('camera') ||
    nameLower.includes('mirrorless') ||
    nameLower.includes('creation') ||
    nameLower.includes('peripheral') ||
    (nameLower.includes('dock') && (nameLower.includes('quest') || nameLower.includes('charging'))) ||
    (nameLower.includes('rack') && (nameLower.includes('printing') || nameLower.includes('3d'))) ||
    nameLower.includes('enclosure') && nameLower.includes('resin')
  ) {
    return 'Peripherals & Creation'
  }
  
  // Networking & Storage keywords
  if (
    nameLower.includes('nas') ||
    (nameLower.includes('storage') && !nameLower.includes('organizer')) ||
    nameLower.includes('drive') ||
    nameLower.includes('tb') ||
    nameLower.includes('wifi') ||
    nameLower.includes('router') ||
    nameLower.includes('switch') ||
    (nameLower.includes('cable') && nameLower.includes('cat')) ||
    nameLower.includes('networking') ||
    nameLower.includes('access point')
  ) {
    return 'Networking & Storage'
  }
  
  // Safety & Device Security keywords - map to other categories
  // Cable locks and lockboxes → Peripherals & Creation
  // Charging stations/carts → Furniture & Fixtures
  // Security items → Room Build-Out (if related to room) or Peripherals & Creation
  if (nameLower.includes('charging station') || nameLower.includes('charging cart')) {
    return 'Furniture & Fixtures'
  }
  if (nameLower.includes('cable lock') || nameLower.includes('lockbox')) {
    return 'Peripherals & Creation'
  }
  
  // Signage keywords
  if (
    nameLower.includes('sign') ||
    nameLower.includes('signage') ||
    nameLower.includes('wayfinding') ||
    (nameLower.includes('qr') && nameLower.includes('display')) ||
    nameLower.includes('smartsign')
  ) {
    return 'Signage'
  }
  
  // Default fallback - try to infer from CSV category
  if (csvCategory === 'equipment-maintenance') {
    return 'Peripherals & Creation'
  }
  
  // If we can't categorize, default to Peripherals & Creation (most general hardware category)
  return 'Peripherals & Creation'
}

// Convert budget config from CSV to BudgetItem format
function convertBudgetConfigToItems(config: ReturnType<typeof getBudgetConfig>, slug: string): BudgetItem[] {
  // Map categories to emojis
  const categoryEmojiMap: Record<string, string> = {
    'Room Build-Out': '🧱',
    'Furniture & Fixtures': '🪑',
    'Compute': '💻',
    'Displays & Projection': '📺',
    'Peripherals & Creation': '🧰',
    'Streaming': '📡',
    'Audio': '🎙️',
    'Networking & Storage': '🔌',
    'Large Format Printer': '🖨️',
    'Signage': '🪧',
    'Contingency': '🧮',
    'Equipment Maintenance': '🔧',
    'Hardware & Materials': '🧰' // Fallback
  }
  
  // Valid display categories (must match the categories array in the component)
  const validDisplayCategories = [
    'Room Build-Out',
    'Furniture & Fixtures',
    'Compute',
    'Displays & Projection',
    'Peripherals & Creation',
    'Streaming',
    'Audio',
    'Networking & Storage',
    'Large Format Printer',
    'Signage',
    'Contingency'
  ]
  
  console.log('\n🔍 Starting Item Categorization Process:')
  console.log(`  Total items to categorize: ${config.items.length}`)
  console.log(`  CSV category distribution:`)
  const csvCategoryCount: Record<string, number> = {}
  config.items.forEach(item => {
    csvCategoryCount[item.category] = (csvCategoryCount[item.category] || 0) + 1
  })
  Object.entries(csvCategoryCount).forEach(([cat, count]) => {
    console.log(`    - ${cat}: ${count} items`)
  })
  
  const convertedItems = config.items.map((item, index) => {
    // Intelligently categorize based on item name and notes
    const originalCsvCategory = item.category
    let displayCategory = categorizeItem(item.name, item.notes || '', item.category)
    
    // Log categorization decision for debugging
    if (displayCategory !== 'Peripherals & Creation' || originalCsvCategory === 'contingency') {
      console.log(`  ✓ Item ${index + 1}: "${item.name}"`)
      console.log(`    CSV Category: ${originalCsvCategory}`)
      console.log(`    Assigned Category: ${displayCategory}`)
      if (item.notes) {
        console.log(`    Notes: ${item.notes.substring(0, 60)}${item.notes.length > 60 ? '...' : ''}`)
      }
    }
    
    // Ensure category is valid, fallback to Peripherals & Creation if not
    if (!validDisplayCategories.includes(displayCategory)) {
      console.warn(`⚠️ Invalid category "${displayCategory}" for item "${item.name}", remapping to "Peripherals & Creation"`)
      displayCategory = 'Peripherals & Creation'
    }
    
    const emoji = categoryEmojiMap[displayCategory] || '📦'
    
    return {
      emoji,
      lineItem: item.name,
      category: displayCategory,
      qty: 1, // Default quantity, could be parsed from item name if needed
      unitCost: item.amount,
      subtotal: item.amount,
      notes: item.notes || '',
      comments: '',
      links: item.vendor && item.vendor.startsWith('http') ? item.vendor : '',
      participant: '',
      phase: index < Math.floor(config.items.length * 0.4) ? 1 : 
            index < Math.floor(config.items.length * 0.75) ? 2 :
            index < Math.floor(config.items.length * 0.9) ? 3 : 4,
      priority: (index < 5 ? 'high' : index < 15 ? 'medium' : 'low') as 'low' | 'medium' | 'high'
    }
  })
  
  // Log category breakdown
  console.log('\n📊 Category Breakdown Analysis:')
  const categoryBreakdown: Record<string, { count: number; total: number; items: string[] }> = {}
  
  convertedItems.forEach(item => {
    if (!categoryBreakdown[item.category]) {
      categoryBreakdown[item.category] = { count: 0, total: 0, items: [] }
    }
    categoryBreakdown[item.category].count++
    categoryBreakdown[item.category].total += item.subtotal
    categoryBreakdown[item.category].items.push(item.lineItem)
  })
  
  console.log('\n📋 Category Distribution (Final):')
  Object.entries(categoryBreakdown)
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([category, data]) => {
      const percentage = ((data.total / config.totalBudget) * 100).toFixed(1)
      console.log(`\n  ${category}:`)
      console.log(`    - Items: ${data.count}`)
      console.log(`    - Total: $${data.total.toLocaleString()} (${percentage}%)`)
      console.log(`    - Equipment List:`)
      data.items.forEach((itemName, idx) => {
        const item = convertedItems.find(i => i.lineItem === itemName)
        const itemCost = item ? item.subtotal : 0
        console.log(`      ${idx + 1}. ${itemName} ($${itemCost.toLocaleString()})`)
      })
    })
  
  console.log('\n🔍 Complete Equipment-to-Category Mapping:')
  convertedItems.forEach((item, idx) => {
    const csvItem = config.items[idx]
    console.log(`  ${idx + 1}. "${item.lineItem}"`)
    console.log(`     CSV: ${csvItem?.category || 'N/A'} → Display: ${item.category}`)
    console.log(`     Cost: $${item.subtotal.toLocaleString()}`)
  })
  
  // Summary statistics
  console.log('\n📈 Categorization Summary:')
  console.log(`  Total items processed: ${convertedItems.length}`)
  console.log(`  Categories used: ${Object.keys(categoryBreakdown).length}`)
  const uncategorizedCount = categoryBreakdown['Peripherals & Creation']?.count || 0
  if (uncategorizedCount > 0) {
    console.log(`  ⚠️ Items defaulted to "Peripherals & Creation": ${uncategorizedCount}`)
  }
  
  return convertedItems
}

// Helper function to create months from budgetItems for dashboard consistency
// Uses the same budgetItems data source as the overview tab
function createMonthsFromBudgetItems(budgetItems: BudgetItem[], totalBudget: number): BudgetMonth[] {
  // Create months from September 2025 to December 2025 (4 months only)
  const months: BudgetMonth[] = []
  const monthNames = ['2025-09', '2025-10', '2025-11', '2025-12']
  
  // Distribute items across these 4 months evenly
  const itemsPerMonth = Math.ceil(budgetItems.length / 4)
  
  monthNames.forEach((monthStr, index) => {
    const startIdx = index * itemsPerMonth
    const endIdx = Math.min(startIdx + itemsPerMonth, budgetItems.length)
    const monthItems = budgetItems.slice(startIdx, endIdx)
    
    // Convert BudgetItem to BudgetLineItem format
    const lineItems: BudgetLineItem[] = monthItems.map((item, idx) => ({
      id: `${monthStr}-${idx}`,
      name: item.lineItem,
      category: item.category,
      amount: item.subtotal,
      imageUrl: '',
      date: `${monthStr}-${String(Math.floor(1 + (idx * 7))).padStart(2, '0')}`,
      vendor: item.links || '',
      notes: item.notes || ''
    }))
    
    const spent = monthItems.reduce((sum, item) => sum + item.subtotal, 0)
    // Distribute budget proportionally: Sep-Dec gets more, but cap at spent amount
    const budget = Math.max(spent, Math.floor(totalBudget * 0.25)) // 25% per month
    
    months.push({
      month: monthStr,
      budget,
      spent,
      lineItems
    })
  })
  
  console.log('📊 Created months from budgetItems:', {
    totalItems: budgetItems.length,
    monthsCreated: months.length,
    totalSpent: months.reduce((sum, m) => sum + m.spent, 0),
    totalBudget: months.reduce((sum, m) => sum + m.budget, 0)
  })
  
  return months
}

// Legacy mock budget data - kept for reference but not used
function getMockBudgetData(): BudgetItem[] {
  return [
    // Room Build-Out
    { emoji: '🧱', lineItem: 'Paint & patching', category: 'Room Build-Out', qty: 1, unitCost: 2500, subtotal: 2500, notes: 'Walls/ceiling refresh; light neutral', comments: 'Assess room state for estimate', links: '', participant: '', phase: 1, priority: 'high' },
    { emoji: '🧱', lineItem: 'Electrical upgrades & outlets', category: 'Room Build-Out', qty: 1, unitCost: 4000, subtotal: 4000, notes: 'Dedicated circuits, added outlets, cable trays', comments: 'Asses extra outlet locations needed on either side of the wall', links: '', participant: '', phase: 1, priority: 'high' },
    { emoji: '🧱', lineItem: 'Blackout blinds & light control', category: 'Room Build-Out', qty: 1, unitCost: 2000, subtotal: 2000, notes: 'For projection and color work', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧱', lineItem: 'Acoustic panels', category: 'Room Build-Out', qty: 12, unitCost: 150, subtotal: 1800, notes: 'Reduce reverb for talks/recording', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧱', lineItem: 'Security film for glass / door hardware', category: 'Room Build-Out', qty: 1, unitCost: 1700, subtotal: 1700, notes: 'Basic asset protection', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧱', lineItem: 'Flooring protection & entry mats', category: 'Room Build-Out', qty: 1, unitCost: 1500, subtotal: 1500, notes: 'Traffic & equipment safety', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧱', lineItem: 'Misc build materials', category: 'Room Build-Out', qty: 1, unitCost: 1500, subtotal: 1500, notes: 'Anchors, fasteners, paint sundries', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Furniture & Fixtures
    { emoji: '🪑', lineItem: 'Workstation desks (sit/stand)', category: 'Furniture & Fixtures', qty: 4, unitCost: 600, subtotal: 2400, notes: 'Core creation benches', comments: '', links: 'https://thedisplayoutlet.com/products/mobile-computer-cart-with-power-dual-monitor-mount-gray', participant: '', phase: 1, priority: 'high' },
    { emoji: '🪑', lineItem: 'Mobile tables / folding', category: 'Furniture & Fixtures', qty: 3, unitCost: 350, subtotal: 1050, notes: 'Room can flip lab↔workshop', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🪑', lineItem: 'Stools / chairs', category: 'Furniture & Fixtures', qty: 8, unitCost: 150, subtotal: 1200, notes: 'Mixed seating', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🪑', lineItem: 'Lockable storage cabinets', category: 'Furniture & Fixtures', qty: 2, unitCost: 600, subtotal: 1200, notes: 'Gear & laptop carts', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🪑', lineItem: 'AV/display carts (heavy-duty)', category: 'Furniture & Fixtures', qty: 2, unitCost: 800, subtotal: 1600, notes: 'For 65" displays', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🪑', lineItem: 'Pipe & drape / modular backdrop', category: 'Furniture & Fixtures', qty: 1, unitCost: 1000, subtotal: 1000, notes: 'Photo/video & exhibits', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🪑', lineItem: 'Wall-mount whiteboards', category: 'Furniture & Fixtures', qty: 2, unitCost: 300, subtotal: 600, notes: 'Curriculum/critique', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Compute
    { emoji: '💻', lineItem: 'Raspberry Pi 5 kits (8GB) bundles', category: 'Compute', qty: 8, unitCost: 220, subtotal: 1760, notes: 'Cases, PSUs, SD cards, HDMI', comments: '', links: 'https://www.raspberrypi.com/products/raspberry-pi-5/', participant: '', phase: 1, priority: 'high' },
    { emoji: '💻', lineItem: 'Keyboards + mice sets', category: 'Compute', qty: 8, unitCost: 25, subtotal: 200, notes: 'For Pi stations', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '💻', lineItem: 'USB-C hubs & card readers', category: 'Compute', qty: 6, unitCost: 35, subtotal: 210, notes: 'IO for cameras/SD', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '💻', lineItem: 'Mid-tier Windows workstations', category: 'Compute', qty: 2, unitCost: 2500, subtotal: 5000, notes: 'RTX 4070 class, 64GB RAM', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '💻', lineItem: 'UPS battery backups', category: 'Compute', qty: 2, unitCost: 350, subtotal: 700, notes: 'Protect against outages', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '💻', lineItem: 'VR-ready laptop', category: 'Compute', qty: 1, unitCost: 2000, subtotal: 2000, notes: 'Mobile demos/streaming', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '💻', lineItem: 'Loaner laptops (Chromebook/Win)', category: 'Compute', qty: 6, unitCost: 600, subtotal: 3600, notes: 'Expand class capacity', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Displays & Projection
    { emoji: '📺', lineItem: '65" 4K displays', category: 'Displays & Projection', qty: 2, unitCost: 900, subtotal: 1800, notes: 'Class/critique', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📺', lineItem: 'Short-throw projector (1080p/4K-ready)', category: 'Displays & Projection', qty: 1, unitCost: 1600, subtotal: 1600, notes: 'Workshops & pop-ups', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📺', lineItem: 'Projector screen / paint', category: 'Displays & Projection', qty: 1, unitCost: 400, subtotal: 400, notes: 'Matte white', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📺', lineItem: 'Portable 15" USB-C monitors', category: 'Displays & Projection', qty: 2, unitCost: 200, subtotal: 400, notes: 'Demos/livestream notes', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📺', lineItem: 'Color-accurate reference monitor (27")', category: 'Displays & Projection', qty: 1, unitCost: 1500, subtotal: 1500, notes: 'Grading/proofing', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📺', lineItem: 'Calibrator (Spyder/X-Rite)', category: 'Displays & Projection', qty: 1, unitCost: 300, subtotal: 300, notes: 'Color management', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Peripherals & Creation
    { emoji: '🧰', lineItem: 'Midrange 3D printer', category: 'Peripherals & Creation', qty: 1, unitCost: 2000, subtotal: 2000, notes: 'PLA/ABS capable', comments: '', links: 'https://bambulab.com/en/p1/p1s', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧰', lineItem: 'Filament & tools starter', category: 'Peripherals & Creation', qty: 1, unitCost: 500, subtotal: 500, notes: 'Nozzles, scrapers, etc.', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧰', lineItem: 'Meta Quest 3 headset', category: 'Peripherals & Creation', qty: 1, unitCost: 500, subtotal: 500, notes: 'XR demos', comments: '', links: 'https://www.meta.com/quest/quest-3/', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧰', lineItem: 'iPad (10th gen) + Pencil', category: 'Peripherals & Creation', qty: 2, unitCost: 600, subtotal: 1200, notes: 'Procreate/sketching', comments: '', links: 'https://www.apple.com/ipad-10.9/', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧰', lineItem: 'Wacom tablet (M)', category: 'Peripherals & Creation', qty: 1, unitCost: 400, subtotal: 400, notes: 'Digital drawing', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🧰', lineItem: 'Mirrorless camera body + lens', category: 'Peripherals & Creation', qty: 1, unitCost: 1200, subtotal: 1200, notes: 'Capture demos/artifacts', comments: '', links: 'https://www.sony.com/electronics/interchangeable-lens-cameras/zv-e10', participant: '', phase: 1, priority: 'medium' },

    // Streaming
    { emoji: '📡', lineItem: 'HDMI/SDI capture card', category: 'Streaming', qty: 1, unitCost: 300, subtotal: 300, notes: 'OBS/NDI streaming', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'LED panel lights w/ stands (2-pack)', category: 'Streaming', qty: 1, unitCost: 500, subtotal: 500, notes: 'Even lighting', comments: '', links: 'https://www.amaran.tilda.ws/100d', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'Tripod + light stands + clamps', category: 'Streaming', qty: 1, unitCost: 300, subtotal: 300, notes: 'Rigging', comments: '', links: 'https://www.manfrotto.com/global/290-collection/', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'Cables, adapters, gaff', category: 'Streaming', qty: 1, unitCost: 300, subtotal: 300, notes: 'Connectivity kit', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    // Audio
    { emoji: '🎙️', lineItem: 'Wireless lavalier mics (dual)', category: 'Audio', qty: 1, unitCost: 700, subtotal: 700, notes: 'Talks/workshops', comments: '', links: 'https://rode.com/en/microphones/wireless/wirelessgoii', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🎙️', lineItem: 'USB audio interface / small mixer', category: 'Audio', qty: 1, unitCost: 400, subtotal: 400, notes: 'Audio routing', comments: '', links: 'https://rode.com/en/interfaces-and-mixers/rodecaster-series/rodecaster-duo', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🎙️', lineItem: 'Portable PA (2 speakers + mixer)', category: 'Audio', qty: 1, unitCost: 1200, subtotal: 1200, notes: 'Talks in larger rooms', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Networking & Storage
    { emoji: '📡', lineItem: 'Business-grade Wi-Fi router', category: 'Networking & Storage', qty: 1, unitCost: 300, subtotal: 300, notes: 'Gateway', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'Gigabit switch (PoE)', category: 'Networking & Storage', qty: 1, unitCost: 400, subtotal: 400, notes: 'Backbone', comments: '', links: 'https://www.netgear.com/business/wired/switches/unmanaged/gs324/', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'Wi-Fi access points', category: 'Networking & Storage', qty: 2, unitCost: 200, subtotal: 400, notes: 'Coverage in room', comments: '', links: 'https://store.ui.com/us/en/collections/unifi-network-access-points/products/u6-pro', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'CAT6 cabling & installation', category: 'Networking & Storage', qty: 1, unitCost: 1500, subtotal: 1500, notes: 'Runs to benches/displays', comments: '', links: 'https://www.monoprice.com/product?p_id=109883', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: '20TB NAS + drives', category: 'Networking & Storage', qty: 1, unitCost: 4500, subtotal: 4500, notes: 'Asset storage/backup', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Safety & Device Security
    { emoji: '🔒', lineItem: 'Cable locks / lockboxes', category: 'Safety & Device Security', qty: 10, unitCost: 40, subtotal: 400, notes: 'Anti-theft', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🔒', lineItem: 'Charging station / cart', category: 'Safety & Device Security', qty: 1, unitCost: 800, subtotal: 800, notes: 'For tablets/laptops', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🔒', lineItem: 'Door signage / QR wayfinding', category: 'Safety & Device Security', qty: 1, unitCost: 800, subtotal: 800, notes: 'Booking/house rules', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },


    // Signage
    { emoji: '🪧', lineItem: 'SmartSign display + wall/door mount', category: 'Signage', qty: 1, unitCost: 900, subtotal: 900, notes: 'Public-facing schedule/QR', comments: '', links: 'https://hecklerdesign.com/collections/ipad-stand/products/windfall-ipad-10th-generation', participant: '', phase: 1, priority: 'medium' },

    // Contingency
    { emoji: '🧮', lineItem: 'Unallocated contingency (~9.0%)', category: 'Contingency', qty: 1, unitCost: 6980, subtotal: 6980, notes: 'Price swings, shipping, replacements', comments: '', links: '', participant: '', phase: 1, priority: 'medium' as const }
  ].map(item => ({ ...item, priority: item.priority as 'low' | 'medium' | 'high' })) as BudgetItem[]
}

