"use client"

import { useState } from "react"
import { Home, Car, BookOpen, Video, Package, MoreVertical, ChevronDown, Pencil, BarChart3, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import type { AssetRow } from "@/lib/dashboard-data"

const iconMap = { home: Home, car: Car, book: BookOpen, video: Video, box: Package }

function Sparkline({ data, trend }: { data: number[]; trend: AssetRow["trend"] }) {
  const w = 64; const h = 28
  const max = Math.max(...data); const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(" ")
  const stroke = trend === "down" ? "#f43f5e" : "#22c55e"
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const healthStyles: Record<AssetRow["health"], string> = {
  优秀: "bg-emerald-100 text-emerald-700",
  良好: "bg-green-50 text-green-600",
  较差: "bg-rose-100 text-rose-600",
  一般: "bg-amber-100 text-amber-700",
}

export function AssetTable() {
  const { assets } = useStore()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">我的创收资产</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-3 font-medium">资产名称</th>
              <th className="pb-3 font-medium">类型</th>
              <th className="pb-3 font-medium">本月净收益</th>
              <th className="pb-3 font-medium">净收益率</th>
              <th className="pb-3 font-medium">趋势</th>
              <th className="pb-3 font-medium">健康度</th>
              <th className="pb-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => {
              const Icon = iconMap[a.icon as keyof typeof iconMap] || Package
              return (
                <tr key={a.id} className="border-b border-border/60 transition-colors hover:bg-secondary/50">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: a.bg }}>
                        <Icon className="h-[18px] w-[18px]" style={{ color: a.color }} />
                      </div>
                      <span className="font-medium text-foreground">
                        {a.name}
                        {a.sub && <span className="text-muted-foreground"> - {a.sub}</span>}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-muted-foreground">{a.type}</td>
                  <td className={`py-3.5 font-semibold ${a.isNegative ? "text-rose-500" : "text-foreground"}`}>
                    {a.netProfit}
                  </td>
                  <td className={`py-3.5 font-medium ${a.isNegative ? "text-rose-500" : "text-emerald-600"}`}>
                    {a.rate}
                  </td>
                  <td className="py-3.5">
                    <Sparkline data={a.spark} trend={a.trend} />
                  </td>
                  <td className="py-3.5">
                    <span className={`rounded-md px-2 py-1 text-xs font-medium ${healthStyles[a.health]}`}>
                      {a.health}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1">
                      <Link href="/assets" className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80">
                        查看详情 <ExternalLink className="h-3 w-3" />
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary"
                          aria-label="更多操作"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenu === a.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-lg border border-border bg-card p-1 shadow-lg">
                              <Link href="/assets" className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary" onClick={() => setOpenMenu(null)}>
                                <Pencil className="h-3.5 w-3.5" />编辑资产
                              </Link>
                              <Link href="/performance" className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary" onClick={() => setOpenMenu(null)}>
                                <BarChart3 className="h-3.5 w-3.5" />查看绩效
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Link href="/assets" className="mx-auto mt-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
        查看全部 {assets.length} 项资产
        <ChevronDown className="h-4 w-4" />
      </Link>
    </div>
  )
}
