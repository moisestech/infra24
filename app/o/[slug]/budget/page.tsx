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
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { BudgetDashboard, type CategoryChartItem } from '@/components/budget/BudgetDashboard'
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
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingDown,
  LayoutDashboard,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { getBudgetConfig, type OoliteBudgetType } from '@/lib/budget/budget-data'

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
  vendor?: string
  participant: string
  phase: number
  priority: 'high' | 'medium' | 'low'
  date?: string
  purpose?: string
  phaseLabel?: string
  programPillar?: string
  spendType?: string
  budgetBucket?: string
  targetMonth?: string
  vendorGroup?: string
  printSystem?: string
  expenseType?: string
  emailTitle?: string
  emailDate?: string
  emailPeople?: string
  evidenceMetadata?: string
}

export default function DigitalLabBudgetPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  // Get initial tab from query param; for Oolite default to 'reconciliation' (Spent To Date)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || (slug === 'oolite' ? 'reconciliation' : 'overview'))
  
  // Sync tab with query param when it changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    if (tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams, activeTab])
  
  
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
  const [budgetType, setBudgetType] = useState<OoliteBudgetType>('digital-lab')
  const [activeView, setActiveView] = useState<'all' | 'actuals' | 'planned' | 'digital-conference' | 'surface-renovation' | 'printers' | 'verity-it'>('all')
  const [syncPurposeLoading, setSyncPurposeLoading] = useState(false)
  const [syncPurposeResult, setSyncPurposeResult] = useState<{ updated: number; errors: string[] } | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedVendorGroup, setSelectedVendorGroup] = useState<string>('all')
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>('all')
  const [selectedProgramPillar, setSelectedProgramPillar] = useState<string>('all')
  const [selectedBudgetBucket, setSelectedBudgetBucket] = useState<string>('all')
  const [selectedTargetMonth, setSelectedTargetMonth] = useState<string | null>(null)
  const [selectedPeople, setSelectedPeople] = useState<string>('')
  const [groupBy, setGroupBy] = useState<'category' | 'programPillar'>('category')
  const [selectedPillarForSort, setSelectedPillarForSort] = useState<string | null>(null)

  const BUDGET_CAP = 80000
  const PILLAR_ORDER = ['Infrastructure', 'Programming Support', 'Programming + Archive', 'Documentation + Archive', 'Public Engagement', 'Smart Sign']
  const KNIGHT_BUCKETS = ['Digital Lab', 'Digital Conference']

  const vendorGroups = React.useMemo(() => {
    if (slug !== 'oolite') return []
    const set = new Set<string>()
    budgetItems.forEach(i => { if (i.vendorGroup) set.add(i.vendorGroup) })
    return Array.from(set).sort()
  }, [budgetItems, slug])

  const expenseTypes = React.useMemo(() => {
    if (slug !== 'oolite') return []
    const set = new Set<string>()
    budgetItems.forEach(i => { if (i.expenseType) set.add(i.expenseType) })
    return Array.from(set).sort()
  }, [budgetItems, slug])

  const programPillars = React.useMemo(() => {
    if (slug !== 'oolite') return []
    const set = new Set<string>()
    budgetItems.forEach(i => { if (i.programPillar) set.add(i.programPillar) })
    return PILLAR_ORDER.filter(p => set.has(p)).concat(Array.from(set).filter(p => !PILLAR_ORDER.includes(p)).sort())
  }, [budgetItems, slug])

  const budgetBuckets = React.useMemo(() => {
    if (slug !== 'oolite') return []
    const set = new Set<string>()
    budgetItems.forEach(i => { if (i.budgetBucket) set.add(i.budgetBucket) })
    return Array.from(set).sort()
  }, [budgetItems, slug])

  const targetMonths = React.useMemo(() => {
    if (slug !== 'oolite') return []
    const parseTargetMonth = (s?: string): string | null => {
      if (!s) return null
      try {
        const d = new Date(s)
        if (isNaN(d.getTime())) return null
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      } catch { return null }
    }
    const set = new Set<string>()
    budgetItems.forEach(i => {
      const m = parseTargetMonth(i.targetMonth)
      if (m) set.add(m)
    })
    return Array.from(set).sort()
  }, [budgetItems, slug])

  const dataQualityIssues = React.useMemo(() => {
    if (slug !== 'oolite') return []
    return budgetItems.filter(
      i => i.spendType === 'Purchased Actual' && (!i.date || !i.subtotal || i.subtotal <= 0)
    )
  }, [budgetItems, slug])

  const budgetBucketBreakdown = React.useMemo(() => {
    if (slug !== 'oolite') return null
    const lab = budgetItems.filter(i => (i.budgetBucket || 'Digital Lab') === 'Digital Lab')
    const conf = budgetItems.filter(i => i.budgetBucket === 'Digital Conference')
    const labActual = lab.filter(i => i.spendType === 'Purchased Actual' && i.date && i.subtotal > 0).reduce((s, i) => s + i.subtotal, 0)
    const labPlanned = lab.filter(i => i.spendType === 'Planned' || (!i.spendType && !i.date)).reduce((s, i) => s + i.subtotal, 0)
    const confActual = conf.filter(i => i.spendType === 'Purchased Actual' && i.date && i.subtotal > 0).reduce((s, i) => s + i.subtotal, 0)
    const confPlanned = conf.filter(i => i.spendType === 'Planned' || (!i.spendType && !i.date)).reduce((s, i) => s + i.subtotal, 0)
    return { labActual, labPlanned, confActual, confPlanned }
  }, [budgetItems, slug])

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
    { id: 'Contingency', name: 'Contingency', emoji: '🧮' },
    // Summit/Event budget categories
    { id: 'Speakers & Program', name: 'Speakers & Program', emoji: '🎤' },
    { id: 'Production & AV', name: 'Production & AV', emoji: '🎬' },
    { id: 'Hospitality', name: 'Hospitality', emoji: '☕' },
    { id: 'Marketing', name: 'Marketing', emoji: '📣' },
    { id: 'Publishing', name: 'Publishing', emoji: '📚' },
    { id: 'Archiving', name: 'Archiving', emoji: '📦' },
    { id: 'Operations', name: 'Operations', emoji: '⚙️' },
    { id: 'Community Event', name: 'Community Event', emoji: '🎤' }
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
  }, [budgetItems, searchTerm, selectedCategory, selectedMonth, selectedVendorGroup, selectedExpenseType, selectedProgramPillar, selectedBudgetBucket, selectedTargetMonth, selectedPeople, activeView])

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

      // Load budget data: for Oolite, fetch from API (Airtable when configured); otherwise use static config
      const effectiveBudgetType = slug === 'oolite' ? budgetType : undefined
      let budgetConfig: ReturnType<typeof getBudgetConfig>

      if (slug === 'oolite') {
        try {
          const res = await fetch(`/api/organizations/by-slug/${slug}/budget/config`)
          if (res.ok) {
            budgetConfig = await res.json()
          } else {
            budgetConfig = getBudgetConfig(slug, effectiveBudgetType)
          }
        } catch {
          budgetConfig = getBudgetConfig(slug, effectiveBudgetType)
        }
      } else {
        budgetConfig = getBudgetConfig(slug, effectiveBudgetType)
      }
      
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

  // View filter: mirrors Airtable views
  const viewFilteredItems = React.useMemo(() => {
    let items = budgetItems
    if (slug !== 'oolite') return items
    switch (activeView) {
      case 'actuals':
        items = items.filter(i =>
          i.spendType === 'Purchased Actual' && i.date && i.subtotal > 0 &&
          KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab')
        )
        break
      case 'planned':
        items = items.filter(i =>
          (i.spendType === 'Planned' || (!i.spendType && !i.date)) &&
          KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab')
        )
        break
      case 'digital-conference':
        items = items.filter(i => i.budgetBucket === 'Digital Conference')
        break
      case 'surface-renovation':
        items = items.filter(i =>
          (i.phaseLabel || '').toLowerCase().includes('renovation') ||
          (i.phaseLabel || '').toLowerCase().includes('setup')
        )
        break
      case 'printers':
        items = items.filter(i => {
          const v = (i.vendor || '').toLowerCase()
          const vg = (i.vendorGroup || '').toLowerCase()
          const ps = (i.printSystem || '').toLowerCase()
          return v.includes('image pro') || vg.includes('image pro') || ps.includes('p-8000') ||
            ps.includes('f6470h') || v.includes('epson') || v.includes('printer')
        })
        break
      case 'verity-it':
        items = items.filter(i => (i.vendorGroup || '').toLowerCase().includes('verity'))
        break
      default:
        break
    }
    return items
  }, [budgetItems, activeView, slug])

  // Parse targetMonth (e.g. "November 26, 2026") to YYYY-MM for filtering
  const getMonthFromTargetMonth = (targetMonthStr?: string): string | null => {
    if (!targetMonthStr) return null
    try {
      const date = new Date(targetMonthStr)
      if (isNaN(date.getTime())) return null
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    } catch {
      return null
    }
  }

  const filterItems = () => {
    let filtered = viewFilteredItems

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.lineItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.evidenceMetadata || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedMonth && slug === 'oolite') {
      filtered = filtered.filter(item => {
        const itemMonth = item.date ? getMonthFromDate(item.date) : getMonthFromTargetMonth(item.targetMonth)
        return itemMonth === selectedMonth
      })
    }

    if (selectedVendorGroup !== 'all' && slug === 'oolite') {
      filtered = filtered.filter(item => (item.vendorGroup || '') === selectedVendorGroup)
    }

    if (selectedExpenseType !== 'all' && slug === 'oolite') {
      filtered = filtered.filter(item => (item.expenseType || '') === selectedExpenseType)
    }

    if (selectedProgramPillar !== 'all' && slug === 'oolite') {
      filtered = filtered.filter(item => (item.programPillar || 'Programming Support') === selectedProgramPillar)
    }

    if (selectedBudgetBucket !== 'all' && slug === 'oolite') {
      filtered = filtered.filter(item => (item.budgetBucket || '') === selectedBudgetBucket)
    }

    if (selectedTargetMonth && slug === 'oolite') {
      filtered = filtered.filter(item => getMonthFromTargetMonth(item.targetMonth) === selectedTargetMonth)
    }

    if (selectedPeople.trim() && slug === 'oolite') {
      const terms = selectedPeople.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      if (terms.length > 0) {
        filtered = filtered.filter(item => {
          const people = (item.emailPeople || '').toLowerCase()
          return terms.some(t => people.includes(t))
        })
      }
    }

    setFilteredItems(filtered)
  }

  const getTotalCost = () => {
    if (slug === 'oolite') return BUDGET_CAP
    return totalBudget || budgetItems.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const getItemAmount = (i: BudgetItem) => (i.subtotal ?? i.unitCost ?? 0)

  const getActualSpent = () => {
    if (slug !== 'oolite') return budgetItems.reduce((sum, item) => sum + getItemAmount(item), 0)
    return budgetItems
      .filter(i => i.spendType === 'Purchased Actual' && i.date && getItemAmount(i) > 0)
      .filter(i => KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab'))
      .reduce((s, i) => s + getItemAmount(i), 0)
  }

  const getRequestedPending = () => {
    if (slug !== 'oolite') return 0
    return budgetItems
      .filter(i =>
        i.spendType === 'Purchased Actual' &&
        !i.date &&
        i.emailDate &&
        i.emailTitle &&
        i.emailPeople &&
        KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab')
      )
      .reduce((s, i) => s + getItemAmount(i), 0)
  }

  const getPlannedTotal = () => {
    if (slug !== 'oolite') return 0
    return budgetItems
      .filter(i => i.spendType === 'Planned' || (!i.spendType && !i.date))
      .filter(i => KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab'))
      .reduce((s, i) => s + getItemAmount(i), 0)
  }

  const getSpentAmount = () => getActualSpent()

  const getRemainingBudget = () => {
    if (slug === 'oolite') return BUDGET_CAP - getActualSpent()
    return getTotalCost() - getSpentAmount()
  }

  // Format date to show month/year badge
  const formatDateBadge = (dateStr?: string): string | null => {
    if (!dateStr) return null
    try {
      const date = new Date(dateStr)
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const year = date.getFullYear()
      return `${month} ${year}`
    } catch {
      return null
    }
  }

  // Get month from date for sorting/grouping
  const getMonthFromDate = (dateStr?: string): string | null => {
    if (!dateStr) return null
    try {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    } catch {
      return null
    }
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
    const hasFilters = selectedCategory !== 'all' || searchTerm || (slug === 'oolite' && selectedMonth) ||
      (slug === 'oolite' && selectedVendorGroup !== 'all') || (slug === 'oolite' && selectedExpenseType !== 'all') ||
      (slug === 'oolite' && selectedProgramPillar !== 'all') || (slug === 'oolite' && selectedBudgetBucket !== 'all') || (slug === 'oolite' && selectedTargetMonth) ||
      (slug === 'oolite' && selectedPeople.trim())
    const itemsToUse = hasFilters ? filteredItems : viewFilteredItems
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
    const itemsForChart = viewFilteredItems
    let segmentTotals: { name: string; value: number; color: string; percentage: number }[]

    if (groupBy === 'programPillar' && slug === 'oolite') {
      const pillarTotals = itemsForChart.reduce((acc, item) => {
        const pillar = item.programPillar || 'Programming Support'
        if (!acc[pillar]) acc[pillar] = 0
        acc[pillar] += item.subtotal
        return acc
      }, {} as Record<string, number>)
      segmentTotals = PILLAR_ORDER.filter(p => (pillarTotals[p] ?? 0) > 0).map(pillar => ({
        name: pillar,
        value: pillarTotals[pillar],
        color: getPillarColor(pillar),
        percentage: pillarTotals[pillar] > 0 ? (pillarTotals[pillar] / getTotalCost()) * 100 : 0
      }))
    } else {
      segmentTotals = categories.slice(1).map(category => {
        const total = itemsForChart
          .filter(item => item.category === category.id)
          .reduce((sum, item) => sum + item.subtotal, 0)
        return {
          name: category.name,
          value: total,
          color: getCategoryColor(category.id),
          percentage: total > 0 ? (total / getTotalCost()) * 100 : 0
        }
      }).filter(item => item.value > 0)
    }

    const categoryTotals = segmentTotals

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

  // Spend by month for bar chart (Overview tab)
  const monthlySpendData = React.useMemo(() => {
    const monthTotals: Record<string, number> = {}
    const monthOrder = [
      ...Array.from({ length: 4 }, (_, i) => `2025-${String(9 + i).padStart(2, '0')}`),
      ...Array.from({ length: 11 }, (_, i) => `2026-${String(1 + i).padStart(2, '0')}`)
    ]
    monthOrder.forEach(m => { monthTotals[m] = 0 })
    viewFilteredItems.forEach(item => {
      const monthStr = item.date ? getMonthFromDate(item.date) : getMonthFromTargetMonth(item.targetMonth)
      if (monthStr && monthTotals.hasOwnProperty(monthStr)) {
        monthTotals[monthStr] += item.subtotal
      }
    })
    return monthOrder.map(monthStr => ({
      month: new Date(monthStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      monthKey: monthStr,
      spend: monthTotals[monthStr]
    }))
  }, [viewFilteredItems])

  const resetFilters = () => {
    setSelectedCategory('all')
    setSearchTerm('')
    setSelectedMonth(null)
    setSelectedVendorGroup('all')
    setSelectedExpenseType('all')
    setSelectedProgramPillar('all')
    setSelectedBudgetBucket('all')
    setSelectedTargetMonth(null)
    setSelectedPeople('')
    setSelectedSegment(null)
    setSelectedCategoryForSort(null)
    setSelectedPillarForSort(null)
    setExpandedCategories(new Set())
  }

  const getPillarColor = (pillar: string) => {
    const colors: Record<string, string> = {
      'Infrastructure': '#3B82F6',
      'Programming Support': '#10B981',
      'Programming + Archive': '#10B981',
      'Documentation + Archive': '#8B5CF6',
      'Public Engagement': '#F59E0B',
      'Smart Sign': '#06B6D4'
    }
    return colors[pillar] || '#6B7280'
  }

  const getCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
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
      'Contingency': '#6B7280',
      'Speakers & Program': '#6366F1',
      'Production & AV': '#8B5CF6',
      'Hospitality': '#10B981',
      'Marketing': '#F59E0B',
      'Publishing': '#06B6D4',
      'Archiving': '#64748B',
      'Operations': '#94A3B8',
      'Community Event': '#6366F1'
    }
    return colors[categoryId] || '#6B7280'
  }

  const toggleCategoryExpansion = (categoryIdOrPillar: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryIdOrPillar)) {
        newSet.delete(categoryIdOrPillar)
      } else {
        newSet.add(categoryIdOrPillar)
      }
      return newSet
    })
    if (PILLAR_ORDER.includes(categoryIdOrPillar)) {
      setSelectedPillarForSort(categoryIdOrPillar)
      setSelectedCategoryForSort(null)
    } else {
      setSelectedCategoryForSort(categoryIdOrPillar)
      setSelectedPillarForSort(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Category pie data for Dashboard tab (Oolite/Airtable) - uses display categories from lineItems
  const dashboardCategoryChartData = React.useMemo((): CategoryChartItem[] | undefined => {
    if (slug !== 'oolite' || budgetMonths.length === 0) return undefined
    const totals: Record<string, number> = {}
    budgetMonths.forEach(month => {
      month.lineItems.forEach(item => {
        const cat = item.category || 'Other'
        totals[cat] = (totals[cat] ?? 0) + item.amount
      })
    })
    return Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value, color: getCategoryColor(name) }))
  }, [slug, budgetMonths])

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category)
    return categoryData?.emoji || '📦'
  }

  const syncPurposeToAirtable = async () => {
    if (slug !== 'oolite') return
    setSyncPurposeLoading(true)
    setSyncPurposeResult(null)
    try {
      const res = await fetch(`/api/organizations/by-slug/${slug}/budget/sync-purpose`, { method: 'POST' })
      const data = await res.json()
      setSyncPurposeResult({ updated: data.updated ?? 0, errors: data.errors ?? [] })
      if (data.success) loadData()
    } catch {
      setSyncPurposeResult({ updated: 0, errors: ['Request failed'] })
    } finally {
      setSyncPurposeLoading(false)
    }
  }

  const exportToCSV = () => {
    const exportHasFilters = selectedCategory !== 'all' || searchTerm || (slug === 'oolite' && selectedMonth) ||
      (slug === 'oolite' && selectedVendorGroup !== 'all') || (slug === 'oolite' && selectedExpenseType !== 'all') ||
      (slug === 'oolite' && selectedProgramPillar !== 'all') || (slug === 'oolite' && selectedBudgetBucket !== 'all') || (slug === 'oolite' && selectedTargetMonth) ||
      (slug === 'oolite' && selectedPeople.trim())
    const itemsToExport = exportHasFilters ? filteredItems : budgetItems
    const escapeCSV = (val: string | number | undefined): string => {
      if (val === undefined || val === null) return ''
      const str = String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }
    const headers = ['Name', 'Category', 'Purpose', 'Amount', 'Vendor', 'Notes', 'Date', 'Qty', 'Unit Cost', 'Subtotal', 'Phase', 'Program Pillar', 'Spend Type', 'Budget Bucket', 'Vendor Group', 'Email Title', 'Email Date', 'Email People', 'Evidence Metadata']
    const rows = itemsToExport.map(item => [
      escapeCSV(item.lineItem),
      escapeCSV(item.category),
      escapeCSV(item.purpose),
      escapeCSV(item.subtotal),
      escapeCSV(item.vendor),
      escapeCSV(item.notes),
      escapeCSV(item.date),
      escapeCSV(item.qty),
      escapeCSV(item.unitCost),
      escapeCSV(item.subtotal),
      escapeCSV(item.phaseLabel),
      escapeCSV(item.programPillar),
      escapeCSV(item.spendType),
      escapeCSV(item.budgetBucket),
      escapeCSV(item.vendorGroup),
      escapeCSV(item.emailTitle),
      escapeCSV(item.emailDate),
      escapeCSV(item.emailPeople),
      escapeCSV(item.evidenceMetadata)
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug}-budget-export-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
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
                  {slug === 'oolite' ? 'Digital Lab Budget' : 'Budget'}
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {slug === 'oolite' ? 'Digital Lab + Digital Conference ($80k combined) · September 2025 - November 2026' : 'Budget overview'}
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
                    <p className="text-green-100 text-sm">Actual Spent</p>
                    {showPercentageInChart ? (
                      <>
                        <p className="text-3xl font-bold">
                          {((getActualSpent() / getTotalCost()) * 100).toFixed(1)}%
                        </p>
                        <p className="text-green-200 text-xs mt-1">
                          {formatCurrency(getActualSpent())} to date
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-bold">{formatCurrency(getActualSpent())}</p>
                        <p className="text-green-200 text-xs mt-1">
                          {((getActualSpent() / getTotalCost()) * 100).toFixed(1)}% of budget
                        </p>
                      </>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-r from-purple-700 to-purple-800' : 'bg-gradient-to-r from-purple-600 to-purple-700'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">{slug === 'oolite' ? 'Planned' : 'Equipment Items'}</p>
                    {slug === 'oolite' ? (
                      <>
                        <p className="text-3xl font-bold">{formatCurrency(getPlannedTotal())}</p>
                        <p className="text-purple-200 text-xs mt-1">forecast</p>
                      </>
                    ) : (
                      <p className="text-3xl font-bold">{budgetItems.length}</p>
                    )}
                  </div>
                  <Package className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-r from-orange-700 to-orange-800' : 'bg-gradient-to-r from-orange-600 to-orange-700'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Remaining</p>
                    {showPercentageInChart ? (
                      <>
                        <p className="text-3xl font-bold">
                          {((getRemainingBudget() / getTotalCost()) * 100).toFixed(1)}%
                        </p>
                        <p className="text-orange-200 text-xs mt-1">
                          {formatCurrency(getRemainingBudget())} available
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-bold">{formatCurrency(getRemainingBudget())}</p>
                        <p className="text-orange-200 text-xs mt-1">
                          {((getRemainingBudget() / getTotalCost()) * 100).toFixed(1)}% available
                        </p>
                      </>
                    )}
                  </div>
                  <Wallet className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Quality Alert */}
          {slug === 'oolite' && dataQualityIssues.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                <strong>{dataQualityIssues.length} item(s)</strong> marked Purchased Actual are missing Date or Subtotal.
                These are excluded from Actual Spent. Fix in Airtable: {dataQualityIssues.map(i => i.lineItem).join(', ')}
              </AlertDescription>
            </Alert>
          )}

          {/* Budget Bucket Breakdown (Oolite) */}
          {slug === 'oolite' && budgetBucketBreakdown && (
            <motion.div
              className="mb-6 p-4 rounded-lg border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}
            >
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>By Budget Bucket</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Digital Lab</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Actual: {formatCurrency(budgetBucketBreakdown.labActual)} / Planned: {formatCurrency(budgetBucketBreakdown.labPlanned)}
                  </p>
                </div>
                <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Digital Conference</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Actual: {formatCurrency(budgetBucketBreakdown.confActual)} / Planned: {formatCurrency(budgetBucketBreakdown.confPlanned)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* View switcher (Oolite / Airtable views) */}
          {slug === 'oolite' && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>View</Label>
              <Select value={activeView} onValueChange={(v: typeof activeView) => setActiveView(v)}>
                <SelectTrigger className={`w-full sm:w-64 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="actuals">Purchased / Actuals</SelectItem>
                  <SelectItem value="planned">Planned / Not Yet Purchased</SelectItem>
                  <SelectItem value="digital-conference">Digital Conference</SelectItem>
                  <SelectItem value="surface-renovation">Surface Renovation</SelectItem>
                  <SelectItem value="printers">Printers / Image Pro</SelectItem>
                  <SelectItem value="verity-it">Verity IT</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

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
                  placeholder="Search name, category, notes, or evidence..."
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

              {slug === 'oolite' && (
                <Select
                  value={selectedMonth ?? 'all'}
                  onValueChange={(v) => setSelectedMonth(v === 'all' ? null : v)}
                >
                  <SelectTrigger className={`w-full sm:w-48 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <SelectValue placeholder="All months" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                    <SelectItem value="all">All months</SelectItem>
                    {[
                      ...Array.from({ length: 4 }, (_, i) => ({ y: 2025, m: 9 + i })),
                      ...Array.from({ length: 11 }, (_, i) => ({ y: 2026, m: 1 + i }))
                    ].map(({ y, m }) => {
                      const val = `${y}-${String(m).padStart(2, '0')}`
                      const label = new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      return (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
              {slug === 'oolite' && vendorGroups.length > 0 && (
                <Select value={selectedVendorGroup} onValueChange={setSelectedVendorGroup}>
                  <SelectTrigger className={`w-full sm:w-40 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <SelectValue placeholder="Vendor Group" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {vendorGroups.map(vg => (
                      <SelectItem key={vg} value={vg}>{vg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {slug === 'oolite' && expenseTypes.length > 0 && (
                <Select value={selectedExpenseType} onValueChange={setSelectedExpenseType}>
                  <SelectTrigger className={`w-full sm:w-40 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <SelectValue placeholder="Expense Type" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                    <SelectItem value="all">All Types</SelectItem>
                    {expenseTypes.map(et => (
                      <SelectItem key={et} value={et}>{et}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {slug === 'oolite' && programPillars.length > 0 && (
                <Select value={selectedProgramPillar} onValueChange={setSelectedProgramPillar}>
                  <SelectTrigger className={`w-full sm:w-48 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <SelectValue placeholder="Program Pillar" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                    <SelectItem value="all">All Pillars</SelectItem>
                    {programPillars.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {slug === 'oolite' && budgetBuckets.length > 0 && (
                <Select value={selectedBudgetBucket} onValueChange={setSelectedBudgetBucket}>
                  <SelectTrigger className={`w-full sm:w-44 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <SelectValue placeholder="Budget Bucket" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                    <SelectItem value="all">All Buckets</SelectItem>
                    {budgetBuckets.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {slug === 'oolite' && targetMonths.length > 0 && (
                <Select value={selectedTargetMonth ?? 'all'} onValueChange={(v) => setSelectedTargetMonth(v === 'all' ? null : v)}>
                  <SelectTrigger className={`w-full sm:w-48 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <SelectValue placeholder="Target Month (Planned)" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                    <SelectItem value="all">All Target Months</SelectItem>
                    {targetMonths.map(m => {
                      const [y, mo] = m.split('-')
                      const label = new Date(parseInt(y || '2025'), parseInt(mo || '1') - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      return <SelectItem key={m} value={m}>{label}</SelectItem>
                    })}
                  </SelectContent>
                </Select>
              )}
              {slug === 'oolite' && (
                <Input
                  placeholder="People (Email People)..."
                  value={selectedPeople}
                  onChange={(e) => setSelectedPeople(e.target.value)}
                  className={`w-full sm:w-48 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  title="Comma-separated names to filter by Email People"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {slug === 'oolite' && (
                <Button
                  variant="outline"
                  className={`flex items-center ${isDark ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'}`}
                  onClick={syncPurposeToAirtable}
                  disabled={syncPurposeLoading}
                >
                  {syncPurposeLoading ? (
                    <span className="animate-spin mr-2">⏳</span>
                  ) : (
                    <Wrench className="h-4 w-4 mr-2" />
                  )}
                  Sync Purpose
                </Button>
              )}
              <Button 
                variant="outline" 
                className={`flex items-center ${isDark ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'}`}
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
            {syncPurposeResult && (
              <p className={`text-sm ${syncPurposeResult.errors.length > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {syncPurposeResult.updated} record(s) updated.
                {syncPurposeResult.errors.length > 0 && ` ${syncPurposeResult.errors.length} error(s).`}
              </p>
            )}
            </div>
          </motion.div>

          {/* Item count indicator */}
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {selectedCategory !== 'all' || searchTerm || (slug === 'oolite' && selectedMonth) ||
              (slug === 'oolite' && selectedVendorGroup !== 'all') || (slug === 'oolite' && selectedExpenseType !== 'all') ||
              (slug === 'oolite' && selectedProgramPillar !== 'all') || (slug === 'oolite' && selectedBudgetBucket !== 'all') || (slug === 'oolite' && selectedTargetMonth) ||
              (slug === 'oolite' && selectedPeople.trim())
              ? `Showing ${filteredItems.length} of ${viewFilteredItems.length} items`
              : `${viewFilteredItems.length} items`}
          </p>

          {/* Budget Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value)
              router.push(`/o/${slug}/budget?tab=${value}`, { scroll: false })
            }} className="w-full">
              <TabsList className={`grid w-full ${slug === 'oolite' ? 'grid-cols-6' : 'grid-cols-4'} ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                {slug === 'oolite' && (
                  <TabsTrigger 
                    value="reconciliation" 
                    className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-1 inline" />
                    Spent To Date
                  </TabsTrigger>
                )}
                {slug === 'oolite' && (
                  <TabsTrigger 
                    value="report" 
                    className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Report
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="overview" 
                  className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="presentation" 
                  className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Presentation
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
              
              {slug === 'oolite' && (
                <TabsContent value="reconciliation" className="mt-6">
                  <ReconciliationView
                    budgetItems={budgetItems}
                    filteredItems={filteredItems}
                    activeView={activeView}
                    viewFilteredItems={viewFilteredItems}
                    getActualSpent={getActualSpent}
                    getRequestedPending={getRequestedPending}
                    getPlannedTotal={getPlannedTotal}
                    getRemainingBudget={getRemainingBudget}
                    BUDGET_CAP={BUDGET_CAP}
                    formatCurrency={formatCurrency}
                    formatDateBadge={formatDateBadge}
                    getCategoryIcon={getCategoryIcon}
                    isDark={isDark}
                    slug={slug}
                    selectedMonth={selectedMonth}
                    getMonthFromDate={getMonthFromDate}
                    getMonthFromTargetMonth={getMonthFromTargetMonth}
                    monthlySpendData={monthlySpendData}
                  />
                </TabsContent>
              )}
              {slug === 'oolite' && (
                <TabsContent value="report" className="mt-6">
                  <ReportView
                    budgetItems={budgetItems}
                    getActualSpent={getActualSpent}
                    getRequestedPending={getRequestedPending}
                    getPlannedTotal={getPlannedTotal}
                    getRemainingBudget={getRemainingBudget}
                    BUDGET_CAP={BUDGET_CAP}
                    formatCurrency={formatCurrency}
                    getCategoryIcon={getCategoryIcon}
                    isDark={isDark}
                  />
                </TabsContent>
              )}
              
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
                            Click segments to highlight. Toggle Values (% or $) and Show (Remaining or Spent) to switch views.
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          {(selectedCategory !== 'all' || searchTerm || (slug === 'oolite' && selectedMonth) ||
                            (slug === 'oolite' && selectedVendorGroup !== 'all') || (slug === 'oolite' && selectedExpenseType !== 'all') ||
                            (slug === 'oolite' && selectedProgramPillar !== 'all') || (slug === 'oolite' && selectedBudgetBucket !== 'all') || (slug === 'oolite' && selectedTargetMonth) ||
                            (slug === 'oolite' && selectedPeople.trim())) && (
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
                          {slug === 'oolite' && (
                            <div className="flex items-center space-x-2 border-l pl-2 ml-2 border-gray-600">
                              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Group by:
                              </span>
                              <Button
                                variant={groupBy === 'category' ? "default" : "outline"}
                                size="sm"
                                onClick={() => { setGroupBy('category'); setSelectedPillarForSort(null) }}
                                className={groupBy === 'category' ? '' : (isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')}
                              >
                                Category
                              </Button>
                              <Button
                                variant={groupBy === 'programPillar' ? "default" : "outline"}
                                size="sm"
                                onClick={() => { setGroupBy('programPillar'); setSelectedCategoryForSort(null) }}
                                className={groupBy === 'programPillar' ? '' : (isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')}
                              >
                                Program Pillar
                              </Button>
                            </div>
                          )}
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
                                if (groupBy === 'programPillar' && slug === 'oolite') {
                                  setSelectedPillarForSort(data.name)
                                  setSelectedCategoryForSort(null)
                                  setExpandedCategories(prev => {
                                    const newSet = new Set(prev)
                                    newSet.add(data.name)
                                    return newSet
                                  })
                                } else {
                                  const categoryId = categories.find(c => c.name === data.name)?.id
                                  if (categoryId) {
                                    setSelectedCategoryForSort(categoryId)
                                    setSelectedPillarForSort(null)
                                    setExpandedCategories(prev => {
                                      const newSet = new Set(prev)
                                      newSet.add(categoryId)
                                      return newSet
                                    })
                                  }
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
                                selectedPillarForSort === entry.name ||
                                (selectedCategory !== 'all' && selectedCategory === categoryId))
                              const hasSelection = selectedSegment || selectedCategoryForSort || selectedPillarForSort || (selectedCategory !== 'all')
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
                                      {(((data.value as number) / getTotalCost()) * 100).toFixed(1)}%
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

                  {/* Spend by Month Bar Chart */}
                  <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Spend by Month
                      </CardTitle>
                      <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Actual and planned spend per month
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlySpendData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" className={isDark ? 'stroke-gray-600' : 'stroke-gray-200'} />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis
                            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
                            tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload?.[0]) {
                                const d = payload[0].payload
                                return (
                                  <div className={`p-3 rounded-lg shadow-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                                    <p className="font-semibold">{d.month}</p>
                                    <p className="text-sm">{formatCurrency(d.spend)}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="spend" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Category / Pillar Overview - Full Width */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {groupBy === 'programPillar' && slug === 'oolite' ? 'Program Pillar Breakdown' : 'Category Breakdown'}
                      </h3>
                      {(selectedCategoryForSort || selectedPillarForSort) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategoryForSort(null)
                            setSelectedPillarForSort(null)
                            setSelectedSegment(null)
                          }}
                          className={isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
                        >
                          Show All
                        </Button>
                      )}
                    </div>
                    {(() => {
                      if (groupBy === 'programPillar' && slug === 'oolite') {
                        // Pillar breakdown
                        const pillarData = PILLAR_ORDER.map(pillar => {
                          const pillarItems = viewFilteredItems
                            .filter(item => (item.programPillar || 'Programming Support') === pillar)
                            .sort((a, b) => b.subtotal - a.subtotal)
                          const pillarTotal = pillarItems.reduce((sum, item) => sum + item.subtotal, 0)
                          const percentage = pillarTotal > 0 ? (pillarTotal / getTotalCost()) * 100 : 0
                          return { pillar, pillarItems, pillarTotal, percentage }
                        }).filter(p => p.pillarTotal > 0)

                        const sortedPillars = [...pillarData].sort((a, b) => {
                          const aSel = selectedPillarForSort === a.pillar
                          const bSel = selectedPillarForSort === b.pillar
                          if (aSel && !bSel) return -1
                          if (bSel && !aSel) return 1
                          return b.pillarTotal - a.pillarTotal
                        })

                        return sortedPillars.map(({ pillar, pillarItems, pillarTotal, percentage }) => {
                          const isExpanded = expandedCategories.has(pillar)
                          return (
                            <div
                              key={pillar}
                              className={`rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'} ${
                                selectedPillarForSort === pillar ? (isDark ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-500') : ''
                              }`}
                            >
                              <button
                                type="button"
                                className={`w-full flex items-center justify-between p-4 text-left ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} rounded-t-lg`}
                                onClick={() => toggleCategoryExpansion(pillar)}
                              >
                                <div className="flex items-center gap-2">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{pillar}</span>
                                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    ({pillarItems.length} items)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {formatCurrency(pillarTotal)}
                                  </span>
                                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              </button>
                              {isExpanded && (
                                <div className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-200'} divide-y ${isDark ? 'divide-gray-600' : 'divide-gray-200'}`}>
                                  {pillarItems.map((item, idx) => (
                                    <div key={idx} className={`p-3 flex flex-col gap-1 ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}>
                                      <div className="flex justify-between items-start gap-2">
                                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{item.lineItem}</span>
                                        <span className={`text-sm font-medium shrink-0 ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(item.subtotal)}</span>
                                      </div>
                                      {item.purpose && (
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} title={item.purpose}>
                                          {item.purpose}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })
                      }

                      // Category breakdown
                      const categoryData = categories.slice(1).map((category) => {
                        let categoryItems = viewFilteredItems.filter(item => item.category === category.id)
                        const categoryTotal = categoryItems.reduce((sum, item) => sum + item.subtotal, 0)
                        const percentage = categoryTotal > 0 ? (categoryTotal / getTotalCost()) * 100 : 0
                        return {
                          category,
                          categoryItems: categoryItems.sort((a, b) => b.subtotal - a.subtotal),
                          categoryTotal,
                          percentage
                        }
                      })
                      
                      const sortedCategories = categoryData.sort((a, b) => {
                        const aIsSelected = selectedCategoryForSort === a.category.id || 
                          (selectedCategory !== 'all' && selectedCategory === a.category.id)
                        const bIsSelected = selectedCategoryForSort === b.category.id || 
                          (selectedCategory !== 'all' && selectedCategory === b.category.id)
                        if (aIsSelected && !bIsSelected) return -1
                        if (bIsSelected && !aIsSelected) return 1
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
                                    {categoryItems.map((item, idx) => {
                                      // Try to get date from item, or find it in budgetMonths
                                      let itemDate = item.date
                                      if (!itemDate && budgetMonths.length > 0) {
                                        // Find the item in budgetMonths to get its date
                                        for (const month of budgetMonths) {
                                          const foundItem = month.lineItems.find(li => 
                                            li.name === item.lineItem && li.amount === item.subtotal
                                          )
                                          if (foundItem?.date) {
                                            itemDate = foundItem.date
                                            break
                                          }
                                        }
                                      }
                                      
                                      const dateBadge = formatDateBadge(itemDate)
                                      const monthStr = getMonthFromDate(itemDate)
                                      
                                      return (
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
                                              <div className="mt-1">
                                                {dateBadge ? (
                                                  <Badge 
                                                    variant="outline" 
                                                    className={`text-xs font-medium ${isDark ? 'bg-gray-800 border-gray-500 text-gray-200' : 'bg-white border-gray-400 text-gray-700'}`}
                                                    title={`Purchased: ${dateBadge}`}
                                                  >
                                                    📅 {dateBadge}
                                                  </Badge>
                                                ) : (
                                                  <Badge 
                                                    variant="outline" 
                                                    className={`text-xs font-medium opacity-50 ${isDark ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-white border-gray-300 text-gray-500'}`}
                                                    title="Date not specified"
                                                  >
                                                    No date
                                                  </Badge>
                                                )}
                                              </div>
                                              {item.purpose && (
                                                <p className={`text-xs mt-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} title={item.purpose}>
                                                  {item.purpose}
                                                </p>
                                              )}
                                              {item.notes && (
                                                <p className={`text-xs truncate mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                                      )
                                    })}
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
              
              <TabsContent value="presentation" className="mt-6">
                <PresentationView 
                  budgetItems={budgetItems} 
                  totalBudget={totalBudget}
                  getTotalCost={getTotalCost}
                  getSpentAmount={getSpentAmount}
                  getRemainingBudget={getRemainingBudget}
                  formatCurrency={formatCurrency}
                  isDark={isDark}
                  budgetType={budgetType}
                />
              </TabsContent>
              
              <TabsContent value="dashboard" className="mt-6">
                {budgetMonths.length > 0 ? (
                  <BudgetDashboard months={budgetMonths} organizationSlug={slug} totalBudget={totalBudget} categoryChartData={dashboardCategoryChartData} />
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
                            <th className={`text-left p-3 max-w-[220px] ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Purpose</th>
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
                              <td className={`p-3 text-sm max-w-[220px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`} title={item.purpose}>
                                {item.purpose ? (
                                  <span className="line-clamp-2">{item.purpose}</span>
                                ) : (
                                  <span className="italic opacity-60">—</span>
                                )}
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
                              <td colSpan={5} className={`p-3 text-right font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
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

// Report view: 3-slide story flow for leadership presentations
function ReportView({
  budgetItems,
  getActualSpent,
  getRequestedPending,
  getPlannedTotal,
  getRemainingBudget,
  BUDGET_CAP,
  formatCurrency,
  getCategoryIcon,
  isDark
}: {
  budgetItems: BudgetItem[]
  getActualSpent: () => number
  getRequestedPending: () => number
  getPlannedTotal: () => number
  getRemainingBudget: () => number
  BUDGET_CAP: number
  formatCurrency: (n: number) => string
  getCategoryIcon: (c: string) => string
  isDark: boolean
}) {
  const [reportSlide, setReportSlide] = useState(0)
  const [accountingRemaining, setAccountingRemaining] = useState('22000')

  const spent = getActualSpent()
  const requestedPending = getRequestedPending()
  const planned = getPlannedTotal()
  const remaining = getRemainingBudget()
  const spentPct = BUDGET_CAP > 0 ? (spent / BUDGET_CAP) * 100 : 0
  const remainingPct = BUDGET_CAP > 0 ? (remaining / BUDGET_CAP) * 100 : 0
  const remainingAfterPlanned = Math.max(0, BUDGET_CAP - spent - planned)
  const gap = accountingRemaining ? parseFloat(accountingRemaining.replace(/[^0-9.-]/g, '')) - remaining : null

  const KNIGHT_BUCKETS = ['Digital Lab', 'Digital Conference']
  const allActualsForProof = budgetItems.filter(
    i => i.spendType === 'Purchased Actual' && (i.subtotal > 0 || i.unitCost > 0) &&
    KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab')
  )
  const hasProofForMeter = (i: BudgetItem) => Boolean(i.emailTitle && i.emailDate && i.emailPeople)
  const proofCoveragePct = allActualsForProof.length > 0
    ? (allActualsForProof.filter(hasProofForMeter).length / allActualsForProof.length) * 100
    : 100

  const PILLAR_ORDER = ['Infrastructure', 'Programming Support', 'Documentation + Archive', 'Public Engagement']
  const PILLAR_OUTCOMES: Record<string, string> = {
    'Infrastructure': 'Renovation + readiness',
    'Programming Support': 'Resident + alumni support',
    'Documentation + Archive': '360 captures + cataloging',
    'Public Engagement': 'Monthly Digital Presence Sprint rotation'
  }
  const byPillar = budgetItems.reduce((acc, item) => {
    const pillar = item.programPillar || 'Programming Support'
    if (!acc[pillar]) acc[pillar] = 0
    acc[pillar] += item.subtotal
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Slide content */}
      <Card className={`min-h-[400px] ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-8">
          {reportSlide === 0 && (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Where we are + what Knight gets</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Total Cap (Knight)</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>{formatCurrency(BUDGET_CAP)}</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-green-200' : 'text-green-800'}`}>Spent to Date (Actuals)</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-green-900'}`}>{formatCurrency(spent)}</p>
                  <p className={`text-xs ${isDark ? 'text-green-300' : 'text-green-600'}`}>{spentPct.toFixed(1)}%</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${isDark ? 'border-cyan-400/50 text-cyan-300' : 'border-cyan-600 text-cyan-700'}`}>
                      Proof Coverage: {proofCoveragePct.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>Requested / Pending</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-amber-900'}`}>{formatCurrency(requestedPending)}</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>Planned (Forecast)</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>{formatCurrency(planned)}</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>Remaining (after Actuals)</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-orange-900'}`}>{formatCurrency(remaining)}</p>
                  <p className={`text-xs ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>{remainingPct.toFixed(1)}%</p>
                </div>
              </div>
              <p className={`text-base italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Every line item is tied to an email request trail.
              </p>
            </div>
          )}
          {reportSlide === 1 && (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Knight Pillars → Spend → Outcomes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PILLAR_ORDER.map(pillar => (
                  <div key={pillar} className={`p-6 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{pillar}</p>
                    <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{formatCurrency(byPillar[pillar] || 0)}</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      → {PILLAR_OUTCOMES[pillar] || '— artists served, workshops, captures'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {reportSlide === 2 && (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Reconciliation + governance</h2>
              <div className="space-y-4">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Our tracker is built from the Digital Lab email request/receipt trail and shows:
                </p>
                <ul className={`list-disc list-inside text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>Spent to Date (Actuals): {formatCurrency(spent)}</li>
                  <li>Remaining (after Actuals): {formatCurrency(remaining)}</li>
                </ul>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  A separate figure referenced in recent correspondence is:
                </p>
                <div className="flex items-center gap-1">
                  <Label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Remaining (Accounting claim):</Label>
                  <Input
                    placeholder="e.g. 22000"
                    value={accountingRemaining}
                    onChange={(e) => setAccountingRemaining(e.target.value)}
                    className={`max-w-[140px] ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                </div>
                {gap !== null && !Number.isNaN(gap) && (
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Difference to reconcile: {formatCurrency(gap)}
                  </p>
                )}
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Next step: match Bill.com/GL export used for the claim against this tracker, line-by-line, and confirm the reporting basis (included/excluded items).
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Approval process: Rina approves → Accounting posts → tracker updated.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setReportSlide(s => Math.max(0, s - 1))}
          disabled={reportSlide === 0}
          className={isDark ? 'bg-gray-800 border-gray-600 text-white' : ''}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {reportSlide + 1} of 3
        </span>
        <Button
          variant="outline"
          onClick={() => setReportSlide(s => Math.min(2, s + 1))}
          disabled={reportSlide === 2}
          className={isDark ? 'bg-gray-800 border-gray-600 text-white' : ''}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

// Reconciliation view: Spent To Date table, audit tabs, proof trail, gap detector
function ReconciliationView({
  budgetItems,
  filteredItems,
  activeView,
  viewFilteredItems,
  getActualSpent,
  getRequestedPending,
  getPlannedTotal,
  getRemainingBudget,
  BUDGET_CAP,
  formatCurrency,
  formatDateBadge,
  getCategoryIcon,
  isDark,
  slug,
  selectedMonth,
  getMonthFromDate,
  getMonthFromTargetMonth,
  monthlySpendData
}: {
  budgetItems: BudgetItem[]
  filteredItems: BudgetItem[]
  activeView: string
  viewFilteredItems: BudgetItem[]
  getActualSpent: () => number
  getRequestedPending: () => number
  getPlannedTotal: () => number
  getRemainingBudget: () => number
  BUDGET_CAP: number
  formatCurrency: (n: number) => string
  formatDateBadge: (d?: string) => string | null
  getCategoryIcon: (c: string) => string
  isDark: boolean
  slug: string
  selectedMonth: string | null
  getMonthFromDate: (d?: string) => string | null
  getMonthFromTargetMonth: (d?: string) => string | null
  monthlySpendData: { month: string; monthKey: string; spend: number }[]
}) {
  const spent = getActualSpent()
  const requestedPending = getRequestedPending()
  const planned = getPlannedTotal()
  const remaining = getRemainingBudget()
  const spentPct = BUDGET_CAP > 0 ? (spent / BUDGET_CAP) * 100 : 0
  const remainingPct = BUDGET_CAP > 0 ? (remaining / BUDGET_CAP) * 100 : 0
  const remainingAfterPlanned = Math.max(0, BUDGET_CAP - spent - planned)

  const KNIGHT_BUCKETS = ['Digital Lab', 'Digital Conference']
  // Use filteredItems so Reconciliation table respects View (Printers/Verity) + category/month/search filters
  const baseItems = filteredItems
  const actualsItems = baseItems.filter(
    i => i.spendType === 'Purchased Actual' && (i.subtotal > 0 || i.unitCost > 0) &&
    KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab')
  ).sort((a, b) => {
    const dateA = a.date || a.emailDate || ''
    const dateB = b.date || b.emailDate || ''
    return dateB.localeCompare(dateA)
  })

  const hasProof = (i: BudgetItem) =>
    Boolean(i.emailTitle && i.emailDate && i.emailPeople && i.evidenceMetadata)
  const hasProofForMeter = (i: BudgetItem) =>
    Boolean(i.emailTitle && i.emailDate && i.emailPeople)
  const missingProofItems = actualsItems.filter(i => !hasProof(i))
  const missingDateItems = actualsItems.filter(i => !i.date)
  const plannedWithDateItems = baseItems.filter(
    i => i.spendType === 'Planned' && i.date
  )
  const allActualsForProof = budgetItems.filter(
    i => i.spendType === 'Purchased Actual' && (i.subtotal > 0 || i.unitCost > 0) &&
    KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab')
  )
  const proofCoveragePct = allActualsForProof.length > 0
    ? (allActualsForProof.filter(hasProofForMeter).length / allActualsForProof.length) * 100
    : 100

  const [auditTab, setAuditTab] = useState<'spent' | 'missing-proof' | 'missing-dates' | 'planned-with-date'>('spent')
  const [accountingRemaining, setAccountingRemaining] = useState<string>('22000')
  const [tableSort, setTableSort] = useState<{ column: 'date' | 'item' | 'subtotal' | 'vendorGroup' | 'programPillar' | 'category'; direction: 'asc' | 'desc' }>({ column: 'date', direction: 'desc' })
  const [checklistExpanded, setChecklistExpanded] = useState(false)
  const gap = accountingRemaining ? parseFloat(accountingRemaining.replace(/[^0-9.-]/g, '')) - remaining : null

  const applyMonthFilter = (items: BudgetItem[]) => {
    if (!selectedMonth) return items
    return items.filter(i => {
      const m = i.date ? getMonthFromDate(i.date) : getMonthFromTargetMonth(i.targetMonth)
      return m === selectedMonth
    })
  }

  const rawTableItems = applyMonthFilter(
    auditTab === 'spent' ? actualsItems
    : auditTab === 'missing-proof' ? missingProofItems
    : auditTab === 'missing-dates' ? missingDateItems
    : plannedWithDateItems
  )

  const tableItems = [...rawTableItems].sort((a, b) => {
    const { column, direction } = tableSort
    const mult = direction === 'asc' ? 1 : -1
    let cmp = 0
    switch (column) {
      case 'date':
        cmp = (a.date || a.emailDate || '').localeCompare(b.date || b.emailDate || '')
        break
      case 'item':
        cmp = (a.lineItem || '').localeCompare(b.lineItem || '')
        break
      case 'subtotal':
        cmp = (a.subtotal ?? 0) - (b.subtotal ?? 0)
        break
      case 'vendorGroup':
        cmp = (a.vendorGroup || '').localeCompare(b.vendorGroup || '')
        break
      case 'programPillar':
        cmp = (a.programPillar || '').localeCompare(b.programPillar || '')
        break
      case 'category':
        cmp = (a.category || '').localeCompare(b.category || '')
        break
      default:
        break
    }
    return mult * cmp
  })

  const handleSort = (col: typeof tableSort.column) => {
    setTableSort(prev =>
      prev.column === col ? { column: col, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { column: col, direction: col === 'date' ? 'desc' : 'asc' }
    )
  }

  // Planned for selected month (when month is selected)
  const plannedForMonthItems = selectedMonth
    ? baseItems.filter(
        i => (i.spendType === 'Planned' || (!i.spendType && !i.date)) &&
        KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab') &&
        getMonthFromTargetMonth(i.targetMonth) === selectedMonth
      ).sort((a, b) => (a.lineItem || '').localeCompare(b.lineItem || ''))
    : []

  const formatMonthLabel = (ym: string) => {
    const [y, m] = ym.split('-')
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${monthNames[parseInt(m || '1', 10) - 1]} ${y}`
  }

  // Printers view: group by Print System → Expense Type
  const printersGrouped = activeView === 'printers' ? (() => {
    const bySystem: Record<string, Record<string, { items: BudgetItem[]; total: number }>> = {}
    baseItems.forEach(i => {
      const sys = i.printSystem || 'Other'
      if (!bySystem[sys]) bySystem[sys] = {}
      const et = i.expenseType || 'Other'
      if (!bySystem[sys][et]) bySystem[sys][et] = { items: [], total: 0 }
      bySystem[sys][et].items.push(i)
      bySystem[sys][et].total += i.subtotal
    })
    return bySystem
  })() : null

  return (
    <div className="space-y-6">
      {/* Presentation Checklist (collapsible) */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader
          className={`py-4 cursor-pointer select-none ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}
          onClick={() => setChecklistExpanded(!checklistExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className={`text-base flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <LayoutDashboard className="h-4 w-4" />
              Presentation Checklist — What we have, what matters most
            </CardTitle>
            {checklistExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CardHeader>
        {checklistExpanded && (
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    <th className={`text-left p-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Feature</th>
                    <th className={`text-left p-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                    <th className={`text-left p-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Notes</th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <tr><td className="p-2">Executive KPI strip (5 blocks)</td><td className="p-2">Done</td><td className="p-2">Cap, Spent, Requested/Pending, Planned, Remaining</td></tr>
                  <tr><td className="p-2">Proof Coverage meter</td><td className="p-2">Done</td><td className="p-2">Badge under Spent to Date</td></tr>
                  <tr><td className="p-2">Accounting Reconciliation panel</td><td className="p-2">Done</td><td className="p-2">Discrepancy explainer</td></tr>
                  <tr><td className="p-2">Spent To Date table</td><td className="p-2">Done</td><td className="p-2">Default view, sortable by column</td></tr>
                  <tr><td className="p-2">Audit tabs (Missing Proof, Dates, etc.)</td><td className="p-2">Done</td><td className="p-2">4 tabs</td></tr>
                  <tr><td className="p-2">Month filter</td><td className="p-2">Done</td><td className="p-2">Sep 2025–Nov 2026</td></tr>
                  <tr><td className="p-2">Category, Program Pillar, Budget Bucket, Target Month, People filters</td><td className="p-2">Done</td><td className="p-2">—</td></tr>
                  <tr><td className="p-2">Spent by Month chart</td><td className="p-2">Done</td><td className="p-2">Bar chart</td></tr>
                  <tr><td className="p-2">Spent by Program Pillar chart</td><td className="p-2">Done</td><td className="p-2">In Reconciliation</td></tr>
                  <tr><td className="p-2">Planned for [Month] list</td><td className="p-2">Done</td><td className="p-2">When month selected</td></tr>
                  <tr><td className="p-2">Planned burn-down</td><td className="p-2">Done</td><td className="p-2">Projected Remaining after planned</td></tr>
                  <tr><td className="p-2">Printers / Verity story views</td><td className="p-2">Done</td><td className="p-2">View filter</td></tr>
                  <tr><td className="p-2">Export to CSV</td><td className="p-2">Done</td><td className="p-2">—</td></tr>
                  <tr><td className="p-2 font-medium">Table column sorting</td><td className="p-2 font-medium">Done</td><td className="p-2">Click headers to sort</td></tr>
                  <tr><td className="p-2 font-medium">Report / Story flow</td><td className="p-2 font-medium">Done</td><td className="p-2">Report tab with 3 slides</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Executive KPI strip (5 blocks + Proof Coverage) */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1 min-w-0">
          <Card className={`${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`} title="Total Knight Foundation budget cap for Digital Lab + Digital Conference combined (excluding honoraria if treated separately in Accounting).">
            <CardContent className="p-4">
              <div className="flex items-center gap-1">
                <p className={`text-sm font-medium ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Total Cap (Knight)</p>
                <span title="Total Knight Foundation budget cap for Digital Lab + Digital Conference combined (excluding honoraria if treated separately in Accounting)."><HelpCircle className="h-3.5 w-3.5 text-blue-400" /></span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-blue-900'}`}>{formatCurrency(BUDGET_CAP)}</p>
            </CardContent>
          </Card>
          <Card className={`${isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'}`} title="Sum of Purchased Actual line items that have a confirmed spend date. This is the most conservative posted spend view until Bill.com dates are added.">
            <CardContent className="p-4">
              <div className="flex items-center gap-1">
                <p className={`text-sm font-medium ${isDark ? 'text-green-200' : 'text-green-800'}`}>Spent to Date (Actuals)</p>
                <span title="Sum of Purchased Actual line items that have a confirmed spend date. This is the most conservative posted spend view until Bill.com dates are added."><HelpCircle className="h-3.5 w-3.5 text-green-400" /></span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-green-900'}`}>{formatCurrency(spent)}</p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-green-300' : 'text-green-600'}`}>{spentPct.toFixed(1)}%</p>
              <div className="mt-2 flex items-center gap-2" title="This indicates audit readiness. It does not confirm Bill.com posting—only that the email request trail is documented.">
                <span className={`text-[10px] ${isDark ? 'text-green-300/80' : 'text-green-600/80'}`}>Proof Coverage:</span>
                <Badge variant="outline" className={`text-[10px] ${isDark ? 'border-cyan-400/50 text-cyan-300' : 'border-cyan-600 text-cyan-700'}`}>
                  {proofCoveragePct.toFixed(0)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className={`${isDark ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'}`} title="Items requested/approved via email trail (Email Date + proof fields present) but not yet confirmed with a posted/paid date. Used to track obligations and prevent surprise remaining funds discrepancies.">
            <CardContent className="p-4">
              <div className="flex items-center gap-1">
                <p className={`text-sm font-medium ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>Requested / Pending (Email-proven)</p>
                <span title="Items requested/approved via email trail (Email Date + proof fields present) but not yet confirmed with a posted/paid date. Used to track obligations and prevent surprise remaining funds discrepancies."><HelpCircle className="h-3.5 w-3.5 text-amber-400" /></span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-amber-900'}`}>{formatCurrency(requestedPending)}</p>
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-amber-300/80' : 'text-amber-600/80'}`}>Email Date = request timeline · Date = posted/paid timeline</p>
            </CardContent>
          </Card>
          <Card className={`${isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200'}`} title="Forecast items not yet purchased. Organized by Target Month for projection and pacing.">
            <CardContent className="p-4">
              <div className="flex items-center gap-1">
                <p className={`text-sm font-medium ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>Planned (Forecast)</p>
                <span title="Forecast items not yet purchased. Organized by Target Month for projection and pacing."><HelpCircle className="h-3.5 w-3.5 text-purple-400" /></span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-purple-900'}`}>{formatCurrency(planned)}</p>
            </CardContent>
          </Card>
          <Card className={`${isDark ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200'}`} title="Remaining budget using conservative Actuals only definition. Does not subtract Requested/Pending or Planned.">
            <CardContent className="p-4">
              <div className="flex items-center gap-1">
                <p className={`text-sm font-medium ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>Remaining (after Actuals)</p>
                <span title="Remaining budget using conservative Actuals only definition. Does not subtract Requested/Pending or Planned."><HelpCircle className="h-3.5 w-3.5 text-orange-400" /></span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-orange-900'}`}>{formatCurrency(remaining)}</p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>{remainingPct.toFixed(1)}%</p>
              <p className={`text-[10px] mt-1 ${isDark ? 'text-orange-300/80' : 'text-orange-600/80'}`} title="Remaining budget if all planned items are executed.">Remaining after Planned: {formatCurrency(remainingAfterPlanned)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Accounting Reconciliation (Knight Reporting) — directly below KPI strip */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Accounting Reconciliation (Knight Reporting)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Our tracker is built from the Digital Lab email request/receipt trail and shows:
          </p>
          <ul className={`list-disc list-inside text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>Spent to Date (Actuals): {formatCurrency(spent)}</li>
            <li>Remaining (after Actuals): {formatCurrency(remaining)}</li>
          </ul>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            A separate figure referenced in recent correspondence is:
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label htmlFor="accounting-remaining" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Remaining (Accounting claim):</Label>
              <Input
                id="accounting-remaining"
                placeholder="e.g. 22000"
                value={accountingRemaining}
                onChange={(e) => setAccountingRemaining(e.target.value)}
                title="Enter the remaining funds number provided by Accounting/Leadership so the app can compute the variance."
                className={`max-w-[140px] ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            </div>
          </div>
          {gap !== null && !Number.isNaN(gap) && (
            <>
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} title="A non-zero difference usually indicates coding differences, excluded categories, honoraria treatment, or posted items not currently represented in the request trail.">
                Difference to reconcile: {formatCurrency(gap)}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Next step: match Bill.com/GL export used for the claim against this tracker, line-by-line, and confirm the reporting basis (included/excluded items).
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Printers: grouped by Print System → Expense Type */}
      {activeView === 'printers' && printersGrouped && Object.keys(printersGrouped).length > 0 && (
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Printers by Print System & Expense Type</CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Totals grouped by Print System, then by Expense Type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(printersGrouped).map(([system, byExpense]) => {
                const systemTotal = Object.values(byExpense).reduce((s, x) => s + x.total, 0)
                return (
                  <div key={system} className={`rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {system} — {formatCurrency(systemTotal)}
                    </p>
                    <div className="ml-4 space-y-1">
                      {Object.entries(byExpense).map(([expType, { total }]) => (
                        <div key={expType} className="flex justify-between text-sm">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{expType}</span>
                          <span className="font-medium">{formatCurrency(total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spent by Month chart */}
      {monthlySpendData.length > 0 && (
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Spent by Month</CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Actual and planned spend per month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySpendData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className={isDark ? 'stroke-gray-600' : 'stroke-gray-200'} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      const d = payload[0].payload
                      return (
                        <div className={`p-2 rounded border text-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                          <p className="font-semibold">{d.month}</p>
                          <p>{formatCurrency(d.spend)}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="spend" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Spent by Program Pillar — Reconciliation */}
      {(() => {
        const PILLAR_ORDER = ['Infrastructure', 'Programming Support', 'Programming + Archive', 'Documentation + Archive', 'Public Engagement', 'Smart Sign']
        const itemsForPillar = applyMonthFilter(actualsItems)
        const pillarChartData = PILLAR_ORDER.map(pillar => ({
          pillar,
          spend: itemsForPillar
            .filter(i => (i.programPillar || 'Programming Support') === pillar)
            .reduce((s, i) => s + i.subtotal, 0)
        })).filter(d => d.spend > 0)
        if (pillarChartData.length === 0) return null
        return (
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Spent by Program Pillar</CardTitle>
              <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {selectedMonth ? `Actuals for ${formatMonthLabel(selectedMonth)}` : 'All actuals'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pillarChartData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className={isDark ? 'stroke-gray-600' : 'stroke-gray-200'} />
                  <XAxis
                    dataKey="pillar"
                    tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.[0]) {
                        const d = payload[0].payload
                        return (
                          <div className={`p-2 rounded border text-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className="font-semibold">{d.pillar}</p>
                            <p>{formatCurrency(d.spend)}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="spend" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )
      })()}

      {/* Planned Forecast + Conference summary */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Planned Forecast</CardTitle>
          <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Planned items by Target Month (included under same $80k cap)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total Planned</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(planned)}</p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Digital Conference Planned</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(
                  budgetItems
                    .filter(i => i.budgetBucket === 'Digital Conference' && (i.spendType === 'Planned' || (!i.spendType && !i.date)))
                    .reduce((s, i) => s + i.subtotal, 0)
                )}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>Projected Remaining (after planned)</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-orange-900'}`}>
                {formatCurrency(Math.max(0, BUDGET_CAP - spent - planned))}
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                Cap − Spent − Planned
              </p>
            </div>
          </div>
          {/* Planned by Target Month breakdown */}
          {(() => {
            const byTargetMonth = (budgetItems as BudgetItem[]).reduce((acc, i) => {
              if (!(i.spendType === 'Planned' || (!i.spendType && !i.date)) || !KNIGHT_BUCKETS.includes(i.budgetBucket || 'Digital Lab')) return acc
              const m = getMonthFromTargetMonth(i.targetMonth) || 'Unknown'
              acc[m] = (acc[m] || 0) + i.subtotal
              return acc
            }, {} as Record<string, number>)
            const entries = Object.entries(byTargetMonth).filter(([, v]) => v > 0).sort(([a], [b]) => a.localeCompare(b))
            if (entries.length === 0) return null
            return (
              <div className={`mt-4 rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Planned by Target Month</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {entries.map(([month, amt]) => {
                    const [y, mo] = month.split('-')
                    const label = month === 'Unknown' ? 'Unknown' : new Date(parseInt(y || '2025'), parseInt(mo || '1') - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    return (
                      <div key={month} className="flex justify-between">
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
                        <span className="font-medium">{formatCurrency(amt)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </CardContent>
      </Card>

      {/* Audit tabs + Spent To Date table */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Button variant={auditTab === 'spent' ? 'default' : 'outline'} size="sm" onClick={() => setAuditTab('spent')}>
              Spent To Date ({actualsItems.length})
            </Button>
            <Button variant={auditTab === 'missing-proof' ? 'default' : 'outline'} size="sm" onClick={() => setAuditTab('missing-proof')}>
              Missing Proof ({missingProofItems.length})
            </Button>
            <Button variant={auditTab === 'missing-dates' ? 'default' : 'outline'} size="sm" onClick={() => setAuditTab('missing-dates')}>
              Missing Dates ({missingDateItems.length})
            </Button>
            <Button variant={auditTab === 'planned-with-date' ? 'default' : 'outline'} size="sm" onClick={() => setAuditTab('planned-with-date')}>
              Planned but Has Date ({plannedWithDateItems.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'} cursor-pointer select-none hover:opacity-80`} onClick={() => handleSort('date')}>
                    <span className="flex items-center gap-1">Date {tableSort.column === 'date' && (tableSort.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}</span>
                  </th>
                  <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'} cursor-pointer select-none hover:opacity-80`} onClick={() => handleSort('item')}>
                    <span className="flex items-center gap-1">Item {tableSort.column === 'item' && (tableSort.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}</span>
                  </th>
                  <th className={`text-right p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'} cursor-pointer select-none hover:opacity-80`} onClick={() => handleSort('subtotal')}>
                    <span className="flex items-center gap-1 justify-end">Subtotal {tableSort.column === 'subtotal' && (tableSort.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}</span>
                  </th>
                  <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'} cursor-pointer select-none hover:opacity-80`} onClick={() => handleSort('vendorGroup')}>
                    <span className="flex items-center gap-1">Vendor Group {tableSort.column === 'vendorGroup' && (tableSort.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}</span>
                  </th>
                  <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'} cursor-pointer select-none hover:opacity-80`} onClick={() => handleSort('programPillar')}>
                    <span className="flex items-center gap-1">Program Pillar {tableSort.column === 'programPillar' && (tableSort.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}</span>
                  </th>
                  <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'} cursor-pointer select-none hover:opacity-80`} onClick={() => handleSort('category')}>
                    <span className="flex items-center gap-1">Category {tableSort.column === 'category' && (tableSort.direction === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}</span>
                  </th>
                  <th className={`text-center p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Proof</th>
                  <th className={`text-left p-3 max-w-[200px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {tableItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No items in this view
                    </td>
                  </tr>
                ) : (
                  tableItems.map((item, idx) => (
                    <tr key={idx} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <td className="p-3">
                        <div className="flex flex-col gap-0.5">
                          <span>{formatDateBadge(item.date || item.emailDate) || '—'}</span>
                          {!item.date && item.emailDate && (
                            <Badge variant="outline" className={`w-fit text-[10px] ${isDark ? 'border-amber-500/50 text-amber-400' : 'border-amber-600 text-amber-700'}`}>
                              Needs Bill.com posted date
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="mr-2">{getCategoryIcon(item.category)}</span>
                        {item.lineItem}
                      </td>
                      <td className="p-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      <td className="p-3">{item.vendorGroup || '—'}</td>
                      <td className="p-3">{item.programPillar || '—'}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3 text-center">
                        {hasProof(item) ? (
                          <span title="Proof complete"><CheckCircle2 className="h-5 w-5 text-green-500 inline" /></span>
                        ) : (
                          <span title="Missing proof"><AlertTriangle className="h-5 w-5 text-amber-500 inline" /></span>
                        )}
                      </td>
                      <td className="p-3 max-w-[200px] truncate" title={item.evidenceMetadata}>
                        {item.evidenceMetadata || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Planned for [Month] — when month selected */}
      {selectedMonth && (
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              Planned for {formatMonthLabel(selectedMonth)}
            </CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Planned items with Target Month matching selected month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Item</th>
                    <th className={`text-right p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subtotal</th>
                    <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Target Month</th>
                    <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Vendor Group</th>
                    <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Program Pillar</th>
                    <th className={`text-left p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {plannedForMonthItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No planned items for this month
                      </td>
                    </tr>
                  ) : (
                  plannedForMonthItems.map((item, idx) => (
                    <tr key={idx} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <td className="p-3">
                        <span className="mr-2">{getCategoryIcon(item.category)}</span>
                        {item.lineItem}
                      </td>
                      <td className="p-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      <td className="p-3">{item.targetMonth || '—'}</td>
                      <td className="p-3">{item.vendorGroup || '—'}</td>
                      <td className="p-3">{item.programPillar || '—'}</td>
                      <td className="p-3">{item.category}</td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Presentation view for stakeholder meetings (Knight Foundation, etc.)
function PresentationView({
  budgetItems,
  totalBudget,
  getTotalCost,
  getSpentAmount,
  getRemainingBudget,
  formatCurrency,
  isDark,
  budgetType
}: {
  budgetItems: BudgetItem[]
  totalBudget: number
  getTotalCost: () => number
  getSpentAmount: () => number
  getRemainingBudget: () => number
  formatCurrency: (n: number) => string
  isDark: boolean
  budgetType: OoliteBudgetType
}) {
  const total = getTotalCost()
  const spent = getSpentAmount()
  const remaining = getRemainingBudget()
  const spentPct = total > 0 ? (spent / total) * 100 : 0

  // Group by Program Pillar
  const byPillar = budgetItems.reduce((acc, item) => {
    const pillar = item.programPillar || 'Programming Support'
    if (!acc[pillar]) acc[pillar] = { items: [], total: 0 }
    acc[pillar].items.push(item)
    acc[pillar].total += item.subtotal
    return acc
  }, {} as Record<string, { items: BudgetItem[]; total: number }>)

  // Group by Phase (Equipment vs Renovation)
  const byPhase = budgetItems.reduce((acc, item) => {
    const phase = item.phaseLabel || 'Equipment Acquisition'
    if (!acc[phase]) acc[phase] = { items: [], total: 0 }
    acc[phase].items.push(item)
    acc[phase].total += item.subtotal
    return acc
  }, {} as Record<string, { items: BudgetItem[]; total: number }>)

  // Group by Spend Type (Purchased vs Planned)
  const purchased = budgetItems.filter(i => 
    i.spendType === 'Purchased Actual' || (!i.spendType && i.date)
  )
  const planned = budgetItems.filter(i => 
    i.spendType === 'Planned' || (!i.spendType && !i.date)
  )
  const purchasedTotal = purchased.reduce((s, i) => s + i.subtotal, 0)
  const plannedTotal = planned.reduce((s, i) => s + i.subtotal, 0)

  const pillarOrder = ['Programming Support', 'Programming + Archive', 'Infrastructure', 'Documentation + Archive', 'Public Engagement', 'Smart Sign']
  const sortedPillars = Object.entries(byPillar).sort((a, b) => {
    const ai = pillarOrder.indexOf(a[0])
    const bi = pillarOrder.indexOf(b[0])
    if (ai >= 0 && bi >= 0) return ai - bi
    if (ai >= 0) return -1
    if (bi >= 0) return 1
    return b[1].total - a[1].total
  })

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <LayoutDashboard className="h-5 w-5" />
            Digital Lab — Spending Overview
          </CardTitle>
          <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Categorized overview for programming impact and long-term infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Budget</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(total)}</p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>Spent to Date</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>{formatCurrency(spent)}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-green-300' : 'text-green-600'}`}>{spentPct.toFixed(1)}% of budget</p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
              <p className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>Remaining</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>{formatCurrency(remaining)}</p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Line Items</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{budgetItems.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Split: Equipment vs Renovation */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Spending by Phase</CardTitle>
          <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Equipment acquisition vs. setup and renovation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(byPhase).map(([phase, { total: phaseTotal }]) => (
              <div key={phase} className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{phase}</p>
                <p className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(phaseTotal)}</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {total > 0 ? ((phaseTotal / total) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Pillar Bar Chart */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Spend by Program Pillar</CardTitle>
          <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Knight Foundation buckets — horizontal view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(200, sortedPillars.length * 48)}>
            <BarChart
              data={sortedPillars.map(([pillar, { total: pillarTotal }]) => ({
                name: pillar,
                amount: pillarTotal,
                pct: total > 0 ? ((pillarTotal / total) * 100).toFixed(1) : '0'
              }))}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className={isDark ? 'stroke-gray-600' : 'stroke-gray-200'} />
              <XAxis type="number" tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }} />
              <YAxis type="category" dataKey="name" width={95} tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.[0]) {
                    const d = payload[0].payload
                    return (
                      <div className={`p-3 rounded-lg shadow-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                        <p className="font-semibold">{d.name}</p>
                        <p className="text-sm">{formatCurrency(d.amount)} ({d.pct}%)</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Purchased vs Planned */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Current vs. Planned</CardTitle>
          <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Purchased actuals and forward-looking planned expenditures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
              <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>Purchased Actual</p>
              <p className={`text-xl font-bold mt-1 ${isDark ? 'text-green-400' : 'text-green-700'}`}>{formatCurrency(purchasedTotal)}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{purchased.length} items</p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-amber-900/20 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>Planned</p>
              <p className={`text-xl font-bold mt-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{formatCurrency(plannedTotal)}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{planned.length} items — upcoming needs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* By Program Pillar with Purpose */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>By Program Pillar</CardTitle>
          <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            How each category supports programming and artist access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedPillars.map(([pillar, { items, total: pillarTotal }]) => (
            <div key={pillar} className={`rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className={`p-4 flex justify-between items-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{pillar}</h4>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(pillarTotal)}</span>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.slice(0, 12).map((item, idx) => (
                  <div key={idx} className={`p-3 flex justify-between items-start gap-4 ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.lineItem}</p>
                      {item.purpose && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.purpose}</p>
                      )}
                    </div>
                    <span className={`font-mono text-sm font-medium shrink-0 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
                {items.length > 12 && (
                  <div className={`p-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    +{items.length - 12} more items
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Intelligently categorize items based on name and notes
function categorizeItem(itemName: string, itemNotes: string, csvCategory: string): string {
  // Summit/Event budget categories - pass through
  const summitCategoryMap: Record<string, string> = {
    speakers: 'Speakers & Program',
    'production-av': 'Production & AV',
    hospitality: 'Hospitality',
    marketing: 'Marketing',
    publishing: 'Publishing',
    archiving: 'Archiving',
    operations: 'Operations'
  }
  if (summitCategoryMap[csvCategory]) {
    return summitCategoryMap[csvCategory]
  }
  // Airtable/CSV: Community Event (Digital Conference items)
  if (csvCategory === 'Community Event') {
    return 'Community Event'
  }

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
    'Hardware & Materials': '🧰', // Fallback
    'Speakers & Program': '🎤',
    'Production & AV': '🎬',
    'Hospitality': '☕',
    'Marketing': '📣',
    'Publishing': '📚',
    'Archiving': '📦',
    'Operations': '⚙️',
    'Community Event': '🎤'
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
    'Contingency',
    'Speakers & Program',
    'Production & AV',
    'Hospitality',
    'Marketing',
    'Publishing',
    'Archiving',
    'Operations',
    'Community Event'
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
    const purposeFallback: Record<string, string> = {
      'Displays & Projection': 'Display and presentation equipment for exhibitions and workshops',
      'Peripherals & Creation': 'Creation tools and peripherals for programming',
      'Furniture & Fixtures': 'Furniture and workspace fixtures',
      'Room Build-Out': 'Space renovation and build-out',
      'Streaming': 'Streaming and video infrastructure',
      'Compute': 'Computing and hardware',
      'Audio': 'Audio equipment',
      'Networking & Storage': 'Networking and storage infrastructure',
      'Large Format Printer': 'Large format printing and fabrication',
      'Signage': 'Signage and wayfinding',
      'Contingency': 'Contingency and buffer',
      'Speakers & Program': 'Speakers and program for Digital Conference',
      'Production & AV': 'Production and AV for events',
      'Hospitality': 'Hospitality for attendees',
      'Marketing': 'Marketing and outreach',
      'Publishing': 'Publishing and documentation',
      'Archiving': 'Archiving and preservation',
      'Operations': 'Operations support',
      'Community Event': 'Digital Conference programming and public engagement'
    }
    const purpose = item.purpose || purposeFallback[displayCategory] || 'General programming support'
    
    return {
      emoji,
      lineItem: item.name,
      category: displayCategory,
      qty: 1,
      unitCost: item.amount,
      subtotal: item.amount,
      notes: item.notes || '',
      comments: '',
      links: item.vendor && item.vendor.startsWith('http') ? item.vendor : '',
      vendor: item.vendor || '',
      participant: '',
      phase: index < Math.floor(config.items.length * 0.4) ? 1 : 
            index < Math.floor(config.items.length * 0.75) ? 2 :
            index < Math.floor(config.items.length * 0.9) ? 3 : 4,
      priority: (index < 5 ? 'high' : index < 15 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
      date: item.date,
      purpose,
      phaseLabel: item.phase,
      programPillar: item.programPillar,
      spendType: item.spendType,
      budgetBucket: item.budgetBucket,
      targetMonth: item.targetMonth,
      vendorGroup: item.vendorGroup,
      printSystem: item.printSystem,
      expenseType: item.expenseType,
      emailTitle: item.emailTitle,
      emailDate: item.emailDate,
      emailPeople: item.emailPeople,
      evidenceMetadata: item.evidenceMetadata
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
// Month range: Sep 2025 through Nov 2026 (15 months) - covers Digital Lab spend + Summit projected through November
function createMonthsFromBudgetItems(budgetItems: BudgetItem[], totalBudget: number): BudgetMonth[] {
  const months: BudgetMonth[] = []
  const monthNames: string[] = []
  for (let y = 2025; y <= 2026; y++) {
    const startM = y === 2025 ? 9 : 1
    const endM = y === 2026 ? 11 : 12
    for (let m = startM; m <= endM; m++) {
      monthNames.push(`${y}-${String(m).padStart(2, '0')}`)
    }
  }
  // Result: 2025-09..12 (4) + 2026-01..11 (11) = 15 months

  monthNames.forEach((monthStr) => {
    months.push({
      month: monthStr,
      budget: 0,
      spent: 0,
      lineItems: []
    })
  })
  
  // Group items by month based on date field
  const itemsWithoutDate: BudgetItem[] = []
  
  budgetItems.forEach((item, idx) => {
    if (item.date) {
      // Parse date to determine month
      const itemDate = new Date(item.date)
      const itemYear = itemDate.getFullYear()
      const itemMonth = String(itemDate.getMonth() + 1).padStart(2, '0')
      const itemMonthStr = `${itemYear}-${itemMonth}`
      
      // Find the corresponding month
      const monthIndex = months.findIndex(m => m.month === itemMonthStr)
      if (monthIndex !== -1) {
        const month = months[monthIndex]
        const lineItem: BudgetLineItem = {
          id: `${itemMonthStr}-${month.lineItems.length}`,
          name: item.lineItem,
          category: item.category,
          amount: item.subtotal,
          imageUrl: '',
          date: item.date,
          vendor: item.links || '',
          notes: item.notes || ''
        }
        month.lineItems.push(lineItem)
        month.spent += item.subtotal
      } else {
        // Date is outside month range, add to itemsWithoutDate for distribution
        itemsWithoutDate.push(item)
      }
    } else {
      // No date specified, add to itemsWithoutDate for even distribution
      itemsWithoutDate.push(item)
    }
  })
  
  // Distribute items without dates evenly across months
  if (itemsWithoutDate.length > 0) {
    const itemsPerMonth = Math.ceil(itemsWithoutDate.length / monthNames.length)
    monthNames.forEach((monthStr, index) => {
      const startIdx = index * itemsPerMonth
      const endIdx = Math.min(startIdx + itemsPerMonth, itemsWithoutDate.length)
      const monthItems = itemsWithoutDate.slice(startIdx, endIdx)
      const month = months.find(m => m.month === monthStr)!
      
      monthItems.forEach((item, idx) => {
        const lineItem: BudgetLineItem = {
          id: `${monthStr}-${month.lineItems.length}`,
          name: item.lineItem,
          category: item.category,
          amount: item.subtotal,
          imageUrl: '',
          date: `${monthStr}-${String(Math.floor(1 + (idx * 7))).padStart(2, '0')}`,
          vendor: item.links || '',
          notes: item.notes || ''
        }
        month.lineItems.push(lineItem)
        month.spent += item.subtotal
      })
    })
  }
  
  // Set budget for each month (at least equal to spent)
  const monthlyBudgetFloor = Math.floor(totalBudget / monthNames.length)
  months.forEach(month => {
    month.budget = Math.max(month.spent, monthlyBudgetFloor)
  })
  
  console.log('📊 Created months from budgetItems:', {
    totalItems: budgetItems.length,
    itemsWithDates: budgetItems.filter(i => i.date).length,
    itemsWithoutDates: itemsWithoutDate.length,
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
    { emoji: '📺', lineItem: 'Laset Portable (1080p/4K-ready)', category: 'Displays & Projection', qty: 1, unitCost: 600, subtotal: 1600, notes: 'Workshops & pop-ups', comments: '', links: '', participant: '', phase: 1, priority: 'medium' },
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

