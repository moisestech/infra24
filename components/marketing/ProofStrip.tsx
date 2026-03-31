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

export function ProofStrip({
  items,
  className,
}: {
  items: readonly ProofStripItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0',
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
          className="w-[min(100%,min(360px,85vw))] shrink-0 snap-center sm:w-auto sm:shrink"
        >
          <Link
            href={`/case-studies/${item.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              <Image
                src={item.coverImage}
                alt={item.coverAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 85vw, 33vw"
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
        </motion.article>
      ))}
    </div>
  );
}
