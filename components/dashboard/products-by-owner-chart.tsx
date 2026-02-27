'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ProductsByOwnerRow } from '@/lib/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProductsByOwnerChartProps {
  data: ProductsByOwnerRow[]
}

export function ProductsByOwnerChart({ data }: ProductsByOwnerChartProps) {
  const chartData = data.map((d) => ({ ...d, count: d.count }))
  if (!chartData.length) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Products by owner (Top 5)</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[240px] items-center justify-center text-muted-foreground">
          No data
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Products by owner (Top 5)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="ownerName"
                width={80}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v.length > 12 ? v.slice(0, 11) + '…' : v)}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'var(--card-foreground)' }}
                formatter={(value: number, name, props) => [
                  value,
                  'Products',
                  props.payload?.value != null
                    ? `Value: $${Number(props.payload.value).toFixed(2)}`
                    : '',
                ]}
              />
              <Bar
                dataKey="count"
                name="Products"
                fill="var(--color-chart-2)"
                radius={[0, 4, 4, 0]}
                activeBar={{ fill: 'var(--color-chart-2)' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
