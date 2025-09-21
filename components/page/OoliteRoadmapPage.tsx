'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  Map, 
  Calendar, 
  Target, 
  Users, 
  Zap, 
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Building,
  GraduationCap,
  Globe,
  Heart
} from 'lucide-react';

export default function OoliteRoadmapPage() {
  const [selectedPhase, setSelectedPhase] = useState('foundation');
  const [selectedView, setSelectedView] = useState('timeline');

  const roadmapPhases = [
    {
      id: 'foundation',
      title: 'Foundation Phase',
      duration: 'Months 1-3',
      status: 'completed',
      description: 'Establishing infrastructure and initial programming',
      color: 'bg-green-100 text-green-800',
      icon: Building
    },
    {
      id: 'growth',
      title: 'Growth Phase',
      duration: 'Months 4-6',
      status: 'in-progress',
      description: 'Expanding programs and building community',
      color: 'bg-blue-100 text-blue-800',
      icon: TrendingUp
    },
    {
      id: 'scale',
      title: 'Scale Phase',
      duration: 'Months 7-9',
      status: 'planned',
      description: 'Scaling impact and preparing for transition',
      color: 'bg-purple-100 text-purple-800',
      icon: Zap
    },
    {
      id: 'transition',
      title: 'Transition Phase',
      duration: 'Months 10-12',
      status: 'planned',
      description: 'Transitioning to Little River and sustainability',
      color: 'bg-orange-100 text-orange-800',
      icon: Globe
    }
  ];

  const kpis = [
    {
      title: 'Program Capacity',
      current: 120,
      target: 300,
      unit: 'participants',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Workshop Completion',
      current: 15,
      target: 30,
      unit: 'sessions',
      trend: 'up',
      icon: GraduationCap
    },
    {
      title: 'Community Partnerships',
      current: 5,
      target: 8,
      unit: 'organizations',
      trend: 'up',
      icon: Heart
    },
    {
      title: 'Staff Adoption',
      current: 85,
      target: 95,
      unit: '%',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  const currentPhase = roadmapPhases.find(phase => phase.id === selectedPhase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Digital Arts Lab Roadmap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Strategic roadmap for the 12-month Digital Arts Lab program at Oolite Arts, 
            from foundation to sustainable transition.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setSelectedView('timeline')}
            >
              <Map className="w-5 h-5 mr-2" />
              Timeline View
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setSelectedView('phases')}
            >
              <Target className="w-5 h-5 mr-2" />
              Phase Details
            </Button>
          </div>
        </div>

        {/* KPI Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Current Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              const progress = (kpi.current / kpi.target) * 100;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {progress.toFixed(0)}%
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {kpi.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current</span>
                        <span className="font-semibold">{kpi.current} {kpi.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Target</span>
                        <span className="font-semibold">{kpi.target} {kpi.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Phase Navigation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Roadmap Phases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapPhases.map((phase) => {
              const Icon = phase.icon;
              return (
                <Card 
                  key={phase.id}
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    selectedPhase === phase.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPhase(phase.id)}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="mb-4">
                      <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {phase.duration}
                    </p>
                    <Badge className={phase.color}>
                      {phase.status.replace('-', ' ')}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Phase Details */}
        {currentPhase && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {currentPhase.title} Details
            </h2>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{currentPhase.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {currentPhase.description}
                    </CardDescription>
                  </div>
                  <Badge className={currentPhase.color}>
                    {currentPhase.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Key Objectives
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Establish digital infrastructure and equipment
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Launch initial workshop series
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Build community partnerships
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Success Metrics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">85%</div>
                        <div className="text-sm text-gray-600">Staff Adoption</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">120</div>
                        <div className="text-sm text-gray-600">Participants</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">15</div>
                        <div className="text-sm text-gray-600">Workshops</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in building Miami's premier digital arts community. 
            Explore our programs and become part of the future of creative technology.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-5 h-5 mr-2" />
              Download Roadmap
            </Button>
            <Button size="lg" variant="outline">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}