import User from '#models/user'
import type { UserPublicDTO } from '#dtos/auth/user_public_dto_type'

export function userToPublicDto(user: User): UserPublicDTO {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    timezone: user.timezone,
  }
}
