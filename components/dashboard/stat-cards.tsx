"use client"

import { Layers, Wallet, ReceiptText, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { useStore, filterTxByDate, computeTxSummary } from "@/lib/store"

export function StatCards() {
  const { assets, transactions, dateRange } = useStore()
  const activeAssets = assets.filter((a) => (a.status ?? "active") === "active")
  const filteredTx = filterTxByDate(transactions, dateRange.start, dateRange.end)
  const { income, expense, net } = computeTxSummary(filteredTx)

  // 上期对比
  const prevStart = new Date(dateRange.start)
  prevStart.setMonth(prevStart.getMonth() - 1)
  const prevEnd = new Date(dateRange.end)
  prevEnd.setMonth(prevEnd.getMonth() - 1)
  const prevTx = filterTxByDate(
    transactions,
    prevStart.toISOString().slice(0, 10),
    prevEnd.toISOString().slice(0, 10)
  )
  const prev = computeTxSummary(prevTx)

  function changePct(current: number, previous: number): string {
    if (previous === 0) return current > 0 ? "+100%" : "0%"
    const pct = ((current - previous) / previous) * 100
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`
  }

  const cards = [
    {
      title: "总资产（创收中）",
      value: `${activeAssets.length} 项`,
      change: `共 ${assets.length} 项资产`,
      changeColor: "text-muted-foreground",
      icon: Layers,
      iconColor: "#3b82f6",
      iconBg: "#dbeafe",
      showArrow: false,
    },
    {
      title: "总收入",
      value: `¥${income.toLocaleString()}`,
      change: `较上期 ${changePct(income, prev.income)}`,
      changeColor: income >= prev.income ? "text-emerald-600" : "text-rose-500",
      icon: Wallet,
      iconColor: "#22c55e",
      iconBg: "#dcfce7",
      showArrow: income >= prev.income,
    },
    {
      title: "总支出",
      value: `¥${expense.toLocaleString()}`,
      change: `较上期 ${changePct(expense, prev.expense)}`,
      changeColor: expense > prev.expense ? "text-rose-500" : "text-muted-foreground",
      icon: ReceiptText,
      iconColor: "#f43f5e",
      iconBg: "#ffe4e6",
      showArrow: expense > prev.expense,
    },
    {
      title: "净收益",
      value: `${net >= 0 ? "¥" : "-¥"}${Math.abs(net).toLocaleString()}`,
      change: `较上期 ${changePct(net, prev.net)}`,
      changeColor: net >= prev.net ? "text-emerald-600" : "text-rose-500",
      icon: TrendingUp,
      iconColor: "#8b5cf6",
      iconBg: "#ede9fe",
      showArrow: net >= prev.net,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div
            key={c.title}
            className="flex items-start justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{c.title}</p>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p className={`flex items-center gap-1 text-xs font-medium ${c.changeColor}`}>
                {c.change}
                {c.showArrow && <ArrowUp className="h-3 w-3" />}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: c.iconBg }}>
              <Icon className="h-5 w-5" style={{ color: c.iconColor }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
