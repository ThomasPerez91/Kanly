import type { FC } from 'react'

type Props = {
  title: string
  count?: number
}

export const WorkspaceBoardsHeader: FC<Props> = ({ title, count }) => {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <div className="text-xl font-950 text-text">{title}</div>
        {typeof count === 'number' ? (
          <div className="mt-1 text-sm text-text-muted">{count} board(s)</div>
        ) : null}
      </div>
    </div>
  )
}
