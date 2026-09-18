import { Button } from '@/components/ui/button'
import { Show } from '@/components/ui/show'
import type { AdminUser } from '@/lib/api'
import { cn } from 'cn'

type AdminActionsProps = {
  admin: AdminUser
  canEdit: boolean
  canDelete: boolean
  onEdit: (admin: AdminUser) => void
  onDelete: (admin: AdminUser) => void
  isCompact?: boolean
}

export function AdminActions({
  admin,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  isCompact = false,
}: AdminActionsProps) {
  const hasActions = canEdit || canDelete
  const hasBothActions = canEdit && canDelete
  const actionsClassName = isCompact
    ? cn('grid gap-2', hasBothActions ? 'grid-cols-2' : 'grid-cols-1')
    : 'flex flex-wrap justify-end gap-2'

  return (
    <Show when={hasActions}>
      <div className={actionsClassName}>
        <Show when={canEdit}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={isCompact ? 'w-full' : undefined}
            onClick={() => onEdit(admin)}
          >
            Изменить
          </Button>
        </Show>
        <Show when={canDelete}>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className={isCompact ? 'w-full' : undefined}
            onClick={() => onDelete(admin)}
          >
            Удалить
          </Button>
        </Show>
      </div>
    </Show>
  )
}
