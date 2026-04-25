import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VcnTool } from '@/lib/course/vibe-net-art/tool-stack'

const categoryLabel: Record<VcnTool['category'], string> = {
  'quick-start': 'Quick start',
  structured: 'Structured build',
  'ai-assisted': 'AI-assisted',
  advanced: 'Advanced',
}

type Props = {
  tools: VcnTool[]
}

const CATEGORY_ORDER: VcnTool['category'][] = ['quick-start', 'structured', 'ai-assisted', 'advanced']

export function VcnToolStack({ tools }: Props) {
  const grouped = tools.reduce<Record<string, VcnTool[]>>((acc, t) => {
    acc[t.category] = acc[t.category] ? [...acc[t.category], t] : [t]
    return acc
  }, {})

  return (
    <section className="space-y-4" id="tool-stack">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Tool stack</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Beginner-friendly defaults with a clear path toward publishing and creative coding.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => (
          <Card key={cat} className="border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{categoryLabel[cat]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {grouped[cat].map((tool) => (
                <div key={tool.name}>
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {tool.name}
                  </a>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{tool.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
