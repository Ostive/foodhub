"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCcw } from "lucide-react"

interface ApiAccessCardProps {
  apiName: string
  description: string
  initialKey: string
}

export function ApiAccessCard({ apiName, description, initialKey }: ApiAccessCardProps) {
  const [apiKey, setApiKey] = useState(initialKey)

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
  }

  const regenerateKey = () => {
    // Replace with actual key regeneration logic
    const newKey = Math.random().toString(36).substring(2, 20)
    setApiKey(newKey)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{apiName}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Input readOnly value={apiKey} />
          <Button size="icon" variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={regenerateKey}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
