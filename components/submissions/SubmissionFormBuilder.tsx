'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Eye, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'url' | 'date' | 'file';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

interface SubmissionFormBuilderProps {
  organizationId: string;
  formId?: string;
  onFormSaved?: (form: any) => void;
  onCancel?: () => void;
  className?: string;
}

export function SubmissionFormBuilder({ 
  organizationId, 
  formId, 
  onFormSaved, 
  onCancel,
  className 
}: SubmissionFormBuilderProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'application' as 'application' | 'proposal' | 'content' | 'feedback' | 'survey' | 'custom',
    category: '',
    is_public: false,
    requires_authentication: true,
    max_submissions_per_user: null as number | null,
    submission_deadline: '',
    review_deadline: ''
  });

  const [fields, setFields] = useState<FormField[]>([
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'Enter your email'
    }
  ]);

  const [editingField, setEditingField] = useState<number | null>(null);
  const [newField, setNewField] = useState<Partial<FormField>>({
    name: '',
    type: 'text',
    label: '',
    required: false,
    placeholder: ''
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'url', label: 'URL' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File Upload' }
  ];

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addField = () => {
    if (!newField.name || !newField.label) {
      alert('Please fill in field name and label');
      return;
    }

    // Check for duplicate field names
    if (fields.some(f => f.name === newField.name)) {
      alert('Field name already exists');
      return;
    }

    const field: FormField = {
      name: newField.name,
      type: newField.type as any,
      label: newField.label,
      required: newField.required || false,
      placeholder: newField.placeholder,
      options: newField.type === 'select' || newField.type === 'radio' || newField.type === 'checkbox' 
        ? ['Option 1', 'Option 2'] 
        : undefined
    };

    setFields(prev => [...prev, field]);
    setNewField({
      name: '',
      type: 'text',
      label: '',
      required: false,
      placeholder: ''
    });
  };

  const updateField = (index: number, field: FormField) => {
    setFields(prev => prev.map((f, i) => i === index ? field : f));
    setEditingField(null);
  };

  const deleteField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newFields.length) {
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
      setFields(newFields);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || fields.length === 0) {
      alert('Please fill in form title and add at least one field');
      return;
    }

    try {
      const formSchema = {
        fields: fields.map(field => ({
          name: field.name,
          type: field.type,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
          options: field.options,
          validation: field.validation
        }))
      };

      const response = await fetch(`/api/organizations/${organizationId}/submission-forms`, {
        method: formId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          form_schema: formSchema,
          validation_rules: {},
          submission_settings: {
            max_submissions_per_user: formData.max_submissions_per_user,
            submission_deadline: formData.submission_deadline,
            review_deadline: formData.review_deadline
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onFormSaved?.(result.form);
        alert('Form saved successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form');
    }
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Form Builder</CardTitle>
          <CardDescription>
            Create a custom submission form for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormDataChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleFormDataChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="application">Application</option>
                  <option value="proposal">Proposal</option>
                  <option value="content">Content</option>
                  <option value="feedback">Feedback</option>
                  <option value="survey">Survey</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleFormDataChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Residency, Workshop, Exhibition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Submissions per User
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_submissions_per_user || ''}
                  onChange={(e) => handleFormDataChange('max_submissions_per_user', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormDataChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what this form is for..."
              />
            </div>

            {/* Form Settings */}
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => handleFormDataChange('is_public', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Public form (accessible to non-members)</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.requires_authentication}
                  onChange={(e) => handleFormDataChange('requires_authentication', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Requires authentication</span>
              </label>
            </div>

            {/* Form Fields */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
              
              {/* Existing Fields */}
              <div className="space-y-3 mb-6">
                {fields.map((field, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{field.type}</Badge>
                        <span className="font-medium">{field.label}</span>
                        {field.required && <Badge className="bg-red-100 text-red-800">Required</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingField(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => deleteField(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Field name: <code>{field.name}</code>
                      {field.placeholder && ` • Placeholder: "${field.placeholder}"`}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add New Field */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h4 className="font-medium mb-3">Add New Field</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Field name (e.g., phone_number)"
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Field label (e.g., Phone Number)"
                    value={newField.label}
                    onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as any }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newField.required || false}
                        onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                        className="mr-1"
                      />
                      <span className="text-sm">Required</span>
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addField}
                      className="ml-auto"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Placeholder text (optional)"
                  value={newField.placeholder || ''}
                  onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
