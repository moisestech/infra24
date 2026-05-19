'use client'

import type { ReactNode } from 'react'

import { MobileBottomNav, type MobileTabId } from './MobileBottomNav'

type MobileShellProps = {
  tab: MobileTabId
  onTab: (t: MobileTabId) => void
  children: ReactNode
}

export function MobileShell({ tab, onTab, children }: MobileShellProps) {
  return (
    <div className="flex min-h-[70vh] flex-col pb-20 md:hidden">
      <div className="flex-1">{children}</div>
      <MobileBottomNav active={tab} onChange={onTab} />
    </div>
  )
}

export type MobileTab = MobileTabId
