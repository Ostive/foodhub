"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Image from "next/image";
import { Star, Clock, Bike, Heart, MapPin, Phone, Globe, Calendar } from "lucide-react";
import Link from "next/link";
import CustomerNavbar from "..//_components/CustomerNavbar";
import restaurantsData from "../restaurant/restaurantData";
import type { Restaurant } from "../restaurant/restaurantData";

export default function RestaurantTestPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [liked, setLiked] = useState(false);
  
  // Use Burger Palace as our test restaurant
  const restaurant: Restaurant = restaurantsData['restaurant-1']!;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return; // wait for container to be available
    
    try {
      // Use restaurant coordinates if available, otherwise default to NYC
      const restaurantLng = restaurant.longitude ?? -74.006;
      const restaurantLat = restaurant.latitude ?? 40.7128;
      
      // Simulate user position (slightly offset from restaurant)
      const userLng = restaurantLng - 0.008;
      const userLat = restaurantLat - 0.005;
      
      // Calculate distance between points (simple Euclidean for demo)
      const distance = calculateDistance(userLat, userLng, restaurantLat, restaurantLng);
      const distanceKm = (distance).toFixed(1);
      
      // Initialize map centered between the two points
      const centerLng = (restaurantLng + userLng) / 2;
      const centerLat = (restaurantLat + userLat) / 2;
      
      // Initialize map
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [centerLng, centerLat],
        zoom: 13
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl());
      
      // Add markers and line when map loads
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        if (map.current) { 
          // 1. Add Restaurant Marker
          const restaurantMarkerEl = document.createElement('div');
          restaurantMarkerEl.className = 'restaurant-marker';
          restaurantMarkerEl.innerHTML = `
            <div class="modern-marker">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
          `;
          
          // 2. Add User Marker (blue)
          const userMarkerEl = document.createElement('div');
          userMarkerEl.className = 'user-marker';
          userMarkerEl.innerHTML = `
            <div class="user-marker-inner">
              <div class="user-dot"></div>
              <div class="user-pulse"></div>
            </div>
          `;
          
          // Add CSS for both markers
          const style = document.createElement('style');
          style.textContent = `
            .restaurant-marker, .user-marker {
              position: relative;
              transform: translate(-50%, -50%);
            }
            .modern-marker, .user-marker-inner {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .marker-dot {
              width: 12px;
              height: 12px;
              background-color: #000;
              border-radius: 50%;
              box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
              z-index: 2;
            }
            .marker-pulse {
              position: absolute;
              width: 24px;
              height: 24px;
              background-color: transparent;
              border: 2px solid #000;
              border-radius: 50%;
              z-index: 1;
              opacity: 0.6;
            }
            .user-dot {
              width: 12px;
              height: 12px;
              background-color: #2563EB;
              border-radius: 50%;
              box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
              z-index: 2;
            }
            .user-pulse {
              position: absolute;
              width: 24px;
              height: 24px;
              background-color: transparent;
              border: 2px solid #2563EB;
              border-radius: 50%;
              z-index: 1;
              opacity: 0.6;
            }
          `;
          document.head.appendChild(style);
          
          // Add restaurant marker
          new maplibregl.Marker({
            element: restaurantMarkerEl,
            anchor: 'center',
            pitchAlignment: 'viewport',
            rotationAlignment: 'viewport'
          })
            .setLngLat([restaurantLng, restaurantLat])
            .addTo(map.current);
            
          // Add user marker
          new maplibregl.Marker({
            element: userMarkerEl,
            anchor: 'center',
            pitchAlignment: 'viewport',
            rotationAlignment: 'viewport'
          })
            .setLngLat([userLng, userLat])
            .addTo(map.current);
          
          // Add a line connecting the points with a true curve
          // Create a curved path using bezier curve coordinates
          const generateCurvedPath = () => {
            // Start and end points
            const start: [number, number] = [userLng, userLat];
            const end: [number, number] = [restaurantLng, restaurantLat];
            
            // Calculate control points for a nice curve
            const midX = (start[0] + end[0]) / 2;
            const midY = (start[1] + end[1]) / 2;
            
            // Offset for the curve height
            const curveOffset = 0.012; // Increased for more pronounced curve
            
            // Calculate perpendicular offset for the control point
            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            const normLength = Math.sqrt(dx * dx + dy * dy);
            
            // Create perpendicular vector
            const perpX = -dy / normLength * curveOffset;
            const perpY = dx / normLength * curveOffset;
            
            // Generate points along the curve
            const curvePoints: [number, number][] = [];
            const numPoints = 50; // More points = smoother curve
            
            for (let i = 0; i <= numPoints; i++) {
              const t = i / numPoints;
              
              // Quadratic bezier formula
              const controlX = midX + perpX;
              const controlY = midY + perpY;
              
              // Calculate point on quadratic bezier curve
              const x = Math.pow(1-t, 2) * start[0] + 
                       2 * (1-t) * t * controlX + 
                       Math.pow(t, 2) * end[0];
              
              const y = Math.pow(1-t, 2) * start[1] + 
                       2 * (1-t) * t * controlY + 
                       Math.pow(t, 2) * end[1];
              
              curvePoints.push([x, y]);
            }
            
            return curvePoints;
          };
          
          const curveCoordinates = generateCurvedPath();
          
          // Find the middle point of the curve (for label placement)
          const middlePointIndex = Math.floor(curveCoordinates.length / 2);
          const middlePoint = curveCoordinates[middlePointIndex];
          
          if (!middlePoint) {
            console.error('Failed to calculate middle point for curve');
            return;
          }
          
          map.current.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': curveCoordinates
              }
            }
          });
          
          map.current.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#009E73',
              'line-width': 4, // Increased line width
              'line-dasharray': [2, 1]
            }
          });
          
          // Add distance label at the middle of the curve
          // Create a custom HTML element for the distance label
          const distanceEl = document.createElement('div');
          distanceEl.className = 'distance-marker';
          distanceEl.innerHTML = `<span>${distanceKm} km</span>`;
          
          // Add CSS for the distance label
          const labelStyle = document.createElement('style');
          labelStyle.textContent = `
            .distance-marker {
              color: #009E73;
              font-size: 18px; /* Increased font size */
              font-weight: bold;
              text-shadow: 
                0px 0px 4px white,
                0px 0px 4px white,
                0px 0px 4px white,
                0px 0px 4px white;
              pointer-events: none;
              width: max-content;
              transform: translateY(-12px);
            }
          `;
          document.head.appendChild(labelStyle);
          
          // Add the custom distance marker at the middle of the curve
          new maplibregl.Marker({
            element: distanceEl,
            anchor: 'center',
            pitchAlignment: 'viewport',
            rotationAlignment: 'viewport'
          })
            .setLngLat(middlePoint)
            .addTo(map.current);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [restaurant.longitude, restaurant.latitude]);
  
  // Function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      
      {/* Restaurant Hero Section */}
      <div className="relative w-full h-80">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <Image 
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="object-cover"
          fill
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">{restaurant.name}</h1>
            <button 
              onClick={() => setLiked(!liked)}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg"
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          <div className="flex items-center mt-2 text-white">
            <div className="flex items-center mr-4">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span>{restaurant.rating} ({restaurant.reviewCount})</span>
            </div>
            <div className="flex items-center mr-4">
              <Clock className="w-5 h-5 text-white mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <Bike className="w-5 h-5 text-white mr-1" />
              <span>{restaurant.deliveryFee}</span>
            </div>
          </div>
          <div className="mt-2 text-white">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm mr-2">{restaurant.cuisine}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{restaurant.distance} away</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Restaurant Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xs p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About {restaurant.name}</h2>
              <p className="text-gray-600 mb-6">{restaurant.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#009E73] mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">{restaurant.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-[#009E73] mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Opening Hours</h3>
                    <p className="text-gray-600">{restaurant.openingHours}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-[#009E73] mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">{restaurant.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-[#009E73] mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Website</h3>
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {restaurant.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Featured Menu Items */}
            <div className="bg-white rounded-xl shadow-xs p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Popular Items</h2>
                <Link href="/customer/restaurant/restaurant-1" className="text-[#009E73] font-medium hover:underline flex items-center">
                  View Full Menu
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.menuCategories[0]?.items.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex bg-gray-50 rounded-xl overflow-hidden">
                    <div className="relative w-24 h-24">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                      <p className="text-[#009E73] font-medium mt-1">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Map */}
          <div>
            <div className="bg-white rounded-xl shadow-xs p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Restaurant Location</h2>
              <div 
                ref={mapContainer} 
                className="w-full h-[300px] rounded-lg overflow-hidden shadow-xs" 
              />
              <div className="mt-4">
                <div className="flex items-start mb-3">
                  <MapPin className="w-5 h-5 text-[#009E73] mt-1 mr-3" />
                  <p className="text-gray-600">{restaurant.address}</p>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#009E73] hover:bg-[#3d8b40] text-white text-center py-3 rounded-lg font-medium transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
