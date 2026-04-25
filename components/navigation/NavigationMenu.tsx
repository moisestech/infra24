'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Tooltip from '@/components/ui/Tooltip'
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
  variant = 'horizontal',
}: NavigationMenuProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/o/oolite' || href === '/o/bakehouse') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const getItemStyles = (item: NavigationItem, isActiveItem: boolean) => {
    const baseStyles =
      'relative flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors group sm:size-10'
    const activeStyles = 'text-white'
    const inactiveStyles = 'text-gray-700 dark:text-gray-300 hover:bg-opacity-10'

    if (item.disabled) {
      return `${baseStyles} text-gray-400 dark:text-gray-600 cursor-not-allowed`
    }

    if (isActiveItem) {
      return `${baseStyles} ${activeStyles}`
    }

    return `${baseStyles} ${inactiveStyles}`
  }

  const containerClass =
    variant === 'horizontal' ? 'flex items-center gap-0.5 sm:gap-1' : 'flex flex-col space-y-1'

  return (
    <nav className={`${containerClass} ${className}`}>
      {items.map((item) => {
        const isActiveItem = isActive(item.href)
        const Icon = item.icon

        return (
          <Tooltip key={item.href} content={item.name} position="bottom">
            <Link
              href={item.disabled ? '#' : item.href}
              className={getItemStyles(item, isActiveItem)}
              style={{
                backgroundColor: isActiveItem ? colors.primary : 'transparent',
              }}
              title={item.name}
              aria-label={item.name}
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
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="sr-only">{item.name}</span>
              {item.badge ? (
                <span
                  className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"
                  aria-hidden
                />
              ) : null}
            </Link>
          </Tooltip>
        )
      })}
    </nav>
  )
}
