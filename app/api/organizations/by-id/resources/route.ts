import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


export async function GET(
  request: NextRequest
) {
  try {
    const orgId = new URL(request.url).searchParams.get('org_id')

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const access = await requireOrganizationStaff(orgId)
    if (!access.ok) return NextResponse.json({error:access.error},{status:access.status,headers:{'Cache-Control':'private, no-store'}})
    // Staff-only full resource records.
    const { data: resources, error } = await access.db
      .from('resources')
      .select('*')
      .eq('org_id', access.orgId)
      .eq('is_active', true)
      .order('title');

    if (error) {
      console.error('Error fetching resources:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
        { status: 500 }
      );
    }

    return NextResponse.json({ resources },{headers:{'Cache-Control':'private, no-store'}});
  } catch (error) {
    console.error('Error in resources API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const orgId = new URL(request.url).searchParams.get('org_id')
    const access = await requireOrganizationStaff(orgId)
    if (!access.ok) return NextResponse.json({error:access.error},{status:access.status,headers:{'Cache-Control':'private, no-store'}})
    const {title,description,type,capacity,is_bookable} = await request.json()
    if (typeof title !== 'string' || !title.trim() || !['space','equipment','person','other'].includes(type)
      || (capacity !== undefined && (!Number.isInteger(capacity) || capacity < 1))) {
      return NextResponse.json({error:'Invalid resource'},{status:400})
    }
    const {data:resource,error}=await access.db.from('resources').insert({
      org_id:access.orgId,title:title.trim(),type,
      description:typeof description==='string'?description:'',
      capacity:capacity??1,is_bookable:is_bookable===true,
    }).select().single()
    if(error)return NextResponse.json({error:'Failed to create resource'},{status:500})
    return NextResponse.json(resource,{status:201,headers:{'Cache-Control':'private, no-store'}})
  }catch{
    return NextResponse.json({error:'Internal server error'},{status:500})
  }
}
