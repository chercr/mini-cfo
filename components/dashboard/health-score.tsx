"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ArrowUp, ShieldCheck, TrendingUp, Sprout, Timer, AlertTriangle } from "lucide-react"
import { healthMetrics } from "@/lib/dashboard-data"

const donutData = [
  { name: "score", value: 78 },
  { name: "rest", value: 22 },
]

const metricIcons = [ShieldCheck, TrendingUp, Sprout, Timer, AlertTriangle]

export function HealthScore() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">资产健康度</h2>

      <div className="mt-2 flex items-center gap-4">
        {/* Donut */}
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              <Pie
                data={donutData}
                dataKey="value"
                innerRadius={58}
                outerRadius={72}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                cornerRadius={8}
              >
                <Cell fill="url(#healthGradient)" />
                <Cell fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-foreground">
              78 <span className="text-base font-normal text-muted-foreground">分</span>
            </p>
            <p className="text-sm text-emerald-600">健康</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-1 flex-col gap-3">
          {healthMetrics.map((m, i) => {
            const Icon = metricIcons[i]
            return (
              <div key={m.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${m.color}1a` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: m.color }} />
                  </div>
                  <span className="text-sm text-muted-foreground">{m.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{m.score} 分</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
        <ArrowUp className="h-3 w-3" />
        较上月 +6 分
      </div>
    </div>
  )
}
