'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy,
  Clock,
  Target
} from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation?: string
  points?: number
}

interface QuizProps {
  questions: QuizQuestion[]
  title?: string
  description?: string
  timeLimit?: number // in seconds
  passingScore?: number // percentage
  showExplanations?: boolean
  allowRetake?: boolean
  onComplete?: (score: number, totalQuestions: number) => void
}

export function Quiz({ 
  questions, 
  title = "Quiz",
  description,
  timeLimit,
  passingScore = 70,
  showExplanations = true,
  allowRetake = true,
  onComplete
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    if (timeLimit && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLimit, isCompleted])

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date())
    }
  }, [startTime])

  const handleAnswer = (answerIndex: number) => {
    if (showResult || isCompleted) return
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
    const finalScore = (score / questions.length) * 100
    onComplete?.(finalScore, questions.length)
  }

  const retakeQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnswers([])
    setScore(0)
    setIsCompleted(false)
    setTimeLeft(timeLimit || 0)
    setStartTime(new Date())
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= passingScore) return 'text-green-400'
    if (score >= passingScore * 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= passingScore) return 'border-green-400 text-green-400'
    if (score >= passingScore * 0.7) return 'border-yellow-400 text-yellow-400'
    return 'border-red-400 text-red-400'
  }

  if (isCompleted) {
    const finalScore = (score / questions.length) * 100
    const passed = finalScore >= passingScore
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {passed ? (
              <Trophy className="w-16 h-16 text-yellow-400" />
            ) : (
              <Target className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <CardTitle className={`text-2xl ${passed ? 'text-green-400' : 'text-red-400'}`}>
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </CardTitle>
          <p className="text-gray-400">
            {passed 
              ? 'You passed the quiz!' 
              : `You need ${passingScore}% to pass. Try again!`
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(finalScore)}`}>
              {Math.round(finalScore)}%
            </div>
            <p className="text-gray-400">
              {score} out of {questions.length} questions correct
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Score</span>
              <Badge className={getScoreBadgeColor(finalScore)}>
                {Math.round(finalScore)}%
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Passing Score</span>
              <span className="text-[#00ff00]">{passingScore}%</span>
            </div>
            
            {startTime && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Time Taken</span>
                <span className="text-[#00ff00]">
                  {Math.round((new Date().getTime() - startTime.getTime()) / 1000)}s
                </span>
              </div>
            )}
          </div>
          
          {allowRetake && (
            <Button 
              onClick={retakeQuiz} 
              className="w-full bg-[#00ff00] text-black hover:bg-[#00ff00]/90"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl">{title}</CardTitle>
          {timeLimit && (
            <Badge variant="default" className="border-[#00ff00] text-[#00ff00]">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(timeLeft)}
            </Badge>
          )}
        </div>
        
        {description && (
          <p className="text-gray-400 text-sm">{description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-[#00ff00]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
        </div>
      </CardHeader>
      
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">
              {question.question}
            </h3>
            
            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto p-4 ${
                    showResult 
                      ? index === question.correct
                        ? 'bg-green-600 border-green-600 text-white'
                        : selectedAnswer === index
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-gray-600 text-gray-300'
                      : selectedAnswer === index
                      ? 'bg-[#00ff00] text-black border-[#00ff00]'
                      : 'border-gray-600 text-gray-300 hover:border-[#00ff00]'
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    {showResult && (
                      <div className="w-5 h-5 flex items-center justify-center">
                        {index === question.correct ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="w-5 h-5 text-white" />
                        ) : null}
                      </div>
                    )}
                    <span className="flex-1">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            {showResult && showExplanations && question.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <h4 className="font-semibold text-[#00ff00] mb-2">Explanation:</h4>
                <p className="text-gray-300 text-sm">{question.explanation}</p>
              </motion.div>
            )}
            
            {showResult && (
              <Button 
                onClick={nextQuestion} 
                className="w-full bg-[#00ff00] text-black hover:bg-[#00ff00]/90"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
