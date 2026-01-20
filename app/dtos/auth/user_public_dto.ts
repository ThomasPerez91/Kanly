import User from '#models/user'

export type UserPublicDTO = {
  id: number
  email: string
  fullName: string | null
  avatarUrl: string | null
  timezone: string | null
}

export function userToPublicDto(user: User): UserPublicDTO {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    timezone: user.timezone,
  }
}
