import { Badge } from '@/components/ui/badge'
import { getAdminRoleLabel, type AdminRole } from '@/lib/api'

function getAdminRoleVariant(
  role: AdminRole,
): 'default' | 'secondary' | 'outline' {
  if (role === 'LEAD_ADMIN') {
    return 'default'
  }

  return 'secondary'
}

type AdminRoleBadgeProps = {
  role: AdminRole
}

export function AdminRoleBadge({ role }: AdminRoleBadgeProps) {
  return (
    <Badge variant={getAdminRoleVariant(role)}>{getAdminRoleLabel(role)}</Badge>
  )
}
