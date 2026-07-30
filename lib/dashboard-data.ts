export type Trend = "up" | "down" | "volatile"

export interface AssetRow {
  id: string
  name: string
  sub: string
  type: string
  netProfit: string
  isNegative: boolean
  rate: string
  trend: Trend
  spark: number[]
  health: "优秀" | "良好" | "较差" | "一般"
  icon: "home" | "car" | "book" | "video" | "box"
  color: string
  bg: string
  timeInvested?: number
  status?: string
}

export const assets: AssetRow[] = [
  {
    id: "1",
    name: "短租房东",
    sub: "朝阳公寓",
    type: "房产租赁",
    netProfit: "¥18,560",
    isNegative: false,
    rate: "31.2%",
    trend: "up",
    spark: [8, 10, 9, 13, 15, 18, 22],
    health: "优秀",
    icon: "home",
    color: "#3b82f6",
    bg: "#dbeafe",
    timeInvested: 8,
    status: "active",
  },
  {
    id: "2",
    name: "网约车",
    sub: "滴滴专车",
    type: "交通服务",
    netProfit: "¥12,840",
    isNegative: false,
    rate: "15.8%",
    trend: "volatile",
    spark: [12, 9, 14, 11, 16, 13, 15],
    health: "良好",
    icon: "car",
    color: "#22c55e",
    bg: "#dcfce7",
    timeInvested: 15,
    status: "active",
  },
  {
    id: "3",
    name: "网文作者",
    sub: "起点中文网",
    type: "内容创作",
    netProfit: "-¥2,300",
    isNegative: true,
    rate: "-8.5%",
    trend: "down",
    spark: [14, 12, 10, 8, 6, 4, 3],
    health: "较差",
    icon: "book",
    color: "#ec4899",
    bg: "#fce7f3",
    timeInvested: 12,
    status: "active",
  },
  {
    id: "4",
    name: "视频博主",
    sub: "抖音",
    type: "内容创作",
    netProfit: "¥8,920",
    isNegative: false,
    rate: "12.3%",
    trend: "up",
    spark: [6, 8, 7, 11, 13, 15, 18],
    health: "良好",
    icon: "video",
    color: "#0ea5e9",
    bg: "#e0f2fe",
    timeInvested: 30,
    status: "active",
  },
  {
    id: "5",
    name: "自动售货机合伙人",
    sub: "",
    type: "投资理财",
    netProfit: "¥3,650",
    isNegative: false,
    rate: "8.7%",
    trend: "volatile",
    spark: [5, 7, 6, 8, 7, 9, 10],
    health: "一般",
    icon: "box",
    color: "#f97316",
    bg: "#ffedd5",
    timeInvested: 5,
    status: "active",
  },
]

export const healthMetrics = [
  { label: "收入稳定性", score: 82, color: "#3b82f6" },
  { label: "盈利能力", score: 75, color: "#22c55e" },
  { label: "成长潜力", score: 80, color: "#0ea5e9" },
  { label: "时间回报率", score: 72, color: "#f59e0b" },
  { label: "风险水平", score: 65, color: "#ec4899" },
]

export const dataSources = [
  { name: "支付宝", color: "#1677ff", bg: "#e6f0ff", short: "支" },
  { name: "微信支付", color: "#07c160", bg: "#e3f9ec", short: "微" },
  { name: "滴滴出行", color: "#ff7733", bg: "#fff0e6", short: "滴" },
  { name: "Airbnb", color: "#ff385c", bg: "#ffe8ec", short: "A" },
  { name: "抖音", color: "#161823", bg: "#ececed", short: "抖" },
]

export interface TransactionRow {
  id: string
  assetName: string
  assetIcon: "home" | "car" | "book" | "video" | "box"
  assetColor: string
  assetBg: string
  type: "income" | "expense"
  amount: number
  category: string
  note: string
  date: string
}

