// Modern Hero Section with food imagery
import {Marquee} from "./Marquee"
import { Search, MapPin } from "lucide-react"


export default function Hero() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-[90vh] md:min-h-[100vh] overflow-hidden -mt-[1px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0  z-10" 
          style={{ mixBlendMode: 'multiply' }}
        />
        <Marquee />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-start text-left pt-32 md:pt-40">
        <h1 className="font-display text-7xl md:text-9xl mb-6 text-white drop-shadow-lg animate-fade-in">
          Hungry?
        </h1>
        
        <p className="text-xl md:text-3xl text-white mb-10 max-w-2xl drop-shadow-md animate-fade-in delay-150">
          Delicious meals delivered to your doorstep
        </p>
        
        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-12 animate-fade-in delay-150">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <MapPin className="h-6 w-6 text-[#757575]" />
            </div>
            <input
              type="text"
              placeholder="Enter your delivery address"
              className="block w-full pl-14 pr-24 py-5 border-2 border-white/80 rounded-full bg-white/95 backdrop-blur-md focus:ring-[#4CAF50] focus:border-[#4CAF50] focus:outline-none shadow-lg text-[#212121] text-lg"
            />
            <button className="absolute inset-y-2 right-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center text-lg">
              <Search className="h-5 w-5 mr-2" />
              Find Food
            </button>
          </div>
        </div>
        
        {/* Food Categories Pills */}
        <div className="flex flex-wrap gap-3 max-w-3xl animate-fade-in delay-300">
          {[
            "Pizza", "Burgers", "Sushi", "Salads", "Desserts", "Vegan", "Italian", "Chinese", "Mexican"
          ].map((category, idx) => (
            <span 
              key={idx} 
              className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-base font-medium hover:bg-white/30 cursor-pointer transition-colors"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
