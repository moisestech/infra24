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

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  is_anonymous: boolean;
  language_default: string;
  languages_supported: string[];
  opens_at: string | null;
  closes_at: string | null;
  max_responses: number | null;
  max_responses_per_user: number;
  response_count: number;
  survey_schema: any;
  survey_templates?: {
    name: string;
    category: string;
  };
}

export default function SurveyPage() {
  const params = useParams();
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
    const opensAt = survey.opens_at ? new Date(survey.opens_at) : null;
    const closesAt = survey.closes_at ? new Date(survey.closes_at) : null;
    
    if (opensAt && now < opensAt) return false;
    if (closesAt && now > closesAt) return false;
    return survey.status === 'active';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'info',
      active: 'success',
      closed: 'error',
      archived: 'warning'
    } as const;

    const icons = {
      draft: <AlertCircle className="w-3 h-3" />,
      active: <CheckCircle className="w-3 h-3" />,
      closed: <XCircle className="w-3 h-3" />,
      archived: <AlertCircle className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {icons[status as keyof typeof icons]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
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
            {survey.status === 'closed' ? 'This survey has been closed.' :
             survey.opens_at && new Date(survey.opens_at) > new Date() ? 'This survey has not opened yet.' :
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
    category: survey.survey_templates?.category || 'general',
    form_schema: {
      title: survey.title,
      description: survey.description,
      questions: survey.survey_schema?.sections?.flatMap((section: any) => 
        section.questions?.map((question: any) => ({
          id: question.id,
          question: question.prompt?.en || question.prompt || question.label,
          type: question.type,
          required: question.required || false,
          choices: question.options?.map((option: any) => option.label?.en || option.label) || [],
          scale: question.scale,
          labels: question.labels,
          placeholder: question.placeholder
        })) || []
      ) || []
    },
    submission_settings: {
      allow_anonymous: survey.is_anonymous,
      require_authentication: !survey.is_anonymous,
      max_submissions_per_user: survey.max_responses_per_user
    }
  };

  return (
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
            {getStatusBadge(survey.status)}
            <Badge variant="info">
              {survey.survey_templates?.category || 'Custom'}
            </Badge>
          </div>
        </div>

        {/* Survey Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{survey.response_count} responses</span>
                {survey.max_responses && (
                  <span className="text-gray-400">/ {survey.max_responses}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Closes: {formatDate(survey.closes_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                {survey.is_anonymous ? (
                  <>
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>Anonymous</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span>Authenticated</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>Languages: {survey.languages_supported.join(', ').toUpperCase()}</span>
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
              id: tenantId || '',
              name: tenantConfig?.name || '',
              slug: tenantConfig?.slug || ''
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
