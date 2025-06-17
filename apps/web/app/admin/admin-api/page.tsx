"use client"

import { useEffect, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SectionCards2 } from "@/components/section-cards"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { ApiAccessCard } from "@/components/ui/api-access-card"
// ... other imports remain the same

export default function Page() {
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
              {/* Example usage of ApiAccessCard */}
              <div className="px-4 lg:px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ApiAccessCard
                  apiName="Weather API"
                  description="Access current weather data and forecasts."
                  initialKey="sk-test-123weather"
                />
                <ApiAccessCard
                  apiName="Finance API"
                  description="Retrieve real-time stock prices and history."
                  initialKey="sk-test-456finance"
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
