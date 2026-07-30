"use client"

import { Sparkles, Gem, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useStore, generateInsights, type InsightItem } from "@/lib/store"

const groupMeta: Record<string, { icon: typeof TrendingUp; iconBg: string; iconColor: string; title: string }> = {
  positive: { icon: TrendingUp, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", title: "增长机会" },
  warning: { icon: Lightbulb, iconBg: "bg-amber-100", iconColor: "text-amber-600", title: "优化建议" },
  danger: { icon: AlertTriangle, iconBg: "bg-rose-100", iconColor: "text-rose-600", title: "风险预警" },
  info: { icon: Target, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", title: "系统提示" },
}

function groupInsights(items: InsightItem[]) {
  const groups: Record<string, InsightItem[]> = {}
  for (const item of items) {
    const key = item.type
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }
  return groups
}

export default function InsightsPage() {
  const { assets, transactions } = useStore()
  const insights = generateInsights(assets, transactions)
  const groups = groupInsights(insights)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <Sparkles className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI 洞察</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                基于 {assets.length} 项资产、{transactions.length} 条流水实时生成
              </p>
            </div>
          </div>

          {insights.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">暂无洞察数据，添加资产并记录流水后自动生成</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {Object.entries(groups).map(([type, items]) => {
                const meta = groupMeta[type] || groupMeta.info
                const GIcon = meta.icon
                return (
                  <div key={type} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${meta.iconBg}`}>
                        <GIcon className={`h-4 w-4 ${meta.iconColor}`} />
                      </div>
                      <h2 className="text-base font-semibold text-foreground">{meta.title}</h2>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">{items.length}</span>
                    </div>
                    <ul className="mt-4 flex flex-col gap-3">
                      {items.map((item, i) => (
                        <li key={i} className="flex gap-2.5">
                          <Gem className={`mt-0.5 h-4 w-4 shrink-0 ${
                            item.type === "positive" ? "text-emerald-400" :
                            item.type === "warning" ? "text-amber-400" :
                            item.type === "danger" ? "text-rose-400" :
                            "text-indigo-400"
                          }`} />
                          <p className="text-sm leading-relaxed text-foreground/80">{item.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
