'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import { NavigationBrand } from './NavigationBrand'
import { UserMenu } from './UserMenu'
import type { NavigationChromeVariant, NavigationItem, Organization, ThemeColors } from './types'
import { cn } from '@/lib/utils'

type NavigationOverflowMenuProps = {
  organization: Organization
  userItems: NavigationItem[]
  adminItems: NavigationItem[]
  colors: ThemeColors
  userRole?: 'user' | 'admin' | 'super_admin'
  chromeVariant?: NavigationChromeVariant
  className?: string
}

export function NavigationOverflowMenu({
  organization,
  userItems,
  adminItems,
  colors,
  userRole = 'user',
  chromeVariant = 'default',
  className = '',
}: NavigationOverflowMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isSohoChrome = chromeVariant === 'soho-dark'

  const isActive = (href: string) => {
    if (href === '/o/oolite' || href === '/o/bakehouse' || href === '/o/sohohouse') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const buttonClass = isSohoChrome
    ? 'text-[rgba(245,239,230,0.68)] hover:bg-[rgba(245,235,220,0.08)] hover:text-[#f5efe6]'
    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-md transition-colors sm:size-10',
          buttonClass,
          className
        )}
        aria-label="All navigation options"
        title="All navigation options"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="fixed inset-0 bg-black/50"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              'fixed right-0 top-0 flex h-full w-[min(100vw,22rem)] flex-col shadow-xl',
              isSohoChrome ? 'bg-[#0c0a09] text-[#f5efe6]' : 'bg-white dark:bg-gray-900'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-between gap-3 border-b p-4',
                isSohoChrome ? 'border-[rgba(245,235,220,0.08)]' : 'border-gray-200 dark:border-gray-700'
              )}
            >
              <NavigationBrand organization={organization} chromeVariant={chromeVariant} />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-md transition-colors',
                  buttonClass
                )}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-6">
                <section>
                  <h3
                    className={cn(
                      'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
                      isSohoChrome ? 'text-[rgba(245,239,230,0.55)]' : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    {userItems.map((item) => {
                      const isActiveItem = isActive(item.href)
                      const Icon = item.icon

                      return (
                        <Link
                          key={item.href}
                          href={item.disabled ? '#' : item.href}
                          className={cn(
                            'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                            isActiveItem
                              ? 'text-white'
                              : isSohoChrome
                                ? 'text-[rgba(245,239,230,0.82)] hover:bg-[rgba(245,235,220,0.08)]'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                            item.disabled && 'cursor-not-allowed opacity-50'
                          )}
                          style={{
                            backgroundColor: isActiveItem ? colors.primary : 'transparent',
                          }}
                          onClick={(e) => {
                            if (item.disabled) {
                              e.preventDefault()
                            } else {
                              setIsOpen(false)
                            }
                          }}
                        >
                          <Icon className="mr-3 h-5 w-5 shrink-0" aria-hidden />
                          <span className="flex-1">{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </section>

                {userRole !== 'user' && adminItems.length > 0 ? (
                  <section>
                    <h3
                      className={cn(
                        'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
                        isSohoChrome ? 'text-[rgba(245,239,230,0.55)]' : 'text-gray-500 dark:text-gray-400'
                      )}
                    >
                      Administration
                    </h3>
                    <div className="space-y-1">
                      {adminItems.map((item) => {
                        const isActiveItem = isActive(item.href)
                        const Icon = item.icon

                        return (
                          <Link
                            key={item.href}
                            href={item.disabled ? '#' : item.href}
                            className={cn(
                              'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                              isActiveItem
                                ? 'text-white'
                                : isSohoChrome
                                  ? 'text-[rgba(245,239,230,0.82)] hover:bg-[rgba(245,235,220,0.08)]'
                                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                              item.disabled && 'cursor-not-allowed opacity-50'
                            )}
                            style={{
                              backgroundColor: isActiveItem ? colors.primary : 'transparent',
                            }}
                            onClick={(e) => {
                              if (item.disabled) {
                                e.preventDefault()
                              } else {
                                setIsOpen(false)
                              }
                            }}
                          >
                            <Icon className="mr-3 h-5 w-5 shrink-0" aria-hidden />
                            <div className="flex-1">
                              <div>{item.name}</div>
                              {item.description ? (
                                <div
                                  className={cn(
                                    'text-xs',
                                    isSohoChrome
                                      ? 'text-[rgba(245,239,230,0.55)]'
                                      : 'text-gray-500 dark:text-gray-400'
                                  )}
                                >
                                  {item.description}
                                </div>
                              ) : null}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>

            <div
              className={cn(
                'border-t p-4',
                isSohoChrome ? 'border-[rgba(245,235,220,0.08)]' : 'border-gray-200 dark:border-gray-700'
              )}
            >
              <UserMenu colors={colors} chromeVariant={chromeVariant} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
