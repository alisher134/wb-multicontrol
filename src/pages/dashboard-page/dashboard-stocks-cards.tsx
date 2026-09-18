import { Show } from '@/components/ui/show'
import type { DashboardStats } from '@/lib/api'
import { formatCompactNumber } from '@/lib/format'

type DashboardStocksCardsProps = {
  stats: DashboardStats
}

type StockKpi = {
  key: string
  label: string
  value: string
  hint?: string
}

export function DashboardStocksCards({ stats }: DashboardStocksCardsProps) {
  const { stocks } = stats

  const items: StockKpi[] = [
    {
      key: 'sku',
      label: 'SKU на складах',
      value: String(stocks.skuCount),
    },
    {
      key: 'units',
      label: 'Единиц остатка',
      value: formatCompactNumber(stocks.unitsTotal),
    },
    {
      key: 'in-stock',
      label: 'В наличии',
      value: String(stocks.inStockCount),
      hint: 'SKU с нормальным остатком',
    },
    {
      key: 'low',
      label: 'Мало на складе',
      value: String(stocks.lowStockCount),
    },
    {
      key: 'out',
      label: 'Нет в наличии',
      value: String(stocks.outOfStockCount),
    },
    {
      key: 'fbo',
      label: 'Остаток FBO',
      value: formatCompactNumber(stocks.fboUnits),
      hint: 'Склад WB',
    },
    {
      key: 'fbs',
      label: 'Остаток FBS',
      value: formatCompactNumber(stocks.fbsUnits),
      hint: 'Склад продавца',
    },
    {
      key: 'in-way',
      label: 'В пути',
      value: String(stocks.inWayToClient + stocks.inWayFromClient),
      hint: `К клиенту ${stocks.inWayToClient} · от клиента ${stocks.inWayFromClient}`,
    },
  ]

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">Остатки и логистика</h2>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-border xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 xl:border-b-0"
            >
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-mono text-xl font-medium tabular-nums">
                {item.value}
              </p>
              <Show when={item.hint != null} data={item.hint}>
                {(hint) => (
                  <p className="text-xs text-muted-foreground opacity-70">
                    {hint}
                  </p>
                )}
              </Show>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
