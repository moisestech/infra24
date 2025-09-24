'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Save, RotateCcw, Eye } from 'lucide-react';
import { OrganizationTheme, THEME_TEMPLATES, generateThemeCSS } from '@/lib/themes';
import { toast } from 'sonner';

interface ThemeManagerProps {
  organizationId: string;
  organizationSlug: string;
  organizationName: string;
}

export function ThemeManager({ organizationId, organizationSlug, organizationName }: ThemeManagerProps) {
  const [theme, setTheme] = useState<OrganizationTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Load current theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch(`/api/organizations/${organizationId}/theme`);
        if (response.ok) {
          const data = await response.json();
          setTheme(data.theme);
        } else {
          console.error('Failed to load theme');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [organizationId]);

  // Save theme
  const saveTheme = async () => {
    if (!theme) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/organizations/${organizationId}/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      });

      if (response.ok) {
        toast.success('Theme saved successfully!');
      } else {
        toast.error('Failed to save theme');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Error saving theme');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default theme
  const resetTheme = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/organizations/${organizationId}/theme`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setTheme(data.theme);
        toast.success('Theme reset to default!');
      } else {
        toast.error('Failed to reset theme');
      }
    } catch (error) {
      console.error('Error resetting theme:', error);
      toast.error('Error resetting theme');
    } finally {
      setSaving(false);
    }
  };

  // Apply template theme
  const applyTemplate = (templateSlug: string) => {
    const template = THEME_TEMPLATES[templateSlug];
    if (template && theme) {
      const newTheme: OrganizationTheme = {
        ...template,
        id: theme.id,
        name: theme.name,
        createdAt: theme.createdAt,
        updatedAt: new Date().toISOString(),
      } as OrganizationTheme;
      setTheme(newTheme);
      toast.success(`Applied ${template.name} template`);
    }
  };

  // Update color
  const updateColor = (colorKey: keyof OrganizationTheme['colors'], value: string) => {
    if (theme) {
      setTheme({
        ...theme,
        colors: {
          ...theme.colors,
          [colorKey]: value,
        },
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Generate preview CSS
  const previewCSS = theme ? generateThemeCSS(theme) : '';

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!theme) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Failed to load theme</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Manager
              </CardTitle>
              <CardDescription>
                Customize the visual appearance for {organizationName}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? 'Hide' : 'Show'} Preview
              </Button>
              <Button
                variant="outline"
                onClick={resetTheme}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={saveTheme}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Theme'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Preview CSS */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>Theme Preview</CardTitle>
            <CardDescription>
              This CSS will be applied to your organization's pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{previewCSS}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>
                Define the primary colors for your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={key}
                        type="color"
                        value={value}
                        onChange={(e) => updateColor(key as keyof OrganizationTheme['colors'], e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={value}
                        onChange={(e) => updateColor(key as keyof OrganizationTheme['colors'], e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Templates</CardTitle>
              <CardDescription>
                Choose from predefined theme templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(THEME_TEMPLATES).map(([slug, template]) => (
                  <Card key={slug} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="secondary">{slug}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: template.colors?.primary }}
                            title="Primary"
                          />
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: template.colors?.secondary }}
                            title="Secondary"
                          />
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: template.colors?.accent }}
                            title="Accent"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => applyTemplate(slug)}
                          className="w-full"
                        >
                          Apply Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Configure fonts and text styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input
                    id="fontFamily"
                    value={theme.typography.fontFamily}
                    onChange={(e) => setTheme({
                      ...theme,
                      typography: {
                        ...theme.typography,
                        fontFamily: e.target.value,
                      },
                      updatedAt: new Date().toISOString(),
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headingFont">Heading Font</Label>
                  <Input
                    id="headingFont"
                    value={theme.typography.headingFont}
                    onChange={(e) => setTheme({
                      ...theme,
                      typography: {
                        ...theme.typography,
                        headingFont: e.target.value,
                      },
                      updatedAt: new Date().toISOString(),
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
