import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { AuthProviders } from '#enums/auth_providers'
const AuthController = () => import('#controllers/auth_controller')
const WorkspacesController = () => import('#controllers/workspaces_controller')

router.on('/').renderInertia('home')
router.on('/auth').renderInertia('auth/auth_page')

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

router
  .group(() => {
    router.get('/dashboard', [WorkspacesController, 'index'])
    router.post('/workspaces', [WorkspacesController, 'store'])
    router.put('/workspaces/:id', [WorkspacesController, 'update'])
    router.patch('/workspaces/:id', [WorkspacesController, 'update'])
    router.delete('/workspaces/:id', [WorkspacesController, 'destroy'])
  })
  .middleware([middleware.auth()])
