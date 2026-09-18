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
import type { DashboardStats } from '@/lib/api'
import { formatCurrencyRub } from '@/lib/format'

type DashboardSellersRevenueChartProps = {
  stats: DashboardStats
}

const chartConfig = {
  revenue: {
    label: 'Выручка',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function DashboardSellersRevenueChart({
  stats,
}: DashboardSellersRevenueChartProps) {
  const chartData = stats.bySeller.map((row) => ({
    shortName: row.shortName,
    revenue: row.revenue,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Выручка по ИП</CardTitle>
        <CardDescription>Заказы за сегодня без отменённых</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
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
                  formatter={(value) => (
                    <div className="flex flex-1 items-center justify-between gap-8 leading-none">
                      <span className="text-muted-foreground">
                        {chartConfig.revenue.label}
                      </span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {formatCurrencyRub(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
