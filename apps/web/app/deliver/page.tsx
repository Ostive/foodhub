"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, DollarSign, Calendar, MapPin, ChevronRight, Star, CheckCircle, ArrowRight } from "lucide-react";

export default function DeliverPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: "James Wilson",
      role: "Delivery Partner - 2 years",
      quote: "I love the flexibility of delivering with Food'EM. I can work around my college schedule and still make great money.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "Delivery Partner - 1 year",
      quote: "The app is super easy to use, and I get paid fast. Customer support is always there when I need help.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Delivery Partner - 6 months",
      quote: "Best side gig I've ever had. The earnings are consistent, and I get to explore the city while making money.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 4
    },
  ];

  const earnings = [
    { type: "Average Hourly", amount: "$22", period: "per hour" },
    { type: "Weekly Potential", amount: "$800+", period: "per week" },
    { type: "Tips & Bonuses", amount: "$150+", period: "per week" },
  ];

  const benefits = [
    { title: "Flexible Schedule", description: "Work whenever you want, as much or as little as you need", icon: Clock },
    { title: "Fast Payments", description: "Get paid weekly with direct deposit to your bank account", icon: DollarSign },
    { title: "Bonus Opportunities", description: "Earn extra during peak hours and special promotions", icon: Star },
    { title: "No Boss", description: "Be your own boss and manage your own time", icon: CheckCircle },
  ];

  const steps = [
    { number: 1, title: "Sign Up", description: "Complete a simple application with your basic information" },
    { number: 2, title: "Get Approved", description: "Quick verification process, usually within 24-48 hours" },
    { number: 3, title: "Download the App", description: "Get our delivery partner app on iOS or Android" },
    { number: 4, title: "Start Earning", description: "Accept orders and start making money right away" },
  ];

  return (
    <main className="min-h-svh bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-xs py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#0072B2]">Food'EM</Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-[#0072B2] transition-colors">Home</Link>
            <Link href="#earnings" className="text-gray-600 hover:text-[#0072B2] transition-colors">Earnings</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-[#0072B2] transition-colors">How It Works</Link>
            <Link href="/deliver/login" className="text-gray-600 hover:text-[#0072B2] transition-colors font-medium">Driver Login</Link>
            <Link href="/deliver/signup" className="bg-[#0072B2] text-white px-5 py-2 rounded-full font-medium hover:bg-[#0d47a1] transition-colors">Apply Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-[#0072B2] to-[#64B5F6] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
          </svg>
          <defs>
            <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white z-10 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Deliver & Earn <br />On Your Terms</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Join thousands of delivery partners making money on their own schedule with FoodYou.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/deliver/signup" className="bg-white text-[#0072B2] px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors text-center">
                Start Earning Today
              </Link>
              <Link href="#how-it-works" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors text-center">
                Learn How It Works
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative z-10">
            <div className="relative h-[400px] w-full md:w-[500px] mx-auto">
              <Image 
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80" 
                alt="Delivery partner" 
                fill
                className="rounded-3xl object-cover shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">$22/hour</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Flexible Hours</p>
                    <p className="text-2xl font-bold text-gray-900">You Decide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Section */}
      <section id="earnings" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Much Can You Earn?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our delivery partners enjoy competitive earnings, flexible schedules, and weekly payments.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {earnings.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <p className="text-gray-600 mb-2">{item.type}</p>
                <p className="text-5xl font-bold text-[#0072B2] mb-2">{item.amount}</p>
                <p className="text-gray-500">{item.period}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-linear-to-r from-[#0072B2] to-[#64B5F6] rounded-3xl p-10 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-4">Ready to start earning?</h3>
                <p className="text-xl text-blue-100 mb-6 md:mb-0">Sign up today and start making money on your schedule.</p>
              </div>
              <Link href="/deliver/signup" className="bg-white text-[#0072B2] px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors inline-flex items-center">
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Deliver with FoodYou?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join thousands of delivery partners enjoying these benefits</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="bg-blue-100 p-4 rounded-2xl inline-block mb-6">
                    <Icon className="h-8 w-8 text-[#0072B2]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Getting started as a delivery partner is easy</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center relative">
                  <div className="w-12 h-12 bg-[#0072B2] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                      <ChevronRight className="h-8 w-8 text-[#0072B2]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Delivery Partners Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Hear from people already delivering with FoodYou</p>
          </div>
          
          <div className="bg-linear-to-r from-[#0072B2] to-[#64B5F6] rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#quote-pattern)" />
              </svg>
              <defs>
                <pattern id="quote-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <text x="0" y="15" fontSize="20" fill="white">"</text>
                </pattern>
              </defs>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                      <Image 
                        src={testimonials[activeTestimonial].avatar} 
                        alt={testimonials[activeTestimonial].name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white text-[#0072B2] rounded-full px-3 py-1 font-bold flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < testimonials[activeTestimonial].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-2xl italic mb-6">"{testimonials[activeTestimonial]?.quote}"</p>
                  <p className="text-lg text-blue-100">{testimonials[activeTestimonial]?.name}, <span className="opacity-80">{testimonials[activeTestimonial]?.role}</span></p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 mx-2 rounded-full ${activeTestimonial === index ? 'bg-white' : 'bg-white/30'}`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Download Our Delivery App</h2>
            <p className="text-xl text-gray-600 mb-8">Get the FoodYou Delivery app and start earning today. Available for iOS and Android devices.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="bg-black text-white px-6 py-3 rounded-xl font-medium inline-flex items-center hover:bg-gray-800 transition-colors">
                <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.60806 2.60156C3.37267 2.88687 3.25 3.28156 3.25 3.78562V20.2144C3.25 20.7184 3.37267 21.1131 3.60806 21.3984L3.67886 21.4651L13.3974 11.7466V11.25V10.7534L3.67886 1.03491L3.60806 2.60156Z" fill="white"/>
                  <path d="M17.2693 15.6187L13.3975 11.7469V11.25V10.7531L17.2693 6.88125L17.3584 6.93469L21.9282 9.54375C23.1209 10.2469 23.1209 11.4 21.9282 12.1031L17.3584 14.7122L17.2693 15.6187Z" fill="white"/>
                  <path d="M17.3583 14.7122L13.3974 10.7513L3.60803 20.5407C4.01897 20.9813 4.67584 21.0347 5.41553 20.5938L17.3583 14.7122Z" fill="white"/>
                  <path d="M3.60803 1.95938C4.01897 1.51875 4.67584 1.57219 5.41553 2.01281L17.3583 7.89438L13.3974 3.93344L3.60803 1.95938Z" fill="white"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="bg-black text-white px-6 py-3 rounded-xl font-medium inline-flex items-center hover:bg-gray-800 transition-colors">
                <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.60806 2.60156C3.37267 2.88687 3.25 3.28156 3.25 3.78562V20.2144C3.25 20.7184 3.37267 21.1131 3.60806 21.3984L3.67886 21.4651L13.3974 11.7466V11.25V10.7534L3.67886 1.03491L3.60806 2.60156Z" fill="white"/>
                  <path d="M17.2693 15.6187L13.3975 11.7469V11.25V10.7531L17.2693 6.88125L17.3584 6.93469L21.9282 9.54375C23.1209 10.2469 23.1209 11.4 21.9282 12.1031L17.3584 14.7122L17.2693 15.6187Z" fill="white"/>
                  <path d="M17.3583 14.7122L13.3974 10.7513L3.60803 20.5407C4.01897 20.9813 4.67584 21.0347 5.41553 20.5938L17.3583 14.7122Z" fill="white"/>
                  <path d="M3.60803 1.95938C4.01897 1.51875 4.67584 1.57219 5.41553 2.01281L17.3583 7.89438L13.3974 3.93344L3.60803 1.95938Z" fill="white"/>
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-[500px] bg-[#0072B2] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10 flex justify-center items-center">
                  <div className="w-20 h-4 bg-black rounded-b-xl"></div>
                </div>
                <Image 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&q=80" 
                  alt="Delivery App" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Star className="h-6 w-6 text-[#0072B2]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">App Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-linear-to-r from-[#0072B2] to-[#64B5F6] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">Join thousands of delivery partners already earning with FoodYou. Apply today and start delivering tomorrow.</p>
          <Link href="/deliver/signup" className="bg-white text-[#0072B2] px-10 py-4 rounded-full font-bold text-xl hover:bg-blue-50 transition-colors inline-block">
            Apply Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold text-white">FoodYou<span className="text-[#64B5F6]">Deliver</span></Link>
            <p className="mt-4 text-gray-400">Earn money delivering food on your own schedule with the leading food delivery platform.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#earnings" className="text-gray-400 hover:text-white transition-colors">Earnings</Link></li>
              <li><Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/deliver/signup" className="text-gray-400 hover:text-white transition-colors">Apply Now</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Safety</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p> {new Date().getFullYear()} FoodYou. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
