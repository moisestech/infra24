'use client'

import { List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Stable DOM ids for in-page jumps (org workshop detail). */
export const IP_AGE_OF_AI_WORKSHOP_DETAIL_SECTION_IDS = {
  overview: 'workshop-section-overview',
  program: 'workshop-section-program',
  outline: 'workshop-section-outline',
  speakers: 'workshop-section-speakers',
  skills: 'workshop-section-skills',
  gallery: 'workshop-section-gallery',
  outcomes: 'workshop-section-outcomes',
  audience: 'workshop-section-audience',
  session: 'workshop-section-session',
  learn: 'workshop-section-learn',
  pdfTemplates: 'workshop-section-pdf-templates',
} as const

type DetailTab = 'workshop' | 'learn'

type NavItem = {
  label: string
  targetId: string
  tab?: DetailTab
  hide?: boolean
}

export function IpAgeOfAiWorkshopDetailSectionNav({
  variant,
  skillsVisible,
  galleryVisible,
  outcomesVisible,
  audienceVisible,
  tabsVisible,
  onJump,
}: {
  variant: 'aside' | 'bar'
  skillsVisible: boolean
  galleryVisible: boolean
  outcomesVisible: boolean
  audienceVisible: boolean
  tabsVisible: boolean
  onJump: (targetId: string, tab?: DetailTab) => void
}) {
  const ids = IP_AGE_OF_AI_WORKSHOP_DETAIL_SECTION_IDS
  const items: NavItem[] = [
    { label: 'Overview', targetId: ids.overview },
    { label: 'Program', targetId: ids.program },
    { label: 'Outline', targetId: ids.outline },
    { label: 'Instructors', targetId: ids.speakers },
    { label: "Skills you'll learn", targetId: ids.skills, hide: !skillsVisible },
    { label: 'Gallery', targetId: ids.gallery, hide: !galleryVisible },
    { label: 'Outcomes', targetId: ids.outcomes, hide: !outcomesVisible },
    { label: "Who it's for", targetId: ids.audience, hide: !audienceVisible },
    { label: 'Session details', targetId: ids.session, tab: 'workshop', hide: !tabsVisible },
    { label: 'Modules & video', targetId: ids.learn, tab: 'learn', hide: !tabsVisible },
    { label: 'PDF templates', targetId: ids.pdfTemplates, tab: 'learn', hide: !tabsVisible },
  ].filter((x) => !x.hide)

  function RowButton({ item }: { item: NavItem }) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          variant === 'aside'
            ? 'h-auto w-full justify-start px-2 py-1.5 text-left text-sm font-normal text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            : 'shrink-0 whitespace-nowrap rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted'
        )}
        onClick={() => onJump(item.targetId, item.tab)}
      >
        {item.label}
      </Button>
    )
  }

  if (variant === 'bar') {
    return (
      <nav
        aria-label="On this page"
        className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <span className="flex shrink-0 items-center gap-1 pr-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <List className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Sections
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {items.map((item) => (
            <RowButton key={`${item.targetId}-${item.tab ?? ''}`} item={item} />
          ))}
        </div>
      </nav>
    )
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">On this page</CardTitle>
        <CardDescription className="text-xs">Jump to a section</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {items.map((item) => (
          <RowButton key={`${item.targetId}-${item.tab ?? ''}`} item={item} />
        ))}
      </CardContent>
    </Card>
  )
}
