'use client'

import React from 'react'
import { 
  FeatureList, 
  TimelineList, 
  ChecklistList, 
  AccordionList, 
  ComparisonList,
  ProcessList,
  createListItem,
  createProcessStep,
  createComparisonItem
} from '../ui/ListComponents'
import { Star, Zap, Target, Clock, Users, Settings, CheckCircle, AlertTriangle, Info } from 'lucide-react'

export function ListComponentsExample() {
  // Example data for different list types
  const featureItems = [
    createListItem("3-5 second video clips", "Perfect length for social media", "info"),
    createListItem("720p resolution at 24fps", "High quality output", "success"),
    createListItem("Text-to-video generation", "No reference images needed", "success"),
    createListItem("Research only", "Not released to the public", "warning")
  ]

  const timelineItems = [
    createListItem("2017: Deepfake Emergence", "First AI video manipulation", undefined, { date: "2017" }),
    createListItem("2022: Text-to-Video Breakthrough", "Meta and Google release first models", undefined, { date: "2022" }),
    createListItem("2023: Open Source Revolution", "ModelScope makes AI video accessible", undefined, { date: "2023" }),
    createListItem("2024-2025: Quality Revolution", "Sora and advanced models", undefined, { date: "2024-2025" })
  ]

  const checklistItems = [
    createListItem("Define your vision and requirements", "Set clear objectives and target audience"),
    createListItem("Craft effective prompts", "Use specific language and technical details"),
    createListItem("Generate multiple variations", "Create different versions to compare"),
    createListItem("Evaluate quality and identify improvements", "Assess output and note what works"),
    createListItem("Iterate based on results", "Refine prompts and parameters")
  ]

  const processSteps = [
    createProcessStep(
      "Planning",
      "Define your vision and requirements",
      ["Set clear objectives", "Define target audience", "Plan resources needed"],
      "5-10 min",
      ["Start with a clear concept", "Consider technical limitations"]
    ),
    createProcessStep(
      "Prompting",
      "Craft effective prompts for your desired outcome",
      ["Use specific language", "Include technical details", "Test variations"],
      "10-15 min",
      ["Be specific about motion", "Include style references"]
    ),
    createProcessStep(
      "Generation",
      "Create multiple variations and iterations",
      ["Generate multiple versions", "Try different parameters", "Document results"],
      "15-30 min",
      ["Generate more than you need", "Save successful prompts"]
    ),
    createProcessStep(
      "Evaluation",
      "Assess quality and identify improvements",
      ["Review output quality", "Identify issues", "Note what works"],
      "5-10 min",
      ["Be critical but constructive", "Look for patterns"]
    ),
    createProcessStep(
      "Refinement",
      "Iterate based on results and feedback",
      ["Adjust prompts", "Modify parameters", "Generate new versions"],
      "10-20 min",
      ["Make incremental changes", "Test one variable at a time"]
    )
  ]

  const comparisonItems = [
    createComparisonItem(
      "Runway ML",
      {
        "Free Tier": true,
        "Max Duration": "4 seconds",
        "Resolution": "720p",
        "Text-to-Video": true,
        "Image-to-Video": true,
        "Motion Brush": true,
        "Price": "$12/month"
      },
      "Professional creative tool",
      { price: "$12/month", category: "Professional", rating: 4.5 }
    ),
    createComparisonItem(
      "Pika Labs",
      {
        "Free Tier": true,
        "Max Duration": "3 seconds", 
        "Resolution": "576p",
        "Text-to-Video": true,
        "Image-to-Video": true,
        "Motion Brush": false,
        "Price": "$10/month"
      },
      "Community-driven platform",
      { price: "$10/month", category: "Community", rating: 4.2 }
    ),
    createComparisonItem(
      "Luma Dream Machine",
      {
        "Free Tier": true,
        "Max Duration": "5 seconds",
        "Resolution": "720p", 
        "Text-to-Video": true,
        "Image-to-Video": true,
        "Motion Brush": false,
        "Price": "$8/month"
      },
      "Accessible AI video tool",
      { price: "$8/month", category: "Accessible", rating: 4.0 }
    )
  ]

  const comparisonFeatures = [
    { key: "Free Tier", label: "Free Tier Available", type: "boolean" as const },
    { key: "Max Duration", label: "Maximum Duration", type: "text" as const },
    { key: "Resolution", label: "Output Resolution", type: "text" as const },
    { key: "Text-to-Video", label: "Text-to-Video", type: "boolean" as const },
    { key: "Image-to-Video", label: "Image-to-Video", type: "boolean" as const },
    { key: "Motion Brush", label: "Motion Brush", type: "boolean" as const },
    { key: "Price", label: "Starting Price", type: "text" as const }
  ]

  return (
    <div className="space-y-12 p-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-4">Interactive List Components Examples</h1>
        <p className="text-gray-400">These components make content more engaging and interactive across all courses.</p>
      </div>

      {/* Feature List Example */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Feature List</h2>
        <FeatureList 
          title="Key Features"
          subtitle="Essential capabilities of the system"
          items={featureItems}
        />
      </section>

      {/* Timeline List Example */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Timeline List</h2>
        <TimelineList 
          title="AI Video Evolution Timeline"
          subtitle="Major milestones in AI video development"
          items={timelineItems}
        />
      </section>

      {/* Checklist List Example */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Interactive Checklist</h2>
        <ChecklistList 
          title="AI Video Creation Checklist"
          subtitle="Follow these steps to create your first AI video"
          items={checklistItems}
        />
      </section>

      {/* Process List Example */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Process List (Horizontal)</h2>
        <ProcessList 
          title="The 5-Step AI Video Process"
          subtitle="A systematic approach to creating AI videos"
          variant="horizontal"
          interactive={true}
          showProgress={true}
          steps={processSteps}
        />
      </section>

      {/* Process List Accordion Example */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Process List (Accordion)</h2>
        <ProcessList 
          title="Detailed Process Steps"
          subtitle="Click to expand each step for more details"
          variant="accordion"
          interactive={true}
          steps={processSteps}
        />
      </section>

      {/* Comparison List Example */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Platform Comparison</h2>
        <ComparisonList 
          title="AI Video Platform Comparison"
          subtitle="Compare features across different platforms"
          items={comparisonItems}
          features={comparisonFeatures}
          highlightDifferences={true}
        />
      </section>

      {/* Accordion List Example */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Accordion List</h2>
        <AccordionList 
          title="Technical Details"
          subtitle="Click to expand each section"
          collapsible={true}
          items={[
            createListItem("Architecture", "How the system is built", "info"),
            createListItem("Performance", "Speed and efficiency metrics", "success"),
            createListItem("Limitations", "Current constraints and issues", "warning"),
            createListItem("Future Roadmap", "Planned improvements and features", "info")
          ]}
        />
      </section>
    </div>
  )
}
