import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Soho House AI Assistant for Member Relations',
  description:
    'A Member Signal Agent that turns House programming, spaces, and cultural knowledge into approved member-facing experiences.',
  openGraph: {
    title: 'Soho House AI Assistant for Member Relations',
    description:
      'The agent drafts. Staff approves. Members only see approved handoffs.',
    type: 'website',
  },
}

export default function SohoHouseAiAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
