import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  discord: services.discord({
    clientId: env.get('DISCORD_CLIENT_ID'),
    clientSecret: env.get('DISCORD_CLIENT_SECRET'),
    callbackUrl: env.get('DISCORD_CALLBACK_URL'),
    scopes: ['identify', 'email'],
  }),
  github: services.github({
    clientId: env.get('GITHUB_CLIENT_ID'),
    clientSecret: env.get('GITHUB_CLIENT_SECRET'),
    callbackUrl: env.get('GITHUB_CALLBACK_URL'),
    scopes: ['user:email'],
  }),
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID'),
    clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: env.get('GOOGLE_CALLBACK_URL'),
    scopes: ['openid', 'profile', 'email'],
  }),
  linkedin: services.linkedinOpenidConnect({
    clientId: env.get('LINKEDIN_CLIENT_ID'),
    clientSecret: env.get('LINKEDIN_CLIENT_SECRET'),
    callbackUrl: env.get('LINKEDIN_CALLBACK_URL'),
    scopes: ['openid', 'profile', 'email'],
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
