import type { FC } from 'react'
import type { BoardBackgroundPickerModalProps } from './board_background_picker_modal_type'
import { defaultImages } from '~/lib/boards_background'
import { Modal } from '~/components/ui/modal/modal'

export const BoardBackgroundPickerModal: FC<BoardBackgroundPickerModalProps> = ({
  open,
  onClose,
  onPick,
}) => {
  const images = defaultImages.slice(0, 9)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Choose a background"
      description="Pick one of the defaults."
      widthClassName="max-w-[560px]"
    >
      <div className="grid grid-cols-3 gap-3">
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
    </Modal>
  )
}
