'use client'

import Link from 'next/link'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { Infra24Logo } from '@/components/ui/Infra24Logo'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  website?: string
}

interface FooterProps {
  organization?: Organization
  isOrgPage?: boolean
}

export function Footer({ organization, isOrgPage = false }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              {isOrgPage && organization ? (
                <OrganizationLogo 
                  organizationSlug={organization.slug} 
                  variant="horizontal" 
                  size="sm" 
                />
              ) : (
                <Infra24Logo size="md" showText={true} />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {isOrgPage && organization 
                ? `Connecting ${organization.name} with the community through digital innovation and creative collaboration.`
                : 'Empowering organizations with digital tools and community engagement platforms.'
              }
            </p>
            
            {/* Contact Info */}
            {isOrgPage && organization && (
              <div className="space-y-2">
                {organization.contact_email && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <a 
                      href={`mailto:${organization.contact_email}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {organization.contact_email}
                    </a>
                  </div>
                )}
                {organization.contact_phone && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 mr-2" />
                    <a 
                      href={`tel:${organization.contact_phone}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {organization.contact_phone}
                    </a>
                  </div>
                )}
                {organization.address && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{organization.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {isOrgPage && organization ? (
                <>
                  <li>
                    <Link 
                      href={`/o/${organization.slug}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/o/${organization.slug}/announcements`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Announcements
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/o/${organization.slug}/digital-lab`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Digital Lab
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/o/${organization.slug}/workshops`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Workshops
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/o/${organization.slug}/surveys`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Surveys
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/product"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/accessibility"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/help"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/docs"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/status"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  System Status
                </Link>
              </li>
              <li>
                <Link 
                  href="/feedback"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {isOrgPage && organization ? organization.name : 'Infra24'}. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {isOrgPage && organization?.website && (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Official Website
                </a>
              )}
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Powered by{' '}
                <Link 
                  href="/"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Infra24
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
