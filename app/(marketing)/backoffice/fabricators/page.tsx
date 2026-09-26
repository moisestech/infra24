import type { Metadata } from 'next'
import { UserRound } from 'lucide-react'
import { StaffPage, StaffRecords } from '@/components/dcc/backoffice/StaffSection'
import { presentOperators } from '@/lib/dcc/backoffice/crm-reads'

export const metadata: Metadata = { title: 'Fabricators' }
export const dynamic = 'force-dynamic'

export default function FabricatorsStaffPage() {
  return (
    <StaffPage
      title="Fabricators"
      lede="Names, roles, and capabilities from the operator catalog. This is not a CRM availability field, and hourly rates stay off this page."
      icon={UserRound}
      token="teal"
    >
      <StaffRecords rows={presentOperators()} empty="No operators in the catalog." />
    </StaffPage>
  )
}
