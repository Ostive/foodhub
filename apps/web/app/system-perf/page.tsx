import { ChevronRight, Utensils, ShoppingBag, Bike } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'


import Navbar from "../_components/Navbar"
import RoleCard from "../_components/RoleCard"
import Footer from "../_components/Footer"
import Component from "../_components/area-chart"
import ChartLineInteractive from "../_components/line-chart"
import SectionCards from "../_components/section-card"
import NavbarDemo from "../_components/topbar"


export default function Page() {
  return (
    <main className="min-h-screen">
      <NavbarDemo />
      {/* Graph Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            System Performance
          </h2>

          <div className="flex flex-col gap-8">
            <SectionCards />

            <div className="px-4 lg:px-6">
              <Component />
            </div>

            <div className="px-4 lg:px-6">
              <ChartLineInteractive />
            </div>
          </div>
        </div>
      </section>


      {/* Existing Role Cards and Other Sections Below */}
      {/* ...Keep your existing code here (role cards, testimonials, download app, footer, etc)... */}

      <Footer />
    </main>
  )
}
