'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CircleChartData {
  label: string
  value: number
  color: string
  percentage: number
}

interface CircleChartProps {
  data: CircleChartData[]
  size?: number
  strokeWidth?: number
  className?: string
  showLabels?: boolean
  showPercentages?: boolean
  onSegmentClick?: (segment: CircleChartData) => void
}

export function CircleChart({
  data,
  size = 300,
  strokeWidth = 20,
  className,
  showLabels = true,
  showPercentages = true,
  onSegmentClick
}: CircleChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, item) => sum + item.value, 0)

  let cumulativePercentage = 0

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((segment, index) => {
          const segmentPercentage = (segment.value / total) * 100
          const strokeDasharray = `${(segmentPercentage / 100) * circumference} ${circumference}`
          const strokeDashoffset = -((cumulativePercentage / 100) * circumference)
          
          cumulativePercentage += segmentPercentage

          return (
            <motion.circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={onSegmentClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
              onClick={() => onSegmentClick?.(segment)}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeInOut" }}
            />
          )
        })}
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Categories
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLabels && (
        <div className="mt-6 space-y-2">
          {data.map((segment, index) => (
            <motion.div
              key={segment.label}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {segment.label}
                </span>
              </div>
              {showPercentages && (
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {segment.percentage.toFixed(1)}%
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

interface PhaseProgressProps {
  phases: {
    name: string
    budget: number
    spent: number
    color: string
    startDate: string
    endDate: string
  }[]
  totalBudget: number
  className?: string
}

export function PhaseProgress({ phases, totalBudget, className }: PhaseProgressProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {phases.map((phase, index) => {
        const spentPercentage = (phase.spent / phase.budget) * 100
        const budgetPercentage = (phase.budget / totalBudget) * 100

        return (
          <motion.div
            key={phase.name}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {phase.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {phase.startDate} - {phase.endDate}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ${phase.spent.toLocaleString()} / ${phase.budget.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {spentPercentage.toFixed(1)}% spent
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full"
                style={{ backgroundColor: phase.color }}
                initial={{ width: 0 }}
                animate={{ width: `${spentPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Budget: {budgetPercentage.toFixed(1)}% of total</span>
              <span>Remaining: ${(phase.budget - phase.spent).toLocaleString()}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
