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
import { useAdmins } from '@/hooks/use-admins'
import type { AdminUser } from '@/lib/api'
import { getMockSession, isLeadAdmin } from '@/lib/mock-auth'

import { AddAdminDialog } from './add-admin-dialog'
import { AdminsList } from './admins-list'
import { DeleteAdminDialog } from './delete-admin-dialog'
import { EditAdminDialog } from './edit-admin-dialog'

export function AdminsPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, errorMessage, refetch } = useAdmins()
  const session = getMockSession()
  const canManageAdmins = isLeadAdmin()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null)

  const isEditOpen = editingAdmin != null
  const isDeleteOpen = deletingAdmin != null

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

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin)
  }

  const handleDelete = (admin: AdminUser) => {
    setDeletingAdmin(admin)
  }

  const addAdminAction = canManageAdmins ? (
    <Button
      type="button"
      size="sm"
      className="w-full gap-1.5 sm:w-auto"
      onClick={handleOpenAdd}
    >
      <PlusIcon className="size-4" aria-hidden />
      Добавить админа
    </Button>
  ) : undefined

  return (
    <PageShell
      title="Админы"
      description="Пользователи с доступом к мультиконтролю"
      actions={addAdminAction}
    >
      <AsyncWrapper
        isLoading={isLoading}
        isError={isError}
        data={data}
        loaderSlot={<CenteredSpinner />}
        errorSlot={
          <ErrorPageElement
            title="Не удалось загрузить админов"
            description={errorMessage}
            onRetry={handleRetry}
            onGoHome={handleGoHome}
          />
        }
      >
        {(admins) => (
          <Show
            when={admins.length > 0}
            fallback={
              <EmptyState
                title="Админы не найдены"
                description={
                  canManageAdmins
                    ? 'Добавьте первого админа'
                    : 'Список пользователей пуст'
                }
                action={addAdminAction}
              />
            }
          >
            <AdminsList
              admins={admins}
              canManageAdmins={canManageAdmins}
              currentAdminId={session?.adminId ?? null}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Show>
        )}
      </AsyncWrapper>

      <Show when={canManageAdmins}>
        <AddAdminDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSuccess={handleMutationSuccess}
        />

        <EditAdminDialog
          admin={editingAdmin}
          open={isEditOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingAdmin(null)
            }
          }}
          onSuccess={handleMutationSuccess}
        />

        <DeleteAdminDialog
          admin={deletingAdmin}
          open={isDeleteOpen}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingAdmin(null)
            }
          }}
          onSuccess={handleMutationSuccess}
        />
      </Show>
    </PageShell>
  )
}
