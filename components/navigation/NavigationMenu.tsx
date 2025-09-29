'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationItem, ThemeColors } from './types'

interface NavigationMenuProps {
  items: NavigationItem[]
  colors: ThemeColors
  className?: string
  variant?: 'horizontal' | 'vertical'
}

export function NavigationMenu({ 
  items, 
  colors, 
  className = '', 
  variant = 'horizontal' 
}: NavigationMenuProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/o/oolite' || href === '/o/bakehouse') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const getItemStyles = (item: NavigationItem, isActiveItem: boolean) => {
    const baseStyles = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors group"
    const activeStyles = "text-white"
    const inactiveStyles = "text-gray-700 dark:text-gray-300 hover:bg-opacity-10"
    
    if (item.disabled) {
      return `${baseStyles} text-gray-400 dark:text-gray-600 cursor-not-allowed`
    }

    if (isActiveItem) {
      return `${baseStyles} ${activeStyles}`
    }

    return `${baseStyles} ${inactiveStyles}`
  }

  const containerClass = variant === 'horizontal' 
    ? 'flex items-center space-x-1' 
    : 'flex flex-col space-y-1'

  return (
    <nav className={`${containerClass} ${className}`}>
      {items.map((item) => {
        const isActiveItem = isActive(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.disabled ? '#' : item.href}
            className={getItemStyles(item, isActiveItem)}
            style={{
              backgroundColor: isActiveItem ? colors.primary : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActiveItem && !item.disabled) {
                e.currentTarget.style.backgroundColor = colors.primary
                e.currentTarget.style.color = 'white'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActiveItem && !item.disabled) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = ''
              }
            }}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault()
              }
            }}
          >
            <Icon className="w-4 h-4 mr-2" />
            <span className="hidden xl:inline">{item.name}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
            {/* Tooltip for mobile/small screens */}
            <span className="xl:hidden absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {item.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
