    import { NextResponse } from 'next/server'
    import fs from 'fs'
    import path from 'path'

    export async function GET() {
    const apiDir = path.join(process.cwd(), 'app/api')

    function listRoutes(dir: string, prefix = ''): string[] {
        const items = fs.readdirSync(dir, { withFileTypes: true })
        let routes: string[] = []

        for (const item of items) {
        const fullPath = path.join(dir, item.name)
        const routePath = `${prefix}/${item.name}`

        if (item.isDirectory()) {
            routes = routes.concat(listRoutes(fullPath, routePath))
        } else if (item.name === 'route.ts' || item.name === 'route.js') {
            routes.push(prefix)
        }
        }

        return routes
    }

    const routes = listRoutes(apiDir).map(r => r.replace(/^\/?/, '/api'))

    return NextResponse.json({ routes })
    }
