type Props = {
  children: string
  className?: string
}

export function SectionLabel({ children, className }: Props) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 ${className ?? ''}`}
    >
      {children}
    </p>
  )
}
