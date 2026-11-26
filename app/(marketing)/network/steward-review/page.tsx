import type { Metadata } from 'next'
import { DccStewardReview } from '@/components/dcc/community/DccStewardReview'
export const metadata: Metadata = {title:'DCC Steward Review',robots:{index:false,follow:false}}
export default function DccStewardReviewPage() {
  // The action UI is server-gated separately from the read-only reviewer queue.
  // Authorization is checked again by the write endpoint.
  const canWrite=process.env.DCC_STEWARD_REVIEW_ENABLED==='true' &&
    process.env.DCC_STEWARD_PUBLICATION_ENABLED==='true'
  return <DccStewardReview canWrite={canWrite} canResolveIdentity={process.env.DCC_STEWARD_REVIEW_ENABLED==='true' && process.env.DCC_STEWARD_IDENTITY_RESOLUTION_ENABLED==='true'}/>
}
