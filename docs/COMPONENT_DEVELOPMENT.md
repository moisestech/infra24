# Component Development Guide

## 🎯 **Component Strategy**

Build components incrementally, starting with the most visual and impactful pieces. Each component should be reusable across organizations and integrate seamlessly with the existing design system.

## 🏗️ **Component Architecture**

### **Component Hierarchy**
```
BookingSystem/
├── ResourceCalendar/          # FullCalendar wrapper
├── BookingForm/              # Create/edit bookings
├── WorkshopCatalog/          # Workshop listing
├── WorkshopRegistration/     # Registration flow
├── EquipmentBooking/         # Equipment-specific booking
├── StudioVisitBooking/       # Cal.com integration
└── BookingDashboard/         # Admin overview
```

## 📅 **Phase 1: ResourceCalendar Component**

### **Core ResourceCalendar Component**
```typescript
// components/booking/ResourceCalendar.tsx
'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createClient } from '@/lib/supabase'
import { format, startOfWeek, endOfWeek } from 'date-fns'

interface Resource {
  id: string
  title: string
  type: 'space' | 'equipment' | 'person'
  capacity: number
}

interface Booking {
  id: string
  resourceId: string
  title: string
  start: string
  end: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdBy: string
}

interface ResourceCalendarProps {
  orgId: string
  view?: 'resourceTimeGridDay' | 'resourceTimeGridWeek' | 'resourceDayGridMonth'
  onBookingCreate?: (booking: Partial<Booking>) => void
  onBookingUpdate?: (booking: Booking) => void
  onBookingDelete?: (bookingId: string) => void
}

export function ResourceCalendar({ 
  orgId, 
  view = 'resourceTimeGridWeek',
  onBookingCreate,
  onBookingUpdate,
  onBookingDelete
}: ResourceCalendarProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [orgId])

  const loadData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Load resources
      const { data: resourcesData } = await supabase
        .from('resources')
        .select('id, title, type, capacity')
        .eq('org_id', orgId)
        .eq('is_bookable', true)
        .order('title')

      // Load bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          id,
          resource_uuid_id,
          title,
          starts_at,
          ends_at,
          status,
          created_by
        `)
        .eq('org_id', orgId)
        .gte('starts_at', startOfWeek(new Date()).toISOString())
        .lte('ends_at', endOfWeek(new Date()).toISOString())

      setResources(resourcesData || [])
      setBookings(bookingsData || [])
    } catch (error) {
      console.error('Error loading calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    if (onBookingCreate) {
      onBookingCreate({
        resourceId: selectInfo.resource.id,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        title: 'New Booking'
      })
    }
  }

  const handleEventDrop = (eventInfo: any) => {
    if (onBookingUpdate) {
      onBookingUpdate({
        id: eventInfo.event.id,
        resourceId: eventInfo.event.getResources()[0].id,
        title: eventInfo.event.title,
        start: eventInfo.event.startStr,
        end: eventInfo.event.endStr,
        status: eventInfo.event.extendedProps.status,
        createdBy: eventInfo.event.extendedProps.createdBy
      })
    }
  }

  const handleEventResize = (eventInfo: any) => {
    if (onBookingUpdate) {
      onBookingUpdate({
        id: eventInfo.event.id,
        resourceId: eventInfo.event.getResources()[0].id,
        title: eventInfo.event.title,
        start: eventInfo.event.startStr,
        end: eventInfo.event.endStr,
        status: eventInfo.event.extendedProps.status,
        createdBy: eventInfo.event.extendedProps.createdBy
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <FullCalendar
        plugins={[resourceTimeGridPlugin, resourceDayGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'resourceTimeGridDay,resourceTimeGridWeek,resourceDayGridMonth'
        }}
        resources={resources.map(resource => ({
          id: resource.id,
          title: resource.title,
          extendedProps: {
            type: resource.type,
            capacity: resource.capacity
          }
        }))}
        events={bookings.map(booking => ({
          id: booking.id,
          resourceId: booking.resourceId,
          title: booking.title,
          start: booking.start,
          end: booking.end,
          color: booking.status === 'confirmed' ? '#10B981' : '#F59E0B',
          extendedProps: {
            status: booking.status,
            createdBy: booking.createdBy
          }
        }))}
        selectable
        selectMirror
        editable
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        aspectRatio={1.8}
        resourceAreaWidth="200px"
        resourceLabelText="Resources"
        resourceOrder="title"
      />
    </div>
  )
}
```

### **BookingForm Component**
```typescript
// components/booking/BookingForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const bookingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  resourceId: z.string().min(1, 'Resource is required'),
  startDate: z.date(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1')
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
  orgId: string
  resources: Array<{ id: string; title: string; type: string; capacity: number }>
  onSubmit: (data: BookingFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<BookingFormData>
}

export function BookingForm({ 
  orgId, 
  resources, 
  onSubmit, 
  onCancel, 
  initialData 
}: BookingFormProps) {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: initialData
  })

  const selectedResource = resources.find(r => r.id === watch('resourceId'))
  const maxCapacity = selectedResource?.capacity || 1

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      setLoading(true)
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting booking:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <Input
          {...register('title')}
          placeholder="Enter booking title"
          className={cn(errors.title && 'border-red-500')}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Textarea
          {...register('description')}
          placeholder="Enter booking description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resource *
        </label>
        <Select onValueChange={(value) => setValue('resourceId', value)}>
          <SelectTrigger className={cn(errors.resourceId && 'border-red-500')}>
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
        {errors.resourceId && (
          <p className="text-red-500 text-sm mt-1">{errors.resourceId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !watch('startDate') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('startDate') ? format(watch('startDate'), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch('startDate')}
                onSelect={(date) => setValue('startDate', date || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacity *
          </label>
          <Input
            type="number"
            min="1"
            max={maxCapacity}
            {...register('capacity', { valueAsNumber: true })}
            className={cn(errors.capacity && 'border-red-500')}
          />
          <p className="text-sm text-gray-500 mt-1">
            Max capacity: {maxCapacity}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time *
          </label>
          <Input
            type="time"
            {...register('startTime')}
            className={cn(errors.startTime && 'border-red-500')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time *
          </label>
          <Input
            type="time"
            {...register('endTime')}
            className={cn(errors.endTime && 'border-red-500')}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Booking'}
        </Button>
      </div>
    </form>
  )
}
```

## 🎓 **Phase 2: Workshop Components**

### **WorkshopCatalog Component**
```typescript
// components/workshop/WorkshopCatalog.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, MapPin } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase'

interface Workshop {
  id: string
  title: string
  description: string
  instructor?: {
    name: string
    profile_image?: string
  }
  sessions: Array<{
    id: string
    starts_at: string
    ends_at: string
    capacity: number
    registered_count: number
    resource: {
      name: string
    }
  }>
  capacity: number
  status: string
}

interface WorkshopCatalogProps {
  orgId: string
  onRegister: (workshopId: string, sessionId: string) => void
}

export function WorkshopCatalog({ orgId, onRegister }: WorkshopCatalogProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadWorkshops()
  }, [orgId])

  const loadWorkshops = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data } = await supabase
        .from('workshops')
        .select(`
          id,
          title,
          description,
          capacity,
          status,
          instructor_profile_id,
          artist_profiles!instructor_profile_id (
            name,
            profile_image
          ),
          workshop_sessions (
            id,
            starts_at,
            ends_at,
            capacity,
            bookings!booking_id (
              resource_uuid_id,
              resources!resource_uuid_id (
                name
              )
            )
          )
        `)
        .eq('org_id', orgId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      setWorkshops(data || [])
    } catch (error) {
      console.error('Error loading workshops:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || workshop.status === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search workshops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workshop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.map((workshop) => (
          <Card key={workshop.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{workshop.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {workshop.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Instructor */}
              {workshop.instructor && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {workshop.instructor.profile_image ? (
                      <img 
                        src={workshop.instructor.profile_image} 
                        alt={workshop.instructor.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {workshop.instructor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {workshop.instructor.name}
                  </span>
                </div>
              )}

              {/* Sessions */}
              <div className="space-y-2">
                {workshop.sessions.slice(0, 2).map((session) => (
                  <div key={session.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{format(parseISO(session.starts_at), 'MMM d, h:mm a')}</span>
                    </div>
                    <Badge variant="outline">
                      {session.registered_count}/{session.capacity}
                    </Badge>
                  </div>
                ))}
                {workshop.sessions.length > 2 && (
                  <p className="text-xs text-gray-500">
                    +{workshop.sessions.length - 2} more sessions
                  </p>
                )}
              </div>

              {/* Register Button */}
              <Button 
                className="w-full" 
                onClick={() => onRegister(workshop.id, workshop.sessions[0]?.id)}
                disabled={workshop.sessions.length === 0}
              >
                Register
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkshops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No workshops found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
```

## 🔧 **Phase 3: Equipment Booking Component**

### **EquipmentBooking Component**
```typescript
// components/booking/EquipmentBooking.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Users, Wrench } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase'

interface Equipment {
  id: string
  title: string
  description: string
  type: string
  capacity: number
  metadata: {
    equipment_type?: string
    specs?: any
  }
}

interface EquipmentBookingProps {
  orgId: string
  onBook: (equipmentId: string, startTime: string, endTime: string) => void
}

export function EquipmentBooking({ orgId, onBook }: EquipmentBookingProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEquipment()
  }, [orgId])

  const loadEquipment = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data } = await supabase
        .from('resources')
        .select('id, title, description, type, capacity, metadata')
        .eq('org_id', orgId)
        .eq('type', 'equipment')
        .eq('is_bookable', true)
        .order('title')

      setEquipment(data || [])
    } catch (error) {
      console.error('Error loading equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipment Booking</h2>
        <p className="text-gray-600">Book time on our available equipment and resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Equipment Specs */}
              {item.metadata.specs && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Specifications</h4>
                  <div className="text-sm text-gray-600">
                    {Object.entries(item.metadata.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace('_', ' ')}:</span>
                        <span>{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Capacity */}
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Capacity: {item.capacity} person{item.capacity > 1 ? 's' : ''}
                </span>
              </div>

              {/* Quick Book Buttons */}
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => onBook(item.id, '09:00', '10:00')}
                >
                  Book 1 Hour
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => onBook(item.id, '09:00', '12:00')}
                >
                  Book 3 Hours
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No equipment available for booking.</p>
        </div>
      )}
    </div>
  )
}
```

## 🚀 **Integration with Existing System**

### **Add to Navigation**
```typescript
// Update navigation configs to include booking routes
export const ooliteConfig: NavigationConfig = {
  // ... existing config
  navigation: {
    userItems: [
      // ... existing items
      { name: 'Bookings', href: '/o/oolite/bookings', icon: Calendar },
      { name: 'Workshops', href: '/o/oolite/workshops', icon: GraduationCap },
    ],
    adminItems: [
      // ... existing items
      { name: 'Resource Calendar', href: '/o/oolite/admin/calendar', icon: Calendar },
      { name: 'Workshop Management', href: '/o/oolite/admin/workshops', icon: GraduationCap },
    ]
  }
}
```

### **Create Booking Pages**
```typescript
// app/o/[slug]/bookings/page.tsx
export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bookings</h1>
      <EquipmentBooking orgId={orgId} onBook={handleBooking} />
    </div>
  )
}

// app/o/[slug]/admin/calendar/page.tsx
export default function AdminCalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Resource Calendar</h1>
      <ResourceCalendar orgId={orgId} view="resourceTimeGridWeek" />
    </div>
  )
}
```

## 📊 **Component Testing Strategy**

### **Unit Tests**
```typescript
// __tests__/ResourceCalendar.test.tsx
import { render, screen } from '@testing-library/react'
import { ResourceCalendar } from '@/components/booking/ResourceCalendar'

describe('ResourceCalendar', () => {
  it('renders calendar with resources', () => {
    const mockResources = [
      { id: '1', title: 'Digital Lab', type: 'space', capacity: 12 }
    ]
    
    render(
      <ResourceCalendar 
        orgId="test-org" 
        resources={mockResources}
        bookings={[]}
      />
    )
    
    expect(screen.getByText('Digital Lab')).toBeInTheDocument()
  })
})
```

### **Integration Tests**
```typescript
// __tests__/booking-flow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { BookingForm } from '@/components/booking/BookingForm'

describe('Booking Flow', () => {
  it('creates booking successfully', async () => {
    const mockOnSubmit = jest.fn()
    const mockResources = [
      { id: '1', title: 'VR Headset', type: 'equipment', capacity: 1 }
    ]
    
    render(
      <BookingForm 
        orgId="test-org"
        resources={mockResources}
        onSubmit={mockOnSubmit}
        onCancel={jest.fn()}
      />
    )
    
    fireEvent.change(screen.getByPlaceholderText('Enter booking title'), {
      target: { value: 'Test Booking' }
    })
    
    fireEvent.click(screen.getByText('Create Booking'))
    
    expect(mockOnSubmit).toHaveBeenCalled()
  })
})
```

## 🎯 **Next Steps**

1. **Install required libraries** (see `LIBRARY_INSTALLATION.md`)
2. **Run database migration** (see `BOOKING_DATABASE_MIGRATION.md`)
3. **Build ResourceCalendar component** (start with this)
4. **Create booking API routes** (see `API_DEVELOPMENT.md`)
5. **Integrate with existing navigation**
6. **Test with Oolite Digital Lab data**

---

*This guide provides the foundation for building a comprehensive booking system that integrates seamlessly with your existing infrastructure.*
