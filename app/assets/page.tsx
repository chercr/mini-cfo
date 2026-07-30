"use client"

import { useState } from "react"
import { Home, Car, BookOpen, Video, Package, TrendingUp, TrendingDown, Plus, PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useStore } from "@/lib/store"
import type { AssetRow } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, typeof Home> = { home: Home, car: Car, book: BookOpen, video: Video, box: Package }
const iconOptions = [
  { value: "home", label: "房产", icon: Home },
  { value: "car", label: "交通", icon: Car },
  { value: "book", label: "创作", icon: BookOpen },
  { value: "video", label: "媒体", icon: Video },
  { value: "box", label: "投资", icon: Package },
]
const colorOptions = [
  { value: "#3b82f6", bg: "#dbeafe" }, { value: "#22c55e", bg: "#dcfce7" },
  { value: "#ec4899", bg: "#fce7f3" }, { value: "#0ea5e9", bg: "#e0f2fe" },
  { value: "#f97316", bg: "#ffedd5" }, { value: "#8b5cf6", bg: "#ede9fe" },
]
const typeOptions = ["房产租赁", "交通服务", "内容创作", "投资理财", "电商", "自由职业", "其他"]
const categories = ["租金收入", "运营收入", "稿费收入", "创作收入", "分红收入", "平台激励", "维护费用", "油费", "保养", "推广费用", "设备", "工具订阅", "设备维护", "其他"]

