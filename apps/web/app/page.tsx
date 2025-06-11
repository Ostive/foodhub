import { ChevronRight, Utensils, ShoppingBag, Bike } from "lucide-react"
import Link from "next/link"

import Hero from "./_components/Hero"
import Navbar from "./_components/Navbar"
import RoleCard from "./_components/RoleCard"
import Footer from "./_components/Footer"

export default function Page() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Role Selection */}
      <section className="py-20 bg-gradient-to-r from-[#f9f9f9] via-[#f0f9f0] to-[#f9f9f9] bg-animate">
        <div className="container mx-auto px-4">
          {/* Big Image Card with Description */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 max-w-7xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80" 
              alt="Food Experience" 
              className="w-full h-[400px] object-cover object-center"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 md:p-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Your Place on Foodyou
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                Whether you want to eat, cook, or deliver, Foodyou welcomes everyone. Tap a card to get started!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Customer */}
            <a
              href="/customer"
              className="group flex flex-col items-center rounded-3xl overflow-visible shadow-2xl bg-white/90 border border-gray-100 hover:shadow-3xl transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#4CAF50] p-0"
              style={{ minHeight: '420px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                alt="Order Food"
                className="w-full h-64 object-cover object-center rounded-3xl group-hover:scale-105 transition-transform duration-500 shadow-lg border border-gray-200"
              />
              <div className="w-full flex-1 flex flex-col items-center justify-center p-8 mt-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Order Food</h3>
                <p className="text-gray-700 text-lg text-center">Browse restaurants and get your favorite meals delivered fast.</p>
              </div>
            </a>
            {/* Restaurant */}
            <a
              href="/restaurant-dashboard"
              className="group flex flex-col items-center rounded-3xl overflow-visible shadow-2xl bg-white/90 border border-gray-100 hover:shadow-3xl transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#FF9800] p-0"
              style={{ minHeight: '420px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
                alt="Join as a Restaurant"
                className="w-full h-64 object-cover object-center rounded-3xl group-hover:scale-105 transition-transform duration-500 shadow-lg border border-gray-200"
              />
              <div className="w-full flex-1 flex flex-col items-center justify-center p-8 mt-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Join as a Restaurant</h3>
                <p className="text-gray-700 text-lg text-center">Grow your business and reach more hungry customers with us.</p>
              </div>
            </a>
            {/* Deliverer */}
            <a
              href="/deliver"
              className="group flex flex-col items-center rounded-3xl overflow-visible shadow-2xl bg-white/90 border border-gray-100 hover:shadow-3xl transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#212121] p-0"
              style={{ minHeight: '420px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80"
                alt="Deliver Food"
                className="w-full h-64 object-cover object-center rounded-3xl group-hover:scale-105 transition-transform duration-500 shadow-lg border border-gray-200"
              />
              <div className="w-full flex-1 flex flex-col items-center justify-center p-8 mt-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Deliver Food</h3>
                <p className="text-gray-700 text-lg text-center">Earn on your own schedule by bringing meals to our community.</p>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-[#f5f5f5] via-[#f8f8f8] to-[#f5f5f5] bg-animate">
        <div className="container mx-auto px-4">
          <div className="text-left mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="text-[#FF9800]">Customers</span> Say
            </h2>
            <p className="text-lg md:text-xl text-[#757575] mb-8 max-w-3xl">
              Don't just take our word for it, hear what our happy customers have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Regular Customer",
                quote: "The food always arrives hot and fresh. The app is super easy to use and the delivery is always on time!",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Michael Chen",
                role: "Foodie Enthusiast",
                quote: "I've discovered so many amazing restaurants through Foodyou that I never knew existed in my neighborhood.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Emily Rodriguez",
                role: "Busy Professional",
                quote: "As someone who works late, Foodyou has been a lifesaver. The variety of options and quick delivery is perfect.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              },
            ].map((testimonial, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-3xl shadow-lg animate-fade-in"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-[#4CAF50]"
                  />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-[#212121]">{testimonial.name}</h3>
                    <p className="text-[#757575]">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#212121] italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* App Download Section */}
      <section className="py-20 bg-gradient-to-r from-[#f9f9f9] via-[#f0f9f0] to-[#f9f9f9] bg-animate">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 rounded-3xl shadow-2xl bg-white/90 p-10 md:p-16 animate-fade-in">
            {/* Text & Buttons */}
            <div className="flex-1 text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Download <span className="text-[#4CAF50]">Foodyou</span> App
              </h2>
              <p className="text-lg md:text-xl text-[#757575] mb-8 max-w-xl">
                Get the full Foodyou experience on your phone. Order food, track deliveries, and earn rewards — all in one app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* App Store Button */}
                <a
                  href="#"
                  className="flex items-center bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-full transition-colors shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 mr-3" fill="currentColor">
                    <path d="M17.5,2A3.5,3.5 0 0,1 21,5.5V18.5A3.5,3.5 0 0,1 17.5,22H6.5A3.5,3.5 0 0,1 3,18.5V5.5A3.5,3.5 0 0,1 6.5,2H17.5M16.75,4H7.25A3.25,3.25 0 0,0 4,7.25V16.75A3.25,3.25 0 0,0 7.25,20H16.75A3.25,3.25 0 0,0 20,16.75V7.25A3.25,3.25 0 0,0 16.75,4M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                  </svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-xl font-semibold font-sans -mt-1">App Store</div>
                  </div>
                </a>
                {/* Google Play Button */}
                <a
                  href="#"
                  className="flex items-center bg-[#4CAF50] hover:bg-[#388E3C] text-white px-6 py-3 rounded-full transition-colors shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 mr-3" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.67 3.67,2 4.5,2H19.5C20.33,2 21,2.67 21,3.5V20.5C21,21.33 20.33,22 19.5,22H4.5C3.67,22 3,21.33 3,20.5M8.5,7.5V16.5L16.5,12L8.5,7.5Z" />
                  </svg>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-xl font-semibold font-sans -mt-1">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            {/* App Image */}
            <div className="flex-1 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
                alt="Foodyou Mobile App Preview"
                className="max-w-xs w-full rounded-3xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <Footer />
    </main>
  )
}
