import type { Metadata } from 'next'
import '@fontsource-variable/space-grotesk'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '../../(marketing)/dcc-local-fonts.css'
import { cn } from '@/lib/utils'
import '../../(marketing)/cdc-marketing-theme.css'

/** Full-screen kiosk layout — no marketing header/footer. */
export default function DccDisplayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('min-h-[100dvh] bg-neutral-950 antialiased', 'dcc-local-fonts')}>
      {children}
    </div>
  )
}
