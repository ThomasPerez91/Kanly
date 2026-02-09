import type { FC, ReactNode } from 'react'
import { FiColumns } from 'react-icons/fi'
import { PiKanbanFill } from 'react-icons/pi'
import { HiMiniTableCells } from 'react-icons/hi2'
import { MdViewTimeline } from 'react-icons/md'
import { IoCalendar } from 'react-icons/io5'

import type { BoardType } from '~/lib/types/board_public'

export const BOARD_TYPES = ['kanban', 'table', 'roadmap', 'calendar'] as const

export const boardTypeLabel = (type: BoardType): string => {
  if (type === 'kanban') return 'Kanban'
  if (type === 'table') return 'Table'
  if (type === 'roadmap') return 'Roadmap'
  if (type === 'calendar') return 'Calendar'
  return type
}

/**
 * Version "raw" si tu veux récupérer directement un ReactNode
 * (utile si tu veux wrapper toi-même dans un badge/span).
 */
export const boardTypeIconNode = (type: BoardType, className?: string): ReactNode => {
  if (type === 'kanban') return <PiKanbanFill className={className} />
  if (type === 'table') return <HiMiniTableCells className={className} />
  if (type === 'roadmap') return <MdViewTimeline className={className} />
  if (type === 'calendar') return <IoCalendar className={className} />
  return <FiColumns className={className} />
}

export type BoardTypeIconProps = {
  type: BoardType
  className?: string
}

/**
 * Composant prêt à l'emploi, modulable via className.
 */
export const BoardTypeIcon: FC<BoardTypeIconProps> = ({ type, className }) => {
  return <>{boardTypeIconNode(type, className)}</>
}
