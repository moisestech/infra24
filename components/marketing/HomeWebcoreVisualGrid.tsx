'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { motion } from 'motion/react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { HomeVisualItem } from '@/lib/marketing/home-visual-assets';
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients';
import { cn } from '@/lib/utils';

type LightboxProp = { lightbox?: boolean };

export type HomeWebcoreVisualGridProps =
  | ({ mode: 'mosaic'; items: HomeVisualItem[]; className?: string } & LightboxProp)
  | ({ mode: 'row'; items: HomeVisualItem[]; className?: string } & LightboxProp)
  | ({ mode: 'strip'; items: HomeVisualItem[]; className?: string } & LightboxProp)
  | ({ mode: 'featured'; item: HomeVisualItem; className?: string } & LightboxProp);

function itemKey(item: HomeVisualItem, index: number) {
  return item.kind === 'image' ? item.src : `${item.gradientId}-${index}`;
}

function VisualSurface({
  item,
  className,
  imageClassName,
  priority,
}: {
  item: HomeVisualItem;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  if (item.kind === 'gradient') {
    return (
      <div
        className={cn(className, marketingGradientSurfaceClass(item.gradientId))}
        role="img"
        aria-label={item.alt}
      />
    );
  }
  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      priority={priority}
      unoptimized={item.src.includes('res.cloudinary.com')}
      className={cn(
        'object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.045] group-hover:contrast-[1.04] group-hover:saturate-[1.06]',
        imageClassName
      )}
    />
  );
}

function VisualFigure({
  item,
  sizes,
  priority,
  reduceMotion,
  className,
  imageWrapperClassName = 'aspect-[4/3] w-full sm:aspect-[5/4]',
  lightbox,
  onOpenLightbox,
}: {
  item: HomeVisualItem;
  sizes: string;
  priority?: boolean;
  reduceMotion: boolean | null;
  className?: string;
  imageWrapperClassName?: string;
  lightbox?: boolean;
  onOpenLightbox?: (item: HomeVisualItem) => void;
}) {
  const surfaceClass = cn(
    'cdc-webcore-visual-shine relative overflow-hidden bg-neutral-200/80',
    imageWrapperClassName
  );

  return (
    <motion.figure
      className={cn(
        'cdc-webcore-visual-frame group overflow-hidden rounded-lg',
        lightbox && 'cursor-zoom-in',
        className
      )}
      initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {lightbox && onOpenLightbox ? (
        <button
          type="button"
          className={cn(
            surfaceClass,
            'block w-full cursor-zoom-in text-left outline-none ring-offset-2 transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--cdc-teal)]'
          )}
          onClick={() => onOpenLightbox(item)}
          aria-haspopup="dialog"
          aria-label={`Open larger view: ${item.caption || item.alt}`}
        >
          {item.kind === 'image' ? (
            <VisualSurface item={item} imageClassName="object-cover" priority={priority} />
          ) : (
            <VisualSurface item={item} className="absolute inset-0" />
          )}
        </button>
      ) : (
        <div className={surfaceClass}>
          {item.kind === 'image' ? (
            <VisualSurface item={item} imageClassName="object-cover" priority={priority} />
          ) : (
            <VisualSurface item={item} className="absolute inset-0" />
          )}
        </div>
      )}
      {(item.caption || item.credit || lightbox) && (
        <figcaption className="mt-2 space-y-0.5 px-0.5">
          {item.caption && (
            <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
              {item.caption}
            </span>
          )}
          {item.credit && (
            <span className="block text-[11px] text-neutral-400">{item.credit}</span>
          )}
          {lightbox && onOpenLightbox ? (
            <span className="block font-mono text-[9px] font-normal normal-case tracking-normal text-neutral-400">
              Tap to enlarge
            </span>
          ) : null}
        </figcaption>
      )}
    </motion.figure>
  );
}

