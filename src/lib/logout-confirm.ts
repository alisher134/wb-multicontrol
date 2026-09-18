export const LOGOUT_CONFIRM_COPY = {
  title: 'Выйти из аккаунта?',
  description:
    'Сессия будет завершена. Чтобы продолжить работу, войдите снова.',
  cancelLabel: 'Отмена',
  confirmLabel: 'Выйти',
} as const

export type LogoutConfirmCopy = typeof LOGOUT_CONFIRM_COPY

export type LogoutConfirmApi = {
  isOpen: boolean
  open: () => void
  close: () => void
  setIsOpen: (open: boolean) => void
  confirm: () => void
  copy: LogoutConfirmCopy
}
