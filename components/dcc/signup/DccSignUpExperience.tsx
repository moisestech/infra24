'use client'

import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

export function DccSignUpExperience({ membershipLive }: { membershipLive: boolean }) {
  const params = useSearchParams()
  const requested = params.get('redirect_url')
  // Avoid open redirects. Auth may return only to an internal site route.
  const redirectTo = requested && requested.startsWith('/') &&
    !requested.startsWith('//') && !requested.includes('\\')
      ? requested : '/dashboard'
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Smart Sign</h1>
            <p className="text-gray-400">Create your account</p>
          </div>
          <div className="mb-6 rounded-xl border border-gray-700 bg-gray-900/80 px-4 py-4 text-left">
            <p className="text-sm font-medium text-white">One account for the DCC network</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              {membershipLive
                ? 'Creating this account also starts your private DCC membership once your identity is verified. After approval, you can choose which practices people can discover in the directory and network sculpture.'
                : 'We are connecting Smart Sign accounts with DCC. When enrollment launches, new accounts will start private DCC membership after identity verification. You will decide separately what appears publicly in the directory and sculpture.'}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              {membershipLive
                ? 'Your signup never creates an identifiable public sculpture dot. Verified membership may appear only in delayed anonymous community batches; named practice links require your consent and review. '
                : 'DCC enrollment is not yet enabled; this signup currently creates a Smart Sign account only. '}
              <a href="/network/community" className="underline underline-offset-2 hover:text-white">
                Explore community examples
              </a>
              {' '}·{' '}
              <a href="/network/artwork" className="underline underline-offset-2 hover:text-white">
                View the sculpture
              </a>
              {' '}·{' '}
              <a href="/privacy" className="underline underline-offset-2 hover:text-white">
                Privacy details
              </a>
            </p>
          </div>
          
          <SignUp 
            redirectUrl={redirectTo}
            appearance={{
              variables: {
                colorPrimary: '#3b82f6',
                colorBackground: '#000000',
                colorText: '#ffffff',
                colorTextSecondary: '#9ca3af'
              },
              elements: {
                rootBox: "mx-auto",
                card: "bg-black/80 backdrop-blur-sm border border-gray-800 rounded-lg p-8 shadow-2xl",
                headerTitle: "text-2xl font-bold text-white text-center",
                headerSubtitle: "text-gray-400 text-sm text-center",
                formButtonPrimary: "w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-4 rounded-md transition-all duration-300",
                formFieldInput: "w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 py-3 px-4 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300",
                formFieldLabel: "block text-sm font-medium text-gray-300",
                formFieldError: "block text-red-400 text-xs",
                footerActionLink: "text-blue-400 hover:text-blue-300 transition-colors",
                dividerLine: "bg-gray-700",
                dividerText: "px-2 bg-black text-gray-400",
                socialButtonsBlockButton: "w-full flex items-center justify-center gap-3 bg-gray-900 border border-gray-700 hover:border-blue-500 text-white py-3 px-4 rounded-md transition-all duration-300 text-sm",
                socialButtonsBlockButtonText: "text-white",
                formResendCodeLink: "text-blue-400 hover:text-blue-300 transition-colors",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-blue-400 hover:text-blue-300 transition-colors",
                formFieldAction: "text-blue-400 hover:text-blue-300 transition-colors",
                formFieldHintText: "text-gray-400 text-xs",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-blue-400 transition-colors",
                formFieldInputShowPasswordIcon: "text-gray-400",
                formHeaderTitle: "text-2xl font-bold text-white text-center",
                formHeaderSubtitle: "text-gray-400 text-sm text-center",
                formButtonSecondary: "w-full bg-gray-900 border border-gray-700 text-white hover:border-blue-500 py-3 px-4 rounded-md transition-all duration-300",
                formButtonReset: "text-blue-400 hover:text-blue-300 transition-colors",
                formButtonArrow: "text-blue-400",
                formButtonText: "font-semibold",
                formFieldRow: "space-y-2",
                formFieldLabelRow: "flex items-center justify-between",
                formFieldLabelRowLabel: "block text-sm font-medium text-gray-300",
                formFieldLabelRowSupplement: "text-xs text-gray-400",
                formFieldRowInput: "w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 py-3 px-4 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300",
                formFieldRowInputShowPasswordButton: "text-gray-400 hover:text-blue-400 transition-colors",
                formFieldRowInputShowPasswordIcon: "text-gray-400"
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
