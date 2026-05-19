import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StaffBriefCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border border-amber-400/25 bg-[#080d14] text-zinc-100 shadow-lg shadow-amber-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight text-zinc-100">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
      </CardContent>
    </Card>
  )
}
