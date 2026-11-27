import { NextRequest, NextResponse } from 'next/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store' }
const fail = (error:string,status:number) => NextResponse.json({error},{status,headers})
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params
    const db=getSupabaseAdmin()
    const {data:visibility,error}=await db.from('submission_forms').select('id,org_id,is_public,requires_authentication').eq('id',id).eq('type','survey').eq('is_active',true).maybeSingle()
    if(error) return fail('Survey unavailable',503)
    if(!visibility) return fail('Survey not found',404)
    if(visibility.is_public!==true){
      const access=await requireOrganizationStaff(visibility.org_id)
      if(!access.ok) return fail(access.error,access.status)
    }else if(visibility.requires_authentication===true && !(await auth()).userId) return fail('Sign in required',401)
    let query=db.from('submission_forms').select('id,title,description,category,form_schema,submission_settings,is_public,requires_authentication,organizations!inner(id,name,slug)').eq('id',id).eq('org_id',visibility.org_id).eq('type','survey').eq('is_active',true).eq('is_public',visibility.is_public).eq('requires_authentication',visibility.requires_authentication)
    const {data:survey,error:readError}=await query.maybeSingle()
    if(readError) return fail('Survey unavailable',503)
    if(!survey) return fail('Survey not found',404)
    return NextResponse.json({survey:{id:survey.id,title:survey.title,description:survey.description,category:survey.category,form_schema:survey.form_schema,submission_settings:survey.submission_settings,is_public:survey.is_public,requires_authentication:survey.requires_authentication,organization:survey.organizations}},{headers})
  }catch{return fail('Survey unavailable',503)}
}
// Legacy mutation target 'surveys' does not exist in the hosted catalog.
// Do not silently redirect mutations to a different table or permission model.
export async function PUT(_request:NextRequest,_context:{params:Promise<{id:string}>}){return fail('Legacy survey editing unavailable',410)}
export async function DELETE(_request:NextRequest,_context:{params:Promise<{id:string}>}){return fail('Legacy survey deletion unavailable',410)}
