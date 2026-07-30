import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatCards } from "@/components/dashboard/stat-cards"
import { PerformanceQuadrant } from "@/components/dashboard/performance-quadrant"
import { HealthScore } from "@/components/dashboard/health-score"
import { AiInsights } from "@/components/dashboard/ai-insights"
import { AssetTable } from "@/components/dashboard/asset-table"
export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden p-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          <Header />

          <StatCards />

          {/* Middle row: 55 / 45 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            <PerformanceQuadrant />
            <div className="flex flex-col gap-6">
              <HealthScore />
              <AiInsights />
            </div>
          </div>

          {/* Bottom row: full width */}
          <AssetTable />
        </div>
      </main>
    </div>
  )
}
