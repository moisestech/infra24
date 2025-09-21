'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/components/tenant/TenantProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';

export default function SurveyThankYouPage() {
  const router = useRouter();
  const { tenantConfig } = useTenant();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Your survey response has been submitted successfully. 
              We appreciate you taking the time to share your feedback with{' '}
              {tenantConfig?.name || 'our organization'}.
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Your responses help us improve our programs and services. 
                We'll review your feedback and use it to make meaningful changes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  onClick={() => router.push(`/o/${tenantConfig?.slug}/surveys`)}
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Surveys
                </Button>
                
                <Button 
                  onClick={() => router.push(`/o/${tenantConfig?.slug}`)}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
