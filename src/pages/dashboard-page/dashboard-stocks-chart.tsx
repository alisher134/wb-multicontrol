import { Cell, Pie, PieChart } from 'recharts'

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
import { EmptyState } from '@/components/ui/empty-state'
import { Show } from '@/components/ui/show'
import type { DashboardStats } from '@/lib/api'
import { formatCompactNumber } from '@/lib/format'

type DashboardStocksChartProps = {
  stats: DashboardStats
}

const LEVEL_COLORS = {
  inStock: 'var(--chart-1)',
  low: 'var(--chart-3)',
  out: 'var(--chart-5)',
} as const

const FULFILLMENT_COLORS = {
  fbo: 'var(--chart-2)',
  fbs: 'var(--chart-4)',
} as const

export function DashboardStocksChart({ stats }: DashboardStocksChartProps) {
  const { stocks } = stats

  const levelData = [
    {
      key: 'inStock',
      label: 'В наличии',
      count: stocks.inStockCount,
      fill: LEVEL_COLORS.inStock,
    },
    {
      key: 'low',
      label: 'Мало',
      count: stocks.lowStockCount,
      fill: LEVEL_COLORS.low,
    },
    {
      key: 'out',
      label: 'Нет',
      count: stocks.outOfStockCount,
      fill: LEVEL_COLORS.out,
    },
  ].filter((point) => point.count > 0)

  const fulfillmentData = [
    {
      key: 'fbo',
      label: 'FBO',
      count: stocks.fboUnits,
      fill: FULFILLMENT_COLORS.fbo,
    },
    {
      key: 'fbs',
      label: 'FBS',
      count: stocks.fbsUnits,
      fill: FULFILLMENT_COLORS.fbs,
    },
  ].filter((point) => point.count > 0)

  const levelConfig = {
    count: { label: 'SKU' },
    ...Object.fromEntries(
      levelData.map((point) => [
        point.key,
        { label: point.label, color: point.fill },
      ]),
    ),
  } satisfies ChartConfig

  const fulfillmentConfig = {
    count: { label: 'Единицы' },
    ...Object.fromEntries(
      fulfillmentData.map((point) => [
        point.key,
        { label: point.label, color: point.fill },
      ]),
    ),
  } satisfies ChartConfig

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Уровни остатков</CardTitle>
          <CardDescription>Распределение SKU по наличию</CardDescription>
        </CardHeader>
        <CardContent>
          <Show
            when={levelData.length > 0}
            fallback={<EmptyState title="Нет данных по остаткам" />}
          >
            <ChartContainer
              config={levelConfig}
              className="mx-auto aspect-square max-h-52 w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="key" hideLabel />}
                />
                <Pie
                  data={levelData}
                  dataKey="count"
                  nameKey="key"
                  innerRadius={40}
                  strokeWidth={2}
                >
                  {levelData.map((point) => (
                    <Cell key={point.key} fill={point.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={
                    <ChartLegendContent
                      nameKey="key"
                      className="flex-wrap gap-2"
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
          </Show>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">FBO / FBS</CardTitle>
          <CardDescription>
            Единицы на складах ·{' '}
            {formatCompactNumber(stocks.fboUnits + stocks.fbsUnits)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Show
            when={fulfillmentData.length > 0}
            fallback={<EmptyState title="Нет данных по складам" />}
          >
            <ChartContainer
              config={fulfillmentConfig}
              className="mx-auto aspect-square max-h-52 w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="key"
                      hideLabel
                      formatter={(value) => (
                        <span className="font-mono tabular-nums">
                          {formatCompactNumber(Number(value))}
                        </span>
                      )}
                    />
                  }
                />
                <Pie
                  data={fulfillmentData}
                  dataKey="count"
                  nameKey="key"
                  innerRadius={40}
                  strokeWidth={2}
                >
                  {fulfillmentData.map((point) => (
                    <Cell key={point.key} fill={point.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={
                    <ChartLegendContent
                      nameKey="key"
                      className="flex-wrap gap-2"
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
          </Show>
        </CardContent>
      </Card>
    </div>
  )
}
