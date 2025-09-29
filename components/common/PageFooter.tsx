'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, ExternalLink, Clock, Users, Wifi, FileText, Shield, HelpCircle, Sparkles } from 'lucide-react'
import DecorativeDivider from '@/components/common/DecorativeDivider'

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
  // Oolite theme colors
  const ooliteColors = {
    primary: '#47abc4',
    primaryLight: '#6bb8d1',
    primaryDark: '#3a8ba3',
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
              backgroundColor: ooliteColors.primary,
              borderColor: ooliteColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = ooliteColors.primaryLight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = ooliteColors.primary
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
              borderColor: ooliteColors.primary,
              color: ooliteColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = ooliteColors.primaryAlpha
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
              borderColor: ooliteColors.primary,
              color: ooliteColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = ooliteColors.primaryAlpha
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
                  style={{ backgroundColor: ooliteColors.primaryAlpha }}
                >
                  <Clock className="w-8 h-8" style={{ color: ooliteColors.primary }} />
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
                  style={{ backgroundColor: ooliteColors.primaryAlpha }}
                >
                  <Users className="w-8 h-8" style={{ color: ooliteColors.primary }} />
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
                  style={{ backgroundColor: ooliteColors.primaryAlpha }}
                >
                  <Wifi className="w-8 h-8" style={{ color: ooliteColors.primary }} />
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
            from: 'rgba(71, 171, 196, 0.1)',
            via: 'rgba(107, 184, 209, 0.1)',
            to: 'rgba(71, 171, 196, 0.1)'
          }}
          iconColor="text-[#47abc4]/50"
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
                  style={{ backgroundColor: ooliteColors.primaryAlpha }}
                >
                  <FileText className="w-8 h-8" style={{ color: ooliteColors.primary }} />
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
                  style={{ backgroundColor: ooliteColors.primaryAlpha }}
                >
                  <Shield className="w-8 h-8" style={{ color: ooliteColors.primary }} />
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
                  style={{ backgroundColor: ooliteColors.primaryAlpha }}
                >
                  <HelpCircle className="w-8 h-8" style={{ color: ooliteColors.primary }} />
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
            from: 'rgba(71, 171, 196, 0.1)',
            via: 'rgba(107, 184, 209, 0.1)',
            to: 'rgba(71, 171, 196, 0.1)'
          }}
          iconColor="text-[#47abc4]/50"
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
