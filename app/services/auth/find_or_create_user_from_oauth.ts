import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import SocialAccount from '#models/social_account'
import { AuthProviders } from '#enums/auth_providers'
import type { NormalizedSocialUser } from '#types/auth/normalized_social_user'

export async function findOrCreateUserFromOAuth(
  provider: AuthProviders,
  payload: NormalizedSocialUser
): Promise<User> {
  return db.transaction(async (trx) => {
    const existing = await SocialAccount.query({ client: trx })
      .where('provider', provider)
      .where('providerUserId', payload.providerUserId)
      .preload('user')
      .first()

    if (existing) {
      existing.merge({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        tokenExpiresAt: payload.tokenExpiresAt,
        raw: payload.raw,
      })
      await existing.save()

      existing.user.merge({
        fullName: payload.fullName ?? existing.user.fullName,
        avatarUrl: payload.avatarUrl ?? existing.user.avatarUrl,
      })
      await existing.user.save()

      return existing.user
    }

    if (!payload.email) {
      throw new Error(`OAuth provider "${provider}" did not return an email`)
    }

    let user = await User.query({ client: trx }).where('email', payload.email).first()

    if (!user) {
      user = await User.create(
        {
          email: payload.email,
          fullName: payload.fullName,
          avatarUrl: payload.avatarUrl,
          password: null,
        },
        { client: trx }
      )
    } else {
      user.merge({
        fullName: user.fullName ?? payload.fullName,
        avatarUrl: user.avatarUrl ?? payload.avatarUrl,
      })
      await user.save()
    }

    await SocialAccount.create(
      {
        userId: user.id,
        provider,
        providerUserId: payload.providerUserId,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        tokenExpiresAt: payload.tokenExpiresAt,
        raw: payload.raw,
      },
      { client: trx }
    )

    return user
  })
}
