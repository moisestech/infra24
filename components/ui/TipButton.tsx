'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Heart, DollarSign, MessageCircle, Eye, EyeOff } from 'lucide-react';

interface TipButtonProps {
  artistId: string;
  artistName: string;
  organizationId: string;
  onTipSubmitted?: (tip: any) => void;
  className?: string;
}

const TIP_AMOUNTS = [5, 10, 25, 50, 100];

export function TipButton({ 
  artistId, 
  artistName, 
  organizationId, 
  onTipSubmitted,
  className 
}: TipButtonProps) {
  const [showTipModal, setShowTipModal] = useState(false);
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
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

  const handleSubmitTip = async () => {
    if (amount <= 0) return;

    setIsSubmitting(true);
    try {
      const tipData = {
        org_id: organizationId,
        artist_profile_id: artistId,
        amount: amount,
        message: message.trim() || null,
        is_anonymous: isAnonymous,
        status: 'pending'
      };

      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipData),
      });

      if (response.ok) {
        const result = await response.json();
        onTipSubmitted?.(result);
        setShowTipModal(false);
        setMessage('');
        setAmount(10);
        setCustomAmount('');
        setIsAnonymous(false);
      } else {
        console.error('Failed to submit tip');
      }
    } catch (error) {
      console.error('Error submitting tip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowTipModal(true)}
        className={`bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white ${className}`}
        size="sm"
      >
        <Heart className="w-4 h-4 mr-2" />
        Tip {artistName}
      </Button>

      {showTipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                Tip {artistName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount Selection */}
              <div>
                <Label className="text-sm font-medium">Amount</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {TIP_AMOUNTS.map((tipAmount) => (
                    <Button
                      key={tipAmount}
                      variant={amount === tipAmount ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAmountSelect(tipAmount)}
                      className="relative"
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      {tipAmount}
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

              {/* Message */}
              <div>
                <Label htmlFor="tip-message" className="text-sm font-medium">
                  Message (optional)
                </Label>
                <Textarea
                  id="tip-message"
                  placeholder="Leave a message for the artist..."
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
                    Send anonymously
                  </div>
                </Label>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTipModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitTip}
                  disabled={amount <= 0 || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                >
                  {isSubmitting ? 'Processing...' : `Tip $${amount.toFixed(2)}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

