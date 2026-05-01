/**
 * Decorative isometric “packet stack” for hero areas — CSS 3D only (compositor-friendly).
 */
export function KnightPacketVolumeMark() {
  return (
    <div className="knight-packet-volume-mark" aria-hidden>
      <div className="knight-packet-volume-mark__stage">
        <div className="knight-packet-volume-mark__stack">
          <span className="knight-packet-volume-mark__sheet knight-packet-volume-mark__sheet--back" />
          <span className="knight-packet-volume-mark__sheet knight-packet-volume-mark__sheet--mid" />
          <span className="knight-packet-volume-mark__sheet knight-packet-volume-mark__sheet--front">
            <span className="knight-packet-volume-mark__seal absolute right-[14%] top-1/2 size-[38px] -translate-y-1/2 rounded-full" />
          </span>
        </div>
      </div>
    </div>
  );
}
