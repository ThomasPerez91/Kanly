import { AuthProviders } from '#enums/auth_providers'

export function isValidProvider(provider: string): provider is AuthProviders {
  return Object.values(AuthProviders).includes(provider as AuthProviders)
}
