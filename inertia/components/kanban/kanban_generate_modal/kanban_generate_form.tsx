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
    <div className="space-y-4">
      {/* Mode switch */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'default' ? 'primary' : 'secondary'}
          size="md"
          onClick={() => onModeChange('default')}
        >
          Default
        </Button>

        <Button
          variant={mode === 'custom' ? 'primary' : 'secondary'}
          size="md"
          onClick={() => onModeChange('custom')}
        >
          Custom
        </Button>
      </div>

      {mode === 'custom' && (
        <div className="space-y-2">
          {listNames.map((name, i) => (
            <div key={i}>
              <input
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                placeholder={`List name ${i + 1}`}
                className="input"
              />
            </div>
          ))}

          <Button variant="ghost" size="sm" onClick={addInput}>
            + Add list
          </Button>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <div className="flex gap-2 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="primary"
          loading={submitting}
          disabled={!isValid}
          onClick={onSubmit}
        >
          Generate
        </Button>
      </div>
    </div>
  )
}
