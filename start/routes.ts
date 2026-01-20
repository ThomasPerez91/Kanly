import router from '@adonisjs/core/services/router'
import { AuthProviders } from '#enums/auth_providers'
const AuthController = () => import('#controllers/auth_controller')

router.on('/').renderInertia('home')

const providerRegex = new RegExp(Object.values(AuthProviders).join('|'))

router
  .group(() => {
    router.get('/:provider/redirect', [AuthController, 'redirect']).where('provider', providerRegex)
    router.get('/:provider/callback', [AuthController, 'callback']).where('provider', providerRegex)
    router.post('/logout', [AuthController, 'logout'])
  })
  .prefix('/auth')
