'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Info,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mobile-optimized validation schema
const mobileBookingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title too long'),
  description: z.string().max(200, 'Description too long').optional(),
  resourceId: z.string().min(1, 'Please select a resource'),
  startDate: z.date({ message: 'Start date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.date({ message: 'End date is required' }),
  endTime: z.string().min(1, 'End time is required'),
  contactName: z.string().min(1, 'Name is required'),
  contactEmail: z.string().email('Valid email required'),
  contactPhone: z.string().optional(),
  notes: z.string().max(300, 'Notes too long').optional(),
});

type MobileBookingFormData = z.infer<typeof mobileBookingSchema>;

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  price?: number;
  currency?: string;
}

interface MobileBookingFormProps {
  resources: Resource[];
  onSubmit: (data: MobileBookingFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MobileBookingForm({ 
  resources, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: MobileBookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 'resource', title: 'Resource', icon: MapPin },
    { id: 'datetime', title: 'Date & Time', icon: Calendar },
    { id: 'details', title: 'Details', icon: User },
    { id: 'contact', title: 'Contact', icon: Mail },
    { id: 'confirm', title: 'Confirm', icon: CheckCircle },
  ];

  const form = useForm<MobileBookingFormData>({
    resolver: zodResolver(mobileBookingSchema),
    defaultValues: {
      title: '',
      description: '',
      resourceId: '',
      startDate: new Date(),
      startTime: '09:00',
      endDate: new Date(),
      endTime: '10:00',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: '',
    }
  });

  const { watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: MobileBookingFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              isActive && "bg-primary text-primary-foreground",
              isCompleted && "bg-green-500 text-white",
              !isActive && !isCompleted && "bg-gray-200 text-gray-600"
            )}>
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 mx-2",
                isCompleted ? "bg-green-500" : "bg-gray-200"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderResourceSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Select Resource</h3>
        <p className="text-sm text-gray-600">Choose what you'd like to book</p>
      </div>
      
      <div className="space-y-3">
        {resources.map((resource) => (
          <Card 
            key={resource.id}
            className={cn(
              "cursor-pointer transition-all",
              watchedValues.resourceId === resource.id 
                ? "ring-2 ring-primary bg-primary/5" 
                : "hover:shadow-md"
            )}
            onClick={() => setValue('resourceId', resource.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{resource.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {resource.type}
                    </Badge>
                    {resource.price && (
                      <Badge variant="secondary" className="text-xs">
                        ${resource.price} {resource.currency?.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
                {watchedValues.resourceId === resource.id && (
                  <CheckCircle className="w-5 h-5 text-primary ml-2" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {errors.resourceId && (
        <p className="text-sm text-red-600">{errors.resourceId.message}</p>
      )}
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Date & Time</h3>
        <p className="text-sm text-gray-600">When would you like to book?</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <Input
            type="date"
            value={format(watchedValues.startDate, 'yyyy-MM-dd')}
            onChange={(e) => setValue('startDate', new Date(e.target.value))}
            className="w-full"
          />
          {errors.startDate && (
            <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <Input
              type="time"
              value={watchedValues.startTime}
              onChange={(e) => setValue('startTime', e.target.value)}
              className="w-full"
            />
            {errors.startTime && (
              <p className="text-sm text-red-600 mt-1">{errors.startTime.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">End Time</label>
            <Input
              type="time"
              value={watchedValues.endTime}
              onChange={(e) => setValue('endTime', e.target.value)}
              className="w-full"
            />
            {errors.endTime && (
              <p className="text-sm text-red-600 mt-1">{errors.endTime.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Booking Details</h3>
        <p className="text-sm text-gray-600">Tell us about your booking</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            placeholder="e.g., Studio Session"
            value={watchedValues.title}
            onChange={(e) => setValue('title', e.target.value)}
            className="w-full"
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <Textarea
            placeholder="Brief description of your booking..."
            value={watchedValues.description}
            onChange={(e) => setValue('description', e.target.value)}
            className="w-full min-h-[80px]"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {watchedValues.description?.length || 0}/200 characters
          </p>
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
          <Textarea
            placeholder="Any special requests or information..."
            value={watchedValues.notes}
            onChange={(e) => setValue('notes', e.target.value)}
            className="w-full min-h-[60px]"
            maxLength={300}
          />
          <p className="text-xs text-gray-500 mt-1">
            {watchedValues.notes?.length || 0}/300 characters
          </p>
          {errors.notes && (
            <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContactForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <p className="text-sm text-gray-600">How can we reach you?</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <Input
            placeholder="Your full name"
            value={watchedValues.contactName}
            onChange={(e) => setValue('contactName', e.target.value)}
            className="w-full"
          />
          {errors.contactName && (
            <p className="text-sm text-red-600 mt-1">{errors.contactName.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={watchedValues.contactEmail}
            onChange={(e) => setValue('contactEmail', e.target.value)}
            className="w-full"
          />
          {errors.contactEmail && (
            <p className="text-sm text-red-600 mt-1">{errors.contactEmail.message}</p>
          )}
        </div>
        
      </div>
    </div>
  );

  const renderConfirmation = () => {
    const selectedResource = resources.find(r => r.id === watchedValues.resourceId);
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">Confirm Booking</h3>
          <p className="text-sm text-gray-600">Review your booking details</p>
        </div>
        
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <h4 className="font-medium text-sm">Resource</h4>
              <p className="text-sm text-gray-600">{selectedResource?.title}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Date & Time</h4>
              <p className="text-sm text-gray-600">
                {format(watchedValues.startDate, 'MMM dd, yyyy')} at {watchedValues.startTime} - {watchedValues.endTime}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Title</h4>
              <p className="text-sm text-gray-600">{watchedValues.title}</p>
            </div>
            
            {watchedValues.description && (
              <div>
                <h4 className="font-medium text-sm">Description</h4>
                <p className="text-sm text-gray-600">{watchedValues.description}</p>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-sm">Contact</h4>
              <p className="text-sm text-gray-600">{watchedValues.contactName}</p>
              <p className="text-sm text-gray-600">{watchedValues.contactEmail}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderResourceSelection();
      case 1: return renderDateTimeSelection();
      case 2: return renderDetailsForm();
      case 3: return renderContactForm();
      case 4: return renderConfirmation();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-sm mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={currentStep === 0 ? onCancel : handlePrevious}
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold">Book Resource</h2>
          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex-1 min-h-[44px]"
              disabled={isLoading}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              className="flex-1 min-h-[44px]"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
