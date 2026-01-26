import type { FC } from 'react'

import type { ConfirmDeleteModalProps } from './confirm_delete_modal_type'
import { Modal } from '~/components/ui/modal/modal'
import { Button } from '~/components/ui/button/button'

export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  title = 'Delete',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isConfirming,
  error,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      widthClassName="max-w-lg"
    >
      {error ? (
        <div className="mb-4 text-sm text-danger-600 border border-danger-500/20 bg-danger-500/10 rounded-xl p-3">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          label={cancelLabel}
          type="button"
          onClick={onClose}
          disabled={Boolean(isConfirming)}
        />
        <Button
          variant="danger"
          size="sm"
          label={confirmLabel}
          type="button"
          loading={Boolean(isConfirming)}
          onClick={onConfirm}
        />
      </div>
    </Modal>
  )
}
