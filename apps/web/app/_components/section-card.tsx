
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SectionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          
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
            
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
         
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
            
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          
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
            
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
