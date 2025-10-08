'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ThemeManager } from '@/components/admin/ThemeManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Organization {
  id: string;
  name: string;
  slug: string;
  theme?: any;
}

export default function ThemeAdminPage() {
  const params = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const response = await fetch(`/api/organizations/by-slug/${params.slug}/public`);
        if (response.ok) {
          const data = await response.json();
          setOrganization(data.organization);
        } else {
          console.error('Failed to load organization');
        }
      } catch (error) {
        console.error('Error loading organization:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadOrganization();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500">Organization not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/o/${params.slug}/admin`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Theme Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Customize the visual appearance for {organization.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="default">{organization.slug}</Badge>
            <Badge variant="default">{organization.name}</Badge>
          </div>
        </div>

        {/* Theme Manager */}
        <ThemeManager
          organizationId={organization.id}
          organizationSlug={organization.slug}
          organizationName={organization.name}
        />
      </div>
    </div>
  );
}
