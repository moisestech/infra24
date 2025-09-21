'use client'

import { Toaster as HotToaster } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        // Success toast styling
        success: {
          duration: 3000,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#f0fdf4',
          },
        },
        // Error toast styling
        error: {
          duration: 5000,
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
        },
        // Loading toast styling
        loading: {
          style: {
            background: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
          },
        },
      }}
    />
  )
}

// Custom toast components for specific use cases
export const toast = {
  success: (message: string) => {
    return import('react-hot-toast').then(({ toast: hotToast }) => {
      return hotToast.success(message, {
        duration: 3000,
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#f0fdf4',
        },
      })
    })
  },
  
  error: (message: string) => {
    return import('react-hot-toast').then(({ toast: hotToast }) => {
      return hotToast.error(message, {
        duration: 5000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fef2f2',
        },
      })
    })
  },
  
  loading: (message: string) => {
    return import('react-hot-toast').then(({ toast: hotToast }) => {
      return hotToast.loading(message, {
        style: {
          background: '#f8fafc',
          color: '#475569',
          border: '1px solid #e2e8f0',
        },
      })
    })
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return import('react-hot-toast').then(({ toast: hotToast }) => {
      return hotToast.promise(promise, messages, {
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      })
    })
  }
}