'use client';

import { useEffect } from 'react';

const WORKLET_URL = '/worklets/partners-pixel-grid.js';
const READY_CLASS = 'cdc-partners-paint-ready';

/**
 * Registers the partners card CSS Paint worklet once (Chrome/Edge).
 * When successful, sets `cdc-partners-paint-ready` on `<html>` so CSS can
 * switch from gradient fallback to `paint(partners-pixel-grid)`.
 */
export function PartnersCardPaintRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const css = window.CSS as typeof CSS & { paintWorklet?: { addModule: (url: string) => Promise<void> } };
    if (!css?.paintWorklet) return;

    let cancelled = false;
    css.paintWorklet
      .addModule(WORKLET_URL)
      .then(() => {
        if (!cancelled) document.documentElement.classList.add(READY_CLASS);
      })
      .catch(() => {
        /* keep CSS fallback */
      });

    return () => {
      cancelled = true;
      document.documentElement.classList.remove(READY_CLASS);
    };
  }, []);

  return null;
}
