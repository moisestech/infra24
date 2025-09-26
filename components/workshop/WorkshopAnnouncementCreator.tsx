'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Megaphone, Calendar, Clock, Users, MapPin, User } from 'lucide-react'

interface Workshop {
  id: string
  title: string
  description: string
  capacity: number
  registration_open_at: string | null
  registration_close_at: string | null
  resources?: {
    id: string
    title: string
    type: string
  }
  artist_profiles?: {
    id: string
    name: string
  }
}

interface WorkshopAnnouncementCreatorProps {
  workshop: Workshop
  orgId: string
  onAnnouncementCreated?: (announcement: any) => void
  onCancel?: () => void
}

export function WorkshopAnnouncementCreator({ 
  workshop, 
  orgId, 
  onAnnouncementCreated,
  onCancel 
}: WorkshopAnnouncementCreatorProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: `🎓 New Workshop: ${workshop.title}`,
    content: `Join us for "${workshop.title}"! ${workshop.description}\n\n` +
             `📅 Capacity: ${workshop.capacity} participants\n` +
             `${workshop.resources ? `📍 Location: ${workshop.resources.title}\n` : ''}` +
             `${workshop.artist_profiles ? `👨‍🏫 Instructor: ${workshop.artist_profiles.name}\n` : ''}` +
             `\nRegister now to secure your spot!`,
    priority: 'normal',
    visibility: 'public',
    scheduledAt: '',
    expiresAt: ''
  })

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/announcements/workshop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orgId,
          workshopId: workshop.id,
          announcementTitle: formData.title,
          announcementContent: formData.content,
          priority: formData.priority,
          visibility: formData.visibility,
          scheduledAt: formData.scheduledAt || null,
          expiresAt: formData.expiresAt || null
        })
      })

      if (response.ok) {
        const { announcement } = await response.json()
        if (onAnnouncementCreated) {
          onAnnouncementCreated(announcement)
        }
        alert('Announcement created successfully!')
      } else {
        const error = await response.json()
        alert(`Error creating announcement: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert('Error creating announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Workshop Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Megaphone className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">Creating Announcement for Workshop</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium">{workshop.title}</span>
          </div>
          
          {workshop.resources && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">{workshop.resources.title}</span>
            </div>
          )}
          
          {workshop.artist_profiles && (
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Instructor: {workshop.artist_profiles.name}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700">Capacity: {workshop.capacity} participants</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Announcement Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter announcement title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter announcement content"
            rows={6}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <Select 
              value={formData.visibility} 
              onValueChange={(value) => setFormData({ ...formData, visibility: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="members_only">Members Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Date (Optional)
            </label>
            <Input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expires Date (Optional)
            </label>
            <Input
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Announcement'}
        </Button>
      </div>
    </div>
  )
}
