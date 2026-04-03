'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ProofStripItem = {
  slug: string;
  title: string;
  challenge: string;
  coverImage: string;
  coverAlt: string;
};

function ProofCard({
  item,
  className,
  imageClassName,
  priority,
}: {
  item: ProofStripItem;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/projects/${item.slug}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-neutral-100',
          imageClassName ?? 'aspect-[16/10]'
        )}
      >
        <Image
          src={item.coverImage}
          alt={item.coverAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 85vw, (max-width: 1280px) 50vw, 40vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        <p className="absolute bottom-3 left-3 right-3 text-sm font-semibold leading-snug text-white drop-shadow">
          {item.title}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-3 text-sm text-neutral-600">{item.challenge}</p>
        <span className="mt-4 text-sm font-medium text-neutral-900 underline-offset-4 group-hover:underline">
          Read the pattern
        </span>
      </div>
    </Link>
  );
}

export function ProofStrip({
  items,
  className,
}: {
  items: readonly ProofStripItem[];
  className?: string;
}) {
  const [lead, second, third] = items;

  return (
    <>
      <div
        className={cn(
          '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:hidden',
          className
        )}
      >
        {items.map((item, i) => (
          <motion.article
            key={item.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.06 * i }}
            className="w-[min(100%,min(360px,85vw))] shrink-0 snap-center"
          >
            <ProofCard item={item} priority={i === 0} />
          </motion.article>
        ))}
      </div>

      {lead && second && third ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="hidden gap-6 lg:grid lg:grid-cols-3 lg:grid-rows-2"
        >
          <article className="col-span-2 row-span-2 min-h-0">
            <ProofCard
              item={lead}
              imageClassName="min-h-[280px] lg:min-h-[320px]"
              priority
            />
          </article>
          <article className="col-span-1 row-start-1 col-start-3 min-h-0">
            <ProofCard item={second} />
          </article>
          <article className="col-span-1 row-start-2 col-start-3 min-h-0">
            <ProofCard item={third} />
          </article>
        </motion.div>
      ) : (
        <div className={cn('hidden gap-6 lg:grid lg:grid-cols-3', className)}>
          {items.map((item) => (
            <article key={item.slug}>
              <ProofCard item={item} />
            </article>
          ))}
        </div>
      )}
    </>
  );
}
