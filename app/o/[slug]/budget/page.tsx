'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { OoliteNavigation } from '@/components/tenant/OoliteNavigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Carousel } from '@/components/ui/carousel'
import { CircleChart, PhaseProgress } from '@/components/ui/circle-chart'
import { 
  DollarSign, 
  ExternalLink, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  EyeOff,
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
  Calendar,
  Target,
  Zap,
  Building
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

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

interface BudgetPhase {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  budget: number
  spent: number
  color: string
  status: string
  items: BudgetItem[]
}

export default function DigitalLabBudgetPage() {
  const params = useParams()
  const slug = params.slug as string

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [filteredItems, setFilteredItems] = useState<BudgetItem[]>([])
  const [budgetPhases, setBudgetPhases] = useState<BudgetPhase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPhase, setSelectedPhase] = useState('all')
  const [showCosts, setShowCosts] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Categories', emoji: '📊' },
    { id: 'Room Build-Out', name: 'Room Build-Out', emoji: '🧱' },
    { id: 'Furniture & Fixtures', name: 'Furniture & Fixtures', emoji: '🪑' },
    { id: 'Compute', name: 'Compute', emoji: '💻' },
    { id: 'Displays & Projection', name: 'Displays & Projection', emoji: '📺' },
    { id: 'Peripherals & Creation', name: 'Peripherals & Creation', emoji: '🧰' },
    { id: 'Audio/Streaming', name: 'Audio/Streaming', emoji: '🎙️' },
    { id: 'Networking & Storage', name: 'Networking & Storage', emoji: '📡' },
    { id: 'Software & Cloud (12mo)', name: 'Software & Cloud', emoji: '☁️' },
    { id: 'Safety & Device Security', name: 'Safety & Device Security', emoji: '🔒' },
    { id: 'Professional Services', name: 'Professional Services', emoji: '🧑‍💻' },
    { id: 'Signage', name: 'Signage', emoji: '🪧' },
    { id: 'Contingency', name: 'Contingency', emoji: '🧮' }
  ]

  const phases = [
    { id: 'all', name: 'All Phases', emoji: '📅' },
    { id: '1', name: 'Phase 1: Foundation', emoji: '🏗️' },
    { id: '2', name: 'Phase 2: Core Equipment', emoji: '⚙️' },
    { id: '3', name: 'Phase 3: Advanced Tools', emoji: '🚀' },
    { id: '4', name: 'Phase 4: Optimization', emoji: '✨' }
  ]

  useEffect(() => {
    loadData()
  }, [slug])

  useEffect(() => {
    filterItems()
  }, [budgetItems, searchTerm, selectedCategory, selectedPhase])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load organization data
      const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        setOrganization(orgData.organization)
      }

      // Load budget data (mock data for now)
      const mockData = getMockBudgetData()
      setBudgetItems(mockData)
      setBudgetPhases(getMockBudgetPhases(mockData))
    } catch (error) {
      console.error('Error loading data:', error)
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

    if (selectedPhase !== 'all') {
      filtered = filtered.filter(item => item.phase.toString() === selectedPhase)
    }

    setFilteredItems(filtered)
  }

  const getTotalCost = () => {
    return budgetItems.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const getCategoryTotal = (category: string) => {
    return budgetItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.subtotal, 0)
  }

  const getPhaseTotal = (phaseId: number) => {
    return budgetItems
      .filter(item => item.phase === phaseId)
      .reduce((sum, item) => sum + item.subtotal, 0)
  }

  const getCircleChartData = () => {
    const categoryTotals = categories.slice(1).map(category => {
      const total = getCategoryTotal(category.id)
      return {
        label: category.name,
        value: total,
        color: getCategoryColor(category.id),
        percentage: (total / getTotalCost()) * 100
      }
    }).filter(item => item.value > 0)

    return categoryTotals
  }

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      'Room Build-Out': '#3B82F6',
      'Furniture & Fixtures': '#10B981',
      'Compute': '#8B5CF6',
      'Displays & Projection': '#F59E0B',
      'Peripherals & Creation': '#EF4444',
      'Audio/Streaming': '#06B6D4',
      'Networking & Storage': '#84CC16',
      'Software & Cloud (12mo)': '#F97316',
      'Safety & Device Security': '#EC4899',
      'Professional Services': '#6366F1',
      'Signage': '#14B8A6',
      'Contingency': '#6B7280'
    }
    return colors[categoryId as keyof typeof colors] || '#6B7280'
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <OoliteNavigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </TenantProvider>
    )
  }

  return (
    <TenantProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <OoliteNavigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Carousel Banner */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Carousel className="h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-full">
                <Image
                  src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1758247127/smart-sign/orgs/oolite/oolite-digital-arts-program_ai-sketch_mqtbm9.png"
                  alt="Digital Lab Vision"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Digital Lab Budget
                      </h1>
                      <p className="text-white/90 text-lg">
                        September 2025 - September 2026
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <OrganizationLogo 
                        organizationSlug={slug} 
                        size="lg" 
                        className="h-16 w-16 4xl:h-24 4xl:w-24" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional banner slides can be added here */}
              <div className="relative h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Building className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold mb-2">Phase-Based Implementation</h2>
                    <p className="text-white/90">Strategic rollout across 4 phases</p>
                  </div>
                </div>
              </div>
              
              <div className="relative h-full bg-gradient-to-br from-green-600 via-teal-600 to-cyan-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Target className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold mb-2">Smart Budget Tracking</h2>
                    <p className="text-white/90">Real-time monitoring and analytics</p>
                  </div>
                </div>
              </div>
            </Carousel>
          </motion.div>

          {/* Budget Summary */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
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

            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
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

            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Categories</p>
                    <p className="text-3xl font-bold">{categories.length - 1}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Contingency</p>
                    <p className="text-3xl font-bold">{formatCurrency(getCategoryTotal('Contingency'))}</p>
                  </div>
                  <Calculator className="h-8 w-8 text-orange-200" />
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
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
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

              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-full sm:w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Filter by phase" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      <span className="flex items-center">
                        <span className="mr-2">{phase.emoji}</span>
                        {phase.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCosts(!showCosts)}
                className="flex items-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                {showCosts ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showCosts ? 'Hide Costs' : 'Show Costs'}
              </Button>

              <Button variant="outline" className="flex items-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
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
              <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="phases" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Phases</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Analytics</TabsTrigger>
                <TabsTrigger value="detailed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Detailed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Circle Chart */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900 dark:text-white">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Budget Distribution
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Click on segments to filter by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CircleChart
                        data={getCircleChartData()}
                        size={280}
                        strokeWidth={25}
                        onSegmentClick={(segment) => {
                          setSelectedSegment(segment.label)
                          setSelectedCategory(categories.find(c => c.name === segment.label)?.id || 'all')
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Category Overview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
                    {categories.slice(1).map((category) => {
                      const categoryTotal = getCategoryTotal(category.id)
                      const categoryItems = budgetItems.filter(item => item.category === category.id)
                      const percentage = (categoryTotal / getTotalCost()) * 100
                      
                      return (
                        <Card key={category.id} className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{category.emoji}</span>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{category.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{categoryItems.length} items</p>
                                </div>
                              </div>
                              <div className="text-right">
                                {showCosts && (
                                  <>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                      {formatCurrency(categoryTotal)}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {percentage.toFixed(1)}%
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: getCategoryColor(category.id)
                                }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="phases" className="mt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Implementation Phases
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Strategic rollout from September 2025 to September 2026
                    </p>
                  </div>
                  
                  <PhaseProgress 
                    phases={budgetPhases}
                    totalBudget={getTotalCost()}
                    className="max-w-4xl mx-auto"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {budgetPhases.map((phase) => (
                      <Card key={phase.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: phase.color }}
                            />
                            <CardTitle className="text-sm">{phase.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(phase.budget)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Spent:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(phase.spent)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Items:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {phase.items.length}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Monthly Budget Tracking</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        September 2025 - September 2026
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { month: 'Sep 2025', budget: 15000, spent: 0, color: '#3B82F6' },
                          { month: 'Oct 2025', budget: 12000, spent: 0, color: '#10B981' },
                          { month: 'Nov 2025', budget: 18000, spent: 0, color: '#8B5CF6' },
                          { month: 'Dec 2025', budget: 10000, spent: 0, color: '#F59E0B' },
                          { month: 'Jan 2026', budget: 15000, spent: 0, color: '#EF4444' },
                          { month: 'Feb 2026', budget: 12000, spent: 0, color: '#06B6D4' },
                          { month: 'Mar 2026', budget: 18000, spent: 0, color: '#84CC16' },
                          { month: 'Apr 2026', budget: 10000, spent: 0, color: '#F97316' },
                          { month: 'May 2026', budget: 15000, spent: 0, color: '#EC4899' },
                          { month: 'Jun 2026', budget: 12000, spent: 0, color: '#6366F1' },
                          { month: 'Jul 2026', budget: 18000, spent: 0, color: '#14B8A6' },
                          { month: 'Aug 2026', budget: 10000, spent: 0, color: '#6B7280' },
                          { month: 'Sep 2026', budget: 15000, spent: 0, color: '#3B82F6' }
                        ].map((month, index) => {
                          const spentPercentage = (month.spent / month.budget) * 100
                          return (
                            <div key={month.month} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{month.month}</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  ${month.spent.toLocaleString()} / ${month.budget.toLocaleString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${spentPercentage}%`,
                                    backgroundColor: month.color
                                  }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Budget Insights</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Key metrics and recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">High Priority Items</h4>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Focus on Phase 1 infrastructure and core equipment to establish foundation.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <h4 className="font-semibold text-green-900 dark:text-green-100">Cost Optimization</h4>
                          </div>
                          <p className="text-sm text-green-800 dark:text-green-200">
                            Consider bulk purchasing and vendor negotiations for 15% potential savings.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100">Timeline Flexibility</h4>
                          </div>
                          <p className="text-sm text-purple-800 dark:text-purple-200">
                            Phases 3-4 can be adjusted based on initial implementation success.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="detailed" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Equipment List</CardTitle>
                    <CardDescription>
                      Complete breakdown of all Digital Lab equipment and costs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Item</th>
                            <th className="text-left p-3">Category</th>
                            <th className="text-center p-3">Qty</th>
                            {showCosts && (
                              <>
                                <th className="text-right p-3">Unit Cost</th>
                                <th className="text-right p-3">Subtotal</th>
                              </>
                            )}
                            <th className="text-left p-3">Notes</th>
                            <th className="text-center p-3">Links</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="p-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{item.emoji}</span>
                                  <span className="font-medium">{item.lineItem}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge variant="info">
                                  {getCategoryIcon(item.category)} {item.category}
                                </Badge>
                              </td>
                              <td className="p-3 text-center">{item.qty}</td>
                              {showCosts && (
                                <>
                                  <td className="p-3 text-right font-mono">
                                    {formatCurrency(item.unitCost)}
                                  </td>
                                  <td className="p-3 text-right font-mono font-bold">
                                    {formatCurrency(item.subtotal)}
                                  </td>
                                </>
                              )}
                              <td className="p-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                                {item.notes}
                              </td>
                              <td className="p-3 text-center">
                                {item.links && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(item.links, '_blank')}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredItem(item.lineItem)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    {hoveredItem === item.lineItem && (
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
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
                            <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                              <td colSpan={4} className="p-3 text-right font-bold text-lg">
                                Total Budget:
                              </td>
                              <td className="p-3 text-right font-bold text-lg text-green-600 dark:text-green-400">
                                {formatCurrency(filteredItems.reduce((sum, item) => sum + item.subtotal, 0))}
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

// Mock budget data - in production this would come from an API
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

    // Audio/Streaming
    { emoji: '🎙️', lineItem: 'HDMI/SDI capture card', category: 'Audio/Streaming', qty: 1, unitCost: 300, subtotal: 300, notes: 'OBS/NDI streaming', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🎙️', lineItem: 'Wireless lavalier mics (dual)', category: 'Audio/Streaming', qty: 1, unitCost: 700, subtotal: 700, notes: 'Talks/workshops', comments: '', links: 'https://rode.com/en/microphones/wireless/wirelessgoii', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🎙️', lineItem: 'USB audio interface / small mixer', category: 'Audio/Streaming', qty: 1, unitCost: 400, subtotal: 400, notes: 'Audio routing', comments: '', links: 'https://rode.com/en/interfaces-and-mixers/rodecaster-series/rodecaster-duo', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🎙️', lineItem: 'LED panel lights w/ stands (2-pack)', category: 'Audio/Streaming', qty: 1, unitCost: 500, subtotal: 500, notes: 'Even lighting', comments: '', links: 'https://www.amaran.tilda.ws/100d', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🎙️', lineItem: 'Tripod + light stands + clamps', category: 'Audio/Streaming', qty: 1, unitCost: 300, subtotal: 300, notes: 'Rigging', comments: '', links: 'https://www.manfrotto.com/global/290-collection/', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🎙️', lineItem: 'Cables, adapters, gaff', category: 'Audio/Streaming', qty: 1, unitCost: 300, subtotal: 300, notes: 'Connectivity kit', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🎙️', lineItem: 'Portable PA (2 speakers + mixer)', category: 'Audio/Streaming', qty: 1, unitCost: 1200, subtotal: 1200, notes: 'Talks in larger rooms', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Networking & Storage
    { emoji: '📡', lineItem: 'Business-grade Wi-Fi router', category: 'Networking & Storage', qty: 1, unitCost: 300, subtotal: 300, notes: 'Gateway', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'Gigabit switch (PoE)', category: 'Networking & Storage', qty: 1, unitCost: 400, subtotal: 400, notes: 'Backbone', comments: '', links: 'https://www.netgear.com/business/wired/switches/unmanaged/gs324/', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'Wi-Fi access points', category: 'Networking & Storage', qty: 2, unitCost: 200, subtotal: 400, notes: 'Coverage in room', comments: '', links: 'https://store.ui.com/us/en/collections/unifi-network-access-points/products/u6-pro', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: 'CAT6 cabling & installation', category: 'Networking & Storage', qty: 1, unitCost: 1500, subtotal: 1500, notes: 'Runs to benches/displays', comments: '', links: 'https://www.monoprice.com/product?p_id=109883', participant: '', phase: 1, priority: 'medium' },
    { emoji: '📡', lineItem: '20TB NAS + drives', category: 'Networking & Storage', qty: 1, unitCost: 4500, subtotal: 4500, notes: 'Asset storage/backup', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Software & Cloud
    { emoji: '☁️', lineItem: 'Adobe CC (3 seats @ $600)', category: 'Software & Cloud (12mo)', qty: 3, unitCost: 600, subtotal: 1800, notes: 'Shared lab seats', comments: '', links: 'https://www.adobe.com/creativecloud/business/teams/plans.html', participant: '', phase: 1, priority: 'medium' },
    { emoji: '☁️', lineItem: 'Domain + hosting + SSL', category: 'Software & Cloud (12mo)', qty: 1, unitCost: 300, subtotal: 300, notes: 'Booking portal/subdomain', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '☁️', lineItem: 'Remote mgmt / MDM', category: 'Software & Cloud (12mo)', qty: 1, unitCost: 600, subtotal: 600, notes: 'Manage lab devices', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '☁️', lineItem: 'Cloud backup (NAS/offsite)', category: 'Software & Cloud (12mo)', qty: 1, unitCost: 1300, subtotal: 1300, notes: 'Versioned backups', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Safety & Device Security
    { emoji: '🔒', lineItem: 'Cable locks / lockboxes', category: 'Safety & Device Security', qty: 10, unitCost: 40, subtotal: 400, notes: 'Anti-theft', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🔒', lineItem: 'Charging station / cart', category: 'Safety & Device Security', qty: 1, unitCost: 800, subtotal: 800, notes: 'For tablets/laptops', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
    { emoji: '🔒', lineItem: 'Door signage / QR wayfinding', category: 'Safety & Device Security', qty: 1, unitCost: 800, subtotal: 800, notes: 'Booking/house rules', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Professional Services
    { emoji: '🧑‍💻', lineItem: 'IT/AV install & imaging', category: 'Professional Services', qty: 1, unitCost: 6000, subtotal: 6000, notes: 'Vendors to wire/mount/configure', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },

    // Signage
    { emoji: '🪧', lineItem: 'SmartSign display + wall/door mount', category: 'Signage', qty: 1, unitCost: 900, subtotal: 900, notes: 'Public-facing schedule/QR', comments: '', links: 'https://hecklerdesign.com/collections/ipad-stand/products/windfall-ipad-10th-generation', participant: '', phase: 1, priority: 'medium' },

    // Contingency
    { emoji: '🧮', lineItem: 'Unallocated contingency (~9.0%)', category: 'Contingency', qty: 1, unitCost: 6980, subtotal: 6980, notes: 'Price swings, shipping, replacements', comments: '', links: '', participant: '', phase: 1, priority: 'medium' }
  ]
}

// Mock budget phases - in production this would come from an API
function getMockBudgetPhases(budgetItems: BudgetItem[]): BudgetPhase[] {
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.subtotal, 0)
  
  return [
    {
      id: 1,
      name: 'Phase 1: Foundation & Core Setup',
      description: 'Essential infrastructure and basic equipment',
      startDate: '2025-09-01',
      endDate: '2025-11-30',
      budget: Math.round(totalBudget * 0.4), // 40% of total budget
      spent: 0,
      color: '#3B82F6',
      status: 'planning',
      items: budgetItems.filter(item => 
        ['Room Build-Out', 'Furniture & Fixtures', 'Compute'].includes(item.category)
      )
    },
    {
      id: 2,
      name: 'Phase 2: Advanced Equipment',
      description: 'Displays, peripherals, and creation tools',
      startDate: '2025-12-01',
      endDate: '2026-02-28',
      budget: Math.round(totalBudget * 0.35), // 35% of total budget
      spent: 0,
      color: '#10B981',
      status: 'planning',
      items: budgetItems.filter(item => 
        ['Displays & Projection', 'Peripherals & Creation'].includes(item.category)
      )
    },
    {
      id: 3,
      name: 'Phase 3: Audio & Networking',
      description: 'Streaming, audio, and network infrastructure',
      startDate: '2026-03-01',
      endDate: '2026-05-31',
      budget: Math.round(totalBudget * 0.15), // 15% of total budget
      spent: 0,
      color: '#F59E0B',
      status: 'planning',
      items: budgetItems.filter(item => 
        ['Audio/Streaming', 'Network & Power'].includes(item.category)
      )
    },
    {
      id: 4,
      name: 'Phase 4: Software & Final Setup',
      description: 'Software licenses, signage, and final touches',
      startDate: '2026-06-01',
      endDate: '2026-09-30',
      budget: Math.round(totalBudget * 0.1), // 10% of total budget
      spent: 0,
      color: '#8B5CF6',
      status: 'planning',
      items: budgetItems.filter(item => 
        ['Software & Subscriptions', 'Signage & Room OS', 'Safety & Basics', 'Contingency'].includes(item.category)
      )
    }
  ]
}
