'use client'

import { Users } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ipAgeOfAiParticipants,
  ipAgeOfAiProgramInstructorsIntro,
} from '@/lib/workshops/ip-age-of-ai-program'
import { IpAgeOfAiSpeakerBio, IpAgeOfAiSpeakerHeadshot } from '@/components/workshops/marketing/IpAgeOfAiSpeakerBlocks'

export function IpAgeOfAiProgramInstructors({
  sectionId,
  avatarClassName,
  className,
}: {
  /** Landmark id for in-page nav */
  sectionId?: string
  /** e.g. h-36 w-36 for larger hero avatars */
  avatarClassName?: string
  className?: string
}) {
  const people = [...ipAgeOfAiParticipants].sort((a, b) => a.order - b.order)
  const count = people.length
  const countLabel =
    count === 1 ? '1 instructor' : `${count} instructors & moderator`

  return (
    <section
      id={sectionId}
      className={cn('scroll-mt-28 space-y-6', className)}
      aria-labelledby="ip-age-of-ai-program-instructors-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="ip-age-of-ai-program-instructors-heading"
          className="text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Program instructors
        </h2>
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Users className="h-4 w-4 shrink-0" aria-hidden />
          {countLabel}
        </p>
      </div>

      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {ipAgeOfAiProgramInstructorsIntro}
      </p>

      <div className="mx-auto flex w-full max-w-lg flex-col gap-10 pt-2">
        {people.map((person) => (
          <article
            key={person.id}
            className="relative rounded-2xl border border-border bg-card px-6 pb-6 pt-16 shadow-sm dark:bg-card/80"
          >
            <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
              <IpAgeOfAiSpeakerHeadshot
                person={person}
                className={avatarClassName ?? 'h-36 w-36 md:h-40 md:w-40'}
              />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground md:text-xl">{person.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">{person.tagline}</p>
            </div>

            <div className="mt-5">
              <IpAgeOfAiSpeakerBio person={person} />
            </div>

            <div className="mt-5 flex justify-center">
              {person.linkedInUrl ? (
                <Button variant="outline" size="sm" className="gap-2 rounded-full" asChild>
                  <a href={person.linkedInUrl} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="h-4 w-4 shrink-0" aria-hidden />
                    LinkedIn
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="gap-2 rounded-full" disabled>
                  <FaLinkedin className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
                  LinkedIn (soon)
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
