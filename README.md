# 创收资产管家 · Mini CFO

开源个人创收资产管理工具，帮你全面掌握副业、投资、自由职业等各类资产的收入与支出。

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform">
</p>

## 功能

- **📊 仪表盘** — 总收入/支出/净收益统计、资产绩效四象限、健康度评分、AI 智能洞察
- **📋 资产管理** — 添加/编辑/删除创收资产，设置图标、类型、颜色、时间投入
- **💰 流水记录** — 记录每项资产的收入与支出，自动汇总到流水中心
- **📈 绩效分析** — 时间投入 vs 收益率象限图、月度收支趋势、健康度指标
- **🤖 AI 洞察** — 基于你的数据自动分析，给出增长机会、风险预警、优化建议
- **💾 本地存储** — 所有数据保存在浏览器中，不上传任何服务器，无需注册登录
- **📤 数据备份** — 支持 JSON 导出/导入，换电脑也不丢数据

## 快速开始

### Windows

1. 下载本项目 ZIP 并解压，或 `git clone` 到本地
2. 双击 `start.bat`
3. 浏览器自动打开 `http://localhost:4002`

首次运行会自动安装依赖并构建（约 1-2 分钟），之后启动只需几秒。

### macOS / Linux

```bash
# 安装依赖（首次）
npm install -g pnpm
pnpm install
pnpm build

# 启动
pnpm start
```

浏览器访问 `http://localhost:4002`

### 环境要求

- [Node.js](https://nodejs.org) v18 或以上

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Next.js 16 |
| 样式 | Tailwind CSS v4 + shadcn/ui |
| 图标 | Lucide React |
| 图表 | Recharts |
| 存储 | 浏览器 localStorage |
| 语言 | TypeScript |

## 数据说明

所有数据保存在你浏览器的 localStorage 中，**全程本地运行，不联网、不上传、不注册**。如需换电脑：

1. 旧电脑：进入「设置中心」→ 导出 JSON
2. 新电脑：启动本项目 → 进入「设置中心」→ 导入 JSON

## 开源协议

MIT License
