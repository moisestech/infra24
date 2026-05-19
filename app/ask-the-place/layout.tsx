import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ask the Place',
  description: 'Cultural Intelligence Concierge for premium spaces — Infra24 pilot shell.',
}

export default function AskThePlaceLayout({ children }: { children: React.ReactNode }) {
  return <div className="ask-the-place-root">{children}</div>
}
