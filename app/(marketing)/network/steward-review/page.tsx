import type { Metadata } from 'next'
import { DccStewardReview } from '@/components/dcc/community/DccStewardReview'
export const metadata: Metadata = {title:'DCC Steward Review',robots:{index:false,follow:false}}
export default function DccStewardReviewPage() {return <DccStewardReview />}
