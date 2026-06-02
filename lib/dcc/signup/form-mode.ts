export type DccSignupFormMode = 'quick' | 'full'

export function parseSignupFormMode(param: string | undefined): DccSignupFormMode {
  if (param === 'full' || param === 'index') return 'full'
  return 'quick'
}
