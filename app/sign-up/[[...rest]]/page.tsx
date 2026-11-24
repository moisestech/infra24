import { Suspense } from 'react'
import { DccAuthExperience } from '@/components/dcc/auth/DccAuthExperience'

export default function SignUpPage() {
  const membershipLive =
    process.env.DCC_MEMBER_EVENT_CAPTURE_ENABLED === 'true' &&
    process.env.DCC_MEMBER_RECONCILIATION_ENABLED === 'true' &&
    process.env.DCC_MEMBER_PROFILE_ENABLED === 'true'
  return <Suspense fallback={<main className="min-h-screen bg-[#f3f5ee]" />}>
    <DccAuthExperience mode="sign-up" membershipLive={membershipLive}/>
  </Suspense>
}