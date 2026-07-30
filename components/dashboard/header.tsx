"use client"

import { useState } from "react"
import { Calendar, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { useStore, type DateRange } from "@/lib/store"
import { cn } from "@/lib/utils"

const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

function buildRange(key: string, year: number, month: number): DateRange {
  const y = year; const m = month
  switch (key) {
    case "month": {
      const start = `${y}-${String(m + 1).padStart(2, "0")}-01`
      const endDay = new Date(y, m + 1, 0).getDate()
      const end = `${y}-${String(m + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`
      return { key, start, end }
    }
    case "quarter": {
      const endM = m; const startM = m - 2
      const sy = startM < 0 ? y - 1 : y; const sm = startM < 0 ? startM + 12 : startM
      const start = `${sy}-${String(sm + 1).padStart(2, "0")}-01`
      const endDay = new Date(y, endM + 1, 0).getDate()
      const end = `${y}-${String(endM + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`
      return { key, start, end }
    }
    case "halfYear": {
      const endM = m; const startM = m - 5
      const sy = startM < 0 ? y - 1 : y; const sm = startM < 0 ? startM + 12 : startM
      const start = `${sy}-${String(sm + 1).padStart(2, "0")}-01`
      const endDay = new Date(y, endM + 1, 0).getDate()
      const end = `${y}-${String(endM + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`
      return { key, start, end }
    }
    case "year":
      return { key, start: `${y}-01-01`, end: `${y}-12-31` }
    default: {
      const start = `${y}-${String(m + 1).padStart(2, "0")}-01`
      const endDay = new Date(y, m + 1, 0).getDate()
      const end = `${y}-${String(m + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`
      return { key: "custom", start, end }
    }
  }
}

const ranges = [
  { label: "本月", key: "month" },
  { label: "近3月", key: "quarter" },
  { label: "近半年", key: "halfYear" },
  { label: "全年", key: "year" },
]

export function Header() {
  const { dateRange, setDateRange } = useStore()
  const [spinning, setSpinning] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [customYear, setCustomYear] = useState(new Date().getFullYear())
  const [customMonth, setCustomMonth] = useState(new Date().getMonth())

  function handleRefresh() {
    setSpinning(true)
    setTimeout(() => setSpinning(false), 800)
  }

  function applyRange(key: string) {
    setDateRange(buildRange(key, new Date().getFullYear(), new Date().getMonth()))
    setPickerOpen(false)
  }

  function applyCustom() {
    setDateRange(buildRange("custom", customYear, customMonth))
    setPickerOpen(false)
  }

  function prevMonth() {
    if (customMonth === 0) { setCustomMonth(11); setCustomYear(customYear - 1) }
    else setCustomMonth(customMonth - 1)
  }
  function nextMonth() {
    if (customMonth === 11) { setCustomMonth(0); setCustomYear(customYear + 1) }
    else setCustomMonth(customMonth + 1)
  }

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">总览</h1>

      <div className="flex items-center gap-3">
        {/* 日期选择 */}
        <div className="relative">
          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            <span>{dateRange.start} ~ {dateRange.end}</span>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </button>

          {pickerOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
                <p className="mb-2 text-xs font-medium text-muted-foreground">快捷选择</p>
                <div className="flex flex-wrap gap-2">
                  {ranges.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => applyRange(r.key)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                        dateRange.key === r.key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {}}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      dateRange.key === "custom"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    自选月
                  </button>
                </div>

                <div className="mt-3 border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-foreground">{customYear}年 {monthNames[customMonth]}</span>
                    <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-center text-xs text-muted-foreground">
                    {buildRange("custom", customYear, customMonth).start} ~ {buildRange("custom", customYear, customMonth).end}
                  </div>
                </div>

                <button
                  onClick={applyCustom}
                  className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  应用自选月
                </button>
              </div>
            </>
          )}
        </div>

        {/* 刷新 */}
        <button
          onClick={handleRefresh}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="刷新"
        >
          <RefreshCw className={`h-4 w-4 transition-transform ${spinning ? "animate-spin" : ""}`} />
        </button>
      </div>
    </header>
  )
}
