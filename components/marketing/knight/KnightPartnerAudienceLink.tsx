import { knightPartnersContentFragment } from '@/lib/marketing/knight-nav';

/**
 * Gradient + subtle glitch (CSS-only, theme-aware). Links into the partner cards block.
 */
export function KnightPartnerAudienceLink() {
  return (
    <a
      href={knightPartnersContentFragment}
      className="knight-audience-link group mx-auto flex max-w-xl flex-col items-center rounded-xl px-4 py-2 text-center outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950"
    >
      <span className="knight-audience-link__label">Who this packet is for</span>
      <span className="mt-1 text-[10px] font-normal normal-case tracking-normal text-neutral-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-neutral-400">
        Jump to partner cards
      </span>
    </a>
  );
}
