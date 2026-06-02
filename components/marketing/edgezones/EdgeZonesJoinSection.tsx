'use client'

import { DccSignupForm } from '@/components/dcc/signup/DccSignupForm'

export function EdgeZonesJoinSection() {
  return (
    <DccSignupForm source="edgezones" formMode="quick" showPathwayShell={false} compactHeader />
  )
}
