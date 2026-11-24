import type { Metadata } from 'next'
import { YourDccHome } from '@/components/dcc/community/YourDccHome'
export const metadata:Metadata={title:'Your DCC — Membership, Passport & Atlas',robots:{index:false,follow:false}}
export default function YourDccPage(){
  const membershipLive=process.env.DCC_MEMBER_EVENT_CAPTURE_ENABLED==='true' &&
    process.env.DCC_MEMBER_RECONCILIATION_ENABLED==='true' &&
    process.env.DCC_MEMBER_PROFILE_ENABLED==='true'
  return <YourDccHome membershipLive={membershipLive}/>
}