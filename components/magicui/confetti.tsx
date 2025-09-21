"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface ConfettiProps {
  className?: string
  colors?: string[]
  particleCount?: number
  spread?: number
  startVelocity?: number
  gravity?: number
  duration?: number
}

export function Confetti({
  className = "",
  colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
  particleCount = 150,
  spread = 70,
  startVelocity = 45,
  gravity = 0.5,
  duration = 3000,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      life: number
      maxLife: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = canvasWidth / 2
        this.y = canvasHeight / 2
        this.vx = (Math.random() - 0.5) * spread + (Math.random() - 0.5) * startVelocity
        this.vy = -Math.random() * startVelocity - 5
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.size = Math.random() * 4 + 2
        this.life = 0
        this.maxLife = duration / 16 // Assuming 60fps
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += gravity
        this.vx *= 0.99 // Air resistance
        this.life++
      }

      draw() {
        if (!ctx) return
        
        const alpha = 1 - (this.life / this.maxLife)
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      isDead(canvasHeight: number) {
        return this.life >= this.maxLife || this.y > canvasHeight
      }
    }

    const particles: Particle[] = []

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.update()
        particle.draw()

        if (particle.isDead(canvas.height)) {
          particles.splice(i, 1)
        }
      }

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [colors, particleCount, spread, startVelocity, gravity, duration])

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  )
}
