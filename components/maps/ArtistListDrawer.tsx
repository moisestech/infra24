'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  MapPin, 
  ExternalLink, 
  BookOpen,
  X,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface StudioProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  claimed: boolean;
  studioNumber: string;
  specialties: string[];
  bio?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
  };
}

interface ArtistListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artists: StudioProfile[];
  searchTerm: string;
  filterType: string;
  onSelectArtist: (artist: StudioProfile) => void;
}

export const ArtistListDrawer: React.FC<ArtistListDrawerProps> = ({
  open,
  onOpenChange,
  artists,
  searchTerm,
  filterType,
  onSelectArtist
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'studio'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedArtists = React.useMemo(() => {
    let filtered = artists.filter(artist => 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.studioNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (sortBy === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else {
        aValue = a.studioNumber;
        bValue = b.studioNumber;
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [artists, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'studio') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => onOpenChange(false)}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Artists ({artists.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search artists..."
                    value={searchTerm}
                    onChange={(e) => {
                      // We'll need to handle search differently since we don't have onSearchChange
                      console.log('Search term changed:', e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="flex-1"
                  >
                    {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4 mr-1" /> : <SortDesc className="w-4 h-4 mr-1" />)}
                    Name
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort('studio')}
                    className="flex-1"
                  >
                    {sortBy === 'studio' && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4 mr-1" /> : <SortDesc className="w-4 h-4 mr-1" />)}
                    Studio
                  </Button>
                </div>
              </div>

              {/* Artist List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {filteredAndSortedArtists.map((artist) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={artist.avatarUrl || undefined} />
                              <AvatarFallback>
                                {artist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {artist.name}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {artist.studioNumber}
                                </Badge>
                              </div>
                              
                              {artist.specialties && artist.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {artist.specialties.slice(0, 3).map((specialty, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                  {artist.specialties.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{artist.specialties.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => onSelectArtist(artist)}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Profile
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => onSelectArtist(artist)}
                                >
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Book Visit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {filteredAndSortedArtists.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {searchTerm ? 'No artists found matching your search.' : 'No artists found.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
