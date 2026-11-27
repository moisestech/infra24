'use client'
import { useEffect,useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
type Receipt={id:string,status:string,start_time:string,end_time:string}
export default function BookingConfirmationPage(){
  const {id}=useParams<{id:string}>()
  const [receipt,setReceipt]=useState<Receipt|null>(null)
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const controller=new AbortController()
    const token=new URLSearchParams(window.location.hash.slice(1)).get('receipt')
    setLoading(true);setReceipt(null)
    if(!token){setLoading(false);return}
    fetch('/api/bookings/'+encodeURIComponent(id)+'/confirmation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token}),cache:'no-store',signal:controller.signal})
      .then(async r=>r.ok?(await r.json()).booking:null)
      .then(r=>{if(!controller.signal.aborted)setReceipt(r)})
      .catch(()=>{})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false)})
    return ()=>controller.abort()
  },[id])
  const download=()=>{
    if(!receipt||receipt.status!=='confirmed')return
    const stamp=(value:string)=>new Date(value).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Infra24//Receipt//EN','BEGIN:VEVENT','UID:'+receipt.id+'@infra24','DTSTAMP:'+stamp(new Date().toISOString()),'DTSTART:'+stamp(receipt.start_time),'DTEND:'+stamp(receipt.end_time),'SUMMARY:Infra24 booking','END:VEVENT','END:VCALENDAR']
    const url=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar'}))
    const a=document.createElement('a');a.href=url;a.download='booking.ics';a.click();URL.revokeObjectURL(url)
  }
  return <main className="mx-auto max-w-xl p-8 space-y-6">
    <h1 className="text-2xl font-semibold">Booking receipt</h1>
    {loading?<p>Checking your booking…</p>:receipt?<><p>Status: {receipt.status}</p><p>{new Date(receipt.start_time).toLocaleString()} – {new Date(receipt.end_time).toLocaleString()}</p><p>For private meeting details, cancellation or rescheduling, refer to your booking email.</p>{receipt.status==='confirmed'&&<Button onClick={download}>Download calendar reminder</Button>}</>:<p>This receipt is unavailable or expired. Refer to your original booking email or contact the organization. A booking ID alone cannot reveal private details.</p>}
    <p><a href="/book" className="underline">Return to booking</a></p>
  </main>
}
