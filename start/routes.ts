import { AuthProviders } from '#enums/auth_providers'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const BoardsController = () => import('#controllers/boards_controller')
const WorkspacesController = () => import('#controllers/workspaces_controller')
const WorkspacePagesController = () => import('#controllers/workspace_pages_controller')

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

    // Workspace pages
    router.get('/workspaces/:workspaceId/boards', [WorkspacePagesController, 'boards'])
    router.get('/workspaces/:workspaceId/views', [WorkspacePagesController, 'views'])
    router.get('/workspaces/:workspaceId/activity', [WorkspacePagesController, 'activity'])

    // Boards API (write)
    router.post('/workspaces/:workspaceId/boards', [BoardsController, 'store'])

    router.get('/boards/:id', [BoardsController, 'show'])
    router.put('/boards/:id', [BoardsController, 'update'])
    router.patch('/boards/:id', [BoardsController, 'update'])
    router.delete('/boards/:id', [BoardsController, 'destroy'])
  })
  .middleware([middleware.auth()])
