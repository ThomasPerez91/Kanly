import type { FC } from 'react'
import { useEffect } from 'react'
import type { WorkspaceNameInputProps } from './workspace_name_input_type'

export const WorkspaceNameInput: FC<WorkspaceNameInputProps> = ({ value, onChange, error }) => {
  useEffect(() => {}, [value])

  return (
    <div>
      <label className="label" htmlFor="workspace-name">
        Name
      </label>
      <input
        id="workspace-name"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Acme"
        autoComplete="off"
      />
      {error ? <div className="error">{error}</div> : null}
    </div>
  )
}
