"use client"

import { useState, useRef } from "react"
import { Pencil, Trash2, Plus, Layers, Palette, Database, Info, Download, Upload, Check, AlertCircle } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const defaultTypes = ["房产租赁", "交通服务", "内容创作", "投资理财", "电商", "自由职业", "其他"]

const themes = [
  {
    key: "emerald", name: "翡翠绿", desc: "清新自然",
    colors: ["#22c55e", "#f8fafc", "#ecfdf5", "#e2e8f0"],
    primary: "#22c55e", bg: "#f8fafc",
  },
  {
    key: "ocean", name: "海洋蓝", desc: "沉稳专业",
    colors: ["#2563eb", "#f0f9ff", "#eff6ff", "#e0f2fe"],
    primary: "#2563eb", bg: "#f0f9ff",
  },
  {
    key: "lavender", name: "星空紫", desc: "优雅神秘",
    colors: ["#7c3aed", "#fafafe", "#faf5ff", "#ede9fe"],
    primary: "#7c3aed", bg: "#fafafe",
  },
  {
    key: "sunset", name: "日落橙", desc: "温暖活力",
    colors: ["#f97316", "#fffbf5", "#fff7ed", "#fed7aa"],
    primary: "#f97316", bg: "#fffbf5",
  },
  {
    key: "midnight", name: "暗夜", desc: "护眼深邃",
    colors: ["#38bdf8", "#0f172a", "#1e293b", "#334155"],
    primary: "#38bdf8", bg: "#0f172a",
  },
  {
    key: "stone", name: "岩石灰", desc: "极简克制",
    colors: ["#57534e", "#fafaf9", "#f5f5f4", "#d6d3d1"],
    primary: "#57534e", bg: "#fafaf9",
  },
]

const aboutInfo = {
  name: "创收资产管家",
  version: "v0.1.0",
  description: "开源个人资产管理工具，帮助你全面掌握创收资产表现。",
  tech: "Next.js 16 + Tailwind CSS v4 + shadcn/ui + Recharts",
  license: "MIT",
}

export default function SettingsPage() {
  const { assets, transactions, theme, setTheme, exportData, importData } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [types, setTypes] = useState(defaultTypes)
  const [newType, setNewType] = useState("")
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")

  function addType() {
    if (!newType.trim() || types.includes(newType.trim())) return
    setTypes([...types, newType.trim()])
    setNewType("")
  }

  function startEdit(idx: number) { setEditingIdx(idx); setEditValue(types[idx]) }

  function saveEdit() {
    if (editingIdx === null || !editValue.trim()) return
    const updated = [...types]; updated[editingIdx] = editValue.trim()
    setTypes(updated); setEditingIdx(null)
  }

  function deleteType(idx: number) { setTypes(types.filter((_, i) => i !== idx)) }

  function handleExport() {
    const json = exportData()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `资产管家备份_${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importData(reader.result as string)
      setImportStatus(ok ? "success" : "error")
      setTimeout(() => setImportStatus("idle"), 2000)
    }
    reader.readAsText(file); e.target.value = ""
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">设置中心</h1>
            <p className="mt-1 text-sm text-muted-foreground">管理资产类型与个性化配置</p>
          </div>

          {/* Theme picker */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <Palette className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">主题皮肤</h2>
                <p className="text-sm text-muted-foreground">选择你喜欢的外观风格，即时切换</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {themes.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={cn(
                    "relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all hover:scale-105 active:scale-95",
                    theme === t.key ? "border-foreground shadow-md" : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  {/* Color preview */}
                  <div className="flex h-12 gap-0.5 overflow-hidden rounded-lg">
                    {t.colors.map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="mt-2.5">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  {/* Active dot */}
                  {theme === t.key && (
                    <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Types */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <Layers className="h-4 w-4 text-blue-500" />
              </div>
              <h2 className="text-base font-semibold text-foreground">资产类型</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">自定义你的资产分类，用于看板筛选与绩效分析</p>
            <div className="mt-4 flex gap-2">
              <input type="text" value={newType} onChange={(e) => setNewType(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addType()} placeholder="输入新类型名称..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" />
              <button onClick={addType} disabled={!newType.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
                <Plus className="h-4 w-4" />添加
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {types.map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
                  {editingIdx === i ? (
                    <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit()} onBlur={saveEdit} autoFocus
                      className="w-20 bg-transparent text-sm text-foreground outline-none" />
                  ) : (<span className="text-sm text-foreground">{t}</span>)}
                  <button onClick={() => startEdit(i)} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><Pencil className="h-3 w-3" /></button>
                  <button onClick={() => deleteType(i)} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Data management */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <Database className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">数据管理</h2>
                <p className="text-sm text-muted-foreground">导出备份或导入恢复数据（{assets.length} 资产 · {transactions.length} 流水）</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={handleExport} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-95">
                <Download className="h-4 w-4" />导出 JSON
              </button>
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-95">
                {importStatus === "success" ? <Check className="h-4 w-4 text-emerald-500" /> : importStatus === "error" ? <AlertCircle className="h-4 w-4 text-rose-500" /> : <Upload className="h-4 w-4" />}
                {importStatus === "success" ? "导入成功" : importStatus === "error" ? "格式错误" : "导入 JSON"}
              </button>
              <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            </div>
          </div>

          {/* About */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <Info className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-foreground">关于</h2>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {[
                ["应用名称", aboutInfo.name], ["版本", aboutInfo.version],
                ["技术栈", aboutInfo.tech], ["许可证", aboutInfo.license],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-t border-border py-1.5 first:border-t-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
