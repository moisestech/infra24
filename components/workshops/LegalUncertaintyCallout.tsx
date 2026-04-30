type LegalUncertaintyCalloutProps = {
  message?: string
}

const defaultMessage =
  'Legal uncertainty: This area is still developing. Treat this as a risk-awareness framework, not a guaranteed legal outcome.'

export function LegalUncertaintyCallout({ message = defaultMessage }: LegalUncertaintyCalloutProps) {
  return (
    <aside className="rounded-xl border border-amber-300 bg-amber-50 p-4">
      <p className="text-sm leading-relaxed text-amber-900">{message}</p>
    </aside>
  )
}
