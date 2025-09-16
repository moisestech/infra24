'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Video, 
  Image, 
  Music, 
  Code, 
  Palette,
  Zap,
  BookOpen,
  ExternalLink,
  Play,
  Download
} from 'lucide-react';

export default function OoliteAIToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const aiTools = [
    {
      id: 'runway-ml',
      name: 'RunwayML',
      category: 'Video Generation',
      description: 'AI-powered video editing and generation platform',
      icon: Video,
      features: ['Text-to-video', 'Video editing', 'Motion graphics'],
      pricing: 'Freemium',
      difficulty: 'Intermediate',
      useCases: ['Short films', 'Social media content', 'Art installations']
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      category: 'Image Generation',
      description: 'AI art generator for creating stunning visuals',
      icon: Image,
      features: ['Text-to-image', 'Style transfer', 'High resolution'],
      pricing: 'Subscription',
      difficulty: 'Beginner',
      useCases: ['Concept art', 'Illustrations', 'Digital paintings']
    },
    {
      id: 'stable-diffusion',
      name: 'Stable Diffusion',
      category: 'Image Generation',
      description: 'Open-source AI image generation model',
      icon: Palette,
      features: ['Local processing', 'Custom models', 'ControlNet'],
      pricing: 'Free',
      difficulty: 'Advanced',
      useCases: ['Custom art', 'Research', 'Commercial projects']
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      category: 'Text Generation',
      description: 'AI assistant for creative writing and ideation',
      icon: Brain,
      features: ['Creative writing', 'Brainstorming', 'Code generation'],
      pricing: 'Freemium',
      difficulty: 'Beginner',
      useCases: ['Story development', 'Script writing', 'Concept exploration']
    },
    {
      id: 'suno-ai',
      name: 'Suno AI',
      category: 'Music Generation',
      description: 'AI music creation and composition tool',
      icon: Music,
      features: ['Text-to-music', 'Style variety', 'High quality'],
      pricing: 'Freemium',
      difficulty: 'Beginner',
      useCases: ['Background music', 'Soundtracks', 'Experimental music']
    },
    {
      id: 'github-copilot',
      name: 'GitHub Copilot',
      category: 'Code Generation',
      description: 'AI pair programmer for creative coding',
      icon: Code,
      features: ['Code completion', 'Function generation', 'Learning'],
      pricing: 'Subscription',
      difficulty: 'Intermediate',
      useCases: ['Creative coding', 'Interactive art', 'Prototyping']
    }
  ];

  const categories = ['all', 'Video Generation', 'Image Generation', 'Text Generation', 'Music Generation', 'Code Generation'];

  const filteredTools = selectedCategory === 'all' 
    ? aiTools 
    : aiTools.filter(tool => tool.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Tools for Digital Artists
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover and master cutting-edge AI tools that are revolutionizing digital art creation. 
            From video generation to music composition, explore the future of creative technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Explore by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{tool.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {tool.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Difficulty */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">Pricing: </span>
                        <Badge variant="outline">{tool.pricing}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Level: </span>
                        <Badge className={getDifficultyColor(tool.difficulty)}>
                          {tool.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Use Cases</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tool.useCases.map((useCase, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-purple-500" />
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button size="sm" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Getting Started Section */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Getting Started with AI Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Play className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start with Tutorials</h3>
              <p className="text-gray-600">
                Follow our step-by-step guides to get familiar with each tool's interface and capabilities.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Download className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download Resources</h3>
              <p className="text-gray-600">
                Access our curated collection of prompts, templates, and project files to jumpstart your creativity.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Join the Community</h3>
              <p className="text-gray-600">
                Connect with other digital artists and share your AI-generated creations in our community space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}