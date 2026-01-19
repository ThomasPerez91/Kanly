import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { AuthProviders } from '../app/enums/auth_providers'

router.on('/').renderInertia('home')

const providerRegex = new RegExp(Object.values(AuthProviders).join('|'))

router.group(() => {
  router.get('/:provider/redirect', [AuthController, 'redirect']).where('provider', providerRegex)
  router.get('/:provider/callback', [AuthController, 'callback']).where('provider', providerRegex)
  router.post('/logout', [AuthController, 'logout'])
}).prefix('/auth')
