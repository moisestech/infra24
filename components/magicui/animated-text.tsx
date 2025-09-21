"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
}

export function AnimatedText({ 
  text, 
  className = "", 
  delay = 0, 
  duration = 0.5, 
  stagger = 0.05 
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const words = text.split(" ")

  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration,
            delay: delay + index * stagger,
            ease: "easeOut"
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

interface SparkleTextProps {
  text: string
  className?: string
  sparkleCount?: number
}

export function SparkleText({ text, className = "", sparkleCount = 3 }: SparkleTextProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))
      setSparkles(newSparkles)
    }

    generateSparkles()
    const interval = setInterval(generateSparkles, 2000)
    return () => clearInterval(interval)
  }, [sparkleCount])

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        {text}
      </motion.span>
      
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-2 h-2 bg-yellow-400 rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
