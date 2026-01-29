// app/controllers/workspaces_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

import Workspace from '#models/workspace'
import { workspaceToPublicDto } from '#dtos/workspace/workspace_public_dto'
import type { WorkspacePublicDTO } from '#dtos/workspace/workspace_public_dto_type'
import { WorkspaceUserRoles } from '#enums/workspace_user_roles'
import { createWorkspaceValidator, updateWorkspaceValidator } from '#validators/workspace'

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

    const payload = await request.validateUsing(createWorkspaceValidator)

    const avatarUrl = (request.input('avatarUrl') ??
      request.input('avatar_url') ??
      payload.avatarUrl ??
      null) as string | null

    const workspace = await Workspace.create({
      name: payload.name,
      slug: slugify(payload.name),
      ownerId: user.id,
      avatarUrl,
    })

    await workspace.related('users').attach({
      [user.id]: { role: WorkspaceUserRoles.owner },
    })

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
      .select(['workspaces.id', 'workspaces.owner_id', 'workspaces_users.role as role'])
      .join('workspaces_users', 'workspaces_users.workspace_id', 'workspaces.id')
      .where('workspaces.id', workspaceId)
      .where('workspaces_users.user_id', user.id)
      .first()

    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    const role = (membership as any).$extras.role as WorkspaceUserRoles
    const isOwner = membership.ownerId === user.id || role === WorkspaceUserRoles.owner
    const isAdmin = role === WorkspaceUserRoles.admin

    if (!isOwner && !isAdmin) return response.unauthorized({ message: 'Not allowed' })

    // payload vine
    const payload = await request.validateUsing(updateWorkspaceValidator)

    const workspace = await Workspace.findOrFail(workspaceId)

    if (payload.name !== undefined) workspace.name = payload.name

    // compat camel/snake + possibilité de null
    const avatarUrl = request.input('avatarUrl') ?? request.input('avatar_url')
    if (avatarUrl !== undefined) {
      workspace.avatarUrl = avatarUrl
    } else if (payload.avatarUrl !== undefined) {
      workspace.avatarUrl = payload.avatarUrl
    }

    await workspace.save()

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
    return response.noContent()
  }
}
