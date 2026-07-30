"use client"

import { useState } from "react"
import { ChevronRight, Home, Car, Pencil, Video, Store, BookOpen, Trash2, BarChart3, Download, TrendingUp, ShieldCheck, Sprout, Timer, AlertTriangle, Check } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { quadrantAssets, healthMetrics } from "@/lib/dashboard-data"

const iconMap: Record<string, typeof Home> = {
  home: Home, car: Car, edit: Pencil, camera: Video, store: Store, book: BookOpen, trash: Trash2, chart: BarChart3,
}

function toLeft(x: number) { return 6 + (x / 40) * 88 }
function toTop(y: number) { return 6 + ((36 - y) / 54) * 88 }

const metricIcons = [ShieldCheck, TrendingUp, Sprout, Timer, AlertTriangle]

// Mock monthly data
const monthlyData = [
  { month: "1月", income: 32000, expense: 12000 },
  { month: "2月", income: 28000, expense: 10500 },
  { month: "3月", income: 35000, expense: 13800 },
  { month: "4月", income: 38000, expense: 14200 },
  { month: "5月", income: 42000, expense: 15100 },
  { month: "6月", income: 45000, expense: 16000 },
  { month: "7月", income: 48000, expense: 17500 },
]

export default function PerformancePage() {
  const [exported, setExported] = useState(false)

  function handleExport() {
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }
  const maxBar = Math.max(...monthlyData.map(d => d.income + d.expense))

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">资产绩效</h1>
              <p className="mt-1 text-sm text-muted-foreground">全面分析你的资产表现与健康度</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-all hover:bg-secondary active:scale-95"
            >
              {exported ? <Check className="h-4 w-4 text-emerald-500" /> : <Download className="h-4 w-4" />}
              {exported ? "已导出" : "导出报表"}
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "总资产", value: "8 项", color: "#3b82f6", bg: "#dbeafe" },
              { label: "月均收入", value: "¥38,286", color: "#22c55e", bg: "#dcfce7" },
              { label: "月均支出", value: "¥14,157", color: "#f43f5e", bg: "#ffe4e6" },
              { label: "利润率", value: "63.0%", color: "#8b5cf6", bg: "#ede9fe" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Quadrant + Health */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Quadrant */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold text-foreground">时间投入 vs 净收益率</h2>
              <div className="mt-4 flex gap-3">
                <div className="flex flex-col justify-between py-6 text-xs text-muted-foreground">
                  <span>高</span><span>0%</span><span>低</span>
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-xs text-muted-foreground">净收益率</p>
                  <div className="relative h-[300px] w-full rounded-lg">
                    <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-border" />
                    <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-border" />
                    <div className="absolute left-4 top-3"><p className="text-sm font-semibold text-emerald-600">明星资产</p><p className="text-xs text-muted-foreground">高收益 / 低投入</p></div>
                    <div className="absolute right-4 top-3 text-right"><p className="text-sm font-semibold text-foreground">重点发展</p><p className="text-xs text-muted-foreground">高收益 / 高投入</p></div>
                    <div className="absolute bottom-3 left-4"><p className="text-sm font-semibold text-muted-foreground">可放弃</p><p className="text-xs text-muted-foreground">低收益 / 低投入</p></div>
                    <div className="absolute bottom-3 right-4 text-right"><p className="text-sm font-semibold text-foreground">待优化</p><p className="text-xs text-muted-foreground">低收益 / 高投入</p></div>
                    <div className="absolute right-2 top-8 h-28 w-40 rounded-2xl bg-secondary/60" />
                    {quadrantAssets.map((b) => {
                      const Icon = iconMap[b.id]
                      return (
                        <div key={b.id} className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer" style={{ left: `${toLeft(b.x)}%`, top: `${toTop(b.y)}%` }} title={`${b.label} · 投入 ${b.x}h/周 · 净收益率 ${b.y}%`}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm ring-4 ring-white transition-transform group-hover:scale-110" style={{ backgroundColor: b.color }}>
                            <Icon className="h-5 w-5 text-white" strokeWidth={2.2} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-1 flex justify-between px-1 text-xs text-muted-foreground"><span>少</span><span>20</span><span>多</span></div>
                  <p className="mt-1 text-center text-xs text-muted-foreground">时间投入（小时/周）</p>
                </div>
              </div>
            </div>

            {/* Health details */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold text-foreground">健康度详情</h2>
              <div className="mt-4 flex flex-col gap-4">
                {healthMetrics.map((m, i) => {
                  const Icon = metricIcons[i]
                  return (
                    <div key={m.label} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${m.color}1a` }}>
                        <Icon className="h-4 w-4" style={{ color: m.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{m.label}</span>
                          <span className="text-sm font-semibold text-foreground">{m.score} 分</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${m.score}%`, backgroundColor: m.color }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Monthly bar chart */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">月度收支趋势</h2>
            <div className="mt-4 flex items-end gap-3" style={{ height: 180 }}>
              {monthlyData.map((d) => (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-foreground">¥{(d.income + d.expense).toLocaleString()}</span>
                  <div className="flex w-full gap-1" style={{ height: 140 }}>
                    <div className="flex-1 self-end rounded-t-sm bg-emerald-500/70" style={{ height: `${(d.income / maxBar) * 140}px` }} />
                    <div className="flex-1 self-end rounded-t-sm bg-rose-400/60" style={{ height: `${(d.expense / maxBar) * 140}px` }} />
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-emerald-500/70" /><span className="text-xs text-muted-foreground">收入</span></div>
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-rose-400/60" /><span className="text-xs text-muted-foreground">支出</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
