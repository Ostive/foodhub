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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

type DockerMetric = {
  id: string
  name: string
  cpu: string // e.g. "15.2%"
  memory: {
    usage: number
    limit: number
    percentage: string // e.g. "42.1%"
  }
  timestamp?: string // ISO date-time string
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

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1h")
    }
  }, [isMobile])

  const now = new Date()

  const transformedData = data.map((item, idx) => {
    const date = item.timestamp ? new Date(item.timestamp) : new Date(now.getTime() - idx * 60000)
    return {
      date: date.toISOString(),
      cpu: parseFloat(item.cpu.replace("%", "")) || 0,
      memory: parseFloat(item.memory.percentage.replace("%", "")) || 0,
    }
  })

  const filteredData = transformedData.filter((item) => {
    const itemDate = new Date(item.date)
    const timeAgo = new Date(now)

    if (timeRange === "1h") timeAgo.setHours(now.getHours() - 1)
    else if (timeRange === "6h") timeAgo.setHours(now.getHours() - 6)
    else if (timeRange === "24h") timeAgo.setHours(now.getHours() - 24)

    return itemDate >= timeAgo
  })

  if (loading) return <p>Loading metrics...</p>
  if (!data.length) return <p>No performance data available</p>

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Real-Time Performance</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            CPU and memory usage (last hour to 24h)
          </span>
          <span className="@[540px]/card:hidden">Live performance</span>
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
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
              stackId="a"
            />
            <Area
              dataKey="memory"
              type="monotone"
              fill="url(#fillMemory)"
              stroke="var(--secondary)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
