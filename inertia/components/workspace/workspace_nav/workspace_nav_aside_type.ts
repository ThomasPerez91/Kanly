export type WorkspaceNavKey = 'dashboard' | 'boards' | 'views' | 'activity'

export type WorkspaceNavAsideProps = {
  className?: string
  workspaceId: number
  activeKey: WorkspaceNavKey | null
  onNavigate: (key: WorkspaceNavKey) => void
  isOpen: boolean
  variant?: 'desktop' | 'drawer'
  disableAnimation?: boolean
}
