import Link from "next/link";
import { cn } from "@/lib/utils";
import { Beaker, BookOpen, Building2, Grid2X2, Library } from "lucide-react";

const NAV = [
  { href: "/workshop/resin-printing", label: "Overview", Icon: Grid2X2 },
  {
    href: "/workshop/resin-printing/modules/welcome",
    label: "Modules",
    Icon: Library,
  },
  {
    href: "/workshop/resin-printing/resources",
    label: "Resources",
    Icon: BookOpen,
  },
  {
    href: "/workshop/resin-printing/booklet",
    label: "Booklet",
    Icon: BookOpen,
  },
  {
    href: "/workshop/resin-printing/venue/oolite",
    label: "Venues",
    Icon: Building2,
  },
] as const;

const shellWidth = "mx-auto w-full max-w-6xl";
const shellPad = "px-4 md:px-6";

export function WorkshopEngineShell({
  children,
  currentPath,
  brandTitle = "Resin Printing",
  brandSub = "Infra24 workshop engine",
}: {
  children: React.ReactNode;
  currentPath: string;
  brandTitle?: string;
  brandSub?: string;
}) {
  return (
    <div className="min-h-screen bg-[#f5f7f5] text-slate-950">
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-orange-400" />
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div
          className={cn(
            shellWidth,
            shellPad,
            "flex flex-wrap items-center justify-between gap-4 py-4",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
              <Beaker aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                {brandTitle}
              </p>
              <p className="text-sm text-slate-600">{brandSub}</p>
            </div>
          </div>
          <p className="max-w-xs text-left text-xs leading-relaxed text-slate-500 md:text-right">
            Not operator certification — supervised appointment prep.
          </p>
        </div>
        <nav
          className={cn(
            shellWidth,
            shellPad,
            "flex flex-wrap gap-x-4 gap-y-2 pb-4",
          )}
          aria-label="Workshop sections"
        >
          {NAV.map((item) => {
            const Icon = item.Icon;
            const active =
              currentPath === item.href ||
              (item.label === "Modules" && currentPath.includes("/modules/")) ||
              (item.label === "Venues" && currentPath.includes("/venue/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className={cn(shellWidth, shellPad, "py-8 md:py-10")}>
        {children}
      </main>
    </div>
  );
}
