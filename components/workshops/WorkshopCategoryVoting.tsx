'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, CheckCircle, Palette, Camera, Video, Mic, Box, Brain, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useTenant } from '@/components/tenant/TenantProvider';

interface WorkshopCategoryVotingProps {
  organizationId: string;
  userId?: string;
}

interface CategoryVote {
  category: string;
  votes: number;
  hasVoted: boolean;
}

const WORKSHOP_CATEGORIES = [
  { name: 'Digital Marketing', icon: Target, description: 'SEO, social media, content marketing', color: 'text-red-500' },
  { name: 'Web Development', icon: Users, description: 'Frontend, backend, full-stack development', color: 'text-blue-500' },
  { name: 'Data Science', icon: Brain, description: 'Analytics, machine learning, visualization', color: 'text-purple-500' },
  { name: 'Design', icon: Palette, description: 'UI/UX, graphic design, branding', color: 'text-pink-500' },
  { name: 'Photography', icon: Camera, description: 'Digital photography, editing, composition', color: 'text-green-500' },
  { name: 'Video Production', icon: Video, description: 'Filming, editing, post-production', color: 'text-orange-500' },
  { name: 'Audio Production', icon: Mic, description: 'Recording, mixing, sound design', color: 'text-yellow-500' },
  { name: '3D Modeling', icon: Box, description: 'Blender, Maya, 3D printing', color: 'text-indigo-500' },
  { name: 'AI & Machine Learning', icon: Brain, description: 'Neural networks, deep learning, AI tools', color: 'text-cyan-500' }
];

export default function WorkshopCategoryVoting({ organizationId, userId }: WorkshopCategoryVotingProps) {
  const { theme } = useTheme();
  const { tenantConfig } = useTenant();

  // Oolite theme colors
  const ooliteColors = {
    primary: '#47abc4',
    primaryLight: '#6bb8d1',
    primaryDark: '#3a8ba3',
    primaryAlpha: 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
  };
  const [categories, setCategories] = useState<CategoryVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  console.log('🗳️ WorkshopCategoryVoting component rendered')
  console.log('🗳️ organizationId:', organizationId)
  console.log('🗳️ userId:', userId)

  useEffect(() => {
    fetchCategoryVotes();
  }, [organizationId, userId]);

  const fetchCategoryVotes = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/workshop-categories/votes`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        setHasVoted(data.hasVoted || false);
      }
    } catch (error) {
      console.error('Error fetching category votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (category: string) => {
    if (!userId || hasVoted || voting) return;

    setVoting(category);
    try {
      const response = await fetch(`/api/organizations/${organizationId}/workshop-categories/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          userId,
        }),
      });

      if (response.ok) {
        setHasVoted(true);
        await fetchCategoryVotes(); // Refresh votes
      }
    } catch (error) {
      console.error('Error voting for category:', error);
    } finally {
      setVoting(null);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading voting data...
        </p>
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
        <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <Heart className="inline-block h-8 w-8 text-red-500 mr-2" />
          Help Shape Our Workshop Program
        </h3>
        <p className={`text-lg max-w-3xl mx-auto ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Vote for the workshop categories you'd like to see more of. Your input helps us prioritize 
          the most valuable learning opportunities for our community.
        </p>
      </motion.div>

      {hasVoted ? (
        <motion.div variants={itemVariants} className="text-center">
          <Card className={`max-w-md mx-auto ${
            theme === 'dark' 
              ? 'bg-green-900/20 border-green-800' 
              : 'bg-green-50 border-green-200'
          }`}>
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Thank You for Voting!
              </h4>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Your vote has been recorded. We'll use this feedback to plan future workshops.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKSHOP_CATEGORIES.map((category, index) => {
              const categoryData = categories.find(c => c.category === category.name);
              const votes = categoryData?.votes || 0;
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Card className={`cursor-pointer transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20' 
                      : 'bg-white/50 backdrop-blur-sm border-gray-200 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div 
                          className={`p-4 rounded-full transition-all duration-300 group-hover:scale-110 ${
                            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'
                          }`}
                          whileHover={{ rotate: 5 }}
                        >
                          <Icon className={`h-12 w-12 ${category.color} transition-all duration-300 group-hover:scale-110`} />
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg font-bold">{category.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {category.description}
                          </CardDescription>
                        </div>
                        <Badge variant="default" className="text-sm px-3 py-1">
                          {votes} votes
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleVote(category.name)}
                          disabled={voting === category.name || !userId}
                          className="w-full h-12 text-base font-semibold"
                          style={{
                            backgroundColor: ooliteColors.primary,
                            color: 'white',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = ooliteColors.primaryLight;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = ooliteColors.primary;
                          }}
                        >
                          {voting === category.name ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Voting...
                            </>
                          ) : (
                            <>
                              <Heart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                              <span className="group-hover:opacity-90">Vote for this category</span>
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Results Summary */}
      {categories.length > 0 && (
        <motion.div variants={itemVariants} className="mt-12">
          <h4 className={`text-xl font-semibold mb-6 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Current Voting Results
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 6)
              .map((category, index) => (
                <motion.div
                  key={category.category}
                  variants={itemVariants}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800/30 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {category.category}
                    </span>
                    <Badge variant="default" className="text-xs">
                      {category.votes} votes
                    </Badge>
                  </div>
                  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(10, (category.votes / Math.max(...categories.map(c => c.votes))) * 100)}%`
                      }}
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
