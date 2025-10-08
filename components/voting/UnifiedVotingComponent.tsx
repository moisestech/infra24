'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Star,
  Target,
  Brain,
  Palette,
  Camera,
  Video,
  Mic,
  Box,
  Monitor,
  Printer,
  Cpu,
  Headphones,
  Wifi,
  Zap,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useTenant } from '@/components/tenant/TenantProvider';
import { motion } from 'framer-motion';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Icon mapping for different categories
const getCategoryIcon = (category: string, type: 'workshop' | 'equipment') => {
  const iconMap: { [key: string]: any } = {
    // Workshop categories
    'Digital Marketing': Target,
    'Web Development': Users,
    'Data Science': Brain,
    'Design': Palette,
    'Photography': Camera,
    'Video Production': Video,
    'Audio Production': Mic,
    '3D Modeling': Box,
    
    // Equipment categories
    'Printing': Printer,
    '3D Printing': Box,
    'Audio': Headphones,
    'Computing': Cpu,
    'Networking': Wifi,
    'VR/AR': Monitor,
    'Video': Video,
    'General': Zap
  };
  
  return iconMap[category] || (type === 'workshop' ? Star : Zap);
};

// Color mapping for categories
const getCategoryColor = (category: string, type: 'workshop' | 'equipment') => {
  const colorMap: { [key: string]: string } = {
    // Workshop categories
    'Digital Marketing': 'text-red-500',
    'Web Development': 'text-blue-500',
    'Data Science': 'text-purple-500',
    'Design': 'text-pink-500',
    'Photography': 'text-green-500',
    'Video Production': 'text-orange-500',
    'Audio Production': 'text-yellow-500',
    '3D Modeling': 'text-indigo-500',
    
    // Equipment categories
    'Printing': 'text-blue-500',
    '3D Printing': 'text-purple-500',
    'Audio': 'text-yellow-500',
    'Computing': 'text-green-500',
    'Networking': 'text-indigo-500',
    'VR/AR': 'text-pink-500',
    'Video': 'text-orange-500',
    'General': 'text-gray-500'
  };
  
  return colorMap[category] || (type === 'workshop' ? 'text-blue-500' : 'text-gray-500');
};

