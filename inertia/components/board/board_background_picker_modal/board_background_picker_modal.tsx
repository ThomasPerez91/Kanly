import type { FC } from 'react'
import type { BoardBackgroundPickerModalProps } from './board_background_picker_modal_type'
import { defaultImages } from '~/lib/boards_background'

export const BoardBackgroundPickerModal: FC<BoardBackgroundPickerModalProps> = ({
  open,
  onClose,
  onPick,
}) => {
  if (!open) return null

  const images = defaultImages.slice(0, 9)

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative mx-auto mt-16 w-[min(92vw,560px)]">
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-900 text-text">Choose a background</div>
              <div className="mt-1 text-sm text-text-muted">Pick one of the defaults.</div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-xl border border-border bg-surface hover:bg-bg transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => {
                  onPick(img.urls.full)
                  onClose()
                }}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface focus:outline-none focus:(ring-4 ring-brand-500/20)"
                aria-label={img.alt_description ?? img.slug}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-200 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${img.urls.small})` }}
                  aria-hidden="true"
                />
                <div className="relative h-22 w-full" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
