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
        'workspace_users.role as role',
      ])
      .whereHas('users', (q) => {
        q.where('users.id', user.id)
      })
      .join('workspace_users', (join) => {
        join
          .on('workspace_users.workspace_id', '=', 'workspaces.id')
          .andOnVal('workspace_users.user_id', '=', user.id)
      })
      .orderBy('workspaces.name', 'asc')

    const data: WorkspacePublicDTO[] = workspaces.map(workspaceToPublicDto)

    // Active workspace id from query string (?workspace=1)
    const activeWorkspaceIdRaw = request.input('workspace')
    const activeWorkspaceId =
      activeWorkspaceIdRaw !== undefined && activeWorkspaceIdRaw !== null
        ? Number(activeWorkspaceIdRaw)
        : null

    return inertia.render('dashboard/dashboard', {
      workspaces: data,
      activeWorkspaceId: Number.isFinite(activeWorkspaceId) ? activeWorkspaceId : null,
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

    // We return a DTO with role='owner' (we know it)
    const dto = workspaceToPublicDto({
      ...workspace,
      $extras: { role: WorkspaceUserRoles.owner },
    } as any) as WorkspacePublicDTO

    return response.created({ workspace: dto })
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.id)

    const membership = await Workspace.query()
      .select(['workspaces.id', 'workspaces.owner_id', 'workspace_users.role as role'])
      .join('workspace_users', 'workspace_users.workspace_id', 'workspaces.id')
      .where('workspaces.id', workspaceId)
      .where('workspace_users.user_id', user.id)
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

    // Return updated DTO with the caller's role (same as membership role)
    const dto = workspaceToPublicDto({
      ...workspace,
      $extras: { role },
    } as any) as WorkspacePublicDTO

    return response.ok({ workspace: dto })
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

    // No redirect: just a clean status
    return response.noContent()
  }
}
