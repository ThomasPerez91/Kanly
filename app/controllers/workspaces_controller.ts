// app/controllers/workspaces_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Workspace from '#models/workspace'
import { workspaceToPublicDto } from '#dtos/workspace/workspace_public_dto'
import type { WorkspacePublicDTO } from '#dtos/workspace/workspace_public_dto_type'
import { WorkspaceUserRoles } from '#enums/workspace_user_roles'

function slugify(input: string) {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)

  const suffix = Math.random().toString(36).slice(2, 8)
  return base ? `${base}-${suffix}` : suffix
}

export default class WorkspacesController {
  async index({ auth, inertia, request }: HttpContext) {
    const user = auth.user!

    const workspaces = await Workspace.query()
      .select([
        'workspaces.id',
        'workspaces.name',
        'workspaces.slug',
        'workspaces.avatar_url',
        'workspaces_users.role as role',
      ])
      .whereHas('users', (q) => q.where('users.id', user.id))
      .join('workspaces_users', (join) => {
        join
          .on('workspaces_users.workspace_id', '=', 'workspaces.id')
          .andOnVal('workspaces_users.user_id', '=', user.id)
      })
      .orderBy('workspaces.name', 'asc')

    const data: WorkspacePublicDTO[] = workspaces.map(workspaceToPublicDto)

    const qsWorkspace = request.qs().workspace
    const qsId = typeof qsWorkspace === 'string' ? Number(qsWorkspace) : Number.NaN

    const activeWorkspaceId =
      Number.isFinite(qsId) && data.some((w) => w.id === qsId) ? qsId : (data[0]?.id ?? null)

    return inertia.render('dashboard/dashboard', {
      workspaces: data,
      activeWorkspaceId,
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const name = (request.input('name') ?? '').trim()

    if (!name) {
      return response.badRequest({ message: 'Name is required' })
    }

    const avatarUrl = request.input('avatarUrl') ?? request.input('avatar_url') ?? null

    const workspace = await Workspace.create({
      name,
      slug: slugify(name),
      ownerId: user.id,
      avatarUrl,
    })

    await workspace.related('users').attach({
      [user.id]: { role: WorkspaceUserRoles.owner },
    })

    return response.redirect().toPath(`/dashboard?workspace=${workspace.id}`)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.id)

    const membership = await Workspace.query()
      .select(['workspaces.id', 'workspaces.owner_id', 'workspaces_users.role as role'])
      .join('workspaces_users', 'workspaces_users.workspace_id', 'workspaces.id')
      .where('workspaces.id', workspaceId)
      .where('workspaces_users.user_id', user.id)
      .first()

    if (!membership) {
      return response.unauthorized({ message: 'Not allowed' })
    }

    const role = (membership as any).$extras.role as WorkspaceUserRoles
    const isOwner = membership.ownerId === user.id || role === WorkspaceUserRoles.owner
    const isAdmin = role === WorkspaceUserRoles.admin

    if (!isOwner && !isAdmin) {
      return response.unauthorized({ message: 'Not allowed' })
    }

    const workspace = await Workspace.findOrFail(workspaceId)

    const name = request.input('name')
    const avatarUrl = request.input('avatarUrl') ?? request.input('avatar_url')

    if (typeof name === 'string' && name.trim()) workspace.name = name.trim()
    if (avatarUrl !== undefined) workspace.avatarUrl = avatarUrl

    await workspace.save()

    return response.redirect().toPath('/dashboard')
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.id)

    const workspace = await Workspace.query()
      .where('id', workspaceId)
      .where('owner_id', user.id)
      .first()

    if (!workspace) {
      return response.unauthorized({ message: 'Only owner can delete workspace' })
    }

    await workspace.delete()
    return response.redirect().toPath('/dashboard')
  }
}
