"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SafetyGate({
  title = "Safety gate",
  note,
  checklist,
  onComplete,
  storageKey,
}: {
  title?: string;
  note: string;
  checklist: string[];
  onComplete?: () => void;
  storageKey?: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    if (window.localStorage.getItem(storageKey) === "1") {
      setUnlocked(true);
      onComplete?.();
    }
  }, [storageKey, onComplete]);

  const allDone = checklist.every((item) => checked[item]);

  function unlock() {
    if (!allDone) return;
    setUnlocked(true);
    if (storageKey && typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "1");
    }
    onComplete?.();
  }

  if (unlocked) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        Safety check complete for this device. Equipment operation remains
        instructor-led.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-md border-2 border-amber-400 bg-amber-50 p-4 text-amber-950">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide">{title}</p>
        <p className="mt-2 text-sm">{note}</p>
      </div>
      <ul className="space-y-2">
        {checklist.map((item) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(checked[item])}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [item]: e.target.checked }))
                }
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!allDone}
        onClick={unlock}
        className={cn(
          "rounded px-4 py-2 text-sm font-medium",
          allDone
            ? "bg-neutral-950 text-white"
            : "cursor-not-allowed bg-neutral-300 text-neutral-500",
        )}
      >
        Continue past safety gate
      </button>
    </div>
  );
}

export function RoomTimer({
  endsAt,
  label,
  large,
}: {
  endsAt: string | null;
  label?: string | null;
  large?: boolean;
}) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (!endsAt) {
      setRemainingMs(null);
      return;
    }
    const tick = () => {
      setRemainingMs(Math.max(0, new Date(endsAt).getTime() - Date.now()));
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (!endsAt || remainingMs === null) return null;

  const totalSec = Math.ceil(remainingMs / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <div className={cn("text-center", large ? "space-y-2" : "")}>
      {label ? (
        <p
          className={cn(
            "uppercase tracking-wide",
            large ? "text-2xl text-neutral-300" : "text-xs text-neutral-500",
          )}
        >
          {label}
        </p>
      ) : null}
      <p
        className={cn(
          "font-semibold tabular-nums",
          large
            ? "text-7xl text-white md:text-8xl"
            : "text-2xl text-neutral-950",
        )}
      >
        {mm}:{ss}
      </p>
    </div>
  );
}
