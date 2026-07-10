import { redirect } from 'next/navigation'
import { WOLFSONIAN_FELLOWSHIP_MOISES_URL } from '@/lib/marketing/wolfsonian-fellowship-grant'

/** Canonical DCC handoff → fellowship packet on moises.tech. */
export default function WolfsonianFellowshipCanonicalRedirectPage() {
  redirect(WOLFSONIAN_FELLOWSHIP_MOISES_URL)
}
