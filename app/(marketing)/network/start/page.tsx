import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start here | DCC Miami',
  description: 'Find your way into DCC without following every conversation.',
}

const entries = [
  { href: '/network/community', title: 'Explore the Atlas', text: 'Browse the graph or its profile list. Example profiles and local Passport previews are labeled; live listing depends on review and explicit permission.' },
  { href: '/fabricate', title: 'Make something', text: 'Start with a file, a question, or an idea that needs guidance. Submit an inquiry to work out scope and next steps.' },
  { href: '/journal', title: 'Read and return', text: 'Explore DCC’s published writing. A dedicated Signal catch-up archive is being prepared.' },
  { href: '/contact', title: 'Ask for help', text: 'Ask a specific question, offer a capability, or request a connection. Introductions depend on each person’s agreement.' },
]

export default function StartHerePage() {
  return <main style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px 96px' }}>
    <p>DCC MIAMI · START HERE</p>
    <h1 style={{ fontSize: 'clamp(2.25rem, 8vw, 4.5rem)', lineHeight: 1.08, margin: '24px 0' }}>Belong without keeping up with everything.</h1>
    <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>Share what you’re making, ask for something specific, offer what you know, or simply listen. A profile and a Passport are optional.</p>
    <nav aria-label="Ways to participate" style={{ display: 'grid', gap: 20, marginTop: 40 }}>
      {entries.map(entry => <article key={entry.href} style={{ borderTop: '1px solid currentColor', paddingTop: 20 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}><Link href={entry.href} style={{ display: 'inline-block', padding: '8px 0', textDecoration: 'underline', textUnderlineOffset: 4 }}>{entry.title} ↗</Link></h2>
        <p style={{ lineHeight: 1.6 }}>{entry.text}</p>
      </article>)}
    </nav>
    <section style={{ marginTop: 48 }} aria-labelledby="catch-up"><h2 id="catch-up">A lighter way to catch up</h2><p style={{ lineHeight: 1.6 }}>The Signal archive and resource index are in preparation. Until they are available, use the contact route to ask for help finding something you missed.</p></section>
  </main>
}
