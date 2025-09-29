'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, Clock, ArrowRight } from 'lucide-react'

// FeatureList Component
interface FeatureListProps {
  title?: string
  items: Array<{
    text: string
    description?: string
    icon?: ReactNode
  }>
  className?: string
}

export function FeatureList({ title, items, className = '' }: FeatureListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {item.icon || <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {item.text}
              </h4>
              {item.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// TimelineList Component
interface TimelineListProps {
  title?: string
  items: Array<{
    title: string
    description?: string
    time?: string
    status?: 'completed' | 'current' | 'upcoming'
  }>
  className?: string
}

export function TimelineList({ title, items, className = '' }: TimelineListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                item.status === 'completed' ? 'bg-green-500' :
                item.status === 'current' ? 'bg-blue-500' :
                'bg-gray-300'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {item.description}
                </p>
              )}
              {item.time && (
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ChecklistList Component
interface ChecklistListProps {
  title?: string
  items: Array<{
    text: string
    completed?: boolean
  }>
  className?: string
}

export function ChecklistList({ title, items, className = '' }: ChecklistListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              item.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300'
            }`}>
              {item.completed && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span className={`${
              item.completed 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// AccordionList Component
interface AccordionListProps {
  title?: string
  items: Array<{
    title: string
    content: ReactNode
    defaultOpen?: boolean
  }>
  className?: string
}

export function AccordionList({ title, items, className = '' }: AccordionListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {item.title}
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ComparisonList Component
interface ComparisonListProps {
  title?: string
  items: Array<{
    feature: string
    option1: string
    option2: string
  }>
  className?: string
}

export function ComparisonList({ title, items, className = '' }: ComparisonListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium">Feature</th>
              <th className="text-left p-2 font-medium">Option 1</th>
              <th className="text-left p-2 font-medium">Option 2</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 font-medium">{item.feature}</td>
                <td className="p-2">{item.option1}</td>
                <td className="p-2">{item.option2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ProcessList Component
interface ProcessListProps {
  title?: string
  steps: Array<{
    title: string
    description?: string
    number: number
  }>
  className?: string
}

export function ProcessList({ title, steps, className = '' }: ProcessListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                {step.number}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {step.title}
              </h4>
              {step.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
