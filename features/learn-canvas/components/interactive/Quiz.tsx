'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Brain, Trophy, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QuizQuestion {
  q: string
  choices: string[]
  answerIdx: number
  explanation?: string
}

interface QuizProps {
  questions: QuizQuestion[]
  title?: string
  className?: string
  onComplete?: (score: number, total: number) => void
}

export function Quiz({ 
  questions, 
  title = "Knowledge Check", 
  className,
  onComplete
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  if (questions.length === 0) return null
  
  const currentQ = questions[currentQuestion]
  const isCorrect = selectedAnswers[currentQuestion] === currentQ.answerIdx
  const score = selectedAnswers.filter((answer, index) => answer === questions[index].answerIdx).length
  const percentage = Math.round((score / questions.length) * 100)

  const handleAnswerSelect = (choiceIndex: number) => {
    if (isSubmitted) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = choiceIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setIsSubmitted(false)
    } else {
      setShowResults(true)
      onComplete?.(score, questions.length)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswers[currentQuestion] !== undefined) {
      setIsSubmitted(true)
    }
  }

  const handleRetry = () => {
    setSelectedAnswers([])
    setCurrentQuestion(0)
    setShowResults(false)
    setIsSubmitted(false)
  }

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center",
          className
        )}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-lime-500/20 rounded-full flex items-center justify-center">
            {percentage >= 80 ? (
              <Trophy className="w-8 h-8 text-lime-400" />
            ) : (
              <Brain className="w-8 h-8 text-yellow-400" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-white">
            {percentage >= 80 ? "Excellent!" : "Good effort!"}
          </h3>
          
          <p className="text-gray-400">
            You got {score} out of {questions.length} questions correct ({percentage}%)
          </p>
          
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className={cn(
                "h-2 rounded-full",
                percentage >= 80 ? "bg-gradient-to-r from-lime-400 to-green-400" :
                percentage >= 60 ? "bg-gradient-to-r from-yellow-400 to-orange-400" :
                "bg-gradient-to-r from-red-400 to-pink-400"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </motion.div>
    )
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-lime-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          
          <div className="text-sm text-gray-400">
            {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-lime-400 to-green-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      
      {/* Question */}
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-lg font-medium text-white mb-4">
            {currentQ.q}
          </h4>
          
          <div className="space-y-3">
            {Array.isArray(currentQ.choices) ? (
              currentQ.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isSubmitted}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all duration-200",
                    "hover:border-lime-500/50 hover:bg-white/5",
                    "focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:ring-offset-2 focus:ring-offset-black",
                    selectedAnswers[currentQuestion] === index && !isSubmitted && "border-lime-500/50 bg-lime-500/10",
                    isSubmitted && index === currentQ.answerIdx && "border-green-500/50 bg-green-500/10",
                    isSubmitted && selectedAnswers[currentQuestion] === index && index !== currentQ.answerIdx && "border-red-500/50 bg-red-500/10",
                    isSubmitted && "cursor-default"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      selectedAnswers[currentQuestion] === index && !isSubmitted && "border-lime-400 bg-lime-400 text-black",
                      isSubmitted && index === currentQ.answerIdx && "border-green-400 bg-green-400 text-black",
                      isSubmitted && selectedAnswers[currentQuestion] === index && index !== currentQ.answerIdx && "border-red-400 bg-red-400 text-black",
                      selectedAnswers[currentQuestion] !== index && "border-gray-500"
                    )}>
                      {isSubmitted && index === currentQ.answerIdx && <CheckCircle className="w-3 h-3" />}
                      {isSubmitted && selectedAnswers[currentQuestion] === index && index !== currentQ.answerIdx && <XCircle className="w-3 h-3" />}
                    </div>
                    <span className={cn(
                      "text-gray-200",
                      selectedAnswers[currentQuestion] === index && !isSubmitted && "text-lime-400",
                      isSubmitted && index === currentQ.answerIdx && "text-green-400 font-medium",
                      isSubmitted && selectedAnswers[currentQuestion] === index && index !== currentQ.answerIdx && "text-red-400"
                    )}>
                      {choice}
                    </span>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="text-gray-400 italic">Open-ended question. Please reflect or answer in your notes.</div>
            )}
          </div>
        </div>
        
        {/* Explanation */}
        <AnimatePresence>
          {isSubmitted && currentQ.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <h5 className="font-medium text-white mb-2">Explanation</h5>
              <p className="text-sm text-gray-300">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Actions */}
        <div className="flex justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-colors",
                selectedAnswers[currentQuestion] !== undefined
                  ? "bg-lime-500 hover:bg-lime-600 text-black"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              )}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-lime-500 hover:bg-lime-600 rounded-lg font-medium text-black transition-colors"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
} 