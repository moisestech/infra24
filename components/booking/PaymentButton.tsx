'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface PaymentButtonProps {
  bookingId: string
  amount: number
  currency?: string
  userRole?: string
  isFree?: boolean
  resourceName?: string
  className?: string
}

export function PaymentButton({
  bookingId,
  amount,
  currency = 'USD',
  userRole = 'public',
  isFree = false,
  resourceName = 'Workshop',
  className = ''
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'checkout' | 'payment_intent'>('checkout')
  const router = useRouter()

  const handlePayment = async () => {
    if (isFree) {
      toast.success('No payment required for your user role!')
      router.push(`/bookings/${bookingId}/success`)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/bookings/${bookingId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      if (!data.paymentRequired) {
        toast.success(data.message || 'Booking confirmed!')
        router.push(`/bookings/${bookingId}/success`)
        return
      }

      if (paymentMethod === 'checkout' && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl
      } else if (paymentMethod === 'payment_intent' && data.clientSecret) {
        // Handle payment intent (would need Stripe Elements integration)
        toast.info('Payment intent created. Redirecting to payment form...')
        // For now, redirect to checkout
        window.location.href = data.checkoutUrl || `/bookings/${bookingId}/payment`
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'resident_artist':
        return 'bg-green-100 text-green-800'
      case 'staff':
        return 'bg-blue-100 text-blue-800'
      case 'member':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'resident_artist':
        return 'Resident Artist'
      case 'staff':
        return 'Staff'
      case 'member':
        return 'Member'
      default:
        return 'Public'
    }
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Role Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Your Role:</span>
          <Badge className={getRoleBadgeColor(userRole)}>
            {getRoleDisplayName(userRole)}
          </Badge>
        </div>

        {/* Pricing Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Resource:</span>
            <span className="text-sm font-medium">{resourceName}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className={`text-lg font-bold ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
              {isFree ? 'FREE' : formatAmount(amount)}
            </span>
          </div>
        </div>

        {/* Free Access Notice */}
        {isFree && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-800">
              No payment required for {getRoleDisplayName(userRole).toLowerCase()}s
            </span>
          </div>
        )}

        {/* Payment Method Selection (for paid bookings) */}
        {!isFree && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method:</label>
            <div className="flex gap-2">
              <Button
                variant={paymentMethod === 'checkout' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('checkout')}
                className="flex-1"
              >
                Stripe Checkout
              </Button>
              <Button
                variant={paymentMethod === 'payment_intent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('payment_intent')}
                className="flex-1"
              >
                Payment Form
              </Button>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : isFree ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Booking
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay {formatAmount(amount)}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <AlertCircle className="w-3 h-3" />
          <span>Secure payment powered by Stripe</span>
        </div>
      </CardContent>
    </Card>
  )
}