export const transactions: TransactionRow[] = [
  { id: "t1", assetName: "短租房东", assetIcon: "home", assetColor: "#3b82f6", assetBg: "#dbeafe", type: "income", amount: 5300, category: "租金收入", note: "7月短租平台结算", date: "2026-07-15" },
  { id: "t2", assetName: "短租房东", assetIcon: "home", assetColor: "#3b82f6", assetBg: "#dbeafe", type: "expense", amount: 850, category: "维护费用", note: "空调维修", date: "2026-07-10" },
  { id: "t3", assetName: "短租房东", assetIcon: "home", assetColor: "#3b82f6", assetBg: "#dbeafe", type: "income", amount: 4800, category: "租金收入", note: "6月短租平台结算", date: "2026-06-15" },
  { id: "t4", assetName: "网约车", assetIcon: "car", assetColor: "#22c55e", assetBg: "#dcfce7", type: "income", amount: 4200, category: "运营收入", note: "7月滴滴结算", date: "2026-07-12" },
  { id: "t5", assetName: "网约车", assetIcon: "car", assetColor: "#22c55e", assetBg: "#dcfce7", type: "expense", amount: 1200, category: "油费", note: "7月加油费", date: "2026-07-08" },
  { id: "t6", assetName: "网约车", assetIcon: "car", assetColor: "#22c55e", assetBg: "#dcfce7", type: "expense", amount: 350, category: "保养", note: "常规保养", date: "2026-06-20" },
  { id: "t7", assetName: "视频博主", assetIcon: "video", assetColor: "#0ea5e9", assetBg: "#e0f2fe", type: "income", amount: 2800, category: "创作收入", note: "7月广告分成", date: "2026-07-18" },
  { id: "t8", assetName: "视频博主", assetIcon: "video", assetColor: "#0ea5e9", assetBg: "#e0f2fe", type: "income", amount: 1500, category: "平台激励", note: "创作者激励计划", date: "2026-07-05" },
  { id: "t9", assetName: "视频博主", assetIcon: "video", assetColor: "#0ea5e9", assetBg: "#e0f2fe", type: "expense", amount: 600, category: "设备", note: "补光灯购买", date: "2026-06-28" },
  { id: "t10", assetName: "网文作者", assetIcon: "book", assetColor: "#ec4899", assetBg: "#fce7f3", type: "income", amount: 1200, category: "稿费收入", note: "7月平台稿费", date: "2026-07-14" },
  { id: "t11", assetName: "网文作者", assetIcon: "book", assetColor: "#ec4899", assetBg: "#fce7f3", type: "expense", amount: 2800, category: "推广费用", note: "封面设计+推荐位", date: "2026-07-03" },
  { id: "t12", assetName: "网文作者", assetIcon: "book", assetColor: "#ec4899", assetBg: "#fce7f3", type: "expense", amount: 350, category: "工具订阅", note: "写作软件年费", date: "2026-06-10" },
  { id: "t13", assetName: "自动售货机合伙人", assetIcon: "box", assetColor: "#f97316", assetBg: "#ffedd5", type: "income", amount: 1200, category: "分红收入", note: "7月分润", date: "2026-07-20" },
  { id: "t14", assetName: "自动售货机合伙人", assetIcon: "box", assetColor: "#f97316", assetBg: "#ffedd5", type: "income", amount: 1100, category: "分红收入", note: "6月分润", date: "2026-06-18" },
  { id: "t15", assetName: "自动售货机合伙人", assetIcon: "box", assetColor: "#f97316", assetBg: "#ffedd5", type: "expense", amount: 200, category: "设备维护", note: "补货交通费", date: "2026-07-02" },
]

// quadrant bubbles: x = time invested (hrs/wk), y = net profit rate
export const quadrantAssets = [
  { id: "home", label: "短租房东", x: 8, y: 31, color: "#22c55e", bg: "#dcfce7" },
  { id: "car", label: "网约车", x: 15, y: 16, color: "#f59e0b", bg: "#fef3c7" },
  { id: "edit", label: "视频博主", x: 30, y: 24, color: "#8b5cf6", bg: "#ede9fe" },
  { id: "camera", label: "自媒体", x: 36, y: 14, color: "#0ea5e9", bg: "#e0f2fe" },
  { id: "store", label: "微商店铺", x: 27, y: 4, color: "#ec4899", bg: "#fce7f3" },
  { id: "book", label: "网文作者", x: 12, y: -8, color: "#3b82f6", bg: "#dbeafe" },
  { id: "trash", label: "旧项目", x: 6, y: -12, color: "#f97316", bg: "#ffedd5" },
  { id: "chart", label: "售货机", x: 34, y: -14, color: "#14b8a6", bg: "#ccfbf1" },
]
