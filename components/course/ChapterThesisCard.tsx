type Props = {
  thesis: string
}

export function ChapterThesisCard({ thesis }: Props) {
  return (
    <section className="rounded-[2rem] border border-neutral-800 bg-neutral-950 p-8 text-white shadow-sm dark:border-neutral-700 md:p-10">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/60">Chapter thesis</p>
      <p className="mt-4 max-w-4xl text-2xl font-medium leading-9 text-white md:text-3xl md:leading-[1.35]">
        {thesis}
      </p>
    </section>
  )
}
