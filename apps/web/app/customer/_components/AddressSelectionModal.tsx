"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, X, Check, Search } from "lucide-react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type AddressSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelected: (address: string, coordinates?: [number, number]) => void;
};

const AddressSelectionModal = ({ isOpen, onClose, onAddressSelected }: AddressSelectionModalProps) => {
  const [searchAddress, setSearchAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number]>([2.3522, 48.8566]); // Default to Paris
  const [address, setAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!isOpen) return;
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return; // wait for container to be available
    
    try {
      // Initialize map
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: coordinates,
        zoom: 13
      });
      
      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl());
      
      // Add marker for current location
      marker.current = new maplibregl.Marker({
        color: '#4CAF50',
        draggable: true
      })
        .setLngLat(coordinates)
        .addTo(map.current);
      
      // Update coordinates when marker is dragged
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          setCoordinates([lngLat.lng, lngLat.lat]);
          fetchAddressFromCoordinates(lngLat.lat, lngLat.lng);
        }
      });
      
      // Allow clicking on map to move marker
      map.current.on('click', (e) => {
        if (marker.current) {
          marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
          setCoordinates([e.lngLat.lng, e.lngLat.lat]);
          fetchAddressFromCoordinates(e.lngLat.lat, e.lngLat.lng);
        }
      });
      
      // Initial reverse geocoding
      fetchAddressFromCoordinates(coordinates[1], coordinates[0]);
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
  }, [isOpen]);

  // Helper function to validate if coordinates are valid numbers
  const isValidCoordinate = (lat: number, lng: number): boolean => {
    return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng);
  };
  
  // Helper function to check if coordinates are within France's approximate bounds
  const isWithinFranceBounds = (lat: number, lng: number): boolean => {
    // Approximate bounds for Metropolitan France
    const FRANCE_BOUNDS = {
      minLat: 41.0, // Southern bound
      maxLat: 51.5, // Northern bound
      minLng: -5.5, // Western bound
      maxLng: 10.0  // Eastern bound
    };
    
    // Check if coordinates are within France's bounds
    return (
      lat >= FRANCE_BOUNDS.minLat &&
      lat <= FRANCE_BOUNDS.maxLat &&
      lng >= FRANCE_BOUNDS.minLng &&
      lng <= FRANCE_BOUNDS.maxLng
    );
  };

  // Function to fetch address from coordinates using DataGouv API with fallback to OpenStreetMap
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    // Validate coordinates before making the API call
    if (!isValidCoordinate(lat, lng)) {
      setAddress("Invalid coordinates");
      return;
    }
    
    setIsLoadingAddress(true);
    setAddress("");
    
    // Format coordinates to 6 decimal places to avoid precision issues
    const formattedLng = parseFloat(lng.toFixed(6));
    const formattedLat = parseFloat(lat.toFixed(6));
    let addressFound = false;
    
    // Try French API if coordinates are within France's bounds
    if (isWithinFranceBounds(formattedLat, formattedLng)) {
      try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${formattedLng}&lat=${formattedLat}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.features && data.features.length > 0 && data.features[0].properties && data.features[0].properties.label) {
            setAddress(data.features[0].properties.label);
            addressFound = true;
          }
        }
      } catch (_) {
        // Silent catch - we'll try OpenStreetMap
      }
    }
    
    // If French API didn't work, try OpenStreetMap
    if (!addressFound) {
      try {
        const osmResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${formattedLat}&lon=${formattedLng}&zoom=18&addressdetails=1`
        );
        
        if (osmResponse.ok) {
          const osmData = await osmResponse.json();
          
          if (osmData && osmData.display_name) {
            // Format the address to be more readable
            const formattedAddress = osmData.display_name.split(",").slice(0, 3).join(", ");
            setAddress(formattedAddress);
            addressFound = true;
          }
        }
      } catch (_) {
        // Silent catch - we've tried all options
      }
    }
    
    // If both APIs failed, show a generic message
    if (!addressFound) {
      setAddress("No address found for these coordinates");
    }
    
    // Always clean up loading state
    setIsLoadingAddress(false);
  };

  // Function to fetch address suggestions as user types
  const fetchAddressSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setIsLoadingSuggestions(true);
    setShowSuggestions(true);
    
    try {
      // Sanitize and encode the query
      const sanitizedQuery = query.trim();
      
      // Use the same API endpoint that works in testv2
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(sanitizedQuery)}&limit=5`;
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.features && data.features.length > 0) {
          setSuggestions(data.features);
        } else {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    } catch (_) {
      // Silent catch - just set empty suggestions on error
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Handle address input change with debounce
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchAddress(value);
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set a new timeout to fetch suggestions after 300ms of user stopping typing
    debounceTimeoutRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion: any) => {
    // Make sure we have the coordinates in the right format regardless of source
    let lng, lat, address;
    
    if (suggestion.geometry && suggestion.geometry.coordinates) {
      // API format from api-adresse.data.gouv.fr
      [lng, lat] = suggestion.geometry.coordinates;
      address = suggestion.properties.label;
    } else {
      // Skip suggestions with unknown format
      return;
    }
    
    setSearchAddress(address);
    setShowSuggestions(false);
    
    // Update map and marker position
    if (map.current && marker.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true
      });
      
      marker.current.setLngLat([lng, lat]);
      setCoordinates([lng, lat]);
      setAddress(address);
    }
  };

  // Function to get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    setLocationError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update map and marker position
        if (map.current && marker.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            essential: true
          });
          
          marker.current.setLngLat([longitude, latitude]);
          setCoordinates([longitude, latitude]);
          fetchAddressFromCoordinates(latitude, longitude);
        }
        
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            break;
          default:
            setLocationError('An unknown error occurred');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    if (address) {
      onAddressSelected(address, coordinates);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto py-10 bg-black bg-opacity-50">
      <div className="relative mx-auto my-8 bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Set Your Delivery Address</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Header - removed tabs and made map the only option */}
        <div className="py-3 text-center border-b border-gray-200">
          <h3 className="font-medium text-[#4CAF50] flex items-center justify-center">
            <MapPin className="h-5 w-5 mr-2" />
            Set Your Delivery Address
          </h3>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Search bar */}
          <div className="relative mb-4">
            <div className="relative">
              <div className="flex items-center w-full rounded-full px-3 py-2 bg-gray-100">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search for an address..."
                  value={searchAddress}
                  onChange={handleAddressInputChange}
                  onFocus={() => searchAddress.length >= 3 && setShowSuggestions(true)}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicking on them
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="ml-2 w-full bg-transparent border-none focus:outline-hidden text-gray-800 placeholder-gray-500"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Address Suggestions */}
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-xl rounded-lg border border-gray-200 max-h-72 overflow-y-auto">
                {isLoadingSuggestions ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-[#4CAF50] rounded-full animate-spin mr-2"></div>
                    <span>Loading suggestions...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-[#4CAF50] mr-2 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-medium text-gray-800">{suggestion.properties.label}</div>
                            {suggestion.properties.context && (
                              <div className="text-sm text-gray-500">{suggestion.properties.context}</div>
                            )}
                            {/* Percentage bar removed */}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : searchAddress.length >= 3 ? (
                  <div className="p-4 text-center">
                    <div className="text-gray-500 mb-2">No suggestions found</div>
                    <div className="text-sm text-gray-400">Try a different search term or use the map to select your location</div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Always show map view */}
          <div>
            {/* Location button */}
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={getUserLocation}
                disabled={isLocating}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-full font-medium transition-colors"
              >
                {isLocating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Finding location...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>Use my location</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Map container */}
            <div className="relative rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <div ref={mapContainer} className="w-full h-full"></div>
              {locationError && (
                <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center text-sm">
                  {locationError}
                </div>
              )}
            </div>
            
            {/* Current address display */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-start">
              <MapPin className="h-5 w-5 text-[#4CAF50] mr-2 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">Selected Address</div>
                <div className="text-gray-600 break-words">{address || 'No address selected'}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!address}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 rounded-full font-medium transition-colors"
            >
              Confirm Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionModal;
