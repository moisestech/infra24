'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, DollarSign, MessageCircle, Eye, EyeOff, Repeat } from 'lucide-react';

interface DonateButtonProps {
  organizationId: string;
  organizationName: string;
  onDonationSubmitted?: (donation: any) => void;
  className?: string;
}

const DONATION_AMOUNTS = [25, 50, 100, 250, 500];

export function DonateButton({ 
  organizationId, 
  organizationName, 
  onDonationSubmitted,
  className 
}: DonateButtonProps) {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleSubmitDonation = async () => {
    if (amount <= 0) return;

    setIsSubmitting(true);
    try {
      const donationData = {
        org_id: organizationId,
        amount: amount,
        message: message.trim() || null,
        is_anonymous: isAnonymous,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency : null,
        status: 'pending'
      };

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        const result = await response.json();
        onDonationSubmitted?.(result);
        setShowDonationModal(false);
        setMessage('');
        setAmount(50);
        setCustomAmount('');
        setIsAnonymous(false);
        setIsRecurring(false);
        setRecurringFrequency('monthly');
      } else {
        console.error('Failed to submit donation');
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowDonationModal(true)}
        className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white ${className}`}
        size="sm"
      >
        <Heart className="w-4 h-4 mr-2" />
        Donate to {organizationName}
      </Button>

      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-blue-500" />
                Donate to {organizationName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount Selection */}
              <div>
                <Label className="text-sm font-medium">Amount</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {DONATION_AMOUNTS.map((donationAmount) => (
                    <Button
                      key={donationAmount}
                      variant={amount === donationAmount ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAmountSelect(donationAmount)}
                      className="relative"
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      {donationAmount}
                    </Button>
                  ))}
                </div>
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Recurring Donation */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                  />
                  <Label htmlFor="recurring" className="text-sm">
                    <div className="flex items-center">
                      <Repeat className="w-4 h-4 mr-1" />
                      Make this a recurring donation
                    </div>
                  </Label>
                </div>
                
                {isRecurring && (
                  <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="donation-message" className="text-sm font-medium">
                  Message (optional)
                </Label>
                <Textarea
                  id="donation-message"
                  placeholder="Leave a message for the organization..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {message.length}/500 characters
                </p>
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  <div className="flex items-center">
                    {isAnonymous ? (
                      <EyeOff className="w-4 h-4 mr-1" />
                    ) : (
                      <Eye className="w-4 h-4 mr-1" />
                    )}
                    Donate anonymously
                  </div>
                </Label>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {isRecurring ? `${recurringFrequency} donation:` : 'Total:'}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ${amount.toFixed(2)}
                  </span>
                </div>
                {isRecurring && (
                  <p className="text-xs text-gray-500 mt-1">
                    This donation will be charged {recurringFrequency} until cancelled.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDonationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitDonation}
                  disabled={amount <= 0 || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isSubmitting ? 'Processing...' : `Donate $${amount.toFixed(2)}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
