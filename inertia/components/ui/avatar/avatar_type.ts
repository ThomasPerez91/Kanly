export type AvatarShape = 'rounded' | 'circle'

export type AvatarProps = {
  name?: string | null
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  shape?: AvatarShape
  className?: string
  alt?: string
  bordered?: boolean
}
