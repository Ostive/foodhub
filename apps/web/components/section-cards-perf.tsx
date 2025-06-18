  "use client"

  import * as React from "react"
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card"

  type DockerStats = {
    cpu: number | string
    netRx: number
    netTx: number
    blockRead: number
    blockWrite: number
    pidsCurrent: number
    memoryUsage: number
    memoryLimit: number
  }

  type DockerMetricsCardsProps = {
    data: DockerStats | null
    loading?: boolean
  }

  function formatMemoryMBtoGB(mb: number): string {
    if (mb === 0) return "0 B"
    if (mb < 1) return (mb * 1000).toFixed(1) + " kB"
    if (mb < 1000) return mb.toFixed(2) + " MB"
    return (mb / 1000).toFixed(2) + " GB"
  }

  function formatIoSize(bytes: number): string {
    if (bytes === 0) return "0 B"
    const kb = 1000
    const mb = kb * 1000
    const gb = mb * 1000

    if (bytes < kb) return bytes + " B"
    else if (bytes < mb) return (bytes / kb).toFixed(1) + " kB"
    else if (bytes < gb) return (bytes / mb).toFixed(2) + " MB"
    else return (bytes / gb).toFixed(3) + " GB"
  }

  export function DockerMetricsCards({ data, loading }: DockerMetricsCardsProps) {
    if (loading) return <p>Loading Docker metrics...</p>
    if (!data) return <p>No Docker metrics available</p>

    let cpuValue = 0
    if (typeof data.cpu === "number") cpuValue = data.cpu
    else if (typeof data.cpu === "string")
      cpuValue = parseFloat(data.cpu.replace("%", "").trim()) || 0

    const memoryPercent =
      data.memoryLimit > 0 ? ((data.memoryUsage / data.memoryLimit) * 100).toFixed(2) : "N/A"

    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Network Receive</CardTitle>
            <CardDescription>Data received over network</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatIoSize(data.netRx)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Transmit</CardTitle>
            <CardDescription>Data sent over network</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatIoSize(data.netTx)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Block Read</CardTitle>
            <CardDescription>Disk reads</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatIoSize(data.blockRead)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Block Write</CardTitle>
            <CardDescription>Disk writes</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatIoSize(data.blockWrite)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processes (PIDs)</CardTitle>
            <CardDescription>Number of running processes</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{data.pidsCurrent}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>Memory currently used</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatMemoryMBtoGB(data.memoryUsage)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Limit</CardTitle>
            <CardDescription>Max memory allowed</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatMemoryMBtoGB(data.memoryLimit)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage %</CardTitle>
            <CardDescription>Memory usage as percentage</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{memoryPercent !== "N/A" ? memoryPercent + " %" : "N/A"}</CardContent>
        </Card>
      </div>
    )
  }
