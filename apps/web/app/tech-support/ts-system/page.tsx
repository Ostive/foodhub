"use client"

import React, { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar-ts"
import { ChartAreaInteractive } from "@/components/chart-area-interactive-perf"
import { DataTable } from "@/components/data-table"
import { DockerMetricsCards } from "@/components/section-cards-perf"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

type DockerStats = {
  netRx: number
  netTx: number
  blockRead: number
  blockWrite: number
  pidsCurrent: number
  memoryUsage: number // en Mo
  memoryLimit: number // en Mo
}

type DockerMetric = {
  id: string
  name: string
  cpu: number // en pourcentage, pas string
  memory: {
    usage: number // en Mo
    limit: number // en Mo
    percentage: string
  }
  timestamp?: string
}

export default function Page() {
  const [metrics, setMetrics] = useState<DockerMetric[]>([])
  const [dockerStats, setDockerStats] = useState<DockerStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("http://localhost:3005/api/performance")
        if (!res.ok) throw new Error("Erreur lors du fetch")

        const data = await res.json()

        // console.log pour debug
        console.log("Données reçues:", data)

        // total CPU en %
        const totalCpu = data.reduce((sum: number, item: any) => {
          return sum + (typeof item.cpu === "number" ? item.cpu : parseFloat(item.cpu) || 0)
        }, 0)

        // total mémoire en Mo
        const totalMemoryUsage = data.reduce((sum: number, item: any) => sum + (item.memoryUsageMB || 0), 0)
        const totalMemoryLimit = data.reduce((sum: number, item: any) => sum + (item.memoryLimitMB || 0), 0)

        const memoryPercentage =
          totalMemoryLimit > 0
            ? ((totalMemoryUsage / totalMemoryLimit) * 100).toFixed(2) + "%"
            : "0%"

        const aggregatedMetric: DockerMetric = {
          id: Date.now().toString(),
          name: "aggregated",
          cpu: parseFloat(totalCpu.toFixed(2)),
          memory: {
            usage: totalMemoryUsage,
            limit: totalMemoryLimit,
            percentage: memoryPercentage,
          },
          timestamp: new Date().toISOString(),
        }

        setMetrics((prev) => [...prev.slice(-500), aggregatedMetric])

        // Agrégation DockerStats
        const stats: DockerStats = {
          netRx: data.reduce((sum: number, item: any) => sum + (item.netRxBytes || 0), 0),
          netTx: data.reduce((sum: number, item: any) => sum + (item.netTxBytes || 0), 0),
          blockRead: data.reduce((sum: number, item: any) => sum + (item.blockReadBytes || 0), 0),
          blockWrite: data.reduce((sum: number, item: any) => sum + (item.blockWriteBytes || 0), 0),
          pidsCurrent: data.reduce((sum: number, item: any) => sum + (item.pidsCurrent || 0), 0),
          memoryUsage: totalMemoryUsage,
          memoryLimit: totalMemoryLimit,
        }

        setDockerStats(stats)
      } catch (error) {
        console.error("Erreur de récupération des métriques:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const intervalId = setInterval(fetchMetrics, 2000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* ✅ On envoie les vraies stats système ici */}
              <DockerMetricsCards data={dockerStats} loading={loading} />

              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={metrics} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
