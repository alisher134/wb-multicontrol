import { PageShell } from '@/components/page-shell'
import { AsyncWrapper } from '@/components/ui/async-wrapper'
import { CenteredSpinner } from '@/components/ui/centered-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Show } from '@/components/ui/show'
import { useSellers } from '@/hooks/use-sellers'

import { SellersList } from './sellers-list'

export function SellersPage() {
  const { data, isLoading, isError, errorMessage } = useSellers()

  return (
    <PageShell
      title="ИП"
      description="Подключённые кабинеты и состояние синхронизации"
    >
      <AsyncWrapper
        isLoading={isLoading}
        isError={isError}
        data={data}
        loaderSlot={<CenteredSpinner />}
        errorSlot={
          <ErrorAlert
            errorMessage={errorMessage ?? 'Не удалось загрузить кабинеты'}
          />
        }
      >
        {(sellers) => (
          <Show
            when={sellers.length > 0}
            fallback={<EmptyState title="Кабинеты не подключены" />}
          >
            <SellersList sellers={sellers} />
          </Show>
        )}
      </AsyncWrapper>
    </PageShell>
  )
}
