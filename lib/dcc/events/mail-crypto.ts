import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
type Message = {to:string;subject:string;text:string;html:string}
function key():Buffer {
 const value=process.env.DCC_MAIL_ENCRYPTION_KEY
 if(!value || !/^[a-f0-9]{64}$/i.test(value)) throw new Error('Invalid mail encryption configuration')
 return Buffer.from(value,'hex')
}
export function encryptEventEmail(message:Message):string {
 const iv=randomBytes(12)
 const cipher=createCipheriv('aes-256-gcm',key(),iv)
 const ciphertext=Buffer.concat([cipher.update(JSON.stringify(message),'utf8'),cipher.final()])
 return [iv.toString('base64url'),cipher.getAuthTag().toString('base64url'),ciphertext.toString('base64url')].join('.')
}
export function decryptEventEmail(payload:string):Message {
 const [iv,tag,body]=payload.split('.')
 if(!iv || !tag || !body) throw new Error('Invalid encrypted payload')
 const decipher=createDecipheriv('aes-256-gcm',key(),Buffer.from(iv,'base64url'))
 decipher.setAuthTag(Buffer.from(tag,'base64url'))
 const message=JSON.parse(Buffer.concat([decipher.update(Buffer.from(body,'base64url')),decipher.final()]).toString('utf8'))
 if(typeof message.to!=='string'||typeof message.subject!=='string'||typeof message.text!=='string'||typeof message.html!=='string')throw new Error('Invalid email payload')
 return message
}
