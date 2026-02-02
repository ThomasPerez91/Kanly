export type BoardCreateModalProps = {
  open: boolean
  onClose: () => void
  workspaceId: number
  onCreated?: () => void
}
