import { ArrowLeftIcon } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'

import { PageShell } from '@/components/page-shell'
import { AsyncWrapper } from '@/components/ui/async-wrapper'
import { Button } from '@/components/ui/button'
import { CenteredSpinner } from '@/components/ui/centered-spinner'
import { ErrorPageElement } from '@/components/ui/error-page-element'
import { Show } from '@/components/ui/show'
import { routes } from '@/config/routes'
import { useOrderDetails } from '@/hooks/use-order-details'
import { useSellers } from '@/hooks/use-sellers'

import { OrderDetailsContent } from './order-details-content'

export function OrderDetailsPage() {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()
  const resolvedOrderId = orderId ?? ''
  const isInvalidOrderId = resolvedOrderId.length === 0

  const sellersQuery = useSellers()
  const orderQuery = useOrderDetails(resolvedOrderId, !isInvalidOrderId)

  const isPageLoading = sellersQuery.isLoading || orderQuery.isLoading
  const isPageError = sellersQuery.isError || orderQuery.isError
  const pageErrorMessage = orderQuery.errorMessage ?? sellersQuery.errorMessage

  const pageData =
    orderQuery.data != null && sellersQuery.data != null
      ? { order: orderQuery.data, sellers: sellersQuery.data }
      : undefined

  const handleRetry = () => {
    orderQuery.refetch()
    sellersQuery.refetch()
  }

  const handleGoHome = () => {
    void navigate(routes.main)
  }

  const handleGoToOrders = () => {
    void navigate(routes.orders)
  }

  return (
    <PageShell
      title="Детали заказа"
      description="Сборочное задание и статусы по данным кабинета"
    >
      <Button variant="outline" size="sm" className="w-fit gap-1.5" asChild>
        <Link to={routes.orders}>
          <ArrowLeftIcon className="size-4" aria-hidden />К списку заказов
        </Link>
      </Button>

      <Show
        when={!isInvalidOrderId}
        fallback={
          <ErrorPageElement
            title="Некорректный идентификатор заказа"
            description="Проверьте ссылку или вернитесь к списку заказов"
            onRetry={handleGoToOrders}
            onGoHome={handleGoHome}
          />
        }
      >
        <AsyncWrapper
          isLoading={isPageLoading}
          isError={isPageError}
          data={pageData}
          loaderSlot={<CenteredSpinner />}
          errorSlot={
            <ErrorPageElement
              title="Не удалось загрузить заказ"
              description={pageErrorMessage}
              onRetry={handleRetry}
              onGoHome={handleGoHome}
            />
          }
        >
          {(data) => {
            const seller = data.sellers.find(
              (item) => item.id === data.order.accountId,
            )

            return <OrderDetailsContent order={data.order} seller={seller} />
          }}
        </AsyncWrapper>
      </Show>
    </PageShell>
  )
}
