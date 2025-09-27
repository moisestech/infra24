'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTenant } from '@/components/tenant/TenantProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Clock,
  Users,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { SurveyForm } from '@/components/survey/SurveyForm';
import { OrganizationThemeProvider } from '@/components/carousel/OrganizationThemeContext';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  form_schema: any;
  submission_settings: any;
  is_active: boolean;
  is_public: boolean;
  requires_authentication: boolean;
  max_submissions_per_user?: number;
  submission_deadline?: string;
  review_deadline?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function SurveyPage() {
  const params = useParams()
  const slug = params.slug as string
  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    const slug = params.slug as string
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  };
  const router = useRouter();
  const { tenantId, tenantConfig } = useTenant();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const surveyId = params.id as string;

  useEffect(() => {
    if (surveyId && tenantId) {
      fetchSurvey();
    }
  }, [surveyId, tenantId]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/surveys/${surveyId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Survey not found');
        } else if (response.status === 403) {
          setError('You do not have access to this survey');
        } else {
          setError('Failed to load survey');
        }
        return;
      }
      
      const data = await response.json();
      setSurvey(data.survey);
    } catch (err) {
      console.error('Error fetching survey:', err);
      setError('Failed to load survey');
    } finally {
      setLoading(false);
    }
  };


  const isSurveyOpen = () => {
    if (!survey) return false;
    const now = new Date();
    
    // For submission_forms table structure
    if (survey.submission_deadline) {
      const deadline = new Date(survey.submission_deadline);
      if (now > deadline) return false;
    }
    
    // Check if survey is active (submission_forms uses is_active boolean)
    return survey.is_active !== false;
  };


  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Survey</h2>
          <p className="text-gray-600 mb-4">{error || 'Survey not found'}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!isSurveyOpen()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Survey Not Available</h2>
          <p className="text-gray-600 mb-4">
            {!survey.is_active ? 'This survey has been closed.' :
             survey.submission_deadline && new Date(survey.submission_deadline) < new Date() ? 'This survey has passed its deadline.' :
             'This survey is not currently available.'}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Transform survey schema to match SurveyForm interface
  const surveyForForm = {
    id: survey.id,
    title: survey.title,
    description: survey.description,
    category: survey.category || 'general',
    form_schema: survey.form_schema,
    submission_settings: survey.submission_settings
  };

  const orgSlug = params.slug as string;

  return (
    <OrganizationThemeProvider initialSlug={orgSlug}>
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Surveys
        </Button>
        
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
            <p className="text-gray-600 text-lg">{survey.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={survey.is_active ? 'success' : 'error'}>
              {survey.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="info">
              {survey.category || 'Custom'}
            </Badge>
          </div>
        </div>

        {/* Survey Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Deadline: {formatDate(survey.submission_deadline || null)}</span>
              </div>
              <div className="flex items-center gap-2">
                {survey.is_public ? (
                  <>
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span>Private</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {survey.requires_authentication ? (
                  <>
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Requires Login</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>No Login Required</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Survey Form */}
      <Card>
        <CardContent className="p-6">
          <SurveyForm
            survey={surveyForForm}
            organization={{
              id: survey?.organization?.id || '',
              name: survey?.organization?.name || '',
              slug: survey?.organization?.slug || ''
            }}
          />
        </CardContent>
      </Card>
      </div>
    </OrganizationThemeProvider>
  );
}
