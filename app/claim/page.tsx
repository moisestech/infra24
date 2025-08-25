'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Key,
  ArrowRight,
  Users
} from 'lucide-react'
import PublicNavigation from '@/components/ui/PublicNavigation'
import { Badge } from '@/components/ui/Badge'

interface ClaimToken {
  id: string
  artist_profile_id: string
  token: string
  issued_to_email: string
  role_on_claim: string
  expires_at: string
  used_at?: string
  used_by_clerk_id?: string
}

interface ArtistProfile {
  id: string
  name: string
  email: string
  studio_number?: string
  studio_type?: string
  is_claimed: boolean
  claimed_by_clerk_user_id?: string
}

function ClaimPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [token, setToken] = useState(searchParams.get('token') || '')
  const [email, setEmail] = useState('')
  const [claimToken, setClaimToken] = useState<ClaimToken | null>(null)
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [step, setStep] = useState<'email' | 'token' | 'success'>('email')

  useEffect(() => {
    if (token) {
      verifyToken(token)
    }
  }, [token])

  const verifyToken = async (tokenValue: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/claim/verify?token=${tokenValue}`)
      const data = await response.json()

      if (response.ok) {
        setClaimToken(data.token)
        setArtistProfile(data.artist_profile)
        setStep('token')
      } else {
        setError(data.error || 'Invalid or expired token')
      }
    } catch (error) {
      setError('Failed to verify token')
    } finally {
      setLoading(false)
    }
  }

  const requestClaimToken = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/claim/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Claim token sent to your email! Please check your inbox.')
        setStep('token')
      } else {
        setError(data.error || 'Failed to send claim token')
      }
    } catch (error) {
      setError('Failed to request claim token')
    } finally {
      setLoading(false)
    }
  }

  const claimAccount = async () => {
    if (!user || !claimToken) {
      setError('You must be signed in to claim your account')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/claim/consume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: claimToken.token,
          clerk_user_id: user.id 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account claimed successfully!')
        setStep('success')
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Failed to claim account')
      }
    } catch (error) {
      setError('Failed to claim account')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Claim Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your existing artist profile to your Smart Sign account
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700 dark:text-green-400">{success}</span>
              </div>
            </div>
          )}

          {step === 'email' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Enter Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll send you a claim token to verify your identity
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  onClick={requestClaimToken}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Claim Token'}
                </button>
              </div>
            </div>
          )}

          {step === 'token' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Verify Your Identity
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter the claim token sent to your email
                </p>
              </div>

              {artistProfile && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Artist Profile Found
                  </h3>
                  <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <p><strong>Name:</strong> {artistProfile.name}</p>
                    <p><strong>Email:</strong> {artistProfile.email}</p>
                    {artistProfile.studio_number && (
                      <p><strong>Studio:</strong> {artistProfile.studio_number}</p>
                    )}
                    {artistProfile.studio_type && (
                      <p><strong>Type:</strong> {artistProfile.studio_type}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Claim Token
                  </label>
                  <input
                    type="text"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your claim token"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => verifyToken(token)}
                    disabled={loading || !token}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    {loading ? 'Verifying...' : 'Verify Token'}
                  </button>

                  {user && claimToken && (
                    <button
                      onClick={claimAccount}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      {loading ? 'Claiming...' : 'Claim Account'}
                    </button>
                  )}
                </div>

                {!user && claimToken && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      Please sign in to claim your account
                    </p>
                    <button
                      onClick={() => router.push('/sign-in')}
                      className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Account Claimed Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your artist profile has been connected to your Smart Sign account.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClaimPageContent />
    </Suspense>
  )
}
