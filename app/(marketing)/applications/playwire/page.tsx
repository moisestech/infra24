import { redirect } from 'next/navigation'

/** Legacy path → canonical opportunities route. */
export default function PlaywireApplicationRedirectPage() {
  redirect('/opportunities/playwire')
}
