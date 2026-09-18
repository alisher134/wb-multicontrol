import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PlusIcon } from 'lucide-react'

import { PageShell } from '@/components/page-shell'
import { AsyncWrapper } from '@/components/ui/async-wrapper'
import { Button } from '@/components/ui/button'
import { CenteredSpinner } from '@/components/ui/centered-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorPageElement } from '@/components/ui/error-page-element'
import { Show } from '@/components/ui/show'
import { routes } from '@/config/routes'
import { useSellers } from '@/hooks/use-sellers'
import type { SellerAccount } from '@/lib/api'

import { AddSellerDialog } from './add-seller-dialog'
import { DeleteSellerDialog } from './delete-seller-dialog'
import { EditSellerDialog } from './edit-seller-dialog'
import { SellersList } from './sellers-list'
import { UpdateSellerTokenDialog } from './update-seller-token-dialog'

export function SellersPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, errorMessage, refetch } = useSellers()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingSeller, setEditingSeller] = useState<SellerAccount | null>(null)
  const [tokenSeller, setTokenSeller] = useState<SellerAccount | null>(null)
  const [deletingSeller, setDeletingSeller] = useState<SellerAccount | null>(
    null,
  )

  const isEditOpen = editingSeller != null
  const isTokenOpen = tokenSeller != null
  const isDeleteOpen = deletingSeller != null

  const handleRetry = () => {
    refetch()
  }

  const handleGoHome = () => {
    void navigate(routes.main)
  }

  const handleMutationSuccess = () => {
    refetch()
  }

  const handleOpenAdd = () => {
    setIsAddOpen(true)
  }

  const handleEdit = (seller: SellerAccount) => {
    setEditingSeller(seller)
  }

  const handleUpdateToken = (seller: SellerAccount) => {
    setTokenSeller(seller)
  }

  const handleDelete = (seller: SellerAccount) => {
    setDeletingSeller(seller)
  }

  const addSellerAction = (
    <Button
      type="button"
      size="sm"
      className="w-full gap-1.5 sm:w-auto"
      onClick={handleOpenAdd}
    >
      <PlusIcon className="size-4" aria-hidden />
      Добавить кабинет
    </Button>
  )

  return (
    <PageShell
      title="ИП"
      description="Подключённые кабинеты и состояние синхронизации"
      actions={addSellerAction}
    >
      <AsyncWrapper
        isLoading={isLoading}
        isError={isError}
        data={data}
        loaderSlot={<CenteredSpinner />}
        errorSlot={
          <ErrorPageElement
            title="Не удалось загрузить кабинеты"
            description={errorMessage}
            onRetry={handleRetry}
            onGoHome={handleGoHome}
          />
        }
      >
        {(sellers) => (
          <Show
            when={sellers.length > 0}
            fallback={
              <EmptyState
                title="Кабинеты не подключены"
                description="Добавьте первый кабинет Wildberries"
                action={addSellerAction}
              />
            }
          >
            <SellersList
              sellers={sellers}
              onEdit={handleEdit}
              onUpdateToken={handleUpdateToken}
              onDelete={handleDelete}
            />
          </Show>
        )}
      </AsyncWrapper>

      <AddSellerDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={handleMutationSuccess}
      />

      <EditSellerDialog
        seller={editingSeller}
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSeller(null)
          }
        }}
        onSuccess={handleMutationSuccess}
      />

      <UpdateSellerTokenDialog
        seller={tokenSeller}
        open={isTokenOpen}
        onOpenChange={(open) => {
          if (!open) {
            setTokenSeller(null)
          }
        }}
        onSuccess={handleMutationSuccess}
      />

      <DeleteSellerDialog
        seller={deletingSeller}
        open={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingSeller(null)
          }
        }}
        onSuccess={handleMutationSuccess}
      />
    </PageShell>
  )
}
