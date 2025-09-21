'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface SurveyDraftManagerProps {
  surveyId: string
  formData: any
  onSave?: (data: any) => Promise<void>
  className?: string
}

export function SurveyDraftManager({ 
  surveyId, 
  formData, 
  onSave,
  className 
}: SurveyDraftManagerProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Auto-save functionality
  const saveDraft = useCallback(async (data: any, showToast = false) => {
    if (!data || Object.keys(data).length === 0) return

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      // Save to localStorage
      localStorage.setItem(`survey_draft_${surveyId}`, JSON.stringify({
        data,
        timestamp: new Date().toISOString()
      }))

      // Call custom save handler if provided
      if (onSave) {
        await onSave(data)
      }

      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      setSaveStatus('saved')

      if (showToast) {
        toast.success('Draft saved successfully!', {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          duration: 2000
        })
      }

      // Reset status after a delay
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Failed to save draft:', error)
      setSaveStatus('error')
      
      if (showToast) {
        toast.error('Failed to save draft. Please try again.', {
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
          duration: 3000
        })
      }
    } finally {
      setIsSaving(false)
    }
  }, [surveyId, onSave])

  // Auto-save on form data changes (debounced)
  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) return

    setHasUnsavedChanges(true)
    
    const timeoutId = setTimeout(() => {
      saveDraft(formData)
    }, 1200) // 1.2 second debounce

    return () => clearTimeout(timeoutId)
  }, [formData, saveDraft])

  // Load existing draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`survey_draft_${surveyId}`)
    if (savedDraft) {
      try {
        const { timestamp } = JSON.parse(savedDraft)
        setLastSaved(new Date(timestamp))
      } catch (error) {
        console.error('Failed to parse saved draft:', error)
      }
    }
  }, [surveyId])

  // Manual save handler
  const handleManualSave = () => {
    saveDraft(formData, true)
  }

  // Format last saved time
  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {/* Save Status Indicator */}
      <AnimatePresence mode="wait">
        {saveStatus === 'saving' && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400"
          >
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
            <span>Saving...</span>
          </motion.div>
        )}
        
        {saveStatus === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400"
          >
            <CheckCircle className="w-3 h-3" />
            <span>Saved</span>
          </motion.div>
        )}
        
        {saveStatus === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="w-3 h-3" />
            <span>Save failed</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Saved Timestamp */}
      {lastSaved && saveStatus === 'idle' && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Saved {formatLastSaved(lastSaved)}</span>
        </div>
      )}

      {/* Manual Save Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleManualSave}
        disabled={isSaving || !hasUnsavedChanges}
        className={cn(
          "transition-all duration-200",
          hasUnsavedChanges && !isSaving
            ? "border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20"
            : ""
        )}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save Draft'}
      </Button>

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && saveStatus === 'idle' && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-1 text-sm text-orange-600 dark:text-orange-400"
        >
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span>Unsaved changes</span>
        </motion.div>
      )}
    </div>
  )
}
