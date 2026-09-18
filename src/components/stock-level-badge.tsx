import { Badge } from '@/components/ui/badge'
import { getStockLevelLabel, type StockLevel } from '@/lib/api'

function getStockLevelVariant(
  stockLevel: StockLevel,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (stockLevel === 'out_of_stock') {
    return 'destructive'
  }

  if (stockLevel === 'low') {
    return 'outline'
  }

  return 'secondary'
}

type StockLevelBadgeProps = {
  stockLevel: StockLevel
}

export function StockLevelBadge({ stockLevel }: StockLevelBadgeProps) {
  return (
    <Badge variant={getStockLevelVariant(stockLevel)}>
      {getStockLevelLabel(stockLevel)}
    </Badge>
  )
}
