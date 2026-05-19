'use client'

import { useCallback, useState } from 'react'
import { BookmarkPlus, Check, Copy } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'
import type {
  MemoryAgentClientOutputs,
  MemoryAgentLeadershipOutput,
  MemoryAgentMode,
  MemoryAgentOutputSaveContext,
  MemoryAgentPublicOutput,
  MemoryAgentStaffOutput,
} from '@/types/memory-agent'

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

function formatPublic(slice: MemoryAgentPublicOutput): string {
  let s = `${slice.title}\n\n${slice.summary}`
  for (const b of slice.bullets) s += `\n• ${b}`
  if (slice.suggestedAction) s += `\n\nSuggested action: ${slice.suggestedAction}`
  return s.trim()
}

function formatStaff(slice: MemoryAgentStaffOutput): string {
  let s = `${slice.title}\n\n${slice.summary}`
  for (const b of slice.bullets) s += `\n• ${b}`
  if (slice.tasks?.length) {
    s += '\n\nTasks:'
    for (const t of slice.tasks) s += `\n- ${t}`
  }
  if (slice.suggestedAction) s += `\n\nSuggested action: ${slice.suggestedAction}`
  return s.trim()
}

function formatLeadership(slice: MemoryAgentLeadershipOutput): string {
  let s = `${slice.title}\n\n${slice.summary}`
  for (const b of slice.bullets) s += `\n• ${b}`
  if (slice.risks?.length) {
    s += '\n\nRisks:'
    for (const r of slice.risks) s += `\n- ${r}`
  }
  if (slice.opportunities?.length) {
    s += '\n\nOpportunities:'
    for (const o of slice.opportunities) s += `\n- ${o}`
  }
  if (slice.suggestedAction) s += `\n\nSuggested action: ${slice.suggestedAction}`
  return s.trim()
}

function CopyOutputButton({
  label,
  text,
  className,
}: {
  label: string
  text: string
  className?: string
}) {
  const [done, setDone] = useState(false)
  const onCopy = useCallback(async () => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setDone(true)
      window.setTimeout(() => setDone(false), 2000)
    }
  }, [text])

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className={cn(
        'gap-1 border-[var(--ma-border-strong)] text-[var(--ma-text-muted)] hover:bg-[color:color-mix(in_srgb,var(--ma-primary)_8%,var(--ma-surface))]',
        className
      )}
      onClick={() => void onCopy()}
    >
      {done ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? 'Copied' : label}
    </Button>
  )
}

function SaveAssetButton({ label, onSave }: { label: string; onSave?: () => void }) {
  const [done, setDone] = useState(false)
  const handle = useCallback(() => {
    if (!onSave) return
    onSave()
    setDone(true)
    window.setTimeout(() => setDone(false), 1600)
  }, [onSave])
  if (!onSave) return null
  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className={cn('gap-1', ma.btnOutline)}
      onClick={handle}
    >
      {done ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
      {done ? 'Saved' : label}
    </Button>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-[var(--ma-text-muted)]">
      {items.map((b, i) => (
        <li key={`${i}-${b.slice(0, 24)}`}>{b}</li>
      ))}
    </ul>
  )
}

function PublicBody({ slice }: { slice: MemoryAgentPublicOutput }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[var(--ma-text)]">{slice.title}</p>
      <p className="text-sm leading-relaxed text-[var(--ma-text-muted)]">{slice.summary}</p>
      <BulletList items={slice.bullets} />
      {slice.suggestedAction ? (
        <p className="rounded-md border border-dashed border-[color:color-mix(in_srgb,var(--ma-primary)_25%,rgb(228_228_231))] bg-[var(--ma-surface-muted)]/90 px-3 py-2 text-xs text-[var(--ma-text-muted)]">
          <span className="font-medium text-[var(--ma-text)]">Suggested action: </span>
          {slice.suggestedAction}
        </p>
      ) : null}
    </div>
  )
}

