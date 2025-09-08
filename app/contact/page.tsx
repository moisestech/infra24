'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import PublicNavigation from '@/components/ui/PublicNavigation';

export default function ContactPage() {
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailClick = () => {
    window.location.href = 'mailto:m@moises.tech?subject=Smart Sign Inquiry&body=Hello Moises,%0D%0A%0D%0AI would like to learn more about Smart Sign for my organization.%0D%0A%0D%0APlease let me know more details about:%0D%0A- Pricing%0D%0A- Features%0D%0A- Implementation%0D%0A%0D%0AThank you!';
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ready to power your community's communication? Let's discuss how Smart Sign can help your organization.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Moises
            </h2>
            
            <div className="mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                For inquiries about Smart Sign, pricing, features, or implementation:
              </p>
              
              <div className="inline-flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-6 py-4 mb-6">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-mono text-gray-900 dark:text-white">
                  m@moises.tech
                </span>
              </div>
            </div>

            <button
              onClick={handleEmailClick}
              className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                emailSent
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {emailSent ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Email Opened
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Email
                </>
              )}
            </button>

            {emailSent && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-4">
                Your email client should have opened with a pre-filled message.
              </p>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What to expect:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Quick Response</p>
                  <p>I typically respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Custom Demo</p>
                  <p>Personalized walkthrough of Smart Sign features</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Pricing Discussion</p>
                  <p>Transparent pricing based on your organization's needs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Implementation Support</p>
                  <p>Full setup and training for your team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
