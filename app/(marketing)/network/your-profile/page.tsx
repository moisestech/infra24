import type { Metadata } from 'next'
import { YourDccProfile } from '@/components/dcc/community/YourDccProfile'

export const metadata: Metadata = {
  title: 'Your DCC Profile / Passport',
  description: 'Edit your private DCC practice and choose what may be reviewed for public discovery.',
  robots: { index: false, follow: false },
}
export default function YourProfilePage() {
  return <YourDccProfile />
}
