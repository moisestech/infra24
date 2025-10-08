'use client'

import { Footer } from '@/components/organization/Footer'
import LearnHero from '@/features/learn-canvas/components/LearnHero'

export function LearnPageClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white learn-page">
      {/* Header Gradient Overlay */}
      <div className="fixed top-0 left-0 w-full h-24 z-40 pointer-events-none" style={{background: 'linear-gradient(to bottom, #000 70%, transparent 100%)'}} />
      <main className="container mx-auto px-4 pb-12">
        {/* New Above-the-Fold Hero Section */}
        <LearnHero />
        {/* Workshop Grid (passed as children) */}
        {children}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
} 