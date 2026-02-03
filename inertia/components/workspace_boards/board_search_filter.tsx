import type { FC } from 'react'
import { FiSearch } from 'react-icons/fi'

type Props = {
  value: string
  onChange: (v: string) => void
}

export const BoardSearchFilter: FC<Props> = ({ value, onChange }) => {
  return (
    <div className="card p-3">
      <label className="sr-only" htmlFor="boards-search">
        Search boards
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          <FiSearch />
        </span>

        <input
          id="boards-search"
          className="input pl-10"
          placeholder="Search boards…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
