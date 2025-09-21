'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Users, Globe, Clock, Smartphone, Shield, Plus, Trash2, Send } from 'lucide-react';

interface Recipient {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
}

interface SurveyInvitationFormProps {
  surveyId: string;
  surveyTitle: string;
  organizationName: string;
  onInvitationsSent?: (results: any) => void;
}

export function SurveyInvitationForm({ 
  surveyId, 
  surveyTitle, 
  organizationName,
  onInvitationsSent 
}: SurveyInvitationFormProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: '', firstName: '', lastName: '', role: '', department: '' }
  ]);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [sendIndividually, setSendIndividually] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addRecipient = () => {
    setRecipients([...recipients, { email: '', firstName: '', lastName: '', role: '', department: '' }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const validateRecipients = (): boolean => {
    for (const recipient of recipients) {
      if (!recipient.email || !recipient.email.includes('@')) {
        setError('All recipients must have valid email addresses');
        return false;
      }
    }
    return true;
  };

  const sendInvitations = async () => {
    if (!validateRecipients()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/surveys/${surveyId}/invitations/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: recipients.filter(r => r.email),
          language,
          sendIndividually
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitations');
      }

      setSuccess(`Successfully sent ${result.stats.successful} out of ${result.stats.total} invitations`);
      onInvitationsSent?.(result);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitations');
    } finally {
      setIsLoading(false);
    }
  };

  const validRecipients = recipients.filter(r => r.email).length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Survey Invitations
        </CardTitle>
        <CardDescription>
          Send personalized email invitations for "{surveyTitle}" to {organizationName} members
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Language Selection */}
        <div className="space-y-2">
          <Label htmlFor="language">Email Language</Label>
          <Select value={language} onValueChange={(value: 'en' | 'es') => setLanguage(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recipients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Recipients ({validRecipients})</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRecipient}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Recipient
            </Button>
          </div>

          <div className="space-y-3">
            {recipients.map((recipient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 border rounded-lg">
                <div className="md:col-span-2">
                  <Label htmlFor={`email-${index}`}>Email *</Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="user@example.com"
                    value={recipient.email}
                    onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`firstName-${index}`}>First Name</Label>
                  <Input
                    id={`firstName-${index}`}
                    placeholder="John"
                    value={recipient.firstName}
                    onChange={(e) => updateRecipient(index, 'firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                  <Input
                    id={`lastName-${index}`}
                    placeholder="Doe"
                    value={recipient.lastName}
                    onChange={(e) => updateRecipient(index, 'lastName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`role-${index}`}>Role</Label>
                  <Input
                    id={`role-${index}`}
                    placeholder="Staff"
                    value={recipient.role}
                    onChange={(e) => updateRecipient(index, 'role', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  {recipients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRecipient(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Email Features
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Estimated time: 10-15 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Mobile-friendly design</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Anonymous and secure</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Sending Options
            </h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sendIndividually}
                  onChange={(e) => setSendIndividually(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Send individually (slower, better for debugging)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Email Preview */}
        <div className="space-y-3">
          <h4 className="font-medium">Email Preview</h4>
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2 text-sm">
              <div><strong>Subject:</strong> [{organizationName}] Survey: {surveyTitle}</div>
              <div><strong>Language:</strong> {language === 'en' ? 'English' : 'Español'}</div>
              <div><strong>Recipients:</strong> {validRecipients} email{validRecipients !== 1 ? 's' : ''}</div>
              <div><strong>Features:</strong> 
                <Badge variant="default" className="ml-2">Mobile-friendly</Badge>
                <Badge variant="default" className="ml-1">Anonymous</Badge>
                <Badge variant="default" className="ml-1">Secure</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Send Button */}
        <div className="flex justify-end">
          <Button
            onClick={sendInvitations}
            disabled={isLoading || validRecipients === 0}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isLoading ? 'Sending...' : `Send ${validRecipients} Invitation${validRecipients !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

