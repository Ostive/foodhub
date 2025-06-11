import Link from "next/link"
import { Menu } from "lucide-react"
import React from "react"

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-display text-3xl">
                <span className="text-[#FF9800]">Food</span>
                <span className="text-[#4CAF50]">Hub</span>
              </span>
            </Link>

            {/* Navigation Links & CTA */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/customer" className="text-[#fff] hover:text-[#4CAF50] text-sm font-medium">
                Order
              </Link>
              <Link href="/restaurant-dashboard" className="text-[#fff] hover:text-[#4CAF50] text-sm font-medium">
                Restaurant
              </Link>
              <Link href="/deliver" className="text-[#fff] hover:text-[#4CAF50] text-sm font-medium">
                Deliver
              </Link>
              <Link 
                href="#"
                className="bg-[#FF9800] hover:bg-[#F57C00] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                Download App
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button className="text-[#fff] hover:text-[#4CAF50]">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
