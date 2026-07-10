import { redirect } from 'next/navigation'
import { WOLFSONIAN_FELLOWSHIP_CANONICAL_PATH } from '@/lib/marketing/wolfsonian-fellowship-grant'

/** Plural grants path → canonical /grant/wolfsonian-fellowship. */
export default function WolfsonianFellowshipGrantRedirectPage() {
  redirect(WOLFSONIAN_FELLOWSHIP_CANONICAL_PATH)
}
