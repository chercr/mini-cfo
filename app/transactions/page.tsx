"use client"

import { useState } from "react"
import { Home, Car, BookOpen, Video, Package, ArrowUp, ArrowDown, Filter } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useStore, filterTxByDate } from "@/lib/store"
import { cn } from "@/lib/utils"

const iconMap: Record<string, typeof Home> = {
  home: Home, car: Car, book: BookOpen, video: Video, box: Package,
}

type FilterType = "all" | "income" | "expense"

export default function TransactionsPage() {
  const { transactions, dateRange } = useStore()
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState("")

  const inRange = filterTxByDate(transactions, dateRange.start, dateRange.end)
  const filtered = inRange
    .filter((t) => typeFilter === "all" || t.type === typeFilter)
    .filter((t) => !search || t.assetName.includes(search) || t.category.includes(search) || t.note.includes(search))

  const totalIncome = inRange.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpense = inRange.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">流水中心</h1>
            <p className="mt-1 text-sm text-muted-foreground">记录与管理所有资产的收支流水</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">总收入</p>
              <p className="mt-1 text-xl font-bold text-emerald-600">¥{totalIncome.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">总支出</p>
              <p className="mt-1 text-xl font-bold text-rose-500">¥{totalExpense.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">净流水</p>
              <p className={`mt-1 text-xl font-bold ${totalIncome - totalExpense >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                {totalIncome - totalExpense >= 0 ? "+" : "-"}¥{Math.abs(totalIncome - totalExpense).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Filters + Table */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {[
                  { key: "all", label: "全部" },
                  { key: "income", label: "收入" },
                  { key: "expense", label: "支出" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setTypeFilter(f.key as FilterType)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      typeFilter === f.key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索资产或分类..."
                  className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-3 font-medium">资产</th>
                    <th className="pb-3 font-medium">类型</th>
                    <th className="pb-3 font-medium">分类</th>
                    <th className="pb-3 font-medium">金额</th>
                    <th className="pb-3 font-medium">备注</th>
                    <th className="pb-3 font-medium">日期</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">暂无匹配的流水记录</td>
                    </tr>
                  ) : (
                    filtered.map((t) => {
                      const Icon = iconMap[t.assetIcon]
                      return (
                        <tr key={t.id} className="border-b border-border/60 transition-colors hover:bg-secondary/50">
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: t.assetBg }}>
                                <Icon className="h-4 w-4" style={{ color: t.assetColor }} />
                              </div>
                              <span className="font-medium text-foreground">{t.assetName}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={cn("rounded-md px-1.5 py-0.5 text-xs font-medium", t.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600")}>
                              {t.type === "income" ? "收入" : "支出"}
                            </span>
                          </td>
                          <td className="py-3 text-muted-foreground">{t.category}</td>
                          <td className={`py-3 font-medium ${t.type === "income" ? "text-emerald-600" : "text-rose-500"}`}>
                            {t.type === "income" ? "+" : "-"}¥{t.amount.toLocaleString()}
                          </td>
                          <td className="py-3 text-muted-foreground">{t.note}</td>
                          <td className="py-3 text-muted-foreground">{t.date}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
