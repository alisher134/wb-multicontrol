import { z } from 'zod'

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Введите имя пользователя')
    .min(3, 'Минимум 3 символа'),
  password: z.string().min(1, 'Введите пароль').min(6, 'Минимум 6 символов'),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
