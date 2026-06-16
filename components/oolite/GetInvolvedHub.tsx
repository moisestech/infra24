'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getInvolvedHubCopy,
  getInvolvedPillars,
  type GetInvolvedPillar,
} from '@/lib/orgs/oolite/get-involved-content'

function PillarCta({
  cta,
  variant = 'default',
}: {
  cta: { label: string; href: string; external?: boolean }
  variant?: 'default' | 'outline'
}) {
  const isExternal = cta.external || cta.href.startsWith('http')
  const ButtonInner = (
    <>
      {cta.label}
      {isExternal ? <ExternalLink className="ml-2 h-4 w-4" /> : null}
    </>
  )

  if (isExternal) {
    return (
      <Button asChild variant={variant} className={variant === 'default' ? 'w-full sm:w-auto' : ''}>
        <a href={cta.href} target="_blank" rel="noopener noreferrer">
          {ButtonInner}
        </a>
      </Button>
    )
  }

  return (
    <Button asChild variant={variant} className={variant === 'default' ? 'w-full sm:w-auto' : ''}>
      <Link href={cta.href}>{ButtonInner}</Link>
    </Button>
  )
}

function PillarCard({ pillar }: { pillar: GetInvolvedPillar }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {pillar.imageUrl ? (
        <div className="relative aspect-[16/9] w-full bg-muted">
          <Image
            src={pillar.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{pillar.eyebrow}</p>
        <CardTitle className="text-xl">{pillar.title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{pillar.body}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        {pillar.highlights?.length ? (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {pillar.highlights.map((line) => (
              <li key={line}>· {line}</li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <PillarCta cta={pillar.primaryCta} />
          {pillar.secondaryCta ? (
            <PillarCta cta={pillar.secondaryCta} variant="outline" />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export function GetInvolvedHub() {
  const pillars = getInvolvedPillars()

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <header className="mb-12 max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">
          {getInvolvedHubCopy.heroEyebrow}
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
          {getInvolvedHubCopy.heroTitle}
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">{getInvolvedHubCopy.heroLead}</p>
        <Button asChild variant="outline">
          <Link href={getInvolvedHubCopy.agentCta.href}>
            <Sparkles className="mr-2 h-4 w-4" />
            {getInvolvedHubCopy.agentCta.label}
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {pillars.map((pillar) => (
          <PillarCard key={pillar.id} pillar={pillar} />
        ))}
      </div>
    </div>
  )
}
