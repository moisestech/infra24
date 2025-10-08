'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, Calendar, Users, Clock, DollarSign, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'

interface Workshop {
  id: string
  title: string
  description: string
  category: string
  difficulty_level: string
  duration_minutes: number
  max_participants: number
  price: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
  organization_id: string
}

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const categories = [
    'Digital Art',
    'Photography',
    'Video Production',
    '3D Modeling',
    'Web Development',
    'Audio Production'
  ]

  useEffect(() => {
    fetchWorkshops()
  }, [])

  useEffect(() => {
    filterWorkshops()
  }, [workshops, searchTerm, categoryFilter, statusFilter])

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops?orgId=caf2bc8b-8547-4c55-ac9f-5692e93bd831')
      const result = await response.json()
      
      if (result.success) {
        setWorkshops(result.data)
      } else {
        console.error('Failed to fetch workshops:', result.error)
      }
    } catch (error) {
      console.error('Error fetching workshops:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterWorkshops = () => {
    let filtered = workshops

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(workshop =>
        workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(workshop => workshop.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(workshop => workshop.is_active === isActive)
    }

    setFilteredWorkshops(filtered)
  }

  const handleDeleteWorkshop = async (workshopId: string) => {
    if (!confirm('Are you sure you want to delete this workshop? This will also delete all associated sessions and bookings.')) {
      return
    }

    try {
      const response = await fetch(`/api/workshops/${workshopId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setWorkshops(prev => prev.filter(w => w.id !== workshopId))
      } else {
        alert(`Failed to delete workshop: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting workshop:', error)
      alert('Failed to delete workshop')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading workshops...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workshop Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage workshops and their scheduled sessions
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workshop
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search workshops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workshops Grid */}
        {filteredWorkshops.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {workshops.length === 0 ? 'No workshops created yet' : 'No workshops match your filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {workshops.length === 0 
                  ? 'Create your first workshop to get started with the booking system.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workshop
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{workshop.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {workshop.description}
                      </CardDescription>
                    </div>
                    <Badge variant={workshop.is_active ? "default" : "destructive"}>
                      {workshop.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Workshop Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span>{workshop.category}</span>
                      </div>
                      <Badge className={getDifficultyColor(workshop.difficulty_level)}>
                        {workshop.difficulty_level}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{workshop.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{workshop.max_participants} max</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-green-600">
                        {workshop.currency} {workshop.price}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-3 border-t">
                      <Link href={`/o/oolite/admin/workshops/${workshop.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteWorkshop(workshop.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Created: {format(parseISO(workshop.created_at), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {workshops.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Workshop Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{workshops.length}</div>
                  <div className="text-sm text-gray-600">Total Workshops</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {workshops.filter(w => w.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {workshops.filter(w => !w.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {categories.length}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}