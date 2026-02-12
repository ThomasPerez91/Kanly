import type { FC } from 'react'
import { Button } from '~/components/ui/button/button'

type Props = {
  mode: 'default' | 'custom'
  onModeChange: (m: 'default' | 'custom') => void
  listNames: string[]
  onListNamesChange: (names: string[]) => void
  submitting: boolean
  error: string | null
  isValid: boolean
  onCancel: () => void
  onSubmit: () => void
}

export const KanbanGenerateForm: FC<Props> = ({
  mode,
  onModeChange,
  listNames,
  onListNamesChange,
  submitting,
  error,
  isValid,
  onCancel,
  onSubmit,
}) => {
  const updateName = (index: number, value: string) => {
    const next = [...listNames]
    next[index] = value
    onListNamesChange(next)
  }

  const addInput = () => {
    onListNamesChange([...listNames, ''])
  }

  return (
    <div className="space-y-8 max-w-md">
      {/* Segmented toggle */}
      <div className="inline-flex p-1 rounded-xl bg-bg border border-border shadow-soft">
        <Button
          variant={mode === 'default' ? 'primary' : 'ghost'}
          size="sm"
          label="Default"
          onClick={() => onModeChange('default')}
        />

        <Button
          variant={mode === 'custom' ? 'primary' : 'ghost'}
          size="sm"
          label="Custom"
          onClick={() => onModeChange('custom')}
        />
      </div>

      {mode === 'custom' && (
        <div className="space-y-4">
          {listNames.map((name, i) => (
            <input
              key={i}
              value={name}
              onChange={(e) => updateName(i, e.target.value)}
              placeholder={`List name ${i + 1}`}
              className="input"
            />
          ))}

          <Button variant="ghost" size="sm" label="+ Add another column" onClick={addInput} />
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" label="Cancel" onClick={onCancel} />

        <Button
          variant="primary"
          label="Generate"
          loading={submitting}
          disabled={!isValid}
          onClick={onSubmit}
          elevated
        />
      </div>
    </div>
  )
}
