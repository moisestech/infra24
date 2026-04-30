import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { GlossaryTerm } from '@/data/ipAgeOfAiWorkshop'

type GlossaryPreviewProps = {
  terms: GlossaryTerm[]
}

export function GlossaryPreview({ terms }: GlossaryPreviewProps) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold text-slate-900">Glossary terms in this module</h2>
      <Accordion type="multiple" className="mt-3">
        {terms.map((item) => (
          <AccordionItem key={item.term} value={item.term}>
            <AccordionTrigger className="text-left text-sm">{item.term}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-slate-700">{item.definition}</p>
              <p className="mt-2 text-xs text-slate-600">
                <strong>Why it matters:</strong> {item.whyItMatters}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
