import type { Metadata } from 'next'
import { Cpu } from 'lucide-react'
import { StaffPage, StaffRecords } from '@/components/dcc/backoffice/StaffSection'
import { presentMachine, readMachines, type StaffRow } from '@/lib/dcc/backoffice/crm-reads'
import { noticeFromRead, type StaffNotice } from '@/lib/dcc/backoffice/table-read'
import { FABRICATION_MACHINES, machineAccessLabel } from '@/lib/dcc/fabrication/machines-catalog'

export const metadata: Metadata = { title: 'Machines' }
export const dynamic = 'force-dynamic'

function catalogRows(): StaffRow[] {
  return FABRICATION_MACHINES.map((machine) => ({
    id: machine.id,
    title: machine.name,
    detail: [machine.process, machine.location, machineAccessLabel(machine), machine.active ? null : 'Inactive']
      .filter(Boolean)
      .join(' · '),
  }))
}

export default async function MachinesPage() {
  const read = await readMachines()
  const notice = noticeFromRead(read)
  const notices: StaffNotice[] = [
    {
      tone: 'pending',
      text: 'The Anycubic Photon Mono M7 Max is Leo’s printer. DCC can schedule it. CRM Machines still has no row for it.',
    },
  ]
  if (notice) notices.push(notice)
  const rows = [...catalogRows(), ...(read.status === 'records' ? read.records.map(presentMachine) : [])]
  return (
    <StaffPage
      title="Machines"
      lede="Studio catalog plus the CRM Machines table. Hourly rates stay off this page."
      icon={Cpu}
      token="emerald"
      notices={notices}
    >
      <StaffRecords rows={rows} empty="No machines in the catalog or the CRM table." />
    </StaffPage>
  )
}
