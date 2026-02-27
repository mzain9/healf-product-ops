'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { StatusCount } from '@/lib/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatusDonutProps {
  data: StatusCount[]
}

export function StatusDonut({ data }: StatusDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const filtered = data.filter((d) => d.value > 0)
  if (filtered.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Products by status</CardTitle>
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
        <CardTitle>Products by status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filtered}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                stroke="transparent"
                startAngle={50}
                endAngle={-310}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {filtered.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _name: string, item: { payload?: { name?: string }; name?: string }) => {
                  const pct = total ? ((Number(value) / total) * 100).toFixed(1) : '0'
                  const label = item.name ?? item.payload?.name ?? ''
                  return [`${label}: ${value} (${pct}%)`, '']
                }}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'var(--card-foreground)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
