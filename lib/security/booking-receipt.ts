import 'server-only'
import { createHmac,timingSafeEqual } from 'crypto'
export function bookingReceiptToken(id:string,mutationToken:string){
  return createHmac('sha256',mutationToken).update('infra24:booking-receipt:v1:'+id).digest('hex')
}
export function validBookingReceipt(id:string,mutationToken:unknown,token:unknown,createdAt:unknown,now=Date.now()){
  if(typeof mutationToken!=='string'||!/^[a-f0-9]{64}$/.test(mutationToken)||typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token)||typeof createdAt!=='string')return false
  const created=Date.parse(createdAt)
  if(!Number.isFinite(created)||created>now||now-created>24*60*60*1000)return false
  return timingSafeEqual(Buffer.from(bookingReceiptToken(id,mutationToken),'hex'),Buffer.from(token,'hex'))
}

export function bookingCalendarToken(id:string,mutationToken:string){
 return createHmac('sha256',mutationToken).update('infra24:booking-calendar:v1:'+id).digest('hex')
}
export function validBookingCalendar(id:string,mutationToken:unknown,token:unknown,createdAt:unknown,endTime:unknown,now=Date.now()){
 if(typeof mutationToken!=='string'||!/^[a-f0-9]{64}$/.test(mutationToken)||typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token)||typeof createdAt!=='string'||typeof endTime!=='string')return false
 const created=Date.parse(createdAt),end=Date.parse(endTime)
 if(!Number.isFinite(created)||!Number.isFinite(end)||created>now||now-created>90*86400000||end<now)return false
 return timingSafeEqual(Buffer.from(bookingCalendarToken(id,mutationToken),'hex'),Buffer.from(token,'hex'))
}
