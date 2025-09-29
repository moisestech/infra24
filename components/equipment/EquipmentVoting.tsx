'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Heart, TrendingUp, DollarSign, Users, MessageSquare } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useTenant } from '@/components/tenant/TenantProvider';

interface EquipmentOption {
  id: string;
  name: string;
  description: string;
  category: string;
  estimated_cost: number;
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VotingResult {
  equipment_option_id: string;
  org_id: string;
  name: string;
  description: string;
  category: string;
  estimated_cost: number;
  priority_level: string;
  total_votes: number;
  want_votes: number;
  need_votes: number;
  priority_votes: number;
  total_weight: number;
  average_weight: number;
  created_at: string;
  updated_at: string;
}

interface EquipmentVotingProps {
  orgId: string;
}

export default function EquipmentVoting({ orgId }: EquipmentVotingProps) {
  const { user } = useUser();

  const { tenantConfig } = useTenant();
  
  // Use tenant theme colors with fallback to Oolite colors
  const themeColors = {
    primary: tenantConfig?.theme?.primary || '#47abc4',
    primaryLight: tenantConfig?.theme?.primaryLight || '#6bb8d1',
    primaryDark: tenantConfig?.theme?.primaryDark || '#3a8ba3',
    primaryAlpha: tenantConfig?.theme?.primaryAlpha || 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: tenantConfig?.theme?.primaryAlphaLight || 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: tenantConfig?.theme?.primaryAlphaDark || 'rgba(71, 171, 196, 0.15)',
  };
  const [equipmentOptions, setEquipmentOptions] = useState<EquipmentOption[]>([]);
  const [votingResults, setVotingResults] = useState<VotingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchEquipmentData();
  }, [orgId]);

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Equipment Voting: Fetching data for orgId:', orgId);
      
      // Fetch equipment options and voting results in parallel
      const [optionsResponse, resultsResponse] = await Promise.all([
        fetch(`/api/organizations/${orgId}/equipment-options`),
        fetch(`/api/organizations/${orgId}/equipment-votes`)
      ]);

      console.log('🔍 Equipment Voting: Options response status:', optionsResponse.status);
      console.log('🔍 Equipment Voting: Results response status:', resultsResponse.status);

      if (optionsResponse.ok) {
        const optionsData = await optionsResponse.json();
        console.log('🔍 Equipment Voting: Equipment options:', optionsData.equipmentOptions?.length || 0);
        setEquipmentOptions(optionsData.equipmentOptions || []);
      }

      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();
        console.log('🔍 Equipment Voting: Voting results:', resultsData.votingResults?.length || 0);
        setVotingResults(resultsData.votingResults || []);
      }
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (equipmentOptionId: string, voteType: 'want' | 'need' | 'priority') => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }

    try {
      setVoting(prev => ({ ...prev, [equipmentOptionId]: true }));

      const response = await fetch(`/api/organizations/${orgId}/equipment-votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipment_option_id: equipmentOptionId,
          vote_type: voteType,
          vote_weight: voteType === 'priority' ? 3 : voteType === 'need' ? 2 : 1
        }),
      });

      if (response.ok) {
        // Refresh voting results
        await fetchEquipmentData();
      } else {
        const error = await response.json();
        alert(`Error voting: ${error.error}`);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error submitting vote');
    } finally {
      setVoting(prev => ({ ...prev, [equipmentOptionId]: false }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'vr/ar': return '🥽';
      case '3d printing': return '🖨️';
      case 'audio': return '🎵';
      case 'photography': return '📸';
      case 'digital art': return '🎨';
      case 'ai/ml': return '🤖';
      case 'fabrication': return '⚙️';
      case 'software': return '💻';
      default: return '🔧';
    }
  };

  const getVoteCounts = (equipmentOptionId: string) => {
    const result = votingResults.find(r => r.equipment_option_id === equipmentOptionId);
    return {
      total: result?.total_votes || 0,
      want: result?.want_votes || 0,
      need: result?.need_votes || 0,
      priority: result?.priority_votes || 0,
      weight: result?.total_weight || 0
    };
  };

  console.log('🔍 Equipment Voting: Component render - loading:', loading, 'options:', equipmentOptions.length, 'orgId:', orgId);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Equipment Voting</h2>
          <p className="text-sm text-muted-foreground">Loading equipment options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Equipment Voting</h2>
        <p className="text-sm text-muted-foreground">
          Vote on what equipment to add to the digital lab.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {equipmentOptions.map((option) => {
          const voteCounts = getVoteCounts(option.id);
          const isVoting = voting[option.id];

          return (
            <Card key={option.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle 
                      className="text-base leading-tight transition-colors"
                      style={{ 
                        color: 'inherit'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = themeColors.primary
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'inherit'
                      }}
                    >
                      {option.name}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className="text-xs mt-1 transition-colors"
                      style={{
                        borderColor: 'inherit'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = themeColors.primaryAlpha
                        e.currentTarget.style.borderColor = themeColors.primary
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.borderColor = 'inherit'
                      }}
                    >
                      {option.category}
                    </Badge>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: themeColors.primaryAlpha }}
                    >
                      <span 
                        className="font-bold text-sm"
                        style={{ color: themeColors.primary }}
                      >
                        {getCategoryIcon(option.category)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Description - hidden by default, shown on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CardDescription className="text-sm line-clamp-2">
                    {option.description}
                  </CardDescription>
                </div>

                {/* Vote counts - shown on hover */}
                {voteCounts.total > 0 && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {voteCounts.total} votes
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {voteCounts.weight} pts
                      </span>
                    </div>
                    
                    <div className="flex gap-1 text-xs">
                      <span className="flex items-center gap-1">
                        <Heart className="w-2 h-2 text-red-500" />
                        {voteCounts.want}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-2 h-2 text-blue-500" />
                        {voteCounts.need}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-2 h-2 text-green-500" />
                        {voteCounts.priority}
                      </span>
                    </div>
                  </div>
                )}

                {/* Voting buttons - always visible but enhanced on hover */}
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(option.id, 'want')}
                    disabled={isVoting || !user}
                    className="text-xs px-2 py-1 h-8 transition-colors"
                    style={{ 
                      borderColor: 'inherit',
                      color: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = themeColors.primaryAlpha
                      e.currentTarget.style.borderColor = themeColors.primary
                      e.currentTarget.style.color = themeColors.primary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = 'inherit'
                      e.currentTarget.style.color = 'inherit'
                    }}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Want
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(option.id, 'need')}
                    disabled={isVoting || !user}
                    className="text-xs px-2 py-1 h-8 transition-colors"
                    style={{ 
                      borderColor: 'inherit',
                      color: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = themeColors.primaryAlpha
                      e.currentTarget.style.borderColor = themeColors.primary
                      e.currentTarget.style.color = themeColors.primary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = 'inherit'
                      e.currentTarget.style.color = 'inherit'
                    }}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Need
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(option.id, 'priority')}
                    disabled={isVoting || !user}
                    className="text-xs px-2 py-1 h-8 transition-colors"
                    style={{ 
                      borderColor: 'inherit',
                      color: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = themeColors.primaryAlpha
                      e.currentTarget.style.borderColor = themeColors.primary
                      e.currentTarget.style.color = themeColors.primary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = 'inherit'
                      e.currentTarget.style.color = 'inherit'
                    }}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Priority
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!user && (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            Please sign in to vote on equipment options.
          </p>
        </div>
      )}
    </div>
  );
}
