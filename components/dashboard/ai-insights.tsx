"use client"

import { Sparkles, ChevronRight, Gem } from "lucide-react"
import Link from "next/link"
import { useStore, generateInsights } from "@/lib/store"

export function AiInsights() {
  const { assets, transactions } = useStore()
  const insights = generateInsights(assets, transactions)

  return (
    <div className="rounded-xl border border-border bg-gradient-to-b from-indigo-50/70 to-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <h2 className="text-base font-semibold text-foreground">AI 洞察</h2>
        </div>
        <Link
          href="/insights"
          className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          查看详情
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {insights.slice(0, 3).map((item, i) => (
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
}
