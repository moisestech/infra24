import type { Metadata } from 'next'
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google'
import { cn } from '@/lib/utils'
import '../../(marketing)/cdc-marketing-theme.css'

const dccDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-dcc-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const dccMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dcc-mono',
  display: 'swap',
})

/** Full-screen kiosk layout — no marketing header/footer. */
export default function DccDisplayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('min-h-[100dvh] bg-neutral-950 antialiased', dccDisplay.variable, dccMono.variable)}>
      {children}
    </div>
  )
}
