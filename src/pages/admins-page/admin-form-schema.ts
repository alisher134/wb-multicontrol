import { z } from 'zod'

export const adminDetailsFormSchema = z.object({
  name: z.string().min(1, 'Введите имя').min(2, 'Минимум 2 символа'),
  username: z
    .string()
    .min(1, 'Введите логин')
    .min(3, 'Минимум 3 символа')
    .max(32, 'Максимум 32 символа')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Только латиница, цифры и ._-'),
})

export const createAdminFormSchema = adminDetailsFormSchema.extend({
  password: z.string().min(1, 'Введите пароль').min(6, 'Минимум 6 символов'),
})

export const editAdminFormSchema = adminDetailsFormSchema.extend({
  password: z
    .string()
    .refine((value) => value.length === 0 || value.length >= 6, {
      message: 'Минимум 6 символов',
    }),
})

export type AdminDetailsFormValues = z.infer<typeof adminDetailsFormSchema>
export type CreateAdminFormValues = z.infer<typeof createAdminFormSchema>
export type EditAdminFormValues = z.infer<typeof editAdminFormSchema>
