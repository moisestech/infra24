import { Suspense } from 'react'
import { ContentManagement } from '@/components/content/ContentManagement'

export default function ContentManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage articles, lessons, resources, and announcements
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <ContentManagement />
        </Suspense>
      </div>
    </div>
  )
}
