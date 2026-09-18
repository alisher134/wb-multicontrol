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
import { getOrderStatusLabel, type DashboardStats } from '@/lib/api'

type DashboardStatusChartProps = {
  stats: DashboardStats
}

const STATUS_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--primary)',
] as const

export function DashboardStatusChart({ stats }: DashboardStatusChartProps) {
  const chartData = stats.statusBreakdown.map((point, index) => ({
    status: point.status,
    count: point.count,
    fill: STATUS_COLORS[index % STATUS_COLORS.length],
  }))

  const chartConfig = {
    count: {
      label: 'Заказы',
    },
    ...Object.fromEntries(
      chartData.map((point) => [
        point.status,
        {
          label: getOrderStatusLabel(point.status),
          color: point.fill,
        },
      ]),
    ),
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статусы заказов</CardTitle>
        <CardDescription>Распределение заказов за сегодня</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-64 w-full"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="status" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={48}
              strokeWidth={2}
            >
              {chartData.map((point) => (
                <Cell key={point.status} fill={point.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={
                <ChartLegendContent
                  nameKey="status"
                  className="flex-wrap gap-2"
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
