import { useCallback, useState } from 'react'

import { toast } from '@/lib/toast'

export function useSellerMutation(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false)

  const runMutation = useCallback(
    async (
      action: () => Promise<void>,
      successMessage: string,
    ): Promise<boolean> => {
      setIsLoading(true)

      try {
        await action()
        toast.success(successMessage)
        onSuccess?.()
        return true
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось выполнить действие'
        toast.error(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [onSuccess],
  )

  return { isLoading, runMutation }
}
