'use client'

import type { ReactNode } from 'react'
import { useEdgeZonesConceptHover } from '@/components/marketing/edgezones/EdgeZonesConceptHoverContext'
import type { EdgeZonesIconName, EdgeZonesThemeAccent } from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  icon: EdgeZonesIconName
  accent: EdgeZonesThemeAccent
  label: string
  caption: string
}

/** Concept paragraph — highlights on hover and drives the icon stage panel. */
export function EdgeZonesConceptParagraph({ children, className, icon, accent, label, caption }: Props) {
  const { setHover } = useEdgeZonesConceptHover()

  return (
    <p
      className={cn('ez-hover-paragraph ez-concept-paragraph ez-body-prose', className)}
      onMouseEnter={() => setHover({ icon, accent, label, caption })}
      onFocus={() => setHover({ icon, accent, label, caption })}
      tabIndex={0}
    >
      {children}
    </p>
  )
}
