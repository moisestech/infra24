import type { Metadata } from 'next'
import { BackOfficeHome } from '@/components/dcc/backoffice/BackOfficeHome'
import { readJobs, readMachines } from '@/lib/dcc/backoffice/crm-reads'
import { machineStatusForCapacity } from '@/lib/dcc/backoffice/live-status'
import { noticeFromRead, type StaffNotice, type TableRead } from '@/lib/dcc/backoffice/table-read'
import { FABRICATION_MACHINES } from '@/lib/dcc/fabrication/machines-catalog'
import { FABRICATION_OPERATORS } from '@/lib/dcc/fabrication/operators'
import { DCC_MACHINE_STATUS } from '@/lib/dcc/os-field-map'
import { buildBackOfficeHome } from '@/lib/dcc/fabrication-os/backoffice-home'

export const metadata: Metadata = {
  title: 'Back office',
}

export const dynamic = 'force-dynamic'


function homeNotices(jobs: TableRead<unknown>, machines: TableRead<unknown>): StaffNotice[] {
  if (jobs.status === 'unconfigured' && machines.status === 'unconfigured') {
    return [
      {
        tone: 'pending',
        text: 'Airtable is not connected in this environment. Job and machine counts are withheld. Available operators still come from the catalog.',
      },
    ]
  }
  const notices = [noticeFromRead(jobs), noticeFromRead(machines)].filter(
    (notice): notice is StaffNotice => notice !== null
  )
  if (notices.length === 0) {
    notices.push({
      tone: 'ready',
      text: 'Jobs were read from DCC CRM. The Anycubic is in the studio catalog, not a CRM machine row. Operators come from the operator catalog.',
    })
  }
  return notices
}

export default async function BackOfficePage() {
  const [jobs, machines] = await Promise.all([readJobs(), readMachines()])
  const model = buildBackOfficeHome({
    jobsStatus: jobs.status,
    machinesStatus: machines.status,
    operators: FABRICATION_OPERATORS.map((operator) => ({ active: operator.active })),
    jobs:
      jobs.status === 'records'
        ? jobs.records.map((job) => ({
            id: job.id,
            jobName: job.jobName,
            stage: job.stage,
            dueDate: job.dueDate,
            machineCount: job.machineIds.length,
          }))
        : [],
    machines: [
      ...(machines.status === 'records'
        ? machines.records.map((machine) => ({
            id: machine.id,
            name: machine.name,
            status: machineStatusForCapacity(machine.status),
          }))
        : []),
      ...FABRICATION_MACHINES.filter((machine) => machine.active).map((machine) => ({
        id: machine.id,
        name: machine.name,
        status: DCC_MACHINE_STATUS.operational,
      })),
    ],
  })

  return <BackOfficeHome model={model} notices={homeNotices(jobs, machines)} />
}
