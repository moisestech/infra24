'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Users,
  MessageSquare,
  Download
} from 'lucide-react'
import Link from 'next/link'

export default function SubmitLandingPage() {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your submissions are encrypted and protected. We never share your personal information.'
    },
    {
      icon: Clock,
      title: 'Save & Resume',
      description: 'Start your submission and come back later. Your progress is automatically saved.'
    },
    {
      icon: CheckCircle,
      title: 'Track Status',
      description: 'Monitor your submission status and receive updates throughout the review process.'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Receive messages and feedback directly from the review team.'
    }
  ]

  const processSteps = [
    {
      step: 1,
      title: 'Sign In',
      description: 'Create an account or sign in to get started. This helps us save your progress and keep you updated.'
    },
    {
      step: 2,
      title: 'Complete Form',
      description: 'Fill out the submission form at your own pace. You can save drafts and return later.'
    },
    {
      step: 3,
      title: 'Submit',
      description: 'Review your submission and submit when ready. You\'ll receive a confirmation email.'
    },
    {
      step: 4,
      title: 'Track Progress',
      description: 'Monitor your submission status and communicate with the review team through our platform.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-2xl">
              <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Submission Platform
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Submit your applications, surveys, and forms with confidence. Our platform provides 
            enterprise-grade security, progress tracking, and seamless communication.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Users className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600">
              <Download className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Process Steps */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Simple, secure, and transparent submission process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {step.step}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Submit?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust our platform for their important submissions. 
                Get started today with enterprise-grade security and professional support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <FileText className="w-5 h-5 mr-2" />
                  Start Submission
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-16 text-center text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="mb-4">
            Powered by enterprise-grade security and professional support
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
              Terms of Service
            </Link>
            <Link href="/support" className="hover:text-blue-600 dark:hover:text-blue-400">
              Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
