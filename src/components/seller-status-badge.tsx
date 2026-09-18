import { Badge } from '@/components/ui/badge'
import { getSellerStatusLabel, type SellerAccountStatus } from '@/lib/api'

function getSellerStatusVariant(
  status: SellerAccountStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'token_expired') {
    return 'destructive'
  }

  if (status === 'error') {
    return 'outline'
  }

  return 'secondary'
}

type SellerStatusBadgeProps = {
  status: SellerAccountStatus
}

export function SellerStatusBadge({ status }: SellerStatusBadgeProps) {
  return (
    <Badge variant={getSellerStatusVariant(status)}>
      {getSellerStatusLabel(status)}
    </Badge>
  )
}
