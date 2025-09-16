'use client';

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfDay, addMinutes, isSameDay, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
// } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Check,
  X,
  Loader2,
  Info,
  MapPin,
  Star
} from 'lucide-react';

// Types
interface StudioProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  claimed: boolean;
  studioNumber: string;
  specialties?: string[];
  bio?: string;
  website?: string;
}

interface BookingSlot {
  start: Date;
  end: Date;
  available: boolean;
}

interface BookingDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: StudioProfile | null;
  orgSlug: string;
  currentUser?: {
    id: string | null;
    name?: string | null;
    email?: string | null;
  };
  onBooked?: () => void;
}

// Time slot generation
const generateTimeSlots = (date: Date): BookingSlot[] => {
  const slots: BookingSlot[] = [];
  const startOfDayTime = startOfDay(date);
  
  // Generate 30-minute slots from 9 AM to 6 PM
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const start = addMinutes(startOfDayTime, hour * 60 + minute);
      const end = addMinutes(start, 30);
      
      slots.push({
        start,
        end,
        available: true // In real implementation, check against existing bookings
      });
    }
  }
  
  return slots;
};

// Main Booking Drawer Component
export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  open,
  onOpenChange,
  profile,
  orgSlug,
  currentUser,
  onBooked
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (open) {
      setSelectedDate(new Date());
      setSelectedSlot(null);
      setName(currentUser?.name || '');
      setEmail(currentUser?.email || '');
      setNotes('');
      setError(null);
    }
  }, [open, currentUser]);

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));

  // Generate time slots for selected date
  const timeSlots = generateTimeSlots(selectedDate);

  const handleSubmit = async () => {
    if (!selectedSlot || !profile) return;

    setLoading(true);
    setError(null);

    try {
      // Get organization ID
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', orgSlug)
        .single();

      if (orgError || !org) {
        throw new Error('Organization not found');
      }

      // Create booking
      const bookingData = {
        org_id: org.id,
        resource_id: profile.id,
        resource_label: `Studio ${profile.studioNumber} - ${profile.name}`,
        date: format(selectedSlot.start, 'yyyy-MM-dd'),
        start_at: selectedSlot.start.toISOString(),
        end_at: selectedSlot.end.toISOString(),
        status: 'pending',
        booker_clerk_id: currentUser?.id,
        booker_name: name,
        booker_email: email,
        metadata: {
          notes: notes || null,
          studio_number: profile.studioNumber,
          artist_name: profile.name
        }
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      // Success
      onBooked?.();
      onOpenChange(false);
      
      // Show success message (you could use a toast here)
      alert('Booking request submitted successfully!');
      
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const disabled = !selectedSlot || !name || !email || loading;

  if (!profile) return null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile.avatarUrl || undefined} />
                <AvatarFallback>
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Book Studio Visit</h2>
                <p className="text-gray-600">
                  Schedule a visit with {profile.name} at Studio {profile.studioNumber}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

        <div className="space-y-6 py-6">
          {/* Artist Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-medium">Studio {profile.studioNumber}</h3>
                <p className="text-sm text-gray-600">{profile.name}</p>
                {profile.specialties && profile.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Select Date</Label>
            <div className="grid grid-cols-7 gap-2">
              {availableDates.slice(0, 14).map((date) => (
                <Button
                  key={date.toISOString()}
                  variant={isSameDay(date, selectedDate) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  className="h-10 text-xs"
                >
                  <div className="text-center">
                    <div>{format(date, 'EEE')}</div>
                    <div className="font-medium">{format(date, 'd')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Available Times - {format(selectedDate, 'EEEE, MMMM d')}
            </Label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {timeSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedSlot === slot ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className="h-10 text-xs"
                >
                  {format(slot.start, 'h:mm a')}
                </Button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Your Information</Label>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-2 items-center">
                <User className="w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Your name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email"
                  placeholder="you@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Textarea 
                placeholder="Notes for the artist (optional)" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Booking Summary */}
          {selectedSlot && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(selectedSlot.start, 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {format(selectedSlot.start, 'h:mm a')} - {format(selectedSlot.end, 'h:mm a')}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Studio {profile.studioNumber} with {profile.name}
                </div>
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="text-xs text-muted-foreground flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0"/>
            <span>
              By booking you agree to the venue policies. Cancellations may require 24h notice. 
              The artist will be notified of your booking request and will confirm availability.
            </span>
          </div>
        </div>

          <div className="flex items-center justify-end gap-2 pt-6 border-t">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="gap-2">
              <X className="w-4 h-4"/> Cancel
            </Button>
            <Button 
              disabled={disabled} 
              onClick={handleSubmit} 
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin"/>
              ) : (
                <Check className="w-4 h-4"/>
              )}
              {selectedSlot ? `Book ${format(selectedSlot.start, 'h:mm a')}` : 'Select Time'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDrawer;
