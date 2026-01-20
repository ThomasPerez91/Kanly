import type { HttpContext } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'

import User from '#models/user'

import { registerValidator } from '#validators/auth_validator'
import { loginValidator } from '#validators/auth_validator'

import { isValidProvider } from '#services/auth/is_valid_provider'
import { normalizeSocialUser } from '#services/auth/normalize_social_user'
import { findOrCreateUserFromOAuth } from '#services/auth/find_or_create_user_from_oauth'

import { userToPublicDto } from '#dtos/auth/user_public_dto'

export default class AuthController {
  public async register({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const existing = await User.findBy('email', payload.email)
    if (existing) {
      return response.conflict({ message: 'Email already in use' })
    }

    const user = await User.create({
      fullName: payload.fullName ?? null,
      email: payload.email,
      password: payload.password, // hashed by AuthFinder mixin
    })

    await auth.use('web').login(user)

    return response.created({ user: userToPublicDto(user) })
  }

  public async login({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    // UX: compte créé via OAuth => pas de password
    const maybeUser = await User.findBy('email', payload.email)
    if (maybeUser && !maybeUser.password) {
      return response.badRequest({
        message:
          'This account was created with OAuth. Please sign in with your provider or set a password.',
      })
    }

    try {
      const user = await User.verifyCredentials(payload.email, payload.password)
      await auth.use('web').login(user)

      return response.ok({ user: userToPublicDto(user) })
    } catch (error) {
      if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
        return response.unauthorized({ message: 'Invalid credentials' })
      }
      throw error
    }
  }

  public async me({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'Not authenticated' })
    }

    return response.ok({ user: userToPublicDto(auth.user) })
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ ok: true })
  }

  // -----------------
  // OAuth (Ally)
  // -----------------

  public redirect({ ally, params, response }: HttpContext) {
    const provider = params.provider

    if (!isValidProvider(provider)) {
      return response.badRequest(`Provider ${provider} not found`)
    }

    // Scopes/config gérés dans config/ally.ts
    return ally.use(provider).redirect()
  }

  public async callback({ ally, params, response, auth }: HttpContext) {
    const provider = params.provider

    if (!isValidProvider(provider)) {
      return response.badRequest('Provider not found')
    }

    const social = ally.use(provider)

    if (social.accessDenied()) {
      return response.unauthorized('You cancelled the login')
    }

    if (social.stateMisMatch()) {
      return response.badRequest('State mismatch – try again')
    }

    if (social.hasError()) {
      return response.badRequest(social.getError())
    }

    try {
      const socialUser = await social.user()
      const normalized = normalizeSocialUser(socialUser)

      const user = await findOrCreateUserFromOAuth(provider, normalized)

      await auth.use('web').login(user)
      return response.redirect().toPath('/dashboard')
    } catch (error) {
      console.error('OAuth callback error:', error)
      return response.internalServerError('OAuth login failed')
    }
  }
}
