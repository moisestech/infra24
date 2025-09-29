'use client'

import { useState } from 'react'
import { Brain, MessageCircle, Send, Edit3 } from 'lucide-react'

interface ReflectionPromptProps {
  questions: string[]
  title?: string
  description?: string
  allowResponses?: boolean
  showCharacterCount?: boolean
  maxCharacters?: number
  theme?: 'default' | 'journal' | 'discussion'
  className?: string
}

export function ReflectionPrompt({
  questions,
  title = 'Reflection Questions',
  description = 'Take a moment to reflect on what you\'ve learned',
  allowResponses = true,
  showCharacterCount = true,
  maxCharacters = 500,
  theme = 'default',
  className = ''
}: ReflectionPromptProps) {
  const [responses, setResponses] = useState<string[]>(new Array(questions.length).fill(''))
  const [isExpanded, setIsExpanded] = useState<boolean[]>(new Array(questions.length).fill(false))

  // Handle response change
  const handleResponseChange = (index: number, value: string) => {
    if (value.length <= maxCharacters) {
      const newResponses = [...responses]
      newResponses[index] = value
      setResponses(newResponses)
    }
  }

  // Toggle question expansion
  const toggleExpansion = (index: number) => {
    const newExpanded = [...isExpanded]
    newExpanded[index] = !newExpanded[index]
    setIsExpanded(newExpanded)
  }

  // Get theme classes
  const getThemeClasses = () => {
    const themeConfig = {
      default: {
        container: 'bg-gray-900 border-gray-700',
        header: 'text-lime-400',
        icon: 'text-lime-400',
        button: 'bg-lime-500 hover:bg-lime-600 text-black'
      },
      journal: {
        container: 'bg-purple-900/20 border-purple-700',
        header: 'text-purple-400',
        icon: 'text-purple-400',
        button: 'bg-purple-500 hover:bg-purple-600 text-white'
      },
      discussion: {
        container: 'bg-blue-900/20 border-blue-700',
        header: 'text-blue-400',
        icon: 'text-blue-400',
        button: 'bg-blue-500 hover:bg-blue-600 text-white'
      }
    }

    return themeConfig[theme]
  }

  const themeClasses = getThemeClasses()

  return (
    <div className={`border rounded-xl p-6 ${themeClasses.container} ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2 rounded-lg ${themeClasses.container}`}>
          {theme === 'journal' ? (
            <Edit3 className={`w-5 h-5 ${themeClasses.icon}`} />
          ) : theme === 'discussion' ? (
            <MessageCircle className={`w-5 h-5 ${themeClasses.icon}`} />
          ) : (
            <Brain className={`w-5 h-5 ${themeClasses.icon}`} />
          )}
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${themeClasses.header}`}>{title}</h3>
          {description && (
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="space-y-3">
            {/* Question */}
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-white font-medium">{question}</p>
              </div>
            </div>

            {/* Response Area */}
            {allowResponses && (
              <div className="ml-9 space-y-2">
                {!isExpanded[index] ? (
                  <button
                    onClick={() => toggleExpansion(index)}
                    className="w-full text-left p-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-gray-400 text-sm">
                      {responses[index] ? 'Edit your response...' : 'Click to add your reflection...'}
                    </span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={responses[index]}
                      onChange={(e) => handleResponseChange(index, e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-lime-500 transition-colors"
                      rows={4}
                      maxLength={maxCharacters}
                    />
                    
                    {/* Character count and actions */}
                    <div className="flex items-center justify-between">
                      {showCharacterCount && (
                        <span className="text-xs text-gray-500">
                          {responses[index].length}/{maxCharacters} characters
                        </span>
                      )}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleExpansion(index)}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            const newResponses = [...responses]
                            newResponses[index] = ''
                            setResponses(newResponses)
                            toggleExpansion(index)
                          }}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {allowResponses && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {responses.filter(r => r.trim()).length} of {questions.length} questions answered
            </div>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${themeClasses.button}`}
            >
              <Send className="w-4 h-4" />
              <span>Share Reflections</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Variant components for different use cases
export function JournalPrompt({ questions, ...props }: Omit<ReflectionPromptProps, 'theme'>) {
  return (
    <ReflectionPrompt
      questions={questions}
      theme="journal"
      title="Journal Entry"
      description="Write your personal thoughts and insights"
      {...props}
    />
  )
}

export function DiscussionPrompt({ questions, ...props }: Omit<ReflectionPromptProps, 'theme'>) {
  return (
    <ReflectionPrompt
      questions={questions}
      theme="discussion"
      title="Discussion Questions"
      description="Share your thoughts with the community"
      {...props}
    />
  )
}

export function SelfAssessment({ questions, ...props }: Omit<ReflectionPromptProps, 'theme'>) {
  return (
    <ReflectionPrompt
      questions={questions}
      theme="default"
      title="Self Assessment"
      description="Evaluate your understanding and progress"
      {...props}
    />
  )
} 