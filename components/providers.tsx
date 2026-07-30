"use client"

import { useState, useEffect } from "react"
import { StoreProvider } from "@/lib/store"
import { Wallpaper } from "@/components/wallpaper"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // 服务端渲染空壳，客户端挂载后再渲染内容，彻底消除 hydration 不匹配
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" fill="#22c55e" fillOpacity="0.25" />
            <path d="M12 6 17 9v6l-5 3-5-3V9l5-3Z" fill="#22c55e" />
          </svg>
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <StoreProvider>
      <Wallpaper />
      {children}
    </StoreProvider>
  )
}
