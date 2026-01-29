import vine from '@vinejs/vine'

export const createWorkspaceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
    avatarUrl: vine.string().trim().url().nullable().optional(),
  })
)

export const updateWorkspaceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    avatarUrl: vine.string().trim().url().nullable().optional(),
  })
)
