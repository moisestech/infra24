'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void
  acceptedTypes?: string[]
  maxFileSize?: number // in MB
  maxFiles?: number
  className?: string
  disabled?: boolean
}

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

export function FileUploader({
  onFileSelect,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  maxFileSize = 10, // 10MB default
  maxFiles = 5,
  className,
  disabled = false
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      return file.type.match(type.replace('*', '.*'))
    })

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
    }

    return null
  }

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    setError(null)
    const newFiles: UploadedFile[] = []

    Array.from(files).forEach((file, index) => {
      const validationError = validateFile(file)
      
      if (validationError) {
        setError(validationError)
        return
      }

      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const uploadedFile: UploadedFile = {
        file,
        id: `${Date.now()}-${index}`,
        status: 'uploading',
        progress: 0
      }

      newFiles.push(uploadedFile)
    })

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles])
      
      // Simulate upload progress
      newFiles.forEach(uploadedFile => {
        const interval = setInterval(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, progress: Math.min((f.progress || 0) + 10, 100) }
                : f
            )
          )
        }, 100)

        setTimeout(() => {
          clearInterval(interval)
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: 'success', progress: 100 }
                : f
            )
          )
        }, 1000)
      })

      onFileSelect(newFiles.map(f => f.file))
    }
  }, [acceptedTypes, maxFileSize, maxFiles, uploadedFiles.length, onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }, [disabled, handleFileSelect])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-600" />
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-600" />
    } else {
      return <File className="w-5 h-5 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          isDragOver 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Maximum {maxFiles} files, up to {maxFileSize}MB each
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Accepted: {acceptedTypes.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            
            {uploadedFiles.map((uploadedFile) => (
              <motion.div
                key={uploadedFile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(uploadedFile.file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {uploadedFile.status === 'uploading' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {uploadedFile.progress}%
                      </span>
                    </div>
                  )}
                  
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