function StaffBody({ slice }: { slice: MemoryAgentStaffOutput }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[var(--ma-text)]">{slice.title}</p>
      <p className="text-sm leading-relaxed text-[var(--ma-text-muted)]">{slice.summary}</p>
      <BulletList items={slice.bullets} />
      {slice.tasks && slice.tasks.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">Tasks</p>
          <ul className="list-none space-y-1 text-sm text-[var(--ma-text-muted)]">
            {slice.tasks.map((t, i) => (
              <li key={`${i}-${t.slice(0, 20)}`} className="flex gap-2">
                <span className="text-[color:var(--ma-primary)]">→</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {slice.suggestedAction ? (
        <p className="rounded-md border border-dashed border-[var(--ma-border)] bg-[var(--ma-surface-muted)] px-3 py-2 text-xs text-[var(--ma-text-muted)]">
          <span className="font-medium text-[var(--ma-text)]">Suggested action: </span>
          {slice.suggestedAction}
        </p>
      ) : null}
    </div>
  )
}

function LeadershipBody({ slice }: { slice: MemoryAgentLeadershipOutput }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[var(--ma-text)]">{slice.title}</p>
      <p className="text-sm leading-relaxed text-[var(--ma-text-muted)]">{slice.summary}</p>
      <BulletList items={slice.bullets} />
      {slice.risks && slice.risks.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800/90">Risks</p>
          <ul className="list-disc space-y-1 pl-4 text-sm text-[var(--ma-text-muted)]">
            {slice.risks.map((r, i) => (
              <li key={`${i}-${r.slice(0, 20)}`}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {slice.opportunities && slice.opportunities.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-800/90">
            Opportunities
          </p>
          <ul className="list-disc space-y-1 pl-4 text-sm text-[var(--ma-text-muted)]">
            {slice.opportunities.map((o, i) => (
              <li key={`${i}-${o.slice(0, 20)}`}>{o}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {slice.suggestedAction ? (
        <p className="rounded-md border border-dashed border-[var(--ma-border)] bg-[var(--ma-surface-muted)] px-3 py-2 text-xs text-[var(--ma-text-muted)]">
          <span className="font-medium text-[var(--ma-text)]">Suggested action: </span>
          {slice.suggestedAction}
        </p>
      ) : null}
    </div>
  )
}

function HelperLine() {
  return (
    <p className="text-xs leading-relaxed text-[var(--ma-text-muted)]">
      Generated from the same institutional memory, adapted for different audiences.
    </p>
  )
}

export function MemoryAgentOutputTabs({
  outputs,
  mode,
  saveContext,
  onSavePublic,
  onSaveStaff,
  onSaveLeadership,
}: {
  outputs: MemoryAgentClientOutputs
  mode: MemoryAgentMode
  saveContext?: MemoryAgentOutputSaveContext
  onSavePublic?: () => void
  onSaveStaff?: () => void
  onSaveLeadership?: () => void
}) {
  const tabCount = 1 + (outputs.staff ? 1 : 0) + (outputs.leadership ? 1 : 0)
  const saveEnabled = !!saveContext
  const savePublic = saveEnabled ? onSavePublic : undefined
  const saveStaff =
    saveEnabled && mode === 'staff_operator' && outputs.staff ? onSaveStaff : undefined
  const saveLeadership =
    saveEnabled && mode === 'staff_operator' && outputs.leadership ? onSaveLeadership : undefined

  return (
    <section
      className={cn('rounded-xl bg-gradient-to-b from-[var(--ma-surface)] to-[var(--ma-card-tint)] p-4 shadow-sm', ma.card)}
      aria-label="Audience-specific outputs"
    >
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-sm font-semibold tracking-tight text-[var(--ma-text)]">Generated outputs</h2>
        <HelperLine />
      </div>

      <div className="hidden md:block">
        <Tabs defaultValue="public" className="w-full">
          <TabsList
            className={cn(
              'grid h-auto w-full gap-1 bg-[var(--ma-surface-muted)] p-1',
              tabCount === 1 && 'grid-cols-1',
              tabCount === 2 && 'grid-cols-2',
              tabCount >= 3 && 'grid-cols-3'
            )}
          >
            <TabsTrigger
              value="public"
              className="text-xs data-[state=active]:border data-[state=active]:border-[color:color-mix(in_srgb,var(--ma-primary)_35%,transparent)] data-[state=active]:bg-[var(--ma-surface)] data-[state=active]:text-[var(--ma-text)] md:text-sm"
            >
              Public Output
            </TabsTrigger>
            {outputs.staff ? (
              <TabsTrigger
                value="staff"
                className="text-xs data-[state=active]:border data-[state=active]:border-[color:color-mix(in_srgb,var(--ma-primary)_35%,transparent)] data-[state=active]:bg-[var(--ma-surface)] data-[state=active]:text-[var(--ma-text)] md:text-sm"
              >
                Staff Brief
              </TabsTrigger>
            ) : null}
            {outputs.leadership ? (
              <TabsTrigger
                value="leadership"
                className="text-xs data-[state=active]:border data-[state=active]:border-[color:color-mix(in_srgb,var(--ma-primary)_35%,transparent)] data-[state=active]:bg-[var(--ma-surface)] data-[state=active]:text-[var(--ma-text)] md:text-sm"
              >
                Leadership Insight
              </TabsTrigger>
            ) : null}
          </TabsList>
          <TabsContent value="public" className="mt-4 space-y-3">
            <PublicBody slice={outputs.public} />
            <div className="flex flex-wrap gap-2">
              <CopyOutputButton label="Copy Public Output" text={formatPublic(outputs.public)} />
              <SaveAssetButton label="Save Public Output" onSave={savePublic} />
            </div>
          </TabsContent>
          {outputs.staff ? (
            <TabsContent value="staff" className="mt-4 space-y-3">
              <StaffBody slice={outputs.staff} />
              <div className="flex flex-wrap gap-2">
                <CopyOutputButton label="Copy Staff Brief" text={formatStaff(outputs.staff)} />
                <SaveAssetButton label="Save Staff Brief" onSave={saveStaff} />
              </div>
            </TabsContent>
          ) : null}
          {outputs.leadership ? (
            <TabsContent value="leadership" className="mt-4 space-y-3">
              <LeadershipBody slice={outputs.leadership} />
              <div className="flex flex-wrap gap-2">
                <CopyOutputButton
                  label="Copy Leadership Insight"
                  text={formatLeadership(outputs.leadership)}
                />
                <SaveAssetButton label="Save Leadership Insight" onSave={saveLeadership} />
              </div>
            </TabsContent>
          ) : null}
        </Tabs>
      </div>

      <div className="md:hidden">
        <Accordion type="single" collapsible defaultValue="public" className="w-full">
          <AccordionItem value="public" className="border-[var(--ma-border)]">
            <AccordionTrigger className="py-3 text-sm text-[var(--ma-text)] hover:no-underline">
              Public Output
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-1">
                <PublicBody slice={outputs.public} />
                <div className="flex flex-wrap gap-2">
                  <CopyOutputButton label="Copy Public Output" text={formatPublic(outputs.public)} />
                  <SaveAssetButton label="Save Public Output" onSave={savePublic} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {outputs.staff ? (
            <AccordionItem value="staff" className="border-[var(--ma-border)]">
              <AccordionTrigger className="py-3 text-sm text-[var(--ma-text)] hover:no-underline">
                Staff Brief
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pb-1">
                  <StaffBody slice={outputs.staff} />
                  <div className="flex flex-wrap gap-2">
                    <CopyOutputButton label="Copy Staff Brief" text={formatStaff(outputs.staff)} />
                    <SaveAssetButton label="Save Staff Brief" onSave={saveStaff} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null}
          {outputs.leadership ? (
            <AccordionItem value="leadership" className="border-[var(--ma-border)]">
              <AccordionTrigger className="py-3 text-sm text-[var(--ma-text)] hover:no-underline">
                Leadership Insight
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pb-1">
                  <LeadershipBody slice={outputs.leadership} />
                  <div className="flex flex-wrap gap-2">
                    <CopyOutputButton
                      label="Copy Leadership Insight"
                      text={formatLeadership(outputs.leadership)}
                    />
                    <SaveAssetButton label="Save Leadership Insight" onSave={saveLeadership} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null}
        </Accordion>
      </div>
    </section>
  )
}
