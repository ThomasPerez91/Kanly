import type { FC } from 'react'
import { useEffect } from 'react'
import type { ModalProps } from './modal_type'
import { FiX } from 'react-icons/fi'

export const Modal: FC<ModalProps> = ({
  open,
  title,
  description,
  children,
  onClose,
  widthClassName = 'max-w-lg',
}) => {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Center vertically */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div
          className={[
            'w-full card p-0 overflow-hidden',
            'max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-48px)]',
            widthClassName,
          ].join(' ')}
        >
          <div className="h-14 px-4 border-b border-border flex items-center justify-between">
            <div className="min-w-0">
              {title ? <div className="text-sm font-900 text-text truncate">{title}</div> : null}
              {description ? (
                <div className="text-xs text-text-muted truncate">{description}</div>
              ) : null}
            </div>

            <button
              type="button"
              className="h-10 w-10 rounded-xl border border-border bg-surface flex items-center justify-center hover:bg-bg transition"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-4 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
