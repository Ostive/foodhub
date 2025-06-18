"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type DockerMetric = {
  id: string
  name: string
  cpu: string 
  memory?: {
    usage: number
    limit: number
    percentage: string 
  }
  timestamp?: string 
}

type ChartAreaInteractiveProps = {
  data: DockerMetric[]
  loading?: boolean
}

const chartConfig = {
  cpu: {
    label: "CPU Usage (%)",
    color: "var(--primary)",
  },
  memory: {
    label: "Memory Usage (%)",
    color: "var(--secondary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data, loading }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("1h")
  
  // State pour stocker les données accumulées dans le temps
  const [historicalData, setHistoricalData] = React.useState<
    { date: string; cpu: number; memory: number }[]
  >([])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1h")
    }
  }, [isMobile])

  React.useEffect(() => {
    const now = new Date()
    // Transformer les données entrantes dans le format du graphique
    const newEntries = data.map((item, idx) => {
      const date = item.timestamp
        ? new Date(item.timestamp)
        : new Date(now.getTime() - idx * 60000)

      const cpuValue =
        typeof item.cpu === "string"
          ? parseFloat(item.cpu.replace("%", "")) || 0
          : item.cpu || 0

      const memoryPercentage = item.memory?.percentage ?? "0%"
      const memoryValue =
        item.memory && item.memory.limit > 0
          ? (item.memory.usage / item.memory.limit) * 100
          : 0;

      return {
        date: date.toISOString(),
        cpu: cpuValue,
        memory: parseFloat(memoryValue.toFixed(2)),
            }
    })

    // Ajouter les nouvelles données à l'historique sans doublons
    setHistoricalData((old) => {
      // Combine old + new data
      const combined = [...old, ...newEntries]

      // Éliminer doublons par date (garde la dernière occurrence)
      const uniqueByDate = new Map<string, { date: string; cpu: number; memory: number }>()
      combined.forEach((entry) => uniqueByDate.set(entry.date, entry))

      // Trier par date asc
      return Array.from(uniqueByDate.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    })
  }, [data])

  // Filtrer les données historiques selon la plage de temps sélectionnée
  const filteredData = React.useMemo(() => {
    const now = new Date()
    const timeAgo = new Date(now)
    if (timeRange === "1h") timeAgo.setHours(now.getHours() - 1)
    else if (timeRange === "6h") timeAgo.setHours(now.getHours() - 6)
    else if (timeRange === "24h") timeAgo.setHours(now.getHours() - 24)

    return historicalData.filter((item) => new Date(item.date) >= timeAgo)
  }, [historicalData, timeRange])

  if (loading) return <p>Loading metrics...</p>
  if (!data.length && !historicalData.length) return <p>No performance data available</p>

  return (
    <Card className="@container/card">
  <CardHeader>
    <CardTitle>Real-Time Performance</CardTitle>
    <CardDescription>
      <span className="hidden @[540px]/card:block">
        CPU and Memory usage over time
      </span>
      <span className="@[540px]/card:hidden">Live metrics</span>
    </CardDescription>
    <CardAction>
      <ToggleGroup
        type="single"
        value={timeRange}
        onValueChange={(val) => val && setTimeRange(val)}
        variant="outline"
        className="hidden @[767px]/card:flex"
      >
        <ToggleGroupItem value="1h">Last hour</ToggleGroupItem>
        <ToggleGroupItem value="6h">Last 6h</ToggleGroupItem>
        <ToggleGroupItem value="24h">Last 24h</ToggleGroupItem>
      </ToggleGroup>
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1h">Last hour</SelectItem>
          <SelectItem value="6h">Last 6h</SelectItem>
          <SelectItem value="24h">Last 24h</SelectItem>
        </SelectContent>
      </Select>
    </CardAction>
  </CardHeader>

  <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 space-y-8">
    {/* CPU Chart */}
    <ChartContainer config={{ cpu: chartConfig.cpu }} className="h-[250px] w-full">
      <AreaChart data={filteredData}>
        <defs>
          <linearGradient id="fillCpu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            new Date(value).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          defaultIndex={-1}
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="cpu"
          type="monotone"
          fill="url(#fillCpu)"
          stroke="var(--primary)"
        />
      </AreaChart>
    </ChartContainer>

    {/* Memory Chart */}
    <ChartContainer config={{ memory: chartConfig.memory }} className="h-[250px] w-full">
      <AreaChart data={filteredData}>
        <defs>
          <linearGradient id="fillMemory" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            new Date(value).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          defaultIndex={-1}
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="memory"
          type="monotone"
          fill="url(#fillMemory)"
          stroke="var(--secondary)"
        />
      </AreaChart>
    </ChartContainer>
  </CardContent>
</Card>
  )
}
