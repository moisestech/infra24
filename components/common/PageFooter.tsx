'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, ExternalLink, Clock, Users, Wifi, FileText, Shield, HelpCircle, Sparkles } from 'lucide-react'
import DecorativeDivider from '@/components/common/DecorativeDivider'
import { useTenant } from '@/components/tenant/TenantProvider'
import { useTheme } from 'next-themes'

interface PageFooterProps {
  organizationSlug?: string
  showGetStarted?: boolean
  showGuidelines?: boolean
  showTerms?: boolean
  customActions?: React.ReactNode
}

export function PageFooter({ 
  organizationSlug = 'oolite',
  showGetStarted = true,
  showGuidelines = true,
  showTerms = true,
  customActions
}: PageFooterProps) {
  const { tenantConfig } = useTenant()
  const { theme } = useTheme()
  
  // Get organization colors from tenant config or fallback to Oolite colors
  const orgColors = tenantConfig ? {
    primary: tenantConfig.theme.primaryColor,
    secondary: tenantConfig.theme.secondaryColor,
    accent: tenantConfig.theme.accentColor,
    primaryAlpha: `${tenantConfig.theme.primaryColor}1a`, // 10% opacity
    primaryAlphaLight: `${tenantConfig.theme.primaryColor}0d`, // 5% opacity
    primaryAlphaDark: `${tenantConfig.theme.primaryColor}26`, // 15% opacity
  } : {
    // Fallback to Oolite colors if no tenant config
    primary: '#47abc4',
    secondary: '#6bb8d1',
    accent: '#3a8ba3',
    primaryAlpha: 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
  }

  const getActionButtons = () => {
    if (customActions) {
      return customActions
    }

    return (
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href={`/o/${organizationSlug}/bookings`}>
          <Button 
            size="lg" 
            style={{ 
              backgroundColor: orgColors.primary,
              borderColor: orgColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = orgColors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = orgColors.primary
            }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Equipment
          </Button>
        </Link>
        <Link href={`/o/${organizationSlug}/workshops`}>
          <Button 
            size="lg" 
            variant="outline"
            style={{ 
              borderColor: orgColors.primary,
              color: orgColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = orgColors.primaryAlpha
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            View Workshops
          </Button>
        </Link>
        <Link href={`/o/${organizationSlug}/digital-lab`}>
          <Button 
            size="lg" 
            variant="outline"
            style={{ 
              borderColor: orgColors.primary,
              color: orgColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = orgColors.primaryAlpha
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Lab Tour
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-16 space-y-12">
      {/* Lab Guidelines & Policies Section */}
      {showGuidelines && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Lab Guidelines & Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div 
                  className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: orgColors.primaryAlpha }}
                >
                  <Clock className="w-8 h-8" style={{ color: orgColors.primary }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Booking Policy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Equipment can be booked up to 2 weeks in advance. 
                  Maximum 4 hours per session. Cancellations must be made 24 hours in advance.
                </p>
              </div>
              <div className="text-center">
                <div 
                  className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: orgColors.primaryAlpha }}
                >
                  <Users className="w-8 h-8" style={{ color: orgColors.primary }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Safety First</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All users must complete safety training before using equipment. 
                  Follow all posted guidelines and ask staff for assistance when needed.
                </p>
              </div>
              <div className="text-center">
                <div 
                  className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: orgColors.primaryAlpha }}
                >
                  <Wifi className="w-8 h-8" style={{ color: orgColors.primary }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Use</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Respect other users and maintain a collaborative environment. 
                  Clean up after yourself and report any equipment issues immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decorative Divider */}
      {showGuidelines && showTerms && (
        <DecorativeDivider 
          icon={Sparkles}
          gradientColors={{
            from: orgColors.primaryAlpha,
            via: `${orgColors.secondary}1a`,
            to: orgColors.primaryAlpha
          }}
          iconColor={`text-[${orgColors.primary}]/50`}
          className="my-8"
        />
      )}

      {/* Terms and Conditions Section */}
      {showTerms && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Terms and Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div 
                  className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: orgColors.primaryAlpha }}
                >
                  <FileText className="w-8 h-8" style={{ color: orgColors.primary }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Usage Agreement</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  By using our facilities, you agree to follow all policies and guidelines. 
                  Equipment misuse may result in suspension of access privileges.
                </p>
              </div>
              <div className="text-center">
                <div 
                  className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: orgColors.primaryAlpha }}
                >
                  <Shield className="w-8 h-8" style={{ color: orgColors.primary }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Liability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Users are responsible for their own safety and the proper use of equipment. 
                  The organization is not liable for personal injury or property damage.
                </p>
              </div>
              <div className="text-center">
                <div 
                  className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: orgColors.primaryAlpha }}
                >
                  <HelpCircle className="w-8 h-8" style={{ color: orgColors.primary }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Need help? Contact our support team for assistance with equipment, 
                  booking issues, or general questions about our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decorative Divider before Ready to Get Started */}
      {showGetStarted && (
        <DecorativeDivider 
          icon={Sparkles}
          gradientColors={{
            from: orgColors.primaryAlpha,
            via: `${orgColors.secondary}1a`,
            to: orgColors.primaryAlpha
          }}
          iconColor={`text-[${orgColors.primary}]/50`}
          className="my-8"
        />
      )}

      {/* Ready to Get Started Section - At the very bottom */}
      {showGetStarted && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of digital artists and start creating with cutting-edge technology.
          </p>
          {getActionButtons()}
        </div>
      )}
    </div>
  )
}
