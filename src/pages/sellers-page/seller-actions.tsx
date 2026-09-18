import { Button } from '@/components/ui/button'
import type { SellerAccount } from '@/lib/api'

type SellerActionsProps = {
  seller: SellerAccount
  onEdit: (seller: SellerAccount) => void
  onUpdateToken: (seller: SellerAccount) => void
  onDelete: (seller: SellerAccount) => void
  isCompact?: boolean
}

export function SellerActions({
  seller,
  onEdit,
  onUpdateToken,
  onDelete,
  isCompact = false,
}: SellerActionsProps) {
  return (
    <div
      className={
        isCompact
          ? 'grid grid-cols-3 gap-2'
          : 'flex flex-wrap justify-end gap-2'
      }
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={isCompact ? 'w-full' : undefined}
        onClick={() => onEdit(seller)}
      >
        Изменить
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={isCompact ? 'w-full' : undefined}
        onClick={() => onUpdateToken(seller)}
      >
        Токен
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className={isCompact ? 'w-full' : undefined}
        onClick={() => onDelete(seller)}
      >
        Удалить
      </Button>
    </div>
  )
}
