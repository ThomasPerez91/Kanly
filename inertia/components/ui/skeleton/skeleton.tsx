import type { FC } from 'react'

import type { SkeletonProps } from './skeleton_type'

export const Skeleton: FC<SkeletonProps> = ({ className, label = 'Loading' }) => {
  return <div aria-label={label} role="status" className={`skeleton ${className ?? ''}`} />
}
