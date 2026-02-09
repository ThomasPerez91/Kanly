import type { FC } from 'react'

import type { BoardFormProps } from './board_form_type'

import { Button } from '~/components/ui/button/button'
import { BoardTypePicker } from './board_type_picker'
import { BoardBackgroundField } from './board_background_field'

export const BoardForm: FC<BoardFormProps> = ({
  name,
  onNameChange,
  type,
  onTypeChange,
  backgroundUrl,
  onBackgroundUrlChange,
  onOpenBackgroundPicker,
  error,
  submitLabel,
  submitting,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="min-w-0 space-y-4">
      <div>
        <label className="label" htmlFor="board-name">
          Name
        </label>
        <input
          id="board-name"
          className="input"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Product roadmap"
        />
      </div>

      <BoardTypePicker value={type} onChange={onTypeChange} />

      <BoardBackgroundField
        value={backgroundUrl}
        onChange={onBackgroundUrlChange}
        onOpenPicker={onOpenBackgroundPicker}
      />

      {error ? <div className="text-sm text-danger-600 font-800">{error}</div> : null}

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" label="Cancel" onClick={onCancel} />
        <Button
          variant="primary"
          size="sm"
          label={submitLabel}
          loading={submitting}
          onClick={onSubmit}
        />
      </div>
    </div>
  )
}