interface VotingOption {
  id: string;
  name: string;
  description?: string;
  category: string;
  estimated_cost?: number;
  priority_level?: 'low' | 'medium' | 'high' | 'critical';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface VotingResult {
  id: string;
  name: string;
  description?: string;
  category: string;
  estimated_cost?: number;
  total_votes: number;
  want_votes: number;
  need_votes: number;
  priority_votes: number;
  total_weight: number;
  average_weight: number;
  hasVoted?: boolean;
}

interface UnifiedVotingProps {
  orgId: string;
  type: 'workshop' | 'equipment';
  title: string;
  description: string;
  icon: any;
  options?: VotingOption[];
  results?: VotingResult[];
  onVote?: (optionId: string, voteType: string) => Promise<void>;
  onFetchData?: () => Promise<void>;
}

export default function UnifiedVotingComponent({ 
  orgId, 
  type, 
  title, 
  description, 
  icon: TitleIcon,
  options = [],
  results = [],
  onVote,
  onFetchData
}: UnifiedVotingProps) {
  const { user } = useUser();
  const { tenantConfig } = useTenant();
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<{ [key: string]: boolean }>({});
  const [hasVoted, setHasVoted] = useState(false);

  // Use tenant theme colors with fallback
  const themeColors = {
    primary: tenantConfig?.theme?.primaryColor || '#47abc4',
    primaryLight: tenantConfig?.theme?.secondaryColor || '#6bb8d1',
    primaryDark: tenantConfig?.theme?.accentColor || '#3a8ba3',
    primaryAlpha: 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
  };

  useEffect(() => {
    if (onFetchData) {
      onFetchData();
    }
    setLoading(false);
  }, [orgId, onFetchData]);

  const handleVote = async (optionId: string, voteType: 'want' | 'need' | 'priority') => {
    if (!user || !onVote) return;

    try {
      setVoting(prev => ({ ...prev, [optionId]: true }));
      await onVote(optionId, voteType);
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(prev => ({ ...prev, [optionId]: false }));
    }
  };

  const getVoteCounts = (optionId: string) => {
    const result = results.find(r => r.id === optionId);
    if (!result) return { total: 0, want: 0, need: 0, priority: 0, weight: 0 };
    
    return {
      total: result.total_votes,
      want: result.want_votes,
      need: result.need_votes,
      priority: result.priority_votes,
      weight: result.total_weight
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: themeColors.primary }}></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
          <TitleIcon className="inline-block h-8 w-8 mr-2" style={{ color: themeColors.primary }} />
          {title}
        </h3>
        <p className="text-lg max-w-3xl mx-auto text-gray-600">
          {description}
        </p>
      </motion.div>

      {hasVoted ? (
        <motion.div variants={itemVariants} className="text-center py-8">
          <div className="inline-flex items-center px-6 py-3 rounded-full" style={{ backgroundColor: themeColors.primaryAlpha }}>
            <CheckCircle className="w-5 h-5 mr-2" style={{ color: themeColors.primary }} />
            <span className="font-medium" style={{ color: themeColors.primary }}>
              Thank you for your input! Your vote has been recorded.
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option, index) => {
            const voteCounts = getVoteCounts(option.id);
            const isVoting = voting[option.id];
            const CategoryIcon = getCategoryIcon(option.category, type);
            const categoryColor = getCategoryColor(option.category, type);

            return (
              <motion.div
                key={option.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-50 cursor-pointer h-full"
                      style={{ 
                        borderColor: themeColors.primaryAlpha,
                        backgroundColor: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = themeColors.primary;
                        e.currentTarget.style.backgroundColor = themeColors.primaryAlphaLight;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = themeColors.primaryAlpha;
                        e.currentTarget.style.backgroundColor = 'white';
                      }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors.primaryAlpha }}>
                            <CategoryIcon className={`w-5 h-5 ${categoryColor}`} />
                          </div>
                          <CardTitle 
                            className="text-base leading-tight transition-colors"
                            style={{ color: 'inherit' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = themeColors.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'inherit';
                            }}
                          >
                            {option.name}
                          </CardTitle>
                        </div>
                        <Badge 
                          variant="default" 
                          className="text-xs transition-colors"
                        >
                          {option.category}
                        </Badge>
                        {option.priority_level && (
                          <Badge 
                            variant="default" 
                            className={`text-xs ml-2 ${getPriorityColor(option.priority_level)}`}
                          >
                            {option.priority_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Description */}
                    {option.description && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <CardDescription className="text-sm line-clamp-2">
                          {option.description}
                        </CardDescription>
                      </div>
                    )}

                    {/* Cost for equipment */}
                    {type === 'equipment' && option.estimated_cost && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign className="w-3 h-3" />
                          <span>Est. ${option.estimated_cost.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

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

                    {/* Voting buttons */}
                    <div className="grid grid-cols-3 gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVote(option.id, 'want')}
                        disabled={isVoting || !user}
                        className="text-xs px-2 py-1 h-8 transition-colors"
                        style={{ 
                          borderColor: themeColors.primaryAlpha,
                          color: themeColors.primary
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = themeColors.primaryAlpha;
                          e.currentTarget.style.borderColor = themeColors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = themeColors.primaryAlpha;
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
                          borderColor: themeColors.primaryAlpha,
                          color: themeColors.primary
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = themeColors.primaryAlpha;
                          e.currentTarget.style.borderColor = themeColors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = themeColors.primaryAlpha;
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
                          borderColor: themeColors.primaryAlpha,
                          color: themeColors.primary
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = themeColors.primaryAlpha;
                          e.currentTarget.style.borderColor = themeColors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = themeColors.primaryAlpha;
                        }}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Priority
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

