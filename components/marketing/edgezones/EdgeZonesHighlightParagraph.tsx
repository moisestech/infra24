'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
}

/** Paragraph block with hover highlight for improved scanability. */
export function EdgeZonesHighlightParagraph({ children, className }: Props) {
  return <p className={cn('ez-hover-paragraph ez-body-prose', className)}>{children}</p>
}
