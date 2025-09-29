'use client'

import { useState } from 'react'
import { BarChart3, Vote, CheckCircle, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface PollProps {
  question: string
  options: string[]
  pollId?: string
  className?: string
  onVote?: (optionIndex: number) => void
  showResults?: boolean
  totalVotes?: number
  results?: number[]
}

export function Poll({ 
  question, 
  options, 
  pollId,
  className,
  onVote,
  showResults = false,
  totalVotes = 0,
  results = []
}: PollProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [localResults, setLocalResults] = useState<number[]>(results)
  const [localTotalVotes, setLocalTotalVotes] = useState(totalVotes)

  const handleOptionSelect = (optionIndex: number) => {
    if (hasVoted) return
    setSelectedOption(optionIndex)
  }

  const handleVote = () => {
    if (selectedOption === null) return
    
    // Update local results
    const newResults = [...localResults]
    newResults[selectedOption] = (newResults[selectedOption] || 0) + 1
    setLocalResults(newResults)
    setLocalTotalVotes(localTotalVotes + 1)
    
    setHasVoted(true)
    onVote?.(selectedOption)
  }

  const getPercentage = (votes: number) => {
    if (localTotalVotes === 0) return 0
    return Math.round((votes / localTotalVotes) * 100)
  }

  const getWinningOption = () => {
    if (localResults.length === 0) return -1
    return localResults.indexOf(Math.max(...localResults))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
            <Vote className="w-4 h-4 text-lime-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Community Poll</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-lg font-medium text-white mb-4">
            {question}
          </h4>
          
          <div className="space-y-3">
            {options.map((option, index) => {
              const votes = localResults[index] || 0
              const percentage = getPercentage(votes)
              const isWinning = getWinningOption() === index && localTotalVotes > 0
              const isSelected = selectedOption === index
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={hasVoted}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all duration-200 relative overflow-hidden",
                    "hover:border-lime-500/50 hover:bg-white/5",
                    "focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:ring-offset-2 focus:ring-offset-black",
                    isSelected && !hasVoted && "border-lime-500/50 bg-lime-500/10",
                    hasVoted && isWinning && "border-lime-500/50 bg-lime-500/10",
                    hasVoted && "cursor-default"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Progress Bar Background */}
                  {hasVoted && (
                    <motion.div
                      className="absolute inset-0 bg-lime-500/10"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        isSelected && !hasVoted && "border-lime-400 bg-lime-400 text-black",
                        hasVoted && isWinning && "border-lime-400 bg-lime-400 text-black",
                        !isSelected && "border-gray-500"
                      )}>
                        {isSelected && !hasVoted && <CheckCircle className="w-3 h-3" />}
                        {hasVoted && isWinning && <CheckCircle className="w-3 h-3" />}
                      </div>
                      
                      <span className={cn(
                        "text-gray-200 font-medium",
                        isSelected && !hasVoted && "text-lime-400",
                        hasVoted && isWinning && "text-lime-400"
                      )}>
                        {option}
                      </span>
                    </div>
                    
                    {hasVoted && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {votes} vote{votes !== 1 ? 's' : ''}
                        </span>
                        <span className="text-sm font-medium text-white">
                          {percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
        
        {/* Vote Count */}
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400"
          >
            <Users className="w-4 h-4" />
            <span>{localTotalVotes} total vote{localTotalVotes !== 1 ? 's' : ''}</span>
          </motion.div>
        )}
        
        {/* Actions */}
        <AnimatePresence>
          {!hasVoted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-end"
            >
              <button
                onClick={handleVote}
                disabled={selectedOption === null}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium transition-colors",
                  selectedOption !== null
                    ? "bg-lime-500 hover:bg-lime-600 text-black"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                )}
              >
                Vote
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Results Summary */}
        {hasVoted && localTotalVotes > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-lime-400" />
              <h5 className="font-medium text-white">Poll Results</h5>
            </div>
            
            <div className="space-y-2">
              {options.map((option, index) => {
                const votes = localResults[index] || 0
                const percentage = getPercentage(votes)
                const isWinning = getWinningOption() === index
                
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className={cn(
                      "text-gray-300",
                      isWinning && "text-lime-400 font-medium"
                    )}>
                      {option}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/10 rounded-full h-2">
                        <motion.div
                          className={cn(
                            "h-2 rounded-full",
                            isWinning ? "bg-lime-400" : "bg-gray-500"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 1 + index * 0.1 }}
                        />
                      </div>
                      <span className="text-gray-400 w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 