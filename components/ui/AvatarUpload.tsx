'use client'

import { useState, useRef } from 'react'
import { Upload, X, User } from 'lucide-react'
import UserAvatar from './UserAvatar'

interface AvatarUploadProps {
  currentImageUrl?: string
  name?: string
  email?: string
  onUpload: (file: File) => Promise<void>
  onRemove?: () => Promise<void>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function AvatarUpload({ 
  currentImageUrl, 
  name, 
  email, 
  onUpload, 
  onRemove,
  size = 'md',
  className = '' 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      await onUpload(file)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = async () => {
    if (!onRemove) return
    
    setIsUploading(true)
    try {
      await onRemove()
    } catch (error) {
      console.error('Remove failed:', error)
      alert('Remove failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-20 h-20'
      case 'lg':
        return 'w-32 h-32'
      default:
        return 'w-24 h-24'
    }
  }

  return (
    <div className={`relative ${getSizeClasses()} ${className}`}>
      {/* Current Avatar */}
      <div className="relative">
        <UserAvatar
          name={name}
          email={email}
          imageUrl={currentImageUrl}
          size={size}
          className="w-full h-full"
        />
        
        {/* Upload Overlay */}
        <div
          className={`absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${
            dragActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-white text-center">
            <Upload className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs">Drop image here</p>
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </button>

        {/* Remove Button */}
        {currentImageUrl && onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
