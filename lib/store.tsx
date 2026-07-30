"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  assets as initialAssets,
  transactions as initialTransactions,
  type AssetRow,
  type TransactionRow,
} from "@/lib/dashboard-data"

// ---- 持久化 key ----
const ASSETS_KEY = "am_assets"
const TX_KEY = "am_transactions"

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch { /* ignore */ }
  return fallback
}

function saveToStorage(key: string, data: unknown) {
  if (typeof window === "undefined") return
  try { localStorage.setItem(key, JSON.stringify(data)) } catch { /* ignore */ }
}

// ---- 壁纸 ----
export interface Wallpaper {
  data: string         // base64 图片或渐变CSS值
  type: "image" | "gradient"
  blur: number         // 0-20px
  opacity: number      // 0-1
}

const DEFAULT_WALLPAPER: Wallpaper = { data: "", type: "gradient", blur: 0, opacity: 0.15 }

// ---- 日期范围 ----
export interface DateRange {
  key: string  // "month" | "quarter" | "halfYear" | "year" | "custom"
  start: string
  end: string
}

function getDefaultRange(): DateRange {
  const y = new Date().getFullYear()
  const m = new Date().getMonth()
  const start = `${y}-${String(m + 1).padStart(2, "0")}-01`
  const endDay = new Date(y, m + 1, 0).getDate()
  const end = `${y}-${String(m + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`
  return { key: "month", start, end }
}

// ---- 洞察生成 ----
export interface InsightItem {
  text: string
  type: "positive" | "warning" | "danger" | "info"
}

export function generateInsights(
  assetList: AssetRow[],
  txList: TransactionRow[]
): InsightItem[] {
  const insights: InsightItem[] = []
  if (assetList.length === 0) {
    insights.push({ text: "添加你的第一项资产，AI 将自动分析数据并生成洞察建议。", type: "info" })
    return insights
  }
  const best = assetList.filter((a) => !a.isNegative).sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))[0]
  if (best && parseFloat(best.rate) >= 20) {
    insights.push({ text: `你的「${best.name}」资产表现优异，净收益率达 ${best.rate}，远超平均水平，建议考虑增加投入资源。`, type: "positive" })
  }
  const worst = assetList.filter((a) => a.isNegative).sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))[0]
  if (worst) {
    insights.push({ text: `「${worst.name}」资产近期收益下滑，净收益为负（${worst.rate}），建议分析原因或考虑暂停投入。`, type: "warning" })
  }
  const growingAssets = assetList.filter((a) => a.spark.length >= 3 && a.spark[a.spark.length - 1] > a.spark[0])
  if (growingAssets.length >= 2) {
    insights.push({ text: `${growingAssets.slice(0, 2).map((a) => `「${a.name}」`).join("、")} 近几个月收入持续增长，可适度增加投入。`, type: "positive" })
  }
  const incomeAssets = assetList.filter((a) => !a.isNegative)
  if (incomeAssets.length === 1) {
    insights.push({ text: `当前仅「${incomeAssets[0].name}」为盈利资产，收入来源过于集中，建议拓展多元化创收渠道。`, type: "warning" })
  }
  const highTimeLowProfit = assetList.filter((a) => (a.timeInvested ?? 0) >= 15 && parseFloat(a.rate) < 10)
  if (highTimeLowProfit.length > 0) {
    insights.push({ text: `「${highTimeLowProfit[0].name}」每周投入 ${highTimeLowProfit[0].timeInvested}h 但利润率仅 ${highTimeLowProfit[0].rate}，时间回报率偏低。`, type: "warning" })
  }
  if (insights.length < 2) {
    insights.push({ text: "记录更多流水数据，AI 将为你提供更精准的分析与建议。", type: "info" })
  }
  return insights.slice(0, 5)
}

// ---- 交易统计工具 ----
export function filterTxByDate(txList: TransactionRow[], start: string, end: string) {
  return txList.filter((t) => t.date >= start && t.date <= end)
}

export function computeTxSummary(txList: TransactionRow[]) {
  const income = txList.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expense = txList.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  return { income, expense, net: income - expense }
}

