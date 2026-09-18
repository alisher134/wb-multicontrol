import { z } from 'zod'

export const sellerDetailsFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Введите название кабинета')
    .min(2, 'Минимум 2 символа'),
  shortName: z
    .string()
    .min(1, 'Введите короткое имя')
    .max(12, 'Максимум 12 символов'),
})

export const createSellerFormSchema = sellerDetailsFormSchema.extend({
  token: z.string().min(1, 'Введите API-токен').min(8, 'Минимум 8 символов'),
})

export const updateSellerTokenFormSchema = z.object({
  token: z.string().min(1, 'Введите API-токен').min(8, 'Минимум 8 символов'),
})

export type SellerDetailsFormValues = z.infer<typeof sellerDetailsFormSchema>
export type CreateSellerFormValues = z.infer<typeof createSellerFormSchema>
export type UpdateSellerTokenFormValues = z.infer<
  typeof updateSellerTokenFormSchema
>
