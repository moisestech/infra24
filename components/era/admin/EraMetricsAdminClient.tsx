'use client';

import { useMemo, useState } from 'react';
import type { EraMetricLadder } from '@/lib/era/metrics';
import { cn } from '@/lib/utils';

type AdminInitial = { channels: EraMetricLadder[] };

type EraMetricsAdminClientProps = {
  initial: AdminInitial;
};

type SaveState =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'ok'; message: string }
  | { kind: 'err'; message: string };

const TODAY_ISO = () => new Date().toISOString().slice(0, 10);

export function EraMetricsAdminClient({ initial }: EraMetricsAdminClientProps) {
  const [draft, setDraft] = useState<AdminInitial>(() =>
    JSON.parse(JSON.stringify(initial)) as AdminInitial
  );
  const [save, setSave] = useState<SaveState>({ kind: 'idle' });

  const formattedJson = useMemo(() => `${JSON.stringify(draft, null, 2)}\n`, [draft]);

  function updateChannelField(
    idx: number,
    patch: Partial<EraMetricLadder>
  ) {
    setDraft((prev) => {
      const next = { ...prev, channels: [...prev.channels] };
      next.channels[idx] = { ...next.channels[idx], ...patch };
      return next;
    });
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setSave({ kind: 'ok', message: 'JSON copied to clipboard.' });
    } catch (err) {
      setSave({
        kind: 'err',
        message: 'Could not access clipboard — select the textarea and copy manually.',
      });
    }
  }

  async function writeFile() {
    setSave({ kind: 'saving' });
    try {
      const res = await fetch('/api/era-metrics', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: formattedJson,
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string; hint?: string }
          | null;
        const reason = body?.error ?? `HTTP ${res.status}`;
        const hint = body?.hint ? ` ${body.hint}` : '';
        setSave({ kind: 'err', message: `${reason}.${hint}` });
        return;
      }
      setSave({
        kind: 'ok',
        message: 'data/era-metrics.json written. Reload the page to see the change.',
      });
    } catch (err) {
      setSave({
        kind: 'err',
        message: `Network error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={copyJson}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          Copy JSON to clipboard
        </button>
        <button
          type="button"
          onClick={writeFile}
          className="rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
          disabled={save.kind === 'saving'}
        >
          {save.kind === 'saving' ? 'Writing…' : 'Save to data/era-metrics.json'}
        </button>
      </div>
      {save.kind !== 'idle' && save.kind !== 'saving' ? (
        <p
          className={cn(
            'rounded-lg border px-4 py-3 text-sm',
            save.kind === 'ok'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100'
              : 'border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-100'
          )}
        >
          {save.message}
        </p>
      ) : null}

      <div className="space-y-4">
        {draft.channels.map((channel, idx) => (
          <fieldset
            key={channel.channel}
            className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <legend className="px-2 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {channel.channel}
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
                Metric
                <input
                  type="text"
                  value={channel.metric}
                  onChange={(e) => updateChannelField(idx, { metric: e.target.value })}
                  className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm normal-case tracking-normal text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
                Current
                <input
                  type="number"
                  value={channel.current}
                  onChange={(e) =>
                    updateChannelField(idx, {
                      current: Number(e.target.value || 0),
                      lastUpdated: TODAY_ISO(),
                    })
                  }
                  className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm normal-case tracking-normal text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
                Last updated
                <input
                  type="date"
                  value={channel.lastUpdated}
                  onChange={(e) => updateChannelField(idx, { lastUpdated: e.target.value })}
                  className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm normal-case tracking-normal text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </label>
              <div className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
                <span>Tier targets (read-only)</span>
                <ul className="space-y-1 text-[11px]">
                  {channel.tiers.map((tier) => (
                    <li key={tier.tier} className="flex justify-between">
                      <span>{tier.label}</span>
                      <span className="tabular-nums opacity-80">{tier.target}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-700 dark:text-neutral-300">
          Generated JSON
        </h2>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Paste this into <code className="font-mono">data/era-metrics.json</code> if the
          server-side write is unavailable.
        </p>
        <textarea
          readOnly
          value={formattedJson}
          rows={18}
          className="mt-2 w-full rounded-lg border border-neutral-300 bg-neutral-50 p-3 font-mono text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>
    </div>
  );
}
