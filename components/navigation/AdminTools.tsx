'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Shield } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import { NavigationItem, ThemeColors } from './types'

interface AdminToolsProps {
  items: NavigationItem[]
  colors: ThemeColors
  userRole?: 'user' | 'admin' | 'super_admin'
  className?: string
}

export function AdminTools({
  items,
  colors,
  userRole = 'user',
  className = '',
}: AdminToolsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (userRole === 'user' || items.length === 0) {
    return null
  }

  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <Tooltip content="Admin tools" position="bottom">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-9 items-center justify-center gap-0.5 rounded-md text-sm font-medium text-gray-700 transition-colors dark:text-gray-300 sm:size-10"
          style={{
            backgroundColor: isOpen ? colors.primary : 'transparent',
            color: isOpen ? 'white' : undefined,
          }}
          title="Admin tools"
          aria-label="Admin tools"
          aria-expanded={isOpen}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = colors.primary
              e.currentTarget.style.color = 'white'
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = ''
            }
          }}
        >
          <Shield className="h-4 w-4 shrink-0" aria-hidden />
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="py-1">
            <div className="border-b border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Administration
            </div>
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.disabled ? '#' : item.href}
                  className={`flex items-center px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                    item.disabled ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault()
                    } else {
                      setIsOpen(false)
                    }
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.description ? (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                    ) : null}
                  </div>
                  {item.badge ? (
                    <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>
                  ) : null}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
