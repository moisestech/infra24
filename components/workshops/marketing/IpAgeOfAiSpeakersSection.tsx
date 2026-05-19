'use client'

import { IpAgeOfAiProgramInstructors } from '@/components/workshops/marketing/IpAgeOfAiProgramInstructors'

/** @deprecated Use `IpAgeOfAiProgramInstructors`; kept for imports that pass `headingId`. */
export function IpAgeOfAiSpeakersSection({
  headingId,
  headingClassName: _headingClassName,
  avatarClassName,
  className,
}: {
  headingId?: string
  headingClassName?: string
  avatarClassName?: string
  className?: string
}) {
  return (
    <IpAgeOfAiProgramInstructors
      sectionId={headingId}
      avatarClassName={avatarClassName}
      className={className}
    />
  )
}

export { participantInitials } from '@/components/workshops/marketing/IpAgeOfAiSpeakerBlocks'
