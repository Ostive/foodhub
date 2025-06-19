  "use client"

  import { useEffect, useState } from "react"

  import { AppSidebar } from "@/components/app-sidebar"
  import { SiteHeader } from "@/components/site-header"
  import {
    SidebarInset,
    SidebarProvider,
  } from "@/components/ui/sidebar"

  import { ApiAccessCard } from "@/components/ui/api-access-card"

  // Fonction utilitaire pour transformer une route en clé API,
  // exemple: "/apiadmin/list-routes" -> "APIADMIN_LIST_ROUTES"
  function routeToApiName(route: string) {
  let cleaned = route.startsWith('/') ? route.slice(1) : route;
  cleaned = cleaned.replace(/^api/, '');
  cleaned = cleaned.replace(/\[([^\]]+)\]/g, (_, p1) => p1.toUpperCase());
  cleaned = cleaned.replace(/[\/\-]/g, '_');
  cleaned = cleaned.toUpperCase();
  if (cleaned.startsWith('_')) cleaned = cleaned.slice(1);
  if (!cleaned.startsWith('API')) cleaned = 'API' + cleaned;

  // Mappage spécial pour les cas où le backend n'a pas le paramètre dans la clé
  if (cleaned === 'APIRESTAURANT_RESTAURANTID_DISHES') {
    cleaned = 'APIRESTAURANT_DISHES';
  }
  if (cleaned === 'APIRESTAURANT_RESTAURANTID') {
    cleaned = 'APIRESTAURANT_ID';
  }

  return cleaned;
}



  export default function Page() {
    const [keys, setKeys] = useState<Record<string, string>>({})
    const [apis, setApis] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      async function handleRegenerate(apiName: string) {
    try {
      const res = await fetch(`http://localhost:3007/api/keys/${apiName}/regenerate`, {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur lors de la régénération');
      }

      const data = await res.json();

      // Met à jour la clé dans le state
      setKeys((prev) => ({
        ...prev,
        [apiName]: data.newKey,
      }));
    } catch (error) {
      console.error('Erreur régénération clé :', error);
      alert('Impossible de régénérer la clé');
    }
  }
      const fetchData = async () => {
        try {
          // 1. Récupérer la liste des routes API
          const routesRes = await fetch("/api/admin/list-routes")
          const routesData = await routesRes.json()
          const routes = routesData.routes || []

          // 2. Récupérer les clés depuis le service backend
          const keysRes = await fetch("http://localhost:3007/api/keys")
          const keysData = await keysRes.json()

          setApis(routes)
          setKeys(keysData)
        } catch (err) {
          console.error("Failed to fetch API data", err)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
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
                <div className="px-4 lg:px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    <p>Chargement des APIs...</p>
                  ) : (
                    apis.map((route, idx) => {
                      const apiName = routeToApiName(route)
                      return (
                        <ApiAccessCard
                          key={idx}
                          apiName={apiName}
                          description={`Endpoint disponible à ${route}`}
                          initialKey={keys[apiName] || "No key available"}
                          onKeyRegenerated={(newKey) => {
                            setKeys(prev => ({ ...prev, [apiName]: newKey }))
                          }}
                        />
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }
