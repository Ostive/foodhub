"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CustomerNavbar from "../../../_components/CustomerNavbar";
import restaurantsData from "../../../restaurant/restaurantData";
import { Star, Clock, MapPin, Phone, Globe, ArrowLeft, Heart, Share2, ExternalLink, Copy, CheckCircle, Users, Calendar, Award, Utensils } from "lucide-react";
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';
import maplibregl from 'maplibre-gl';

// Note: You'll need to install maplibre-gl with: npm install maplibre-gl --workspace=apps/web
// And add the following to your package.json dependencies: "maplibre-gl": "^2.4.0"

export default function RestaurantDetailsPage() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  const restaurant = restaurantsData[restaurantId];
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // For demo purposes, let's add some mock coordinates for the restaurants
  const restaurantCoordinates: Record<string, [number, number]> = {
    'restaurant-1': [restaurantsData['restaurant-1']?.longitude || -74.006, restaurantsData['restaurant-1']?.latitude || 40.7128],
    'restaurant-3': [restaurantsData['restaurant-3']?.longitude || -74.0060, restaurantsData['restaurant-3']?.latitude || 40.7135],
    'taco-fiesta': [restaurantsData['taco-fiesta']?.longitude || -118.2437, restaurantsData['taco-fiesta']?.latitude || 34.0522],
    'pizza-paradise': [restaurantsData['pizza-paradise']?.longitude || -87.6298, restaurantsData['pizza-paradise']?.latitude || 41.8781],
    'pasta-palace': [restaurantsData['pasta-palace']?.longitude || -122.4194, restaurantsData['pasta-palace']?.latitude || 37.7749],
  };
  
  // Mock restaurant stats
  const restaurantStats = {
    totalOrders: 1243,
    openDate: "March 15, 2023",
    averageRating: restaurant?.rating || 4.5,
    popularDish: "Classic Burger",
  };
  
  // Function to get user's location with better error handling
  const getUserLocation = () => {
    setLocationError(null);
    
    // Create a loading state to show the user something is happening
    const loadingToast = document.createElement('div');
    loadingToast.className = 'location-toast loading';
    loadingToast.innerHTML = `
      <div class="toast-content">
        <div class="spinner"></div>
        <span>Getting your location...</span>
      </div>
    `;
    document.body.appendChild(loadingToast);
    
    // Add toast styles if they don't exist
    if (!document.getElementById('location-toast-styles')) {
      const toastStyles = document.createElement('style');
      toastStyles.id = 'location-toast-styles';
      toastStyles.textContent = `
        .location-toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 12px 20px;
          z-index: 9999;
          transition: all 0.3s ease;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }
        .location-toast.loading .toast-content {
          display: flex;
          align-items: center;
        }
        .location-toast.error {
          background-color: #fee2e2;
          border-left: 4px solid #ef4444;
        }
        .location-toast.success {
          background-color: #dcfce7;
          border-left: 4px solid #22c55e;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #4CAF50;
          border-radius: 50%;
          margin-right: 12px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .location-toast .retry-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          margin-top: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .location-toast .retry-btn:hover {
          background-color: #3d8b40;
        }
        .location-control {
          position: absolute;
          top: 10px;
          right: 10px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .location-control:hover {
          background: #f9fafb;
        }
      `;
      document.head.appendChild(toastStyles);
    }
    
    // Function to show error toast
    const showErrorToast = (message: string) => {
      // Remove loading toast if it exists
      const existingToast = document.querySelector('.location-toast');
      if (existingToast) {
        existingToast.remove();
      }
      
      const errorToast = document.createElement('div');
      errorToast.className = 'location-toast error';
      errorToast.innerHTML = `
        <div class="toast-content">
          <span>${message}</span>
        </div>
        <button class="retry-btn" onclick="this.parentElement.remove(); document.dispatchEvent(new CustomEvent('retry-location'))">
          Try Again
        </button>
      `;
      document.body.appendChild(errorToast);
      
      // Auto remove after 8 seconds
      setTimeout(() => {
        if (document.body.contains(errorToast)) {
          errorToast.remove();
        }
      }, 8000);
    };
    
    // Function to show success toast
    const showSuccessToast = (message: string) => {
      // Remove loading toast if it exists
      const existingToast = document.querySelector('.location-toast');
      if (existingToast) {
        existingToast.remove();
      }
      
      const successToast = document.createElement('div');
      successToast.className = 'location-toast success';
      successToast.innerHTML = `
        <div class="toast-content">
          <span>${message}</span>
        </div>
      `;
      document.body.appendChild(successToast);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          successToast.remove();
        }
      }, 3000);
    };
    
    // Set up retry event listener
    const retryHandler = () => {
      getUserLocation();
    };
    document.addEventListener('retry-location', retryHandler);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          
          // Calculate distance between user and restaurant
          const restaurantCoords = restaurantCoordinates[restaurantId];
          if (restaurantCoords) {
            const dist = calculateDistance(
              latitude, 
              longitude, 
              restaurantCoords[1], 
              restaurantCoords[0]
            );
            setDistance(dist.toFixed(1) + ' km');
            
            // Show success toast
            showSuccessToast(`Location found! You are ${dist.toFixed(1)} km away.`);
          }
          
          // Remove loading toast
          if (loadingToast.parentNode) {
            loadingToast.remove();
          }
          
          // Clean up event listener
          document.removeEventListener('retry-location', retryHandler);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // Remove loading toast
          if (loadingToast.parentNode) {
            loadingToast.remove();
          }
          
          let errorMessage = "An unknown error occurred";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          
          setLocationError(errorMessage);
          showErrorToast(errorMessage);
          
          // Clean up event listener
          document.removeEventListener('retry-location', retryHandler);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Remove loading toast
      if (loadingToast.parentNode) {
        loadingToast.remove();
      }
      
      const errorMessage = "Geolocation is not supported by this browser";
      setLocationError(errorMessage);
      showErrorToast(errorMessage);
      
      // Clean up event listener
      document.removeEventListener('retry-location', retryHandler);
    }
  };

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  // Function to copy location to clipboard
  const copyLocationToClipboard = () => {
    const coordinates = restaurantCoordinates[restaurantId];
    if (coordinates) {
      const locationText = `${coordinates[1]},${coordinates[0]}`;
      navigator.clipboard.writeText(locationText).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  // Load user location from localStorage on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) {
      // If we have a saved address, try to get user location automatically
      getUserLocation();
    }
  }, []);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Map initialization and cleanup
  useEffect(() => {
    // Only initialize map if container is available and map doesn't exist yet
    if (!mapContainer.current || map.current) return;
    
    const coordinates = restaurantCoordinates[restaurantId] || [-74.006, 40.7128];
    
    try {
      // Initialize map
      const newMap = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: coordinates,
        zoom: 14
      });
      
      // Add navigation controls
      newMap.addControl(new maplibregl.NavigationControl(), 'top-left');
      
      // Add custom location control
      const locationControlContainer = document.createElement('div');
      locationControlContainer.className = 'location-control';
      locationControlContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>`;
      locationControlContainer.title = 'Get your location';
      locationControlContainer.onclick = () => {
        getUserLocation();
      };
      
      // Add the location control to the map
      const locationControlDiv = document.createElement('div');
      locationControlDiv.className = 'maplibregl-ctrl maplibregl-ctrl-group';
      locationControlDiv.appendChild(locationControlContainer);
      
      newMap.getContainer().appendChild(locationControlDiv);
      
      // Position the control
      locationControlDiv.style.position = 'absolute';
      locationControlDiv.style.top = '10px';
      locationControlDiv.style.right = '10px';
      locationControlDiv.style.margin = '0';
      
      // Add restaurant marker
      const restaurantMarkerEl = document.createElement('div');
      restaurantMarkerEl.className = 'restaurant-marker';
      restaurantMarkerEl.style.width = '30px';
      restaurantMarkerEl.style.height = '30px';
      restaurantMarkerEl.style.backgroundImage = 'url("/restaurant-marker.svg")';
      restaurantMarkerEl.style.backgroundSize = 'cover';
      
      new maplibregl.Marker(restaurantMarkerEl)
        .setLngLat(coordinates as [number, number])
        .addTo(newMap);
      
      // Wait for map to load before adding user marker and path
      newMap.on('load', () => {
        // If we have user location, add user marker and path
        if (userLocation) {
          const userCoordinates: [number, number] = [userLocation.longitude, userLocation.latitude];
          
          // Add user marker
          const userMarkerEl = document.createElement('div');
          userMarkerEl.className = 'user-marker';
          userMarkerEl.style.width = '30px';
          userMarkerEl.style.height = '30px';
          userMarkerEl.style.backgroundImage = 'url("/user-marker.svg")';
          userMarkerEl.style.backgroundSize = 'cover';
          
          new maplibregl.Marker(userMarkerEl)
            .setLngLat(userCoordinates)
            .addTo(newMap);
          
          // Generate a curved path between user and restaurant
          const generateCurvedPath = () => {
            // Start and end points
            const start: [number, number] = userCoordinates;
            const end: [number, number] = coordinates as [number, number];
            
            // Calculate midpoint
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
          const midPoint = curveCoordinates[middlePointIndex];
          
          if (!midPoint) {
            console.error('Failed to calculate middle point for curve');
            return;
          }
          
          // Create a curved path
          const curvedPath = {
            'type': 'Feature' as const,
            'properties': {},
            'geometry': {
              'type': 'LineString' as const,
              'coordinates': curveCoordinates
            }
          };
          
          // Add the curved path to the map
          newMap.addSource('route', {
            'type': 'geojson',
            'data': curvedPath
          });
          
          newMap.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#4CAF50',
              'line-width': 4,
              'line-dasharray': [2, 1]
            }
          });
          
          // Add distance label at the middle of the curve
          if (distance) {
            // Create a custom HTML element for the distance label
            const distanceEl = document.createElement('div');
            distanceEl.className = 'distance-marker';
            distanceEl.innerHTML = `<span>${distance}</span>`;
            
            // Add CSS for the distance marker if it doesn't exist
            if (!document.getElementById('distance-marker-style')) {
              const style = document.createElement('style');
              style.id = 'distance-marker-style';
              style.textContent = `
                .distance-marker {
                  color: #4CAF50;
                  font-size: 18px;
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
              document.head.appendChild(style);
            }
            
            // Add the custom distance marker at the middle of the curve
            new maplibregl.Marker({
              element: distanceEl,
              anchor: 'center',
              pitchAlignment: 'viewport',
              rotationAlignment: 'viewport'
            })
              .setLngLat(midPoint)
              .addTo(newMap);
          }
          
          // Fit bounds to include both points
          const bounds = new maplibregl.LngLatBounds()
            .extend(coordinates as [number, number])
            .extend(userCoordinates);
          
          newMap.fitBounds(bounds, {
            padding: 70,
            maxZoom: 15
          });
        }
      });
      
      // Store map reference
      map.current = newMap;
    } catch (error) {
      console.error('Error creating map:', error);
    }
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [restaurantId, userLocation, distance]);
  
  if (!restaurant) {
    return (
      <div className="min-h-svh bg-[#f8f9fa]">
        <CustomerNavbar forceLight={true} />
        <div className="pt-20 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Restaurant not found</h1>
            <p className="mt-2 text-gray-600">The restaurant you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-svh bg-[#f8f9fa]">
      <CustomerNavbar forceLight={true} />
      
      {/* Restaurant Header - Hero Section */}
      <div className="relative h-72 md:h-[500px]">
        <Image 
          src={restaurant.coverImage} 
          alt={restaurant.name} 
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
        
        {/* Navigation and Action Buttons */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <Link 
            href={`/customer/restaurant/${restaurantId}`}
            className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg"
            aria-label="Back to restaurant page"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex space-x-3">
            <button 
              className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg"
              aria-label="Save restaurant to favorites"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button 
              className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg"
              aria-label="Share restaurant"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Restaurant Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="font-medium">{restaurant.rating}</span>
                <span className="mx-1 text-white/70">•</span>
                <span className="text-white/90">{restaurant.reviewCount} reviews</span>
              </div>
              
              <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4 mr-2" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              
              <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{restaurant.distance}</span>
              </div>
              
              {distance && (
                <div className="flex items-center bg-[#4CAF50]/90 text-white px-3 py-1.5 rounded-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-medium">{distance} from you</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Restaurant Info */}
          <div className="lg:col-span-7">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">About {restaurant.name}</h2>
                <p className="mt-3 text-gray-600 leading-relaxed">{restaurant.description}</p>
              </div>
              
              {/* Restaurant Stats */}
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-[#4CAF50]" />
                      <span className="ml-2 text-sm text-gray-600">Total Orders</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{restaurantStats.totalOrders.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-[#4CAF50]" />
                      <span className="ml-2 text-sm text-gray-600">Open Since</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{restaurantStats.openDate}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 text-[#4CAF50]" />
                      <span className="ml-2 text-sm text-gray-600">Rating</span>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-bold text-gray-900 mr-2">{restaurantStats.averageRating}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(restaurantStats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <Utensils className="h-5 w-5 text-[#4CAF50]" />
                      <span className="ml-2 text-sm text-gray-600">Popular Dish</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{restaurantStats.popularDish}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                <div className="flex items-start p-6">
                  <div className="bg-[#4CAF50]/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Address</h3>
                    <p className="text-gray-600 mt-1">{restaurant.address}</p>
                    <div className="flex mt-3 space-x-4">
                      <button 
                        onClick={getUserLocation}
                        className="text-[#4CAF50] font-medium flex items-center hover:underline transition-colors"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Calculate Distance
                      </button>
                      <button 
                        onClick={copyLocationToClipboard}
                        className="text-[#4CAF50] font-medium flex items-center hover:underline transition-colors"
                      >
                        {copySuccess ? 
                          <><CheckCircle className="h-4 w-4 mr-1" /> Copied!</> : 
                          <><Copy className="h-4 w-4 mr-1" /> Copy Coordinates</>
                        }
                      </button>
                    </div>
                    {locationError && (
                      <p className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded">{locationError}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start p-6">
                  <div className="bg-[#4CAF50]/10 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Hours</h3>
                    <p className="text-gray-600 mt-1">{restaurant.openingHours}</p>
                  </div>
                </div>
                
                <div className="flex items-start p-6">
                  <div className="bg-[#4CAF50]/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Contact</h3>
                    <p className="text-gray-600 mt-1">{restaurant.phoneNumber}</p>
                  </div>
                </div>
                
                {restaurant.website && (
                  <div className="flex items-start p-6">
                    <div className="bg-[#4CAF50]/10 p-3 rounded-full mr-4">
                      <Globe className="h-6 w-6 text-[#4CAF50]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Website</h3>
                      <a 
                        href={`https://${restaurant.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#4CAF50] hover:underline mt-1 inline-block"
                      >
                        {restaurant.website} <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
            
          {/* Right Column - Map and Reviews */}
          <div className="lg:col-span-5">
            {/* Map Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 sticky top-4">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Location</h2>
                {distance && (
                  <div className="flex items-center bg-[#4CAF50]/10 text-[#4CAF50] px-4 py-2 rounded-full">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="font-medium">{distance} away</span>
                  </div>
                )}
              </div>
              
              {/* Map Container */}
              <div className="relative">
                <div 
                  ref={mapContainer}
                  className="w-full h-[400px]"
                />
                {!userLocation && (
                  <button
                    onClick={getUserLocation}
                    className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
                    aria-label="Get your location"
                  >
                    <MapPin className="h-6 w-6 text-[#4CAF50]" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-8">
                  <div className="bg-[#4CAF50] text-white text-3xl font-bold h-20 w-20 rounded-xl flex items-center justify-center mr-5 shadow-md">
                    {restaurant.rating}
                  </div>
                  <div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-6 w-6 ${i < Math.floor(restaurant.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-lg">{restaurant.reviewCount} reviews</p>
                  </div>
                </div>
                
                {/* Sample Reviews */}
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-800 font-medium rounded-full h-12 w-12 flex items-center justify-center mr-3">
                          JD
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">John Doe</h3>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">2 days ago</span>
                    </div>
                    <p className="text-gray-600">The food was amazing! I especially loved the {restaurantStats.popularDish}. Will definitely come back again.</p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="bg-purple-100 text-purple-800 font-medium rounded-full h-12 w-12 flex items-center justify-center mr-3">
                          AS
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Alice Smith</h3>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">1 week ago</span>
                    </div>
                    <p className="text-gray-600">Great atmosphere and friendly staff. The food was delicious and came quickly. Highly recommend!</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="bg-amber-100 text-amber-800 font-medium rounded-full h-12 w-12 flex items-center justify-center mr-3">
                          RJ
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Robert Johnson</h3>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">2 weeks ago</span>
                    </div>
                    <p className="text-gray-600">I've been coming here for years and the quality has never dropped. Their {restaurantStats.popularDish} is the best in town!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
