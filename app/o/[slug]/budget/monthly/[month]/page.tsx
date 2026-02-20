'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { MonthlyBudgetView } from '@/components/budget/MonthlyBudgetView'
import { BudgetMonth } from '@/lib/budget/budget-utils'
import { motion } from 'framer-motion'

interface Organization {
  id: string
  name: string
  slug: string
}

export default function MonthlyBudgetPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const month = params.month as string
  
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [monthData, setMonthData] = useState<BudgetMonth | null>(null)
  const [loading, setLoading] = useState(true)
  
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig
    }
  }
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Load organization data
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }
        
        // Load monthly budget data
        const budgetResponse = await fetch(`/api/organizations/by-slug/${slug}/budget/monthly/${month}`)
        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json()
          setMonthData(budgetData.month)
        } else {
          console.error('Failed to load monthly budget data')
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (slug && month) {
      loadData()
    }
  }, [slug, month])
  
  if (loading) {
    return (
      <TenantProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </TenantProvider>
    )
  }
  
  if (!monthData) {
    return (
      <TenantProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Month Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The requested month could not be found.
              </p>
              <button
                onClick={() => router.push(`/o/${slug}/budget`)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to Budget Dashboard
              </button>
            </div>
          </div>
        </div>
      </TenantProvider>
    )
  }
  
  return (
    <TenantProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <OrganizationLogo 
                  organizationSlug={slug} 
                  size="lg" 
                  className="h-12 w-12"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Monthly Budget
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {organization?.name || slug}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Monthly Budget View */}
          <MonthlyBudgetView 
            month={monthData}
            onBack={() => router.push(`/o/${slug}/budget`)}
          />
        </div>
      </div>
    </TenantProvider>
  )
}






