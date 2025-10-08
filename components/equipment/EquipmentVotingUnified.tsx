'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import UnifiedVotingComponent from '@/components/voting/UnifiedVotingComponent';

interface EquipmentVotingProps {
  orgId: string;
}

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
}

export default function EquipmentVotingUnified({ orgId }: EquipmentVotingProps) {
  const { user } = useUser();
  const [equipmentOptions, setEquipmentOptions] = useState<EquipmentOption[]>([]);
  const [votingResults, setVotingResults] = useState<VotingResult[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleVote = async (equipmentOptionId: string, voteType: string) => {
    if (!user) return;
    
    // Validate voteType
    if (!['want', 'need', 'priority'].includes(voteType)) {
      console.error('Invalid vote type:', voteType);
      return;
    }

    try {
      const response = await fetch(`/api/organizations/${orgId}/equipment-votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipment_option_id: equipmentOptionId,
          vote_type: voteType,
          user_id: user.id
        }),
      });

      if (response.ok) {
        // Refresh voting data
        await fetchEquipmentData();
      } else {
        const errorData = await response.json();
        console.error('Voting error:', errorData.error);
      }
    } catch (error) {
      console.error('Error voting for equipment:', error);
    }
  };

  // Map equipment options to voting results
  const optionsWithResults = equipmentOptions.map(option => {
    const result = votingResults.find(r => r.equipment_option_id === option.id);
    return {
      id: option.id,
      name: option.name,
      description: option.description,
      category: option.category,
      estimated_cost: option.estimated_cost,
      priority_level: option.priority_level,
      total_votes: result?.total_votes || 0,
      want_votes: result?.want_votes || 0,
      need_votes: result?.need_votes || 0,
      priority_votes: result?.priority_votes || 0,
      total_weight: result?.total_weight || 0,
      average_weight: result?.average_weight || 0,
      hasVoted: false // This would need to be determined based on user's votes
    };
  });

  return (
    <UnifiedVotingComponent
      orgId={orgId}
      type="equipment"
      title="Help Shape Our Digital Lab"
      description="Vote for the equipment you'd like to see in our digital lab. Your input helps us prioritize the most valuable tools for our creative community."
      icon={Zap}
      options={equipmentOptions}
      results={optionsWithResults}
      onVote={handleVote}
      onFetchData={fetchEquipmentData}
    />
  );
}

