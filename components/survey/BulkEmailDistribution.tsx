'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/Badge'
import { 
  Mail, 
  Users, 
  Send, 
  CheckCircle, 
  XCircle, 
  Upload, 
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Survey {
  id: string;
  title: string;
  description: string;
}

interface BulkEmailDistributionProps {
  survey: Survey;
  organizationId: string;
  onClose: () => void;
}

export function BulkEmailDistribution({ survey, organizationId, onClose }: BulkEmailDistributionProps) {
  const [emailList, setEmailList] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<{
    successful: number
    failed: number
    errors: string[]
  } | null>(null)

  const handleEmailListChange = (value: string) => {
    setEmailList(value)
  }

  const parseEmailList = (text: string): string[] => {
    return text
      .split(/[,\n\r;]/)
      .map(email => email.trim())
      .filter(email => email.length > 0)
      .filter(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      })
  }

  const validEmails = parseEmailList(emailList)
  const invalidEmails = emailList
    .split(/[,\n\r;]/)
    .map(email => email.trim())
    .filter(email => email.length > 0)
    .filter(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return !emailRegex.test(email)
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validEmails.length === 0) {
      toast.error('Please enter at least one valid email address')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/surveys/bulk-distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId: survey.id,
          organizationId,
          emailList: validEmails,
          customMessage: customMessage || undefined,
          senderName: senderName || undefined,
          senderEmail: senderEmail || undefined
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data.results)
        toast.success(data.message)
      } else {
        throw new Error(data.error || 'Failed to send emails')
      }
    } catch (error) {
      console.error('Bulk distribution error:', error)
      toast.error('Failed to send survey invitations. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setEmailList(content)
    }
    reader.readAsText(file)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Bulk Email Distribution</CardTitle>
                  <CardDescription>
                    Send survey invitations to multiple recipients
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Survey Info */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {survey.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {survey.description}
              </p>
            </div>

            {!results ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailList" className="text-sm font-medium">
                      Email Addresses
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="fileUpload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fileUpload')?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload CSV</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    id="emailList"
                    placeholder="Enter email addresses separated by commas, semicolons, or new lines&#10;example@domain.com, another@domain.com&#10;third@domain.com"
                    value={emailList}
                    onChange={(e) => handleEmailListChange(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      {validEmails.length > 0 && (
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span>{validEmails.length} valid emails</span>
                        </div>
                      )}
                      {invalidEmails.length > 0 && (
                        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                          <XCircle className="h-4 w-4" />
                          <span>{invalidEmails.length} invalid emails</span>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Total: {emailList.split(/[,\n\r;]/).filter(e => e.trim()).length}
                    </div>
                  </div>

                  {invalidEmails.length > 0 && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            Invalid email addresses:
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {invalidEmails.slice(0, 5).map((email, index) => (
                              <Badge key={index} variant="error" className="text-xs">
                                {email}
                              </Badge>
                            ))}
                            {invalidEmails.length > 5 && (
                              <Badge variant="error" className="text-xs">
                                +{invalidEmails.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Message */}
                <div className="space-y-3">
                  <Label htmlFor="customMessage" className="text-sm font-medium">
                    Custom Message (Optional)
                  </Label>
                  <Textarea
                    id="customMessage"
                    placeholder="Add a personal message to include in the email invitation..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Sender Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="senderName" className="text-sm font-medium">
                      Sender Name (Optional)
                    </Label>
                    <Input
                      id="senderName"
                      placeholder="Your name or organization"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="senderEmail" className="text-sm font-medium">
                      Sender Email (Optional)
                    </Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      placeholder="your-email@domain.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={validEmails.length === 0 || isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send to {validEmails.length} Recipients</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* Results */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Distribution Complete!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Successfully sent {results.successful} out of {results.successful + results.failed} survey invitations
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-800 dark:text-green-200">
                        Successful
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {results.successful}
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-800 dark:text-red-200">
                        Failed
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                      {results.failed}
                    </div>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                      Errors ({results.errors.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {results.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-700 dark:text-red-300">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={onClose} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Done</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
