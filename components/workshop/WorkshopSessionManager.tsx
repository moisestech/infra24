'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase'

interface Resource {
  id: string
  title: string
  type: 'space' | 'equipment' | 'person'
  capacity: number
  organization_id: string
}

interface WorkshopSession {
  id: string
  workshop_id: string
  booking_id: string
  capacity: number
  created_at: string
  bookings: {
    id: string
    title: string
    description: string
    starts_at: string
    ends_at: string
    status: 'pending' | 'confirmed' | 'cancelled'
    resources: {
      id: string
      title: string
      type: string
      capacity: number
    }
  }
}

interface WorkshopSessionManagerProps {
  workshopId: string
  organizationId: string
  onSessionCreated?: (session: WorkshopSession) => void
  onSessionUpdated?: (session: WorkshopSession) => void
  onSessionDeleted?: (sessionId: string) => void
}

export function WorkshopSessionManager({
  workshopId,
  organizationId,
  onSessionCreated,
  onSessionUpdated,
  onSessionDeleted
}: WorkshopSessionManagerProps) {
  const [sessions, setSessions] = useState<WorkshopSession[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSession, setEditingSession] = useState<WorkshopSession | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceId: '',
    startTime: '',
    endTime: '',
    capacity: 10
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  useEffect(() => {
    fetchSessions()
    fetchResources()
  }, [workshopId])

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/workshops/${workshopId}/sessions`)
      const result = await response.json()
      
      if (result.success) {
        setSessions(result.data)
      } else {
        console.error('Failed to fetch sessions:', result.error)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchResources = async () => {
    try {
      const response = await fetch(`/api/resources?orgId=${organizationId}`)
      const result = await response.json()
      
      if (result.data) {
        setResources(result.data)
      } else {
        console.error('Failed to fetch resources:', result.error)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/workshops/${workshopId}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          resourceId: formData.resourceId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          capacity: formData.capacity
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSessions(prev => [...prev, result.data])
        setShowCreateForm(false)
        resetForm()
        onSessionCreated?.(result.data)
      } else {
        alert(`Failed to create session: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Failed to create session')
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return

    try {
      // First delete the booking
      const session = sessions.find(s => s.id === sessionId)
      if (session) {
        const bookingResponse = await fetch(`/api/bookings?id=${session.booking_id}&orgId=${organizationId}`, {
          method: 'DELETE'
        })

        if (bookingResponse.ok) {
          setSessions(prev => prev.filter(s => s.id !== sessionId))
          onSessionDeleted?.(sessionId)
        } else {
          alert('Failed to delete session')
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Failed to delete session')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      resourceId: '',
      startTime: '',
      endTime: '',
      capacity: 10
    })
    setEditingSession(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading sessions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Workshop Sessions</h3>
          <p className="text-sm text-gray-600">Manage scheduled sessions for this workshop</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </div>

      {/* Create Session Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Session</CardTitle>
            <CardDescription>Schedule a new session for this workshop</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Session Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Digital Art Workshop - Session 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Resource</label>
                  <Select
                    value={formData.resourceId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, resourceId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a resource" />
                    </SelectTrigger>
                    <SelectContent>
                      {resources.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.title} ({resource.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Session description..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowCreateForm(false)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button type="submit">Create Session</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions scheduled</h3>
              <p className="text-gray-600 mb-4">Create your first workshop session to get started.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold">{session.bookings.title}</h4>
                      <Badge className={getStatusColor(session.bookings.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(session.bookings.status)}
                          <span className="capitalize">{session.bookings.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    {session.bookings.description && (
                      <p className="text-gray-600 mb-3">{session.bookings.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{format(parseISO(session.bookings.starts_at), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          {format(parseISO(session.bookings.starts_at), 'h:mm a')} - {format(parseISO(session.bookings.ends_at), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{session.bookings.resources.title}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {session.capacity}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Type: {session.bookings.resources.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingSession(session)
                        setFormData({
                          title: session.bookings.title,
                          description: session.bookings.description,
                          resourceId: session.bookings.resources.id,
                          startTime: format(parseISO(session.bookings.starts_at), "yyyy-MM-dd'T'HH:mm"),
                          endTime: format(parseISO(session.bookings.ends_at), "yyyy-MM-dd'T'HH:mm"),
                          capacity: session.capacity
                        })
                        setShowCreateForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