function MiniSpark({ data, trend }: { data: number[]; trend: AssetRow["trend"] }) {
  const w = 80; const h = 32
  const max = Math.max(...data); const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w; const y = h - ((v - min) / range) * h
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(" ")
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={trend === "down" ? "#f43f5e" : "#22c55e"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const healthStyles: Record<AssetRow["health"], string> = {
  优秀: "bg-emerald-100 text-emerald-700", 良好: "bg-green-50 text-green-600",
  较差: "bg-rose-100 text-rose-600", 一般: "bg-amber-100 text-amber-700",
}

function computeHealth(isNegative: boolean, rateStr: string): AssetRow["health"] {
  if (!isNegative) { const r = parseFloat(rateStr); if (r >= 20) return "优秀"; if (r >= 10) return "良好"; return "一般" }
  return "较差"
}

function computeTrend(spark: number[]): AssetRow["trend"] {
  if (spark.length < 2) return "volatile"
  const first = spark[0]; const last = spark[spark.length - 1]
  if (last > first) return "up"; if (last < first) return "down"
  const avg = spark.reduce((a, b) => a + b, 0) / spark.length
  const variance = spark.reduce((s, v) => s + (v - avg) ** 2, 0) / spark.length
  return variance / (Math.abs(avg) + 1) > 3 ? "volatile" : "up"
}

export default function AssetsPage() {
  const { assets, addAsset, updateAsset, deleteAsset, addTransaction } = useStore()
  const [filter, setFilter] = useState("全部")
  const [selected, setSelected] = useState<AssetRow | null>(null)

  // 新增
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState(""); const [newSub, setNewSub] = useState("")
  const [newType, setNewType] = useState(typeOptions[0]); const [newIcon, setNewIcon] = useState("box")
  const [newColor, setNewColor] = useState("#f97316"); const [newBg, setNewBg] = useState("#ffedd5")
  const [newTime, setNewTime] = useState(5)

  // 编辑
  const [editing, setEditing] = useState<AssetRow | null>(null)
  const [editName, setEditName] = useState(""); const [editSub, setEditSub] = useState("")
  const [editType, setEditType] = useState(""); const [editIcon, setEditIcon] = useState("box")
  const [editColor, setEditColor] = useState(""); const [editBg, setEditBg] = useState("")
  const [editTime, setEditTime] = useState(0)

  // 流水
  const [recordAsset, setRecordAsset] = useState<AssetRow | null>(null)
  const [txType, setTxType] = useState<"income" | "expense">("income")
  const [txAmount, setTxAmount] = useState(""); const [txCategory, setTxCategory] = useState(categories[0])
  const [txNote, setTxNote] = useState("")

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const filtered = filter === "全部" ? assets : assets.filter((a) => a.type === filter)

  function handleAdd() {
    if (!newName.trim()) return
    const spark = Array.from({ length: 7 }, (_, i) => (i + 1) * 2 + Math.floor(Math.random() * 10))
    const rate = Math.floor(Math.random() * 35) - 5
    addAsset({
      name: newName.trim(), sub: newSub.trim(), type: newType,
      netProfit: rate >= 0 ? `¥${(rate * 100).toLocaleString()}` : `-¥${Math.abs(rate * 100).toLocaleString()}`,
      isNegative: rate < 0, rate: `${rate >= 0 ? "" : "-"}${Math.abs(rate)}.0%`,
      trend: computeTrend(spark), spark,
      health: computeHealth(rate < 0, `${Math.abs(rate)}.0%`),
      icon: newIcon as AssetRow["icon"], color: newColor, bg: newBg, timeInvested: newTime, status: "active",
    })
    setShowAdd(false); setNewName(""); setNewSub("")
  }

  function openEdit(a: AssetRow) {
    setEditing(a); setEditName(a.name); setEditSub(a.sub); setEditType(a.type)
    setEditIcon(a.icon); setEditColor(a.color); setEditBg(a.bg); setEditTime(a.timeInvested ?? 0)
  }

  function handleEdit() {
    if (!editing || !editName.trim()) return
    updateAsset(editing.id, {
      name: editName.trim(), sub: editSub.trim(), type: editType,
      icon: editIcon as AssetRow["icon"], color: editColor, bg: editBg, timeInvested: editTime,
    })
    setEditing(null)
  }

  function handleDelete(id: string, name: string) {
    deleteAsset(id)
    setDeleteConfirm(null)
    if (selected?.id === id) setSelected(null)
  }

  function openRecord(a: AssetRow) {
    setRecordAsset(a); setTxType("income"); setTxAmount("")
    setTxCategory(a.type === "房产租赁" ? "租金收入" : a.type === "交通服务" ? "运营收入" : a.type === "内容创作" ? "创作收入" : "分红收入")
    setTxNote("")
  }

  function handleRecord() {
    if (!recordAsset || !txAmount.trim() || isNaN(Number(txAmount))) return
    const now = new Date()
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    addTransaction({
      assetName: recordAsset.name, assetIcon: recordAsset.icon, assetColor: recordAsset.color, assetBg: recordAsset.bg,
      type: txType, amount: Number(txAmount), category: txCategory,
      note: txNote || `${txType === "income" ? "收入" : "支出"}记录`, date: dateStr,
    })
    setRecordAsset(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">资产看板</h1>
              <p className="mt-1 text-sm text-muted-foreground">共 {assets.length} 项资产，{assets.filter(a => a.health === "优秀").length} 项表现优秀</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95">
              <PlusCircle className="h-4 w-4" />新增资产
            </button>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {["全部", ...typeOptions].slice(0, 6).map((t) => (
              <button key={t} onClick={() => setFilter(t)}
                className={cn("rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-secondary")}>{t}</button>
            ))}
          </div>

          {/* Asset Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <Package className="mx-auto h-12 w-12 opacity-30" />
                <p className="mt-4">暂无资产</p>
                <button onClick={() => setShowAdd(true)} className="mt-2 text-primary hover:underline">添加第一项资产 →</button>
              </div>
            )}
            {filtered.map((a) => {
              const Icon = iconMap[a.icon] || Package
              const TrendIcon = a.trend === "down" ? TrendingDown : TrendingUp
              return (
                <div key={a.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                  <button onClick={() => setSelected(a)} className="flex w-full items-start justify-between text-left">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: a.bg }}>
                      <Icon className="h-5 w-5" style={{ color: a.color }} />
                    </div>
                    <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", healthStyles[a.health])}>{a.health}</span>
                  </button>
                  <button onClick={() => setSelected(a)} className="mt-3 w-full text-left">
                    <h3 className="font-semibold text-foreground">{a.name}</h3>
                    {a.sub && <p className="text-xs text-muted-foreground">{a.sub}</p>}
                    <span className="mt-1 inline-block rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{a.type}</span>
                  </button>
                  <button onClick={() => setSelected(a)} className="mt-3 flex w-full items-center justify-between text-left">
                    <div>
                      <p className={`text-lg font-bold ${a.isNegative ? "text-rose-500" : "text-foreground"}`}>{a.netProfit}</p>
                      <p className={`text-xs font-medium ${a.isNegative ? "text-rose-500" : "text-emerald-600"}`}>{a.rate}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MiniSpark data={a.spark} trend={a.trend} />
                      <TrendIcon className={cn("h-4 w-4", a.trend === "down" ? "text-rose-400" : "text-emerald-500")} />
                    </div>
                  </button>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openRecord(a)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary">
                      <Plus className="h-4 w-4" />记录流水
                    </button>
                    <button onClick={() => openEdit(a)} className="flex items-center justify-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteConfirm(a.id)} className="flex items-center justify-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Detail modal */}
          {selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
              <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: selected.bg }}>
                      {(() => { const Icon = iconMap[selected.icon] || Package; return <Icon className="h-5 w-5" style={{ color: selected.color }} /> })()}
                    </div>
                    <div><h3 className="font-semibold text-foreground">{selected.name}</h3>
                      {selected.sub && <p className="text-xs text-muted-foreground">{selected.sub}</p>}</div>
                  </div>
                  <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">{selected.type}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[{ label: "净收益", value: selected.netProfit, color: selected.isNegative ? "text-rose-500" : "text-foreground" },
                    { label: "收益率", value: selected.rate, color: selected.isNegative ? "text-rose-500" : "text-emerald-600" },
                    { label: "健康度", value: selected.health, color: "text-foreground" },
                    { label: "趋势", value: selected.trend === "up" ? "上升" : selected.trend === "down" ? "下降" : "波动", color: "text-foreground" },
                  ].map((d) => (
                    <div key={d.label} className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">{d.label}</p><p className={`mt-0.5 font-semibold ${d.color}`}>{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => { setSelected(null); openEdit(selected) }} className="flex-1 rounded-lg border border-border py-2 text-sm text-foreground transition-colors hover:bg-secondary">编辑</button>
                  <button onClick={() => setDeleteConfirm(selected.id)} className="rounded-lg border border-rose-200 px-4 py-2 text-sm text-rose-500 transition-colors hover:bg-rose-50">删除</button>
                </div>
              </div>
            </div>
          )}

          {/* Record modal */}
          {recordAsset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setRecordAsset(null)}>
              <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-foreground">记录流水 — {recordAsset.name}</h2>
                <div className="mt-4 flex flex-col gap-4">
                  <div><label className="mb-1 block text-sm font-medium text-foreground">类型</label>
                    <div className="flex gap-2">
                      {[{ key: "income", label: "收入" }, { key: "expense", label: "支出" }].map((t) => (
                        <button key={t.key} onClick={() => setTxType(t.key as "income" | "expense")}
                          className={cn("flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                            txType === t.key ? (t.key === "income" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-rose-500 bg-rose-50 text-rose-600") : "border-border text-muted-foreground hover:bg-secondary")}>{t.label}</button>
                      ))}</div></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">金额 *</label>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">¥</span>
                      <input type="number" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} placeholder="0.00" className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">分类</label>
                    <select value={txCategory} onChange={(e) => setTxCategory(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">{categories.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">备注</label>
                    <input type="text" value={txNote} onChange={(e) => setTxNote(e.target.value)} placeholder="选填" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setRecordAsset(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary">取消</button>
                  <button onClick={handleRecord} disabled={!txAmount.trim() || isNaN(Number(txAmount))} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">确认记录</button>
                </div>
              </div>
            </div>
          )}

          {/* Add modal */}
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdd(false)}>
              <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-foreground">新增资产</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {[{ label: "资产名称 *", val: newName, set: setNewName, ph: "如：公众号写作" },
                    { label: "子分类 / 平台", val: newSub, set: setNewSub, ph: "如：微信公众号" }].map((f) => (
                    <div key={f.label}><label className="mb-1 block text-sm font-medium text-foreground">{f.label}</label>
                      <input type="text" value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div>
                  ))}
                  <div><label className="mb-1 block text-sm font-medium text-foreground">资产类型</label>
                    <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">{typeOptions.map((t) => (<option key={t} value={t}>{t}</option>))}</select></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">图标</label>
                    <div className="flex flex-wrap gap-2">{iconOptions.map((opt) => { const OptIcon = opt.icon; return (
                      <button key={opt.value} type="button" onClick={() => { setNewIcon(opt.value); const col = colorOptions.find(c => c.value === newColor); if (col) setNewBg(col.bg) }}
                        className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors", newIcon === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-secondary")}><OptIcon className="h-4 w-4" />{opt.label}</button>
                    )})}</div></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">颜色</label>
                    <div className="flex flex-wrap gap-2">{colorOptions.map((c) => (
                      <button key={c.value} type="button" onClick={() => { setNewColor(c.value); setNewBg(c.bg) }}
                        className={cn("h-8 w-8 rounded-full border-2 transition-transform hover:scale-110", newColor === c.value ? "border-foreground scale-110" : "border-transparent")} style={{ backgroundColor: c.value }} />))}</div></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">时间投入（小时/周）</label>
                    <input type="number" value={newTime} min={0} max={168} onChange={(e) => setNewTime(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setShowAdd(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary">取消</button>
                  <button onClick={handleAdd} disabled={!newName.trim()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">确认添加</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit modal */}
          {editing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditing(null)}>
              <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-foreground">编辑资产</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {[{ label: "资产名称 *", val: editName, set: setEditName },
                    { label: "子分类 / 平台", val: editSub, set: setEditSub }].map((f) => (
                    <div key={f.label}><label className="mb-1 block text-sm font-medium text-foreground">{f.label}</label>
                      <input type="text" value={f.val} onChange={(e) => f.set(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div>
                  ))}
                  <div><label className="mb-1 block text-sm font-medium text-foreground">资产类型</label>
                    <select value={editType} onChange={(e) => setEditType(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">{typeOptions.map((t) => (<option key={t} value={t}>{t}</option>))}</select></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">图标</label>
                    <div className="flex flex-wrap gap-2">{iconOptions.map((opt) => { const OptIcon = opt.icon; return (
                      <button key={opt.value} type="button" onClick={() => { setEditIcon(opt.value); const col = colorOptions.find(c => c.value === editColor); if (col) setEditBg(col.bg) }}
                        className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors", editIcon === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-secondary")}><OptIcon className="h-4 w-4" />{opt.label}</button>
                    )})}</div></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">颜色</label>
                    <div className="flex flex-wrap gap-2">{colorOptions.map((c) => (
                      <button key={c.value} type="button" onClick={() => { setEditColor(c.value); setEditBg(c.bg) }}
                        className={cn("h-8 w-8 rounded-full border-2 transition-transform hover:scale-110", editColor === c.value ? "border-foreground scale-110" : "border-transparent")} style={{ backgroundColor: c.value }} />))}</div></div>
                  <div><label className="mb-1 block text-sm font-medium text-foreground">时间投入（小时/周）</label>
                    <input type="number" value={editTime} min={0} max={168} onChange={(e) => setEditTime(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setEditing(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary">取消</button>
                  <button onClick={handleEdit} disabled={!editName.trim()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">保存修改</button>
                </div>
              </div>
            </div>
          )}

          {/* Delete confirm */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirm(null)}>
              <div className="w-full max-w-xs rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-foreground">确认删除</h2>
                <p className="mt-2 text-sm text-muted-foreground">删除后将同时移除关联的流水记录，此操作不可恢复。</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary">取消</button>
                  <button onClick={() => handleDelete(deleteConfirm, "")} className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600">确认删除</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
