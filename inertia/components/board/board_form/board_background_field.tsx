import type { FC } from 'react'
import { FiImage } from 'react-icons/fi'

type BoardBackgroundFieldProps = {
  value: string
  onChange: (val: string) => void
  onOpenPicker: () => void
}

export const BoardBackgroundField: FC<BoardBackgroundFieldProps> = ({
  value,
  onChange,
  onOpenPicker,
}) => {
  return (
    <div>
      <label className="label" htmlFor="board-bg">
        Background URL
      </label>

      <div className="relative">
        <input
          id="board-bg"
          className="input pr-12"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />

        <button
          type="button"
          onClick={onOpenPicker}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl border border-border bg-surface hover:bg-bg transition flex items-center justify-center"
          aria-label="Choose a default background"
        >
          <FiImage className="text-lg" />
        </button>
      </div>

      <div className="mt-1 text-xs text-text-muted">Use an image URL, or pick a default.</div>
    </div>
  )
}
