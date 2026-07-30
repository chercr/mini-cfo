"use client"

import { ChevronRight, Home, Car, Pencil, Video, Store, BookOpen, Trash2, BarChart3 } from "lucide-react"
import Link from "next/link"
import { quadrantAssets } from "@/lib/dashboard-data"

const iconMap: Record<string, typeof Home> = {
  home: Home,
  car: Car,
  edit: Pencil,
  camera: Video,
  store: Store,
  book: BookOpen,
  trash: Trash2,
  chart: BarChart3,
}

function toLeft(x: number) { return 6 + (x / 40) * 88 }
function toTop(y: number) { return 6 + ((36 - y) / 54) * 88 }

export function PerformanceQuadrant() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">资产绩效总览</h2>
        <Link
          href="/performance"
          className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          查看全部资产
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex flex-col justify-between py-6 text-xs text-muted-foreground">
          <span>高</span>
          <span>0%</span>
          <span>低</span>
        </div>

        <div className="flex-1">
          <p className="mb-1 text-xs text-muted-foreground">净收益率</p>
          <div className="relative h-[340px] w-full rounded-lg">
            <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-border" />
            <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-border" />

            <div className="absolute left-4 top-3">
              <p className="text-sm font-semibold text-emerald-600">明星资产</p>
              <p className="text-xs text-muted-foreground">高收益 / 低投入</p>
            </div>
            <div className="absolute right-4 top-3 text-right">
              <p className="text-sm font-semibold text-foreground">重点发展</p>
              <p className="text-xs text-muted-foreground">高收益 / 高投入</p>
            </div>
            <div className="absolute bottom-3 left-4">
              <p className="text-sm font-semibold text-muted-foreground">可放弃</p>
              <p className="text-xs text-muted-foreground">低收益 / 低投入</p>
            </div>
            <div className="absolute bottom-3 right-4 text-right">
              <p className="text-sm font-semibold text-foreground">待优化</p>
              <p className="text-xs text-muted-foreground">低收益 / 高投入</p>
            </div>

            <div className="absolute right-2 top-8 h-28 w-40 rounded-2xl bg-secondary/60" />

            {quadrantAssets.map((b) => {
              const Icon = iconMap[b.id]
              return (
                <div
                  key={b.id}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${toLeft(b.x)}%`, top: `${toTop(b.y)}%` }}
                  title={`${b.label} · 投入 ${b.x}h/周 · 净收益率 ${b.y}%`}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm ring-4 ring-white transition-transform group-hover:scale-110"
                    style={{ backgroundColor: b.color }}
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2.2} />
                  </div>
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
                    {b.label}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-1 flex justify-between px-1 text-xs text-muted-foreground">
            <span>少</span>
            <span>20</span>
            <span>多</span>
          </div>
          <p className="mt-1 text-center text-xs text-muted-foreground">时间投入（小时/周）</p>
        </div>
      </div>
    </div>
  )
}
