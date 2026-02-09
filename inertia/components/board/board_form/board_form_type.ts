import type { BoardType } from '~/lib/types/board_public'

export type BoardFormProps = {
  name: string
  onNameChange: (val: string) => void

  type: BoardType
  onTypeChange: (val: BoardType) => void

  backgroundUrl: string
  onBackgroundUrlChange: (val: string) => void
  onOpenBackgroundPicker: () => void

  error?: string | null

  submitLabel: string
  submitting: boolean

  onCancel: () => void
  onSubmit: () => void
}
