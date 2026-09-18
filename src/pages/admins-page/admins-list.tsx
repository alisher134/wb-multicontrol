import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminRoleBadge } from '@/components/admin-role-badge'
import type { AdminUser } from '@/lib/api'
import { formatDateTime } from '@/lib/format'

import { AdminActions } from './admin-actions'
import { AdminMobileCard } from './admin-mobile-card'

type AdminsListProps = {
  admins: AdminUser[]
  canManageAdmins: boolean
  currentAdminId: string | null
  onEdit: (admin: AdminUser) => void
  onDelete: (admin: AdminUser) => void
}

function canDeleteAdmin(
  admin: AdminUser,
  canManageAdmins: boolean,
  currentAdminId: string | null,
): boolean {
  if (!canManageAdmins) {
    return false
  }

  if (admin.role === 'LEAD_ADMIN') {
    return false
  }

  if (currentAdminId != null && admin.id === currentAdminId) {
    return false
  }

  return true
}

export function AdminsList({
  admins,
  canManageAdmins,
  currentAdminId,
  onEdit,
  onDelete,
}: AdminsListProps) {
  return (
    <>
      <div className="flex flex-col gap-2 md:hidden">
        {admins.map((admin) => (
          <AdminMobileCard
            key={admin.id}
            admin={admin}
            canEdit={canManageAdmins}
            canDelete={canDeleteAdmin(admin, canManageAdmins, currentAdminId)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Логин</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Добавлен</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs tabular-nums">
                    {admin.username}
                  </span>
                </TableCell>
                <TableCell>
                  <AdminRoleBadge role={admin.role} />
                </TableCell>
                <TableCell className="font-mono text-xs tabular-nums">
                  {formatDateTime(admin.createdAt)}
                </TableCell>
                <TableCell>
                  <AdminActions
                    admin={admin}
                    canEdit={canManageAdmins}
                    canDelete={canDeleteAdmin(
                      admin,
                      canManageAdmins,
                      currentAdminId,
                    )}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
