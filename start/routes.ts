import router from '@adonisjs/core/services/router'
import { AuthProviders } from '#enums/auth_providers'
const AuthController = () => import('#controllers/auth_controller')

router.on('/').renderInertia('home')
router.on('/auth').renderInertia('auth/auth_page')
router.on('/dashboard').renderInertia('dashboard/dashboard')

const providerRegex = new RegExp(Object.values(AuthProviders).join('|'))

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.get('/me', [AuthController, 'me'])
    router.post('/logout', [AuthController, 'logout'])

    router.get('/:provider/redirect', [AuthController, 'redirect']).where('provider', providerRegex)
    router.get('/:provider/callback', [AuthController, 'callback']).where('provider', providerRegex)
  })
  .prefix('/auth')
