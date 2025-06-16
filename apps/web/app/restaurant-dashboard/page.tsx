"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Search, MapPin, Star, Clock, Store, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RestaurantDashboardIndex() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock restaurant data - in a real app, this would come from an API
  const restaurants = [
    { 
      id: "bella-napoli", 
      name: "Bella Napoli Pizzeria", 
      cuisine: "Italian", 
      address: "123 Italian Street, Foodville",
      rating: 4.8,
      orders: 24,
      image: "/images/restaurant1.jpg"
    },
    { 
      id: "sushi-master", 
      name: "Sushi Master", 
      cuisine: "Japanese", 
      address: "456 Ocean Drive, Foodville",
      rating: 4.5,
      orders: 18,
      image: "/images/restaurant2.jpg"
    },
    { 
      id: "taco-fiesta", 
      name: "Taco Fiesta", 
      cuisine: "Mexican", 
      address: "789 Spicy Avenue, Foodville",
      rating: 4.2,
      orders: 15,
      image: "/images/restaurant3.jpg"
    },
    { 
      id: "burger-joint", 
      name: "Burger Joint", 
      cuisine: "American", 
      address: "42 Main Street, Foodville",
      rating: 4.7,
      orders: 32,
      image: "/images/restaurant4.jpg"
    },
  ];

  // Filter restaurants based on search query
  const filteredRestaurants = searchQuery
    ? restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : restaurants;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
          <p className="text-gray-500 mt-1">Select a restaurant to manage</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search restaurants..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredRestaurants.map((restaurant) => (
          <Link 
            key={restaurant.id} 
            href={`/restaurant-dashboard/${restaurant.id}`}
            className="block group"
          >
            <Card className="h-full transition-all hover:shadow-md hover:border-orange-300">
              <div className="h-40 w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent z-10"></div>
                <div className="absolute bottom-2 left-3 flex items-center text-white z-20">
                  <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{restaurant.rating}</span>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="group-hover:text-orange-600 transition-colors">
                  {restaurant.name}
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Store className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  <span>{restaurant.cuisine}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 pt-0">
                <div className="flex items-start text-sm text-gray-500 mb-1">
                  <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5 shrink-0" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{restaurant.orders} orders today</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full bg-[#FF9800] hover:bg-orange-600">
                  Manage Restaurant
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link href="/restaurant-dashboard/create">
          <Button className="bg-[#4CAF50] hover:bg-[#388E3C] text-white px-6 py-6 text-lg flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create New Restaurant
          </Button>
        </Link>
      </div>
    </div>
  );
}
