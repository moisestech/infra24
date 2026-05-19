'use client'

import { useEffect, useState } from 'react'

/** True after the first client commit — use to avoid SSR/client DOM mismatches. */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
