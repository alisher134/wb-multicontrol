import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { EmptyState } from '@/components/ui/empty-state'
import { Show } from '@/components/ui/show'
import { getDashboardPeriodLabel, type DashboardStats } from '@/lib/api'
import { formatCompactNumber, formatCurrencyRub } from '@/lib/format'

type DashboardSellersRevenueChartProps = {
  stats: DashboardStats
}

const chartConfig = {
  revenue: {
    label: 'Выручка',
    color: 'var(--chart-2)',
  },
  ordersCount: {
    label: 'Заказы',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function DashboardSellersRevenueChart({
  stats,
}: DashboardSellersRevenueChartProps) {
  const chartData = stats.bySeller.map((row) => ({
    shortName: row.shortName,
    revenue: row.revenue,
    ordersCount: row.ordersCount,
  }))

  const periodLabel = getDashboardPeriodLabel(stats.period)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Сравнение ИП</CardTitle>
        <CardDescription>Выручка и заказы · {periodLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        <Show
          when={chartData.length > 0}
          fallback={<EmptyState title="Нет данных по ИП" />}
        >
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-56 w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 8, right: 8, top: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="shortName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                yAxisId="revenue"
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(value: number) => formatCompactNumber(value)}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={36}
                allowDecimals={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      const isRevenue = name === 'revenue'
                      const label = isRevenue
                        ? chartConfig.revenue.label
                        : chartConfig.ordersCount.label
                      const formattedValue = isRevenue
                        ? formatCurrencyRub(Number(value))
                        : String(value)

                      return (
                        <div className="flex flex-1 items-center justify-between gap-8 leading-none">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-mono font-medium text-foreground tabular-nums">
                            {formattedValue}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                yAxisId="orders"
                dataKey="ordersCount"
                fill="var(--color-ordersCount)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </Show>
      </CardContent>
    </Card>
  )
}
