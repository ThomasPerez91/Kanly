import type { FC } from 'react'

import type { BoardPreviewProps } from './board_preview_type'
import { boardTypeIconNode, boardTypeLabel } from '~/components/board/board_type/board_type'

export const BoardPreview: FC<BoardPreviewProps> = ({ name, type, backgroundUrl }) => {
  const bg = backgroundUrl.trim() ? `url(${backgroundUrl.trim()})` : null
  const previewTitle = name.trim() ? name.trim() : 'Untitled board'

  return (
    <div className="board-preview-col">
      <div className="board-preview-sticky">
        <div className="text-xs font-900 text-text-muted uppercase tracking-wide">Preview</div>

        <div className="board-preview mt-2">
          <div className="board-preview-inner">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={bg ? { backgroundImage: bg } : undefined}
              aria-hidden="true"
            />

            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/0"
              aria-hidden="true"
            />

            <div className="relative h-full p-3 flex flex-col justify-end">
              <div className="text-sm font-900 text-white drop-shadow">{previewTitle}</div>

              <div className="mt-1 inline-flex items-center gap-2 text-white/90 text-xs font-800">
                <span className="board-type-badge">{boardTypeIconNode(type)}</span>
                <span className="drop-shadow">{boardTypeLabel(type)}</span>
              </div>
            </div>
          </div>

          <div className="p-3">
            <div className="text-xs text-text-muted truncate">
              {backgroundUrl.trim() ? backgroundUrl.trim() : 'No background selected'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
