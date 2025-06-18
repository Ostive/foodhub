"use client"

import React from "react"
import { QueryProvider } from "@/lib/providers/query-provider"
import { AuthProvider } from "@/lib/auth/auth-context"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  )
}
