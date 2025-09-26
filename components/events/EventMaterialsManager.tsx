'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Plus,
  Search,
  Filter,
  Calendar,
  User
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

interface EventMaterialsManagerProps {
  eventId: string;
  organizationId: string;
  onMaterialUploaded?: (material: EventMaterial) => void;
  onMaterialDeleted?: (materialId: string) => void;
  className?: string;
}

export function EventMaterialsManager({ 
  eventId, 
  organizationId, 
  onMaterialUploaded,
  onMaterialDeleted,
  className 
}: EventMaterialsManagerProps) {
  const [materials, setMaterials] = useState<EventMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    isPublic: false
  });

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

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadData(prev => ({
        ...prev,
        title: file.name.split('.')[0] // Use filename as default title
      }));
    }
  };

  // Upload material
  const handleUpload = async () => {
    if (!selectedFile || !uploadData.title) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('organizationId', organizationId);
      formData.append('description', uploadData.description);
      formData.append('isPublic', uploadData.isPublic.toString());

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const mediaData = await response.json();
        
        // Create event material
        const materialResponse = await fetch(`/api/events/${eventId}/materials`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            organizationId,
            title: uploadData.title,
            description: uploadData.description,
            fileUrl: mediaData.data.file_url,
            fileType: mediaData.data.file_type,
            isPublic: uploadData.isPublic
          })
        });

        if (materialResponse.ok) {
          const materialData = await materialResponse.json();
          setMaterials(prev => [materialData.data, ...prev]);
          onMaterialUploaded?.(materialData.data);
          
          // Reset form
          setSelectedFile(null);
          setUploadData({ title: '', description: '', isPublic: false });
          setShowUploadForm(false);
        }
      }
    } catch (error) {
      console.error('Error uploading material:', error);
    } finally {
      setUploading(false);
    }
  };

  // Delete material
  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await fetch(`/api/events/${eventId}/materials?materialId=${materialId}&organizationId=${organizationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMaterials(prev => prev.filter(m => m.id !== materialId));
        onMaterialDeleted?.(materialId);
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
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

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || material.file_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center">Loading materials...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              Event Materials
            </CardTitle>
            <CardDescription>
              Manage files and resources for this event
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Material
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Upload Form */}
        {showUploadForm && (
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="font-semibold mb-4">Upload New Material</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter material title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter material description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={uploadData.isPublic}
                  onChange={(e) => setUploadData(prev => ({ ...prev, isPublic: e.target.checked }))}
                />
                <Label htmlFor="isPublic">Make this material public</Label>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || !uploadData.title || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
              <option value="archive">Archives</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Materials List */}
        <div className="space-y-4">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No materials found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowUploadForm(true)}
              >
                Upload First Material
              </Button>
            </div>
          ) : (
            filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {getFileTypeIcon(material.file_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">{material.title}</h3>
                        <Badge className={getFileTypeColor(material.file_type)}>
                          {material.file_type}
                        </Badge>
                        {material.is_public && (
                          <Badge className="bg-green-100 text-green-800">
                            Public
                          </Badge>
                        )}
                      </div>
                      
                      {material.description && (
                        <p className="text-gray-600 text-sm mb-3">{material.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(material.created_at).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {material.uploaded_by}
                        </div>
                        
                        {material.file_size_bytes && (
                          <div>
                            {formatFileSize(material.file_size_bytes)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(material.file_url, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = material.file_url;
                        link.download = material.title;
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
