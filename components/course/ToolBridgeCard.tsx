import type { Tool } from '@/lib/course/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionLabel } from '@/components/course/SectionLabel'
import { LessonExternalAnchor } from '@/components/course/LessonExternalAnchor'

type Props = {
  tools: Tool[]
  title?: string
  lead?: string
}

export function ToolBridgeCard({
  tools,
  title = 'Tool bridge',
  lead = 'Connect historical ideas to a concrete making workflow.',
}: Props) {
  if (!tools.length) return null
  return (
    <Card className="border-neutral-200 dark:border-neutral-800" id="tool-bridge">
      <CardHeader className="pb-2">
        <SectionLabel>Try it</SectionLabel>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{lead}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {tools.map((t) => (
          <div key={t.name}>
            <p className="font-medium text-neutral-900 dark:text-neutral-50">
              {t.website ? (
                <LessonExternalAnchor href={t.website} className="text-primary underline-offset-4 hover:underline">
                  {t.name}
                </LessonExternalAnchor>
              ) : (
                t.name
              )}
              <span className="ml-2 text-xs font-normal text-neutral-500">({t.category})</span>
            </p>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">{t.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
