import { DateTime } from 'luxon'
import type { NormalizedSocialUser } from '#types/auth/normalized_social_user'

export function normalizeSocialUser(socialUser: any): NormalizedSocialUser {
  const token = socialUser.token

  const tokenExpiresAt = token?.expiresAt
    ? DateTime.fromJSDate(token.expiresAt)
    : token?.expires_in
      ? DateTime.now().plus({ seconds: Number(token.expires_in) })
      : token?.expire_at
        ? DateTime.fromISO(String(token.expire_at))
        : null

  const email = typeof socialUser.email === 'string' ? socialUser.email.trim().toLowerCase() : null

  return {
    providerUserId: String(socialUser.id),
    email,
    fullName: socialUser.name ?? null,
    avatarUrl: socialUser.avatarUrl ?? null,
    emailVerified:
      typeof socialUser.emailVerificationState === 'boolean'
        ? socialUser.emailVerificationState
        : null,
    accessToken: token?.token ?? null,
    refreshToken: token?.refreshToken ?? null,
    tokenExpiresAt,
    raw: socialUser,
  }
}
