import Link from 'next/link';
import type { BreadcrumbItem } from '@/lib/cdc/routes';
import { cn } from '@/lib/utils';

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-neutral-500', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="hover:text-neutral-800">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            <span aria-hidden className="text-neutral-300">
              /
            </span>
            {i === items.length - 1 ? (
              <span className="font-medium text-neutral-700">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-neutral-800">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
