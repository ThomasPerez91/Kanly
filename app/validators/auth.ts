import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(120).optional(),
    email: vine.string().trim().email().toLowerCase(),
    password: vine.string().minLength(8).maxLength(180),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
    password: vine.string().minLength(1),
  })
)
