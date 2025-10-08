'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Grid3X3, 
  List,
  BookOpen,
  Star,
  Zap,
  Users,
  Clock
} from 'lucide-react'
import { Workshop } from '@/types/workshop'

const categories = [
  { value: 'all', label: 'All Categories', icon: Grid3X3 },
  { value: 'journalism', label: 'Journalism', icon: BookOpen },
  { value: 'art', label: 'Art', icon: Star },
  { value: 'data', label: 'Data', icon: Zap },
  { value: 'music', label: 'Music', icon: Users },
  { value: 'video', label: 'Video', icon: Clock },
  { value: 'writing', label: 'Writing', icon: BookOpen },
  { value: 'film', label: 'Film', icon: Clock },
  { value: 'animation', label: 'Animation', icon: Star },
  { value: 'documentary', label: 'Documentary', icon: BookOpen },
  { value: 'vfx', label: 'VFX', icon: Zap },
  { value: 'marketing', label: 'Marketing', icon: Users }
]

const difficulties = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

export interface WorkshopFilters {
  searchTerm: string
  selectedCategory: string
  selectedDifficulty: string
  viewMode: 'grid' | 'list'
}

interface WorkshopFiltersProps {
  filters?: WorkshopFilters
  onFiltersChange: (filters: WorkshopFilters) => void
  workshops: Workshop[]
  totalEnrolled: number
  accessibleWorkshops: number
}

export function WorkshopFilters({ 
  filters, 
  onFiltersChange, 
  workshops, 
  totalEnrolled, 
  accessibleWorkshops 
}: WorkshopFiltersProps) {
  // Provide default values if filters is undefined
  const defaultFilters: WorkshopFilters = {
    searchTerm: '',
    selectedCategory: 'all',
    selectedDifficulty: 'all',
    viewMode: 'grid'
  }
  
  const currentFilters = filters || defaultFilters
  const { searchTerm, selectedCategory, selectedDifficulty, viewMode } = currentFilters

  const updateFilters = (updates: Partial<WorkshopFilters>) => {
    if (onFiltersChange) {
      onFiltersChange({ ...currentFilters, ...updates })
    }
  }

  // Safety check for workshops array
  const safeWorkshops = workshops || []

  // Filter workshops based on search and filters
  const filteredWorkshops = safeWorkshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (workshop.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || workshop.level === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Available Workshops
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredWorkshops.length} workshops available • {totalEnrolled} enrolled • {accessibleWorkshops} accessible
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({ viewMode: 'grid' })}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({ viewMode: 'list' })}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search workshops..."
            value={searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={(value) => updateFilters({ selectedCategory: value })}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={(value) => updateFilters({ selectedDifficulty: value })}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter Summary */}
      {(searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Search: "{searchTerm}"
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Category: {categories.find(c => c.value === selectedCategory)?.label}
            </span>
          )}
          {selectedDifficulty !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Difficulty: {difficulties.find(d => d.value === selectedDifficulty)?.label}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFilters({ 
              searchTerm: '', 
              selectedCategory: 'all', 
              selectedDifficulty: 'all' 
            })}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

// Export the filter function for use in other components
export function filterWorkshops(workshops: Workshop[], filters: WorkshopFilters): Workshop[] {
  const { searchTerm, selectedCategory, selectedDifficulty } = filters
  
  return workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (workshop.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || workshop.level === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })
} 