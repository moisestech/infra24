'use client'

import { useState } from 'react'
import { Copy, Check, Eye, Trash2, Edit } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  is_active: boolean
  visibility: string
}

interface AnnouncementIdDisplayProps {
  announcement: Announcement
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function AnnouncementIdDisplay({ announcement, onEdit, onDelete }: AnnouncementIdDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(announcement.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy ID:', err)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete announcement')
      }

      console.log('Successfully deleted announcement:', announcement.id)
      onDelete?.(announcement.id)
    } catch (err) {
      console.error('Failed to delete announcement:', err)
      alert(`Failed to delete announcement: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (isActive: boolean, visibility: string) => {
    if (!isActive) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    if (visibility === 'public') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    if (visibility === 'internal') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
              Admin Tools
            </span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(announcement.is_active, announcement.visibility)}`}>
              {announcement.is_active ? announcement.visibility : 'inactive'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-gray-700 dark:text-gray-300">
              {announcement.id}
            </code>
            
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="Copy ID to clipboard"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
            {announcement.title}
          </p>
        </div>
        
        <div className="flex items-center space-x-1 ml-3">
          <button
            onClick={() => onEdit?.(announcement.id)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            title="Edit announcement"
          >
            <Edit className="h-3 w-3" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors disabled:opacity-50"
            title="Delete announcement"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
