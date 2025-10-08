'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import UnifiedVotingComponent from '@/components/voting/UnifiedVotingComponent';

interface WorkshopCategoryVotingProps {
  organizationId: string;
  userId?: string;
}

const WORKSHOP_CATEGORIES = [
  { 
    id: 'digital-marketing',
    name: 'Digital Marketing', 
    category: 'Digital Marketing',
    description: 'SEO, social media, content marketing strategies and tools'
  },
  { 
    id: 'web-development',
    name: 'Web Development', 
    category: 'Web Development',
    description: 'Frontend, backend, full-stack development and modern frameworks'
  },
  { 
    id: 'data-science',
    name: 'Data Science', 
    category: 'Data Science',
    description: 'Analytics, machine learning, visualization and data-driven insights'
  },
  { 
    id: 'design',
    name: 'Design', 
    category: 'Design',
    description: 'UI/UX, graphic design, branding and visual communication'
  },
  { 
    id: 'photography',
    name: 'Photography', 
    category: 'Photography',
    description: 'Digital photography, editing, composition and professional techniques'
  },
  { 
    id: 'video-production',
    name: 'Video Production', 
    category: 'Video Production',
    description: 'Filming, editing, post-production and storytelling'
  },
  { 
    id: 'audio-production',
    name: 'Audio Production', 
    category: 'Audio Production',
    description: 'Recording, mixing, sound design and audio engineering'
  },
  { 
    id: '3d-modeling',
    name: '3D Modeling', 
    category: '3D Modeling',
    description: 'Blender, Maya, 3D printing and digital sculpting'
  }
];

export default function WorkshopCategoryVotingUnified({ organizationId, userId }: WorkshopCategoryVotingProps) {
  const { user } = useUser();
  const [votingResults, setVotingResults] = useState<any[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  const fetchVotingData = async () => {
    try {
      // Fetch voting results
      const response = await fetch(`/api/organizations/${organizationId}/workshop-categories/votes`);
      if (response.ok) {
        const data = await response.json();
        setVotingResults(data.categories || []);
        setHasVoted(data.hasVoted || false);
      }
    } catch (error) {
      console.error('Error fetching workshop category voting data:', error);
    }
  };

  const handleVote = async (optionId: string, voteType: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/organizations/${organizationId}/workshop-categories/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: optionId,
          userId: user.id
        }),
      });

      if (response.ok) {
        setHasVoted(true);
        // Refresh voting data
        await fetchVotingData();
      } else {
        const errorData = await response.json();
        console.error('Voting error:', errorData.error);
      }
    } catch (error) {
      console.error('Error voting for workshop category:', error);
    }
  };

  // Map workshop categories to voting results
  const optionsWithResults = WORKSHOP_CATEGORIES.map(category => {
    const result = votingResults.find(r => r.category === category.id);
    return {
      ...category,
      total_votes: result?.votes || 0,
      want_votes: 0,
      need_votes: 0,
      priority_votes: 0,
      total_weight: result?.votes || 0,
      average_weight: result?.votes || 0,
      hasVoted: hasVoted
    };
  });

  return (
    <UnifiedVotingComponent
      orgId={organizationId}
      type="workshop"
      title="Help Shape Our Workshop Program"
      description="Vote for the workshop categories you'd like to see more of. Your input helps us prioritize the most valuable learning opportunities for our community."
      icon={Heart}
      options={WORKSHOP_CATEGORIES}
      results={optionsWithResults}
      onVote={handleVote}
      onFetchData={fetchVotingData}
    />
  );
}

