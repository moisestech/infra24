'use client'

import { useState, useEffect } from 'react'
import { Play, RotateCcw, Copy, Check, Download } from 'lucide-react'

interface CodePlaygroundProps {
  language?: 'javascript' | 'html' | 'css' | 'typescript' | 'python'
  starterCode?: string
  title?: string
  description?: string
  height?: number
  theme?: 'dark' | 'light'
  showPreview?: boolean
  showConsole?: boolean
}

export function CodePlayground({
  language = 'javascript',
  starterCode = '',
  title = 'Code Playground',
  description,
  height = 400,
  theme = 'dark',
  showPreview = true,
  showConsole = true
}: CodePlaygroundProps) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'console'>('code')

  // Reset code to starter
  const resetCode = () => {
    setCode(starterCode)
    setOutput('')
    setErrors([])
  }

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Download code as file
  const downloadCode = () => {
    const extension = language === 'javascript' ? 'js' : 
                     language === 'typescript' ? 'ts' : 
                     language === 'html' ? 'html' : 
                     language === 'css' ? 'css' : 'py'
    
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `playground.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Execute code
  const runCode = () => {
    setIsRunning(true)
    setErrors([])
    setOutput('')

    try {
      if (language === 'javascript' || language === 'typescript') {
        // Create a safe execution environment
        const originalConsoleLog = console.log
        const logs: string[] = []
        
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '))
        }

        // Execute the code
        const result = eval(code)
        
        // Restore console.log
        console.log = originalConsoleLog
        
        if (logs.length > 0) {
          setOutput(logs.join('\n'))
        }
        if (result !== undefined) {
          setOutput(prev => prev + (prev ? '\n' : '') + String(result))
        }
      } else if (language === 'html') {
        // For HTML, show preview
        setActiveTab('preview')
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : String(error)])
    } finally {
      setIsRunning(false)
    }
  }

  // Auto-run on mount if starter code is provided
  useEffect(() => {
    if (starterCode && language === 'html') {
      setActiveTab('preview')
    }
  }, [starterCode, language])

  return (
    <div className="w-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'code'
              ? 'text-lime-400 border-b-2 border-lime-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Code
        </button>
        {showPreview && (
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-lime-400 border-b-2 border-lime-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Preview
          </button>
        )}
        {showConsole && (
          <button
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'console'
                ? 'text-lime-400 border-b-2 border-lime-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Console
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex" style={{ height: `${height}px` }}>
        {/* Code Editor */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </button>
                <button
                  onClick={resetCode}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyCode}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={downloadCode}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              placeholder={`Enter your ${language} code here...`}
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {activeTab === 'preview' && showPreview && (
          <div className="flex-1 p-4 bg-white">
            {language === 'html' ? (
              <iframe
                srcDoc={code}
                className="w-full h-full border-0"
                title="Code Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Preview not available for {language}
              </div>
            )}
          </div>
        )}

        {/* Console */}
        {activeTab === 'console' && showConsole && (
          <div className="flex-1 p-4 bg-gray-800">
            <div className="h-full overflow-auto">
              {output && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Output:</h4>
                  <pre className="text-sm text-gray-100 bg-gray-900 p-3 rounded-lg overflow-x-auto">
                    {output}
                  </pre>
                </div>
              )}
              {errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-2">Errors:</h4>
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-300 bg-red-900/20 p-3 rounded-lg mb-2">
                      {error}
                    </div>
                  ))}
                </div>
              )}
              {!output && errors.length === 0 && (
                <div className="text-gray-500 text-sm">
                  Run your code to see output here...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 