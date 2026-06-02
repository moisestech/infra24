'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { captureAttributionFromWindow } from '@/lib/dcc/signup/attribution'

/** Persists UTM / source / QR params from URL into localStorage for later form submit. */
export function DccSignupAttributionCapture() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    captureAttributionFromWindow(pathname)
  }, [pathname, searchParams])

  return null
}
