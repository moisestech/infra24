import Link from 'next/link';
import { cn } from '@/lib/utils';

export type CardGridItem = {
  href: string;
  title: string;
  description: string;
};

type CardGridProps = {
  items: CardGridItem[];
  className?: string;
  columnsClassName?: string;
};

export function CardGrid({ items, className, columnsClassName }: CardGridProps) {
  return (
    <ul
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
        columnsClassName,
        className
      )}
    >
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 hover:bg-neutral-50/80"
          >
            <span className="text-sm font-semibold text-neutral-900">{item.title}</span>
            <span className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