function LightboxDialog({
  item,
  open,
  onOpenChange,
}: {
  item: HomeVisualItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-h-[92vh] max-w-[min(96vw,56rem)] gap-3 border-[var(--cdc-border)] bg-neutral-950 p-3 text-neutral-100 sm:p-5',
          '[&>button]:text-neutral-300 [&>button]:hover:text-white [&>button]:hover:opacity-100'
        )}
      >
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-neutral-300">
            {item?.caption || (item?.kind === 'gradient' ? 'Texture' : 'Image')}
          </DialogTitle>
          {item?.credit ? (
            <p className="text-[11px] font-normal normal-case tracking-normal text-neutral-500">
              {item.credit}
            </p>
          ) : null}
          {item ? (
            <DialogDescription className="sr-only">{item.alt}</DialogDescription>
          ) : null}
        </DialogHeader>
        {item ? (
          <div className="relative mx-auto mt-1 max-h-[min(74vh,800px)] min-h-[220px] w-full">
            {item.kind === 'image' ? (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain"
                sizes="96vw"
              />
            ) : (
              <div
                className={cn(
                  'h-[min(74vh,520px)] w-full rounded-md sm:h-[min(74vh,640px)]',
                  marketingGradientSurfaceClass(item.gradientId)
                )}
                role="img"
                aria-label={item.alt}
              />
            )}
          </div>
        ) : null}
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          Esc or close
        </p>
      </DialogContent>
    </Dialog>
  );
}

export function HomeWebcoreVisualGrid(props: HomeWebcoreVisualGridProps) {
  const reduceMotion = useReducedMotion();
  const lightbox = props.lightbox ?? false;
  const [lightboxItem, setLightboxItem] = useState<HomeVisualItem | null>(null);

  const openLightbox = lightbox ? (item: HomeVisualItem) => setLightboxItem(item) : undefined;

  const dialog = lightbox ? (
    <LightboxDialog
      item={lightboxItem}
      open={!!lightboxItem}
      onOpenChange={(o) => {
        if (!o) setLightboxItem(null);
      }}
    />
  ) : null;

  if (props.mode === 'featured') {
    const { item, className } = props;
    return (
      <>
        <div className={className}>
          <VisualFigure
            item={item}
            sizes="(max-width: 768px) 100vw, 85vw"
            priority={false}
            reduceMotion={reduceMotion}
            imageWrapperClassName="aspect-video w-full"
            className="max-w-4xl"
            lightbox={lightbox}
            onOpenLightbox={openLightbox}
          />
        </div>
        {dialog}
      </>
    );
  }

  const { items, className } = props;

  if (props.mode === 'mosaic') {
    return (
      <>
        <div
          className={cn(
            'columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:break-inside-avoid',
            className
          )}
        >
          {items.map((item, i) => (
            <div key={itemKey(item, i)} className="mb-3">
              <VisualFigure
                item={item}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i < 3}
                reduceMotion={reduceMotion}
                lightbox={lightbox}
                onOpenLightbox={openLightbox}
              />
            </div>
          ))}
        </div>
        {dialog}
      </>
    );
  }

  if (props.mode === 'row') {
    return (
      <>
        <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
          {items.map((item, i) => (
            <VisualFigure
              key={itemKey(item, i)}
              item={item}
              sizes="(max-width: 768px) 100vw, 45vw"
              priority={i === 0}
              reduceMotion={reduceMotion}
              lightbox={lightbox}
              onOpenLightbox={openLightbox}
            />
          ))}
        </div>
        {dialog}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          '-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]',
          className
        )}
      >
        {items.map((item, i) => (
          <div
            key={itemKey(item, i)}
            className="w-[min(100%,280px)] shrink-0 snap-center sm:w-[min(100%,320px)]"
          >
            <VisualFigure
              item={item}
              sizes="320px"
              priority={i === 0}
              reduceMotion={reduceMotion}
              lightbox={lightbox}
              onOpenLightbox={openLightbox}
            />
          </div>
        ))}
      </div>
      {dialog}
    </>
  );
}
