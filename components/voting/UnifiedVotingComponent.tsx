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
import { cn } from '@/lib/utils';

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
    'General': 'text-muted-foreground',
  };

  return colorMap[category] || (type === 'workshop' ? 'text-blue-500 dark:text-blue-400' : 'text-muted-foreground');
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

  const tenantPrimary = tenantConfig?.theme?.primaryColor || '#47abc4';

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
      case 'critical':
        return 'text-destructive';
      case 'high':
        return 'text-orange-500 dark:text-orange-400';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400';
      case 'low':
        return 'text-emerald-600 dark:text-emerald-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const voteButtonClass =
    'text-xs px-2 py-1 h-8 border-primary/25 bg-background text-primary hover:bg-primary/15 hover:border-primary/50 dark:border-primary/35 dark:hover:bg-primary/20 dark:hover:border-primary/55';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-b-primary"
          aria-hidden
        />
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
        <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
          <TitleIcon className="mr-2 inline-block h-8 w-8 text-primary" style={{ color: tenantPrimary }} aria-hidden />
          {title}
        </h3>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{description}</p>
      </motion.div>

      {hasVoted ? (
        <motion.div variants={itemVariants} className="py-8 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-6 py-3 dark:bg-primary/15 dark:border-primary/25">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" style={{ color: tenantPrimary }} aria-hidden />
            <span className="font-medium text-primary" style={{ color: tenantPrimary }}>
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
                <Card
                  className={cn(
                    'group h-full cursor-pointer border-2 border-primary/15 bg-card text-card-foreground transition-all duration-300',
                    'hover:border-primary/45 hover:bg-accent/35 hover:shadow-lg dark:border-primary/25 dark:hover:border-primary/50 dark:hover:bg-accent/25'
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="rounded-lg bg-primary/10 p-2 dark:bg-primary/15">
                            <CategoryIcon className={cn('h-5 w-5', categoryColor)} aria-hidden />
                          </div>
                          <CardTitle className="text-base font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary">
                            {option.name}
                          </CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
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
                      <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <CardDescription className="line-clamp-2 text-sm">{option.description}</CardDescription>
                      </div>
                    )}

                    {/* Cost for equipment */}
                    {type === 'equipment' && option.estimated_cost && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          <span>Est. ${option.estimated_cost.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {/* Vote counts - shown on hover */}
                    {voteCounts.total > 0 && (
                      <div className="space-y-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {voteCounts.total} votes
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {voteCounts.weight} pts
                          </span>
                        </div>
                        
                        <div className="flex gap-1 text-xs text-muted-foreground">
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
                        className={cn('transition-colors', voteButtonClass)}
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Want
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVote(option.id, 'need')}
                        disabled={isVoting || !user}
                        className={cn('transition-colors', voteButtonClass)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Need
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVote(option.id, 'priority')}
                        disabled={isVoting || !user}
                        className={cn('transition-colors', voteButtonClass)}
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

