import { AdminRoleBadge } from '@/components/admin-role-badge'
import type { AdminUser } from '@/lib/api'
import { formatDateTime } from '@/lib/format'

import { AdminActions } from './admin-actions'

type AdminMobileCardProps = {
  admin: AdminUser
  canEdit: boolean
  canDelete: boolean
  onEdit: (admin: AdminUser) => void
  onDelete: (admin: AdminUser) => void
}

export function AdminMobileCard({
  admin,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: AdminMobileCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-medium">{admin.name}</span>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {admin.username}
          </span>
        </div>
        <AdminRoleBadge role={admin.role} />
      </div>

      <dl className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Добавлен</dt>
          <dd className="font-mono text-xs tabular-nums">
            {formatDateTime(admin.createdAt)}
          </dd>
        </div>
      </dl>

      <AdminActions
        admin={admin}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={onEdit}
        onDelete={onDelete}
        isCompact
      />
    </article>
  )
}
