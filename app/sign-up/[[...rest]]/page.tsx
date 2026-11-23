import { Suspense } from 'react'
import { DccSignUpExperience } from '@/components/dcc/signup/DccSignUpExperience'

export default function SignUpPage() {
  // Server-owned feature flags control copy; no browser-side claim of live
  // membership can override the verified enrollment backend.
  const membershipLive =
    process.env.DCC_MEMBER_EVENT_CAPTURE_ENABLED === 'true' &&
    process.env.DCC_MEMBER_RECONCILIATION_ENABLED === 'true' &&
    process.env.DCC_MEMBER_PROFILE_ENABLED === 'true'
  return <Suspense fallback={<div className="min-h-screen bg-black" />}>
    <DccSignUpExperience membershipLive={membershipLive} />
  </Suspense>
}
