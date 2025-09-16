'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { 
  Menu, 
  X, 
  Bell, 
  Users, 
  Globe,
  ChevronDown
} from 'lucide-react'
import { Infra24Logo } from './Infra24Logo'

// Smooth scroll utility function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

export default function PublicNavigation() {
  const { user, isLoaded } = useUser()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Infra24Logo size="lg" showText={true} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => smoothScrollTo('organizations')}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Organizations
            </button>
            <button 
              onClick={() => smoothScrollTo('features')}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </button>
            <Link 
              href="/product" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoaded && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile Logo and Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <Infra24Logo size="md" showText={false} />
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  smoothScrollTo('organizations')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Organizations
              </button>
              <button
                onClick={() => {
                  smoothScrollTo('features')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Features
              </button>
              <Link
                href="/product"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons */}
              {isLoaded && user ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8"
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <SignInButton mode="modal">
                    <button 
                      className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button 
                      className="w-full text-left px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
