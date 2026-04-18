'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  learnAiLandingCopy,
  learnAiAboutImageUrl,
} from '@/lib/workshops/learn-ai-without-losing-yourself/content'
import { learnAiWorkshopPaths } from '@/lib/workshops/learn-ai-without-losing-yourself/constants'
import { LEARN_AI_HERO_IMAGE_URL } from '@/lib/workshops/learn-ai-without-losing-yourself/workshop-visual'
import { learnAiInstitutionalInquiryMailto } from '@/lib/workshops/learn-ai-without-losing-yourself/mailto'

export function LearnAiLanding({
  orgSlug,
  workshopTitle,
}: {
  orgSlug: string
  workshopTitle: string
}) {
  const c = learnAiLandingCopy
  const paths = learnAiWorkshopPaths(orgSlug)
  const aboutImg = learnAiAboutImageUrl()
  const inquiryHref = learnAiInstitutionalInquiryMailto(workshopTitle)

  return (
    <div className="space-y-16 print:hidden">
      <header className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {c.eyebrow}
        </p>
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          <div className="relative aspect-[21/9] max-h-[320px] w-full md:aspect-[3/1]">
            <Image
              src={LEARN_AI_HERO_IMAGE_URL}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                {c.title}
              </h1>
              <p className="mt-3 max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
                {c.supportingLine}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {c.pullQuotes.map((q, i) => (
          <blockquote
            key={i}
            className="border-l-4 border-primary pl-4 text-lg font-medium leading-relaxed text-foreground/90"
          >
            {q}
          </blockquote>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          At a glance
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.quickFacts.map((f) => (
            <Card key={f.label}>
              <CardContent className="pt-4">
                <div className="text-xs font-medium text-muted-foreground">{f.label}</div>
                <div className="mt-1 text-sm">{f.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">{c.problemHeading}</h2>
        <p className="max-w-3xl whitespace-pre-wrap text-muted-foreground leading-relaxed">
          {c.problemBody}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">{c.processTagline}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {c.processSteps.map((step) => (
            <Card key={step.key}>
              <CardContent className="pt-6">
                <div className="text-xs font-bold uppercase text-primary">{step.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">{c.outcomesHeading}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {c.outcomeCards.map((o) => (
            <Card key={o.title}>
              <CardContent className="pt-6">
                <h3 className="font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{o.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold">{c.humanVsAutomated.humanHeading}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {c.humanVsAutomated.humanList.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{c.humanVsAutomated.automatedHeading}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {c.humanVsAutomated.automatedList.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Scenarios</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {c.scenarios.map((s) => (
            <Card key={s.title}>
              <CardContent className="pt-6">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.setup}</p>
                <p className="mt-2 text-sm font-medium text-foreground/90">{s.twist}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">{c.differentiationHeading}</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          {c.differentiationBullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">{c.formatsHeading}</h2>
        <p className="text-muted-foreground">{c.formatsIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.formats.map((f) => (
            <Card key={f.label}>
              <CardContent className="pt-4">
                <div className="font-medium">{f.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{f.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">{c.idealIntroHeading}</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          {c.idealVenues.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 md:grid-cols-2 md:items-start">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{c.aboutHeading}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{c.aboutBio}</p>
          {aboutImg ? (
            // eslint-disable-next-line @next/next/no-img-element -- env URL may not be in images.remotePatterns
            <img
              src={aboutImg}
              alt=""
              className="aspect-[4/3] w-full max-w-md rounded-lg border border-border object-cover"
            />
          ) : null}
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{c.proofHeading}</h2>
          <p className="text-sm text-muted-foreground">{c.proofIntro}</p>
          {c.proofPlaceholders.map((p, i) => (
            <Card key={i}>
              <CardContent className="pt-4 text-sm italic text-muted-foreground">
                {p.quote}
                {p.attribution ? (
                  <div className="mt-2 not-italic text-xs text-foreground/80">— {p.attribution}</div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-muted/40 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">{c.inquiryHeading}</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{c.inquiryBody}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={inquiryHref}>Email to book</a>
          </Button>
          <Button variant="outline" asChild>
            <Link href={paths.curriculum}>Curriculum</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={paths.lab}>Facilitator lab</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
