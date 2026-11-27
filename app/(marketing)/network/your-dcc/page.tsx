import {auth} from '@clerk/nextjs/server'
import {redirect} from 'next/navigation'
import Link from 'next/link'
export const dynamic='force-dynamic'
export const metadata={title:'Your DCC — Private pilot',robots:{index:false,follow:false}}
export default async function Page(){
 const {userId}=await auth()
 if(!userId)redirect('/sign-in?redirect_url=%2Fnetwork%2Fyour-dcc')
 return <main className="mx-auto max-w-2xl space-y-4 p-8"><h1 className="text-3xl font-semibold">Your DCC</h1><p>Private member pilot. Creating an account does not publish your profile or claim an existing identity.</p><Link className="underline" href="/network/your-profile">Open your private Passport</Link></main>
}
