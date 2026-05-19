import { AskThePlaceCommandCenter } from '@/components/ask-the-place/AskThePlaceCommandCenter'

type PageProps = {
  params: Promise<{ vertical: string; prospect: string }>
}

export default async function AskThePlaceDemoPage({ params }: PageProps) {
  const { vertical, prospect } = await params
  return <AskThePlaceCommandCenter vertical={vertical} prospect={prospect} />
}
