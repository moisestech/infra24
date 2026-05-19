import { Button } from '@/components/ui/button'

type QRHandoffProps = {
  ready: boolean
}

export function QRHandoff({ ready }: QRHandoffProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1118] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Mobile handoff</p>
      <p className="mt-2 text-sm text-zinc-300">
        {ready
          ? 'Your itinerary is ready. Guest scans QR from signage to open the route on mobile.'
          : 'Lobby screen → QR scan → mobile itinerary → save / share / concierge.'}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" className="border border-white/10 bg-white/5 text-xs text-zinc-100" disabled={!ready}>
          Save route
        </Button>
        <Button size="sm" variant="secondary" className="border border-white/10 bg-white/5 text-xs text-zinc-100" disabled={!ready}>
          Open map
        </Button>
        <Button size="sm" variant="secondary" className="border border-white/10 bg-white/5 text-xs text-zinc-100" disabled={!ready}>
          Share
        </Button>
        <Button size="sm" className="bg-teal-600 text-xs text-white hover:bg-teal-500" disabled={!ready}>
          Send to concierge
        </Button>
      </div>
    </div>
  )
}
