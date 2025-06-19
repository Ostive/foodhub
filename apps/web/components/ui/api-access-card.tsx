"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCcw, Check } from "lucide-react"

interface ApiAccessCardProps {
  apiName: string
  description: string
  initialKey: string
  onKeyRegenerated?: (newKey: string) => void
}

export function ApiAccessCard({ apiName, description, initialKey, onKeyRegenerated }: ApiAccessCardProps) {
  const [apiKey, setApiKey] = useState(initialKey)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setApiKey(initialKey)
  }, [initialKey])

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const regenerateKey = async () => {
  setLoading(true)
  setSuccess(false)
  try {
    const res = await fetch(`/api/keys/${apiName}/regenerate`, {
      method: 'POST',
    })

    if (!res.ok) {
      // Lis le message d’erreur pour debug
      const errData = await res.json().catch(() => ({}))
      const message = errData.error || 'Erreur inconnue'
      throw new Error(message)
    }

    const data = await res.json()
    setApiKey(data.newKey)
    if (onKeyRegenerated) onKeyRegenerated(data.newKey)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  } catch (error: any) {
    console.error('Regenerate error:', error)
    alert(`Impossible de régénérer la clé: ${error.message || error}`)
  } finally {
    setLoading(false)
  }
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
          <Button size="icon" variant="outline" onClick={handleCopy} aria-label="Copier la clé">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={regenerateKey}
            disabled={loading}
            aria-label="Régénérer la clé"
          >
            {loading ? (
              <RefreshCcw className="animate-spin h-4 w-4" />
            ) : success ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
