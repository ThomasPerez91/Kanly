import type { FC } from 'react'
import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

import type { DrawerProps } from './drawer_type'

export const Drawer: FC<DrawerProps> = ({ open, onClose, title, children }) => {
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
    <div className="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="absolute left-0 top-0 h-full w-[84vw] max-w-[340px] bg-bg border-r border-border shadow-soft animate-[slideIn_.15s_ease-out]">
        <div className="h-14 px-3 border-b border-border flex items-center justify-between">
          <div className="text-sm font-900 text-text truncate">{title ?? 'Menu'}</div>
          <button
            type="button"
            className="h-10 w-10 rounded-xl border border-border bg-surface flex items-center justify-center"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="h-[calc(100%-56px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
