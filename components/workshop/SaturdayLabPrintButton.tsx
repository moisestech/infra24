'use client'

export function SaturdayLabPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 print:hidden"
    >
      Print this page
    </button>
  )
}
