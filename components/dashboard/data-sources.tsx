import { ChevronRight } from "lucide-react"
import { dataSources } from "@/lib/dashboard-data"

export function DataSources() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">数据来源</h2>
        <button className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
          管理授权
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {dataSources.map((s) => (
          <li key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold"
                style={{ backgroundColor: s.bg, color: s.color }}
              >
                {s.short}
              </div>
              <span className="text-sm font-medium text-foreground">{s.name}</span>
            </div>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
              已连接
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
