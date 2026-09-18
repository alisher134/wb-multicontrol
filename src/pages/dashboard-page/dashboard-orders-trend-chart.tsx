import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { DashboardStats } from '@/lib/api'
import { formatCurrencyRub } from '@/lib/format'

type DashboardOrdersTrendChartProps = {
  stats: DashboardStats
}

const chartConfig = {
  ordersCount: {
    label: 'Заказы',
    color: 'var(--chart-1)',
  },
  revenue: {
    label: 'Выручка',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig

export function DashboardOrdersTrendChart({
  stats,
}: DashboardOrdersTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Динамика за 7 дней</CardTitle>
        <CardDescription>Заказы и выручка по всем кабинетам</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={stats.ordersTrend}
            margin={{ left: 8, right: 8, top: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="orders"
              tickLine={false}
              axisLine={false}
              width={36}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="revenue"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(value: number) =>
                new Intl.NumberFormat('ru-RU', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const label =
                      name === 'revenue'
                        ? chartConfig.revenue.label
                        : chartConfig.ordersCount.label
                    const formattedValue =
                      name === 'revenue'
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
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="orders"
              dataKey="ordersCount"
              type="monotone"
              fill="var(--color-ordersCount)"
              fillOpacity={0.2}
              stroke="var(--color-ordersCount)"
              strokeWidth={2}
            />
            <Area
              yAxisId="revenue"
              dataKey="revenue"
              type="monotone"
              fill="var(--color-revenue)"
              fillOpacity={0.15}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
