"use client"

import React, { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive-perf"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Type TypeScript pour la donnée Docker
type DockerMetric = {
  id: string
  name: string
  cpu: string // ex: "15.2%"
  memory: {
    usage: number
    limit: number
    percentage: string // ex: "42.1%"
  }
  timestamp?: string // <-- important pour les filtres temporels
}

export default function Page() {
  const [metrics, setMetrics] = useState<DockerMetric[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    async function fetchMetrics() {
      try {
      const res = await fetch("http://localhost:3005/api/performance");
      if (!res.ok) throw new Error("Erreur lors du fetch");
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

     fetchMetrics();
  const interval = setInterval(fetchMetrics, 5000);
  return () => clearInterval(interval);
}, []);

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
              <SectionCards />

              <div className="px-4 lg:px-6">
                {/* 🔥 Chart avec time-range (1h, 6h, 24h) */}
                <ChartAreaInteractive data={metrics} loading={loading} />
              </div>

              {/* Tableau des métriques en bas */}
              <DataTable data={metrics} loading={loading} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
