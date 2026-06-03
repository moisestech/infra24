'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles } from 'lucide-react';

import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding';
import { getTenantConfig } from '@/lib/tenant';
import { cn } from '@/lib/utils';

type OrgChrome = {
  solid: string;
  softSurface: string;
};

type AnnouncementMemoryAgentPromptProps = {
  orgSlug: string;
  chrome: OrgChrome;
  className?: string;
};

/** Compact Memory Agent nudge — half-width chip; expands for example questions. */
export function AnnouncementMemoryAgentPrompt({
  orgSlug,
  chrome,
  className,
}: AnnouncementMemoryAgentPromptProps) {
  const [open, setOpen] = useState(false);
  const tenant = getTenantConfig(orgSlug);
  if (!tenant?.dashboard.showMemoryAgent) return null;

  const branding = getMemoryAgentBranding(orgSlug);
  const questions = branding.suggestedQuestions.slice(0, 2);
  const agentHref = `/o/${orgSlug}/memory-agent`;

  const nudgeStyle = {
    '--ma-nudge-primary': chrome.solid,
    '--ma-nudge-soft': chrome.softSurface,
  } as CSSProperties;

  return (
    <div className={cn('w-full', className)} style={nudgeStyle}>
      <div
        className={cn(
          'ma-announcement-nudge group/nudge overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
          open && 'is-open shadow-md'
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/40"
        >
          <span
            className="ma-nudge-sparkle flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: chrome.softSurface }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: chrome.solid }} aria-hidden />
          </span>
          <span className="ma-nudge-label min-w-0 flex-1 text-sm font-medium text-gray-900 dark:text-white">
            Ask Memory Agent
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
              open && 'rotate-180'
            )}
            aria-hidden
          />
        </button>

        <div
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-200 ease-out',
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-1.5 border-t border-gray-100 px-3 pb-2.5 pt-2 dark:border-gray-700">
              {questions.map((question) => (
                <Link
                  key={question}
                  href={`${agentHref}?q=${encodeURIComponent(question)}`}
                  className="ma-nudge-question block truncate rounded-md px-2 py-1.5 text-xs text-gray-700 transition-[background-color,box-shadow,color] dark:text-gray-300"
                  title={question}
                >
                  {question}
                </Link>
              ))}
              <Link
                href={agentHref}
                className="inline-block px-2 py-1 text-xs font-medium hover:underline"
                style={{ color: chrome.solid }}
              >
                Open agent →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
