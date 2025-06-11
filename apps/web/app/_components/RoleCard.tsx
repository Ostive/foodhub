import Link from "next/link"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type RoleCardProps = {
  icon: ReactNode
  title: string
  tagline: string
  button: string
  href: string
  buttonVariant: "default" | "secondary" | "outline"
  index: number
  image: string
}

export default function RoleCard({
  icon,
  title,
  tagline,
  button,
  href,
  buttonVariant,
  index,
  image,
}: RoleCardProps) {
  return (
    <Card 
      className={`relative flex flex-col overflow-hidden rounded-3xl shadow-xl border-2 border-transparent 
                  hover:border-[#FF9800]/40 transition-all duration-300 bg-white group animate-fade-in h-[450px]`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-10" />
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center p-8 h-full">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-full mb-auto mt-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <div className="mt-auto mb-6 text-center w-full">
          <h2 className="text-3xl font-bold mb-4 text-white font-display">{title}</h2>
          <p className="mb-8 text-white/90 text-lg">{tagline}</p>
          <Button 
            asChild 
            size="lg" 
            className="w-full font-semibold tracking-wide group-hover:animate-pulse shadow-lg py-6 text-lg" 
            variant={buttonVariant}
          >
            <Link href={href}>{button}</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
