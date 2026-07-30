"use client"

import {
  LayoutGrid,
  LayoutDashboard,
  TrendingUp,
  ArrowLeftRight,
  Sparkles,
  Settings,
  FolderPlus,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { key: "/", label: "总览", icon: LayoutGrid },
  { key: "/assets", label: "资产看板", icon: LayoutDashboard },
  { key: "/performance", label: "资产绩效", icon: TrendingUp },
  { key: "/transactions", label: "流水中心", icon: ArrowLeftRight },
  { key: "/insights", label: "AI洞察", icon: Sparkles },
  { key: "/settings", label: "设置中心", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [toast, setToast] = useState(false)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"
              fill="#22c55e"
              fillOpacity="0.25"
            />
            <path
              d="M12 6 17 9v6l-5 3-5-3V9l5-3Z"
              fill="#22c55e"
            />
          </svg>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-foreground">创收资产管家</p>
          <p className="text-xs text-muted-foreground">你的迷你CFO</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.key
          return (
            <Link
              key={item.key}
              href={item.key}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Promo card */}
      <div className="mt-auto rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/60 p-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/70">
          <FolderPlus className="h-6 w-6 text-primary" strokeWidth={2} />
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">连接更多平台</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          授权更多平台数据，全面掌握你的创收资产表现
        </p>
        <button
          onClick={showToast}
          className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95"
        >
          去授权
        </button>
        {toast && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-foreground px-5 py-3 text-sm text-background shadow-lg animate-in fade-in slide-in-from-bottom-4">
            ✨ 功能开发中，敬请期待
          </div>
        )}
      </div>
    </aside>
  )
}
