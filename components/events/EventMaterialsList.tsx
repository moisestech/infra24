'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  File, 
  Image, 
  Video, 
  FileText, 
  Download, 
  Eye,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventMaterial {
  id: string;
  event_id: string;
  organization_id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
  file_size_bytes?: number;
  uploaded_by: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface EventMaterialsListProps {
  eventId: string;
  organizationId: string;
  maxItems?: number;
  showTitle?: boolean;
  className?: string;
}

export function EventMaterialsList({ 
  eventId, 
  organizationId, 
  maxItems = 5,
  showTitle = true,
  className 
}: EventMaterialsListProps) {
  const [materials, setMaterials] = useState<EventMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}/materials`);
      if (response.ok) {
        const data = await response.json();
        setMaterials(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [eventId]);

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  // Get file type color
  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'image': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'document': return 'bg-orange-100 text-orange-800';
      case 'archive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const displayMaterials = materials.slice(0, maxItems);

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-500">Loading materials...</div>
        </CardContent>
      </Card>
    );
  }

  if (materials.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        {showTitle && (
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <File className="w-5 h-5" />
              Event Materials
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-500">
            <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No materials available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <File className="w-5 h-5" />
            Event Materials
            {materials.length > maxItems && (
              <Badge variant="secondary" className="ml-2">
                {materials.length} total
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayMaterials.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getFileTypeIcon(material.file_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{material.title}</h4>
                    <Badge className={cn('text-xs', getFileTypeColor(material.file_type))}>
                      {material.file_type}
                    </Badge>
                    {material.is_public && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Public
                      </Badge>
                    )}
                  </div>
                  
                  {material.description && (
                    <p className="text-xs text-gray-600 truncate">{material.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span>{new Date(material.created_at).toLocaleDateString()}</span>
                    {material.file_size_bytes && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(material.file_size_bytes)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(material.file_url, '_blank')}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = material.file_url;
                    link.download = material.title;
                    link.click();
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {materials.length > maxItems && (
            <div className="text-center pt-2">
              <Button variant="outline" size="sm" className="text-xs">
                View All Materials ({materials.length})
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
