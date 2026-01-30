export type WorkspaceNavAsideProps = {
  className?: string
  workspaceId: number
  activeKey?: 'dashboard' | 'boards' | 'views' | 'activity' | null
  onNavigate: (key: 'dashboard' | 'boards' | 'views' | 'activity') => void
  isOpen: boolean
  variant?: 'desktop' | 'drawer'
}
