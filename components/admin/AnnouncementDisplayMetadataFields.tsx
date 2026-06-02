'use client';

import type {
  DisplayMetadataFormState,
  TakeoverOverlayFormState,
} from '@/lib/display/announcement-display-metadata-form';

interface AnnouncementDisplayMetadataFieldsProps {
  value: DisplayMetadataFormState;
  onChange: (next: DisplayMetadataFormState) => void;
  hasImageUrl?: boolean;
}

function overlayField(
  overlay: TakeoverOverlayFormState,
  patch: Partial<TakeoverOverlayFormState>
): TakeoverOverlayFormState {
  return { ...overlay, ...patch };
}

export function AnnouncementDisplayMetadataFields({
  value,
  onChange,
  hasImageUrl = false,
}: AnnouncementDisplayMetadataFieldsProps) {
  const set = (patch: Partial<DisplayMetadataFormState>) => {
    onChange({ ...value, ...patch });
  };

  const setOverlay = (patch: Partial<TakeoverOverlayFormState>) => {
    onChange({ ...value, overlay: overlayField(value.overlay, patch) });
  };

  const showVideoField =
    value.display_takeover &&
    (value.media_type === 'video' || value.media_type === '');

  const isOverlay = value.takeover_mode === 'overlay';

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-4 space-y-4 bg-gray-50/80 dark:bg-gray-900/40">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Smart sign display</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Full-bleed image or video takeover for kiosk carousel. Undated takeover slides are always on;
          use Evergreen to keep a dated slide visible outside its event window.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value.display_takeover}
          onChange={(e) => set({ display_takeover: e.target.checked })}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-800 dark:text-gray-200">
          <span className="font-medium">Display takeover</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Replace the standard template with a full-screen image or video
          </span>
        </span>
      </label>

      {value.display_takeover && (
        <>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value.evergreen}
              onChange={(e) => set({ evergreen: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-800 dark:text-gray-200">
              <span className="font-medium">Evergreen (always on)</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Ignore event dates on the smart sign. Undated takeover slides are always on by default.
              </span>
            </span>
          </label>

          <div>
            <label
              htmlFor="display_takeover_mode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Content mode
            </label>
            <select
              id="display_takeover_mode"
              value={value.takeover_mode}
              onChange={(e) =>
                set({ takeover_mode: e.target.value as DisplayMetadataFormState['takeover_mode'] })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="asset">Pre-designed asset — text is part of the image/video</option>
              <option value="overlay">App text overlay — media is background; app renders text</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="display_media_type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Media type
              </label>
              <select
                id="display_media_type"
                value={value.media_type}
                onChange={(e) =>
                  set({
                    media_type: e.target.value as DisplayMetadataFormState['media_type'],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Auto (video if set, else image)</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="display_pin_order"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Pin order
              </label>
              <input
                type="number"
                id="display_pin_order"
                min={0}
                step={1}
                value={value.pin_order}
                onChange={(e) => set({ pin_order: e.target.value })}
                placeholder="0 = first among takeover slides"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Lower numbers play first. Leave empty for default ordering.
              </p>
            </div>
          </div>

          {showVideoField && (
            <div>
              <label
                htmlFor="display_video_url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Video URL
              </label>
              <input
                type="url"
                id="display_video_url"
                value={value.video_url}
                onChange={(e) => set({ video_url: e.target.value })}
                placeholder="https://res.cloudinary.com/.../video.mp4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                MP4, WebM, or MOV. Used when media type is video or auto-detect.
              </p>
            </div>
          )}

          {!hasImageUrl && value.media_type !== 'video' && !value.video_url.trim() && (
            <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2">
              Add an image URL above, or set a video URL, for the takeover to render on the smart sign.
            </p>
          )}

          {!isOverlay && (
            <div className="space-y-3 rounded-md border border-gray-200 dark:border-gray-600 p-3 bg-white/60 dark:bg-gray-800/40">
              <div>
                <label
                  htmlFor="display_takeover_qr"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  QR code
                </label>
                <select
                  id="display_takeover_qr"
                  value={value.takeover_qr}
                  onChange={(e) =>
                    set({ takeover_qr: e.target.value as DisplayMetadataFormState['takeover_qr'] })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="embedded">Embedded in asset — no app QR (designed posters)</option>
                  <option value="app">App-generated QR — dynamic scan link from this announcement</option>
                  <option value="none">None — no app QR</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use embedded when the image or video already includes a QR code to avoid duplicates.
                </p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.show_view_details}
                  onChange={(e) => set({ show_view_details: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Show view details link</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Off by default when QR is embedded in the asset
                  </span>
                </span>
              </label>
            </div>
          )}

          {isOverlay && (
            <div className="space-y-4 rounded-md border border-gray-200 dark:border-gray-600 p-3 bg-white/60 dark:bg-gray-800/40">
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                Overlay copy (optional — overrides announcement fields)
              </p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="display_title_override" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Display title
                  </label>
                  <input
                    id="display_title_override"
                    type="text"
                    value={value.display_title}
                    onChange={(e) => set({ display_title: e.target.value })}
                    placeholder="Leave empty to use announcement title"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="display_body_override" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Display body
                  </label>
                  <textarea
                    id="display_body_override"
                    value={value.display_body}
                    onChange={(e) => set({ display_body: e.target.value })}
                    rows={3}
                    placeholder="Leave empty to use announcement body"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="display_location_override" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Display location
                  </label>
                  <input
                    id="display_location_override"
                    type="text"
                    value={value.display_location}
                    onChange={(e) => set({ display_location: e.target.value })}
                    placeholder="Leave empty to use announcement location"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mb-2">Visible blocks</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(
                    [
                      ['show_date', 'Date'],
                      ['show_title', 'Title'],
                      ['show_body', 'Body'],
                      ['show_location', 'Location'],
                      ['show_people', 'People'],
                      ['show_type_badge', 'Type badge'],
                      ['show_qr', 'QR code'],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={value.overlay[key]}
                        onChange={(e) => setOverlay({ [key]: e.target.checked })}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="display_scrim" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Background scrim
                </label>
                <select
                  id="display_scrim"
                  value={value.overlay.scrim}
                  onChange={(e) =>
                    setOverlay({ scrim: e.target.value as TakeoverOverlayFormState['scrim'] })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="gradient">Gradient (default)</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
