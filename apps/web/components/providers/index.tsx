"use client"

import React from "react"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {/* Add your providers here, for example:
         <ThemeProvider>
           <AuthProvider>
             {children}
           </AuthProvider>
         </ThemeProvider>
      */}
      {children}
    </>
  )
}
