'use client'

import React, { useState, useEffect } from 'react'
import { useTenant } from '@/components/tenant/TenantProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Building,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Copy,
  MessageSquare,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react'
import { format, isToday, isThisWeek, parseISO } from 'date-fns'

interface Booking {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  status: string
  location: string
  resource_id: string
  metadata: {
    host?: string
    artist_name?: string
    artist_email?: string
    source?: string
  }
  booking_participants: Array<{
    user_id: string
    status: string
  }>
}

interface BookingFilters {
  when: 'today' | 'week' | 'all'
  owner: 'me' | 'team' | 'all'
  resource: 'remote' | 'print' | 'all'
  status: 'confirmed' | 'cancelled' | 'all'
}

export default function BookingsPage() {
  const { tenantConfig } = useTenant()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<BookingFilters>({
    when: 'today',
    owner: 'team',
    resource: 'all',
    status: 'all'
  })

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        org_id: '2133fe94-fb12-41f8-ab37-ea4acd4589f6', // Oolite org ID
        when: filters.when,
        owner: filters.owner
      })

      if (filters.resource !== 'all') {
        const resourceId = filters.resource === 'remote' 
          ? '7d683079-3514-4b60-9155-7e4df4c46a30' 
          : '67e52569-d67d-4352-8ca3-c3bcbde8c43f'
        params.append('resource_id', resourceId)
      }

      if (filters.status !== 'all') {
        params.append('status', filters.status)
      }

      const response = await fetch(`/api/bookings?${params}`)
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [filters])

  const filteredBookings = bookings.filter(booking => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        booking.title.toLowerCase().includes(searchLower) ||
        booking.metadata?.artist_name?.toLowerCase().includes(searchLower) ||
        booking.metadata?.artist_email?.toLowerCase().includes(searchLower) ||
        booking.metadata?.host?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getResourceType = (resourceId: string) => {
    if (resourceId === '7d683079-3514-4b60-9155-7e4df4c46a30') {
      return { type: 'Remote', icon: Video, color: 'text-blue-600' }
    } else if (resourceId === '67e52569-d67d-4352-8ca3-c3bcbde8c43f') {
      return { type: 'Print Room', icon: Building, color: 'text-green-600' }
    }
    return { type: 'Unknown', icon: MapPin, color: 'text-gray-600' }
  }

  const formatBookingTime = (startTime: string, endTime: string) => {
    const start = parseISO(startTime)
    const end = parseISO(endTime)
    
    if (isToday(start)) {
      return {
        date: 'Today',
        time: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
        isToday: true
      }
    } else if (isThisWeek(start)) {
      return {
        date: format(start, 'EEE, MMM d'),
        time: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
        isToday: false
      }
    } else {
      return {
        date: format(start, 'MMM d, yyyy'),
        time: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
        isToday: false
      }
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      // This would call an API to update booking status
      console.log(`Updating booking ${bookingId} to ${newStatus}`)
      // For now, just refresh the bookings
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const copyMeetingLink = (booking: Booking) => {
    // This would copy the actual meeting link
    const link = booking.location || 'Meeting link not available'
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bookings Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage consultations and appointments
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by artist name, email, or host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {/* When Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">When:</span>
              {(['today', 'week', 'all'] as const).map((when) => (
                <Button
                  key={when}
                  variant={filters.when === when ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, when })}
                  style={filters.when === when ? {
                    backgroundColor: tenantConfig?.theme?.primaryColor || '#47abc4',
                    borderColor: tenantConfig?.theme?.primaryColor || '#47abc4',
                  } : {}}
                >
                  {when === 'today' ? 'Today' : when === 'week' ? 'This Week' : 'All Time'}
                </Button>
              ))}
            </div>

            {/* Owner Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Owner:</span>
              {(['me', 'team', 'all'] as const).map((owner) => (
                <Button
                  key={owner}
                  variant={filters.owner === owner ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, owner })}
                  style={filters.owner === owner ? {
                    backgroundColor: tenantConfig?.theme?.primaryColor || '#47abc4',
                    borderColor: tenantConfig?.theme?.primaryColor || '#47abc4',
                  } : {}}
                >
                  {owner === 'me' ? 'Mine' : owner === 'team' ? 'Team' : 'All'}
                </Button>
              ))}
            </div>

            {/* Resource Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
              {(['all', 'remote', 'print'] as const).map((resource) => (
                <Button
                  key={resource}
                  variant={filters.resource === resource ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, resource })}
                  style={filters.resource === resource ? {
                    backgroundColor: tenantConfig?.theme?.primaryColor || '#47abc4',
                    borderColor: tenantConfig?.theme?.primaryColor || '#47abc4',
                  } : {}}
                >
                  {resource === 'all' ? 'All' : resource === 'remote' ? 'Remote' : 'Print Room'}
                </Button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
              {(['all', 'confirmed', 'cancelled'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filters.status === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, status })}
                  style={filters.status === status ? {
                    backgroundColor: tenantConfig?.theme?.primaryColor || '#47abc4',
                    borderColor: tenantConfig?.theme?.primaryColor || '#47abc4',
                  } : {}}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No bookings found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => {
              const resourceInfo = getResourceType(booking.resource_id)
              const timeInfo = formatBookingTime(booking.start_time, booking.end_time)
              const ResourceIcon = resourceInfo.icon

              return (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <ResourceIcon className={`w-5 h-5 ${resourceInfo.color}`} />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {booking.title}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <Badge variant="default">
                            {resourceInfo.type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className={timeInfo.isToday ? 'font-medium text-green-600' : ''}>
                              {timeInfo.date}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{timeInfo.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Artist: {booking.metadata?.artist_name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Host: {booking.metadata?.host?.split('@')[0] || 'TBD'}</span>
                          </div>
                        </div>

                        {booking.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {booking.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {booking.status === 'confirmed' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyMeetingLink(booking)}
                              className="flex items-center space-x-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Open Meet</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyMeetingLink(booking)}
                              className="flex items-center space-x-1"
                            >
                              <Copy className="w-4 h-4" />
                              <span>Copy Link</span>
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center space-x-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Message</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center space-x-1"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Reschedule</span>
                        </Button>

                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Mark Complete</span>
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={fetchBookings}
            disabled={loading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