// ---- Store ----
interface StoreContextType {
  assets: AssetRow[]
  addAsset: (a: Omit<AssetRow, "id">) => void
  updateAsset: (id: string, a: Partial<AssetRow>) => void
  deleteAsset: (id: string) => void
  transactions: TransactionRow[]
  addTransaction: (tx: Omit<TransactionRow, "id">) => void
  dateRange: DateRange
  setDateRange: (r: DateRange) => void
  theme: string
  setTheme: (t: string) => void
  wallpaper: Wallpaper
  setWallpaper: (w: Wallpaper) => void
  clearWallpaper: () => void
  exportData: () => string
  importData: (json: string) => boolean
}

const StoreContext = createContext<StoreContextType | null>(null)

let nextAssetId = 20
let nextTxId = 300

export function StoreProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<AssetRow[]>(() => loadFromStorage(ASSETS_KEY, initialAssets))
  const [transactions, setTransactions] = useState<TransactionRow[]>(() => loadFromStorage(TX_KEY, initialTransactions))
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultRange)
  const [wallpaper, setWallpaperState] = useState<Wallpaper>(() => {
    if (typeof window === "undefined") return DEFAULT_WALLPAPER
    try {
      const raw = localStorage.getItem("am_wallpaper")
      if (raw) return JSON.parse(raw) as Wallpaper
    } catch { /* ignore */ }
    return DEFAULT_WALLPAPER
  })
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "emerald"
    return localStorage.getItem("am_theme") || "emerald"
  })
  const [mounted, setMounted] = useState(false)

  // 主题同步到 <html> 和 localStorage
  function setTheme(t: string) {
    setThemeState(t)
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", t)
      localStorage.setItem("am_theme", t)
    }
  }

  // 挂载时应用主题
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme)
    }
  }, [theme, mounted])

  // 标记客户端挂载完成（避免 hydration 不一致）
  useEffect(() => { setMounted(true) }, [])

  // 持久化
  useEffect(() => { if (mounted) saveToStorage(ASSETS_KEY, assets) }, [assets, mounted])
  useEffect(() => { if (mounted) saveToStorage(TX_KEY, transactions) }, [transactions, mounted])

  function addAsset(a: Omit<AssetRow, "id">) {
    setAssets((prev) => [...prev, { ...a, id: `${nextAssetId++}` }])
  }

  function updateAsset(id: string, partial: Partial<AssetRow>) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...partial } : a)))
  }

  function deleteAsset(id: string) {
    setAssets((prev) => {
      const target = prev.find((a) => a.id === id)
      if (target) {
        setTransactions((tx) => tx.filter((t) => t.assetName !== target.name))
      }
      return prev.filter((a) => a.id !== id)
    })
  }

  function addTransaction(tx: Omit<TransactionRow, "id">) {
    setTransactions((prev) => [{ ...tx, id: `t${nextTxId++}` }, ...prev])
  }

  function setWallpaper(w: Wallpaper) {
    setWallpaperState(w)
    if (typeof window !== "undefined") {
      try { localStorage.setItem("am_wallpaper", JSON.stringify(w)) } catch { /* quota exceeded */ }
    }
  }

  function clearWallpaper() {
    setWallpaperState(DEFAULT_WALLPAPER)
    if (typeof window !== "undefined") {
      localStorage.removeItem("am_wallpaper")
    }
  }

  function exportData(): string {
    return JSON.stringify({ assets, transactions, exportedAt: new Date().toISOString() }, null, 2)
  }

  function importData(json: string): boolean {
    try {
      const data = JSON.parse(json)
      if (data.assets && Array.isArray(data.assets)) {
        setAssets(data.assets)
        nextAssetId = Math.max(...data.assets.map((a: AssetRow) => Number(a.id) || 0), nextAssetId) + 1
      }
      if (data.transactions && Array.isArray(data.transactions)) {
        setTransactions(data.transactions)
        nextTxId = Math.max(...data.transactions.map((t: TransactionRow) => parseInt(t.id.slice(1)) || 0), nextTxId) + 1
      }
      return true
    } catch {
      return false
    }
  }

  return (
    <StoreContext.Provider value={{
      assets, addAsset, updateAsset, deleteAsset,
      transactions, addTransaction,
      dateRange, setDateRange,
      theme, setTheme,
      wallpaper, setWallpaper, clearWallpaper,
      exportData, importData,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
