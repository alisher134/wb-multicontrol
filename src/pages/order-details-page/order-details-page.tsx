import { ArrowLeftIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { PageShell } from '@/components/page-shell'
import { AsyncWrapper } from '@/components/ui/async-wrapper'
import { Button } from '@/components/ui/button'
import { CenteredSpinner } from '@/components/ui/centered-spinner'
import { ErrorAlert } from '@/components/ui/error-alert'
import { routes } from '@/config/routes'
import { useOrderDetails } from '@/hooks/use-order-details'
import { useSellers } from '@/hooks/use-sellers'

import { OrderDetailsContent } from './order-details-content'

export function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const resolvedOrderId = orderId ?? ''

  const sellersQuery = useSellers()
  const orderQuery = useOrderDetails(resolvedOrderId)

  const isPageLoading = sellersQuery.isLoading || orderQuery.isLoading
  const isPageError = sellersQuery.isError || orderQuery.isError
  const pageErrorMessage = orderQuery.errorMessage ?? sellersQuery.errorMessage

  const pageData =
    orderQuery.data != null && sellersQuery.data != null
      ? { order: orderQuery.data, sellers: sellersQuery.data }
      : undefined

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

      <AsyncWrapper
        isLoading={isPageLoading}
        isError={isPageError || resolvedOrderId.length === 0}
        data={pageData}
        loaderSlot={<CenteredSpinner />}
        errorSlot={
          <ErrorAlert
            errorMessage={
              resolvedOrderId.length === 0
                ? 'Некорректный идентификатор заказа'
                : (pageErrorMessage ?? 'Не удалось загрузить заказ')
            }
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
    </PageShell>
  )
}
