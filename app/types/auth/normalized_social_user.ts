import { DateTime } from 'luxon'

export type NormalizedSocialUser = {
  providerUserId: string
  email: string | null
  fullName: string | null
  avatarUrl: string | null
  emailVerified: boolean | null
  accessToken: string | null
  refreshToken: string | null
  tokenExpiresAt: DateTime | null
  raw: any
}
