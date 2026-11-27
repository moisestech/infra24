import {auth} from '@clerk/nextjs/server'
import {redirect} from 'next/navigation'
import {PrivatePassportPilot} from '@/components/dcc/community/PrivatePassportPilot'
export const dynamic='force-dynamic'
export const metadata={title:'Your private DCC Passport',robots:{index:false,follow:false}}
export default async function Page(){
 const {userId}=await auth()
 if(!userId)redirect('/sign-in?redirect_url=%2Fnetwork%2Fyour-profile')
 if(process.env.DCC_MEMBER_PROFILE_ENABLED!=='true')return <main className="p-8">Private Passport pilot is not enabled.</main>
 return <PrivatePassportPilot/>
}
