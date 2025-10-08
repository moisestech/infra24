'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { SubmissionFormBuilder } from '@/components/submissions/SubmissionFormBuilder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Users, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

interface SubmissionForm {
  id: string;
  title: string;
  description?: string;
  type: string;
  category?: string;
  is_public: boolean;
  is_active: boolean;
  submission_deadline?: string;
  created_at: string;
  _count?: {
    submissions: number;
  };
}

interface Submission {
  id: string;
  title: string;
  status: string;
  priority: string;
  submitter_name?: string;
  submitter_email?: string;
  created_at: string;
  submitted_at?: string;
  reviewed_at?: string;
  submission_forms: {
    title: string;
    type: string;
  };
}

function OoliteSubmissionsPageContent() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [forms, setForms] = useState<SubmissionForm[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState<'forms' | 'submissions'>('forms');

  useEffect(() => {
    if (tenantId === 'oolite') {
      fetchData();
    }
  }, [tenantId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch forms
      const formsResponse = await fetch('/api/organizations/oolite/submission-forms');
      if (formsResponse.ok) {
        const formsData = await formsResponse.json();
        setForms(formsData.forms || []);
      }

      // Fetch submissions
      const submissionsResponse = await fetch('/api/organizations/oolite/submissions');
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        setSubmissions(submissionsData.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'needs_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-green-100 text-green-800';
      case 'content': return 'bg-blue-100 text-blue-800';
      case 'feedback': return 'bg-yellow-100 text-yellow-800';
      case 'survey': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (tenantId !== 'oolite') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible for Oolite Arts.</p>
        </div>
      </div>
    );
  }

  if (showFormBuilder) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-gray-50">
          <UnifiedNavigation config={ooliteConfig} userRole="admin" />
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setShowFormBuilder(false)}
                className="mb-4"
              >
                ← Back to Submissions
              </Button>
            </div>
            <SubmissionFormBuilder
              organizationId="oolite"
              onFormSaved={(form) => {
                setShowFormBuilder(false);
                fetchData();
              }}
              onCancel={() => setShowFormBuilder(false)}
            />
          </div>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submission Management</h1>
            <p className="text-gray-600">
              Manage forms and review submissions for Oolite Arts
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Forms</p>
                    <p className="text-2xl font-bold">{forms.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold">{submissions.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Under Review</p>
                    <p className="text-2xl font-bold">
                      {submissions.filter(s => s.status === 'under_review').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold">
                      {submissions.filter(s => s.status === 'approved').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('forms')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'forms'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Forms ({forms.length})
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'submissions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Submissions ({submissions.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Forms Tab */}
          {activeTab === 'forms' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Submission Forms</h2>
                <Button onClick={() => setShowFormBuilder(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Form
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                  <Card key={form.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{form.title}</CardTitle>
                          {form.description && (
                            <CardDescription className="mt-1">
                              {form.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getTypeColor(form.type)}>
                            {form.type}
                          </Badge>
                          {form.is_public && (
                            <Badge variant="default">Public</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600">
                        {form.category && (
                          <div>Category: {form.category}</div>
                        )}
                        {form.submission_deadline && (
                          <div>
                            Deadline: {new Date(form.submission_deadline).toLocaleDateString()}
                          </div>
                        )}
                        <div>
                          Created: {new Date(form.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {forms.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
                  <p className="text-gray-600 mb-4">Create your first submission form to start collecting applications and proposals.</p>
                  <Button onClick={() => setShowFormBuilder(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Form
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Recent Submissions</h2>
              
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{submission.title}</h3>
                            <Badge className={getStatusColor(submission.status)}>
                              {submission.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(submission.priority)}>
                              {submission.priority}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Form: {submission.submission_forms.title}</div>
                            {submission.submitter_name && (
                              <div>Submitter: {submission.submitter_name}</div>
                            )}
                            {submission.submitter_email && (
                              <div>Email: {submission.submitter_email}</div>
                            )}
                            <div>
                              Submitted: {submission.submitted_at 
                                ? new Date(submission.submitted_at).toLocaleString()
                                : new Date(submission.created_at).toLocaleString()
                              }
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {submissions.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                  <p className="text-gray-600">Submissions will appear here once people start filling out your forms.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TenantLayout>
  );
}

export default function OoliteSubmissionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OoliteSubmissionsPageContent />
    </Suspense>
  )
}

