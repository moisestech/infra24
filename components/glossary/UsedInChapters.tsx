type UsedInChaptersProps = {
  chapterNumbers?: number[]
}

export function UsedInChapters({ chapterNumbers }: UsedInChaptersProps) {
  if (!chapterNumbers?.length) return null
  return (
    <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
      <span className="font-medium text-neutral-600 dark:text-neutral-300">Used in chapters:</span>{' '}
      {chapterNumbers.join(', ')}
    </p>
  )
}
