"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/magicui/confetti"
import { AnimatedText, SparkleText } from "@/components/magicui/animated-text"
import { CheckCircle, Sparkles, Mail, Calendar, ArrowRight } from "lucide-react"

interface SurveyThankYouProps {
  organizationName: string
  onBackToOrg?: () => void
  className?: string
}

export function SurveyThankYou({ 
  organizationName, 
  onBackToOrg,
  className = "" 
}: SurveyThankYouProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 ${className}`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti 
          colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]}
          particleCount={200}
          duration={4000}
        />
      )}

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div 
          className="max-w-2xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Success Icon */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              {/* Sparkle effects around the icon */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    top: `${20 + Math.cos(i * 60 * Math.PI / 180) * 40}px`,
                    left: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}px`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Thank You Message */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <SparkleText 
                text="Thank You!" 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                sparkleCount={5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <AnimatedText 
                text="Your feedback has been successfully submitted!"
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium"
                delay={800}
                stagger={0.1}
              />
            </motion.div>
          </div>

          {/* Digital Lab Section */}
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
            
            <div className="relative z-10 space-y-4">
              <motion.div
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <h2 className="text-2xl md:text-3xl font-bold">Digital Lab Initiative</h2>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              
              <motion.p
                className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                We'll be in touch soon with exciting updates about our Digital Lab program at {organizationName}. 
                Your input will help shape the future of digital innovation in our community!
              </motion.p>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              What's Next?
            </h3>
            
            <motion.div
              className="flex items-center justify-center space-x-3 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 max-w-md mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-lg">Email Updates</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stay informed about Digital Lab progress, new features, and exclusive early access opportunities</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.open('/digital-lab', '_blank')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Learn More About Digital Lab
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              onClick={onBackToOrg}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Back to {organizationName}
            </Button>
          </motion.div>

          {/* Footer Message */}
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
          >
            Thank you for helping us build the future of digital innovation! 🚀
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
