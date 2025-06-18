'use client'
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardCopyIcon, DownloadIcon } from "lucide-react"
import { toast } from "sonner"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}



const components = [
  {
    name: "Text Div",
    description: "A simple div containing a text message.",
    demo: <div className="text-muted-foreground">Hello, world!</div>,
    code: `<div>Hello, world!</div>`,
  },
  {
    name: "HTML Button",
    description: "A basic HTML button with styling.",
    demo: <button className="px-4 py-2 bg-blue-500 text-white rounded">Click Me</button>,
    code: `<button class="px-4 py-2 bg-blue-500 text-white rounded">Click Me</button>`,
  },
  {
    name: "Hyperlink",
    description: "A simple link that opens Google in a new tab.",
    demo: <a href="https://www.google.com" className="text-blue-600 underline" target="_blank">Google</a>,
    code: `<a href="https://www.google.com" target="_blank">Google</a>`,
  },
  {
    name: "Unordered List",
    description: "A simple HTML unordered list with 3 items.",
    demo: (
      <ul className="list-disc pl-4">
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
    ),
    code: `<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>`,
  },
  {
    name: "Dish Card",
    description: "Card to display a dish with name, description and price.",
    demo: (
      <div className="border rounded p-4 shadow-sm max-w-xs">
        <h3 className="text-lg font-semibold">Grilled Chicken</h3>
        <p className="text-sm text-muted-foreground">Tender grilled chicken with herbs and spices.</p>
        <p className="mt-2 font-bold">$15.99</p>
      </div>
    ),
    code: `<div class="border rounded p-4 shadow-sm max-w-xs">
  <h3 class="text-lg font-semibold">Grilled Chicken</h3>
  <p class="text-sm text-muted-foreground">Tender grilled chicken with herbs and spices.</p>
  <p class="mt-2 font-bold">$15.99</p>
</div>`,
  },
  {
    name: "Order Status Badge",
    description: "Colored badge to show the order status.",
    demo: (
      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
        Delivered
      </span>
    ),
    code: `<span class="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
  Delivered
</span>`,
  },
  {
    name: "Toggle Switch",
    description: "Simple toggle switch for availability or open/close status.",
    demo: (
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 relative transition-colors"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">Open for orders</span>
      </label>
    ),
    code: `<label class="inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer" />
  <div class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 relative transition-colors"></div>
  <span class="ml-3 text-sm font-medium text-gray-900">Open for orders</span>
</label>`,
  },
  {
    name: "Rating Stars",
    description: "Display rating stars for dishes or service.",
    demo: (
      <div aria-label="4 out of 5 stars">
        ⭐⭐⭐⭐☆
      </div>
    ),
    code: `<div aria-label="4 out of 5 stars">
  ⭐⭐⭐⭐☆
</div>`,
  },
  {
    name: "Input Form Field",
    description: "Basic input field for entering dish or menu details.",
    demo: <input type="text" placeholder="Enter dish name" className="border p-2 rounded w-full" />,
    code: `<input type="text" placeholder="Enter dish name" class="border p-2 rounded w-full" />`,
  },
]

export function SectionCards2() {
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard!")
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {components.map((component) => (
        <Card key={component.name} className="@container/card">
          <CardHeader>
            <CardTitle>{component.name}</CardTitle>
            <CardDescription>{component.description}</CardDescription>
          </CardHeader>
          <div className="flex items-center justify-center py-4">
            {component.demo}
          </div>
          <CardFooter className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(component.code)}
            >
              <ClipboardCopyIcon className="mr-2 size-4" />
              Copy Code
            </Button>
            {/* Optional: add a download button for raw files */}
            {/* <Button size="sm" variant="ghost">
              <DownloadIcon className="mr-2 size-4" />
              Download
            </Button> */}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}