type HomeSysLogPanelProps = {
  lines: readonly string[];
};

/**
 * Decorative “console” block — stylized flavor, not live telemetry (see section copy).
 */
export function HomeSysLogPanel({ lines }: HomeSysLogPanelProps) {
  return (
    <div className="cdc-sys-log-panel">
      <div className="cdc-sys-log-panel-header">
        <span className="flex gap-1" aria-hidden>
          <span className="cdc-sys-log-dot bg-red-400/90" />
          <span className="cdc-sys-log-dot bg-amber-400/90" />
          <span className="cdc-sys-log-dot bg-emerald-500/85" />
        </span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
          SYS.LOG
        </span>
      </div>
      <ul className="cdc-sys-log-body text-neutral-600">
        {lines.map((line, i) => (
          <li key={i}>
            {line}
            {i === lines.length - 1 ? (
              <span className="cdc-sys-log-cursor" aria-hidden>
                _
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
