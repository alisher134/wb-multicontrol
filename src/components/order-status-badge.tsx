import { Badge } from '@/components/ui/badge'
import { getOrderStatusLabel, type OrderStatus } from '@/lib/api'

function getOrderStatusVariant(
  status: OrderStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'cancel' || status === 'return') {
    return 'destructive'
  }

  if (status === 'deliver') {
    return 'default'
  }

  if (status === 'new') {
    return 'secondary'
  }

  return 'outline'
}

type OrderStatusBadgeProps = {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant={getOrderStatusVariant(status)}>
      {getOrderStatusLabel(status)}
    </Badge>
  )
}
