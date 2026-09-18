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
import { getDashboardPeriodLabel, type DashboardStats } from '@/lib/api'
import { formatCompactNumber, formatCurrencyRub } from '@/lib/format'

type DashboardOrdersTrendChartProps = {
  stats: DashboardStats
}

const chartConfig = {
  ordersCount: {
    label: 'Заказы',
    color: 'var(--chart-1)',
  },
  salesCount: {
    label: 'Продажи',
    color: 'var(--chart-3)',
  },
  revenue: {
    label: 'Выручка',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig

export function DashboardOrdersTrendChart({
  stats,
}: DashboardOrdersTrendChartProps) {
  const periodLabel = getDashboardPeriodLabel(stats.period)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Динамика · {periodLabel}</CardTitle>
        <CardDescription>
          Заказы, продажи и выручка по выбранному срезу
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-56 w-full"
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
              interval="preserveStartEnd"
              minTickGap={24}
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
              tickFormatter={(value: number) => formatCompactNumber(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const key = String(name) as keyof typeof chartConfig
                    const label = chartConfig[key]?.label ?? String(name)
                    const formattedValue =
                      key === 'revenue'
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
              yAxisId="orders"
              dataKey="salesCount"
              type="monotone"
              fill="var(--color-salesCount)"
              fillOpacity={0.12}
              stroke="var(--color-salesCount)"
              strokeWidth={2}
            />
            <Area
              yAxisId="revenue"
              dataKey="revenue"
              type="monotone"
              fill="var(--color-revenue)"
              fillOpacity={0.1}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
