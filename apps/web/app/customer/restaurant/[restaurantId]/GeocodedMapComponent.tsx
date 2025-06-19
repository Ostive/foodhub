"use client";

import { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import { geocodeAddress } from "./geocodingService";

interface GeocodedMapComponentProps {
  address: string;
  zoom?: number;
  height?: string;
}

export default function GeocodedMapComponent({
  address,
  zoom = 15,
  height = "200px"
}: GeocodedMapComponentProps) {
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Geocode the address
  useEffect(() => {
    async function getCoordinates() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await geocodeAddress(address);
        if (result) {
          setCoordinates(result);
          console.log(`Address geocoded: ${address} -> Lat: ${result.latitude}, Lng: ${result.longitude}`);
        } else {
          setError("Could not find coordinates for this address");
          console.error("No coordinates found for address:", address);
        }
      } catch (err) {
        setError("Error geocoding address");
        console.error("Geocoding error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    getCoordinates();
  }, [address]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4CAF50]"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center p-4">
            <div className="text-red-500 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      )}
      
      {coordinates && (
        <MapComponent 
          latitude={coordinates.latitude} 
          longitude={coordinates.longitude} 
          zoom={zoom}
          height={height}
        />
      )}
      
      {/* Address display */}
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 rounded-md p-2 text-xs text-gray-700 shadow-sm z-20">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-[#4CAF50] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{address}</span>
        </div>
        {coordinates && (
          <div className="mt-1 text-gray-500 text-[10px]">
            {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
}
