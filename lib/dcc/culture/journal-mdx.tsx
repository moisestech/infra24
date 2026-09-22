import { EditorialDiagram } from '@/components/dcc/culture/editorial/EditorialDiagram'
import { EditorialFigure } from '@/components/dcc/culture/editorial/EditorialFigure'
import {
  EditorialFramework,
  EditorialFrameworkItem,
} from '@/components/dcc/culture/editorial/EditorialFramework'
import { EditorialMethodTable } from '@/components/dcc/culture/editorial/EditorialMethodTable'
import { PublishTheReceiptTable } from '@/components/dcc/culture/editorial/PublishTheReceiptTable'
import { EditorialCite } from '@/components/dcc/culture/editorial/EditorialSources'
import { EditorialPullQuote } from '@/components/dcc/culture/editorial/EditorialPullQuote'
import { CapacityChainDiagram } from '@/components/dcc/culture/editorial/diagrams/CapacityChainDiagram'
import { FounderDependencyDiagram } from '@/components/dcc/culture/editorial/diagrams/FounderDependencyDiagram'
import { OperatingLoopDiagram } from '@/components/dcc/culture/editorial/diagrams/OperatingLoopDiagram'
import { ResponsibilityStackDiagram } from '@/components/dcc/culture/editorial/diagrams/ResponsibilityStackDiagram'
import { BudgetPhaseCompare } from '@/components/dcc/culture/editorial/diagrams/BudgetPhaseCompare'
import { EditorialImageSlot } from '@/components/dcc/culture/EditorialImageSlot'
import type { DccEditorial } from '@/lib/dcc/culture/types'

export function journalMdxComponents(entry: DccEditorial) {
  const sources = entry.sources ?? []

  function Cite({ id }: { id: string }) {
    const index = sources.findIndex((source) => source.id === id)
    if (index < 0) {
      return (
        <span className="editorial-cite editorial-cite--missing" title={`Missing source: ${id}`}>
          [?]
        </span>
      )
    }
    return <EditorialCite id={id} n={index + 1} title={sources[index].title} />
  }

  return {
    EditorialImageSlot,
    EditorialPullQuote,
    EditorialFigure,
    EditorialDiagram,
    EditorialFramework,
    EditorialFrameworkItem,
    EditorialMethodTable,
    PublishTheReceiptTable,
    CapacityChainDiagram,
    OperatingLoopDiagram,
    FounderDependencyDiagram,
    ResponsibilityStackDiagram,
    BudgetPhaseCompare,
    Cite,
  }
}
