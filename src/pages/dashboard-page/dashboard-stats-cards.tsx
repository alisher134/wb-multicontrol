import { Show } from '@/components/ui/show'
import { getDashboardPeriodLabel, type DashboardStats } from '@/lib/api'
import { formatCurrencyRub, formatPercent } from '@/lib/format'

type DashboardStatsCardsProps = {
  stats: DashboardStats
}

type KpiItem = {
  key: string
  label: string
  value: string
  hint?: string
}

function buildSalesKpis(stats: DashboardStats): KpiItem[] {
  const periodLabel = getDashboardPeriodLabel(stats.period)

  return [
    {
      key: 'orders',
      label: `Заказы · ${periodLabel}`,
      value: String(stats.ordersCount),
    },
    {
      key: 'sales',
      label: 'Продажи (выкуп)',
      value: String(stats.salesCount),
      hint: 'Заказы в статусе «В доставке»',
    },
    {
      key: 'revenue',
      label: 'Выручка',
      value: formatCurrencyRub(stats.revenue),
      hint: 'Без отменённых заказов',
    },
    {
      key: 'average-check',
      label: 'Средний чек',
      value: formatCurrencyRub(stats.averageCheck),
    },
    {
      key: 'buyout',
      label: 'Процент выкупа',
      value: formatPercent(stats.buyoutRate),
      hint: 'Выкупы / (выкупы + отмены + возвраты)',
    },
    {
      key: 'sellers',
      label: 'Кабинеты',
      value: `${stats.activeSellersCount} / ${stats.activeSellersCount + stats.problemSellersCount}`,
      hint:
        stats.problemSellersCount > 0
          ? `Проблемных: ${stats.problemSellersCount}`
          : 'Все кабинеты активны',
    },
  ]
}

function buildQualityKpis(stats: DashboardStats): KpiItem[] {
  return [
    {
      key: 'cancels',
      label: 'Отмены',
      value: String(stats.cancelsCount),
    },
    {
      key: 'cancel-rate',
      label: 'Доля отмен',
      value: formatPercent(stats.cancelRate),
    },
    {
      key: 'returns',
      label: 'Возвраты',
      value: String(stats.returnsCount),
    },
    {
      key: 'return-rate',
      label: 'Доля возвратов',
      value: formatPercent(stats.returnRate),
    },
  ]
}

function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-border xl:grid-cols-3 2xl:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:odd:border-r-0 xl:border-b-0"
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
  )
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Продажи и выручка</h2>
        <KpiGrid items={buildSalesKpis(stats)} />
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Отмены и возвраты</h2>
        <KpiGrid items={buildQualityKpis(stats)} />
      </section>
    </div>
  )
}
