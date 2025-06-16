"use client";

import { useState, useEffect, useRef } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from "lucide-react";
import CustomerNavbar from "../_components/CustomerNavbar";

export default function CoordinateMapPage() {
  // Map related refs and state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  // Centered on Paris, France
  const [coordinates, setCoordinates] = useState<[number, number]>([2.3522, 48.8566]);
  const [zoom, setZoom] = useState(13);
  const [copySuccess, setCopySuccess] = useState("");
  const [copyAddressSuccess, setCopyAddressSuccess] = useState("");
  const [address, setAddress] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [ignAddress, setIgnAddress] = useState<string>("");
  const [isLoadingIgnAddress, setIsLoadingIgnAddress] = useState(false);
  const [copyIgnAddressSuccess, setCopyIgnAddressSuccess] = useState("");
  
  // Address search related state
  const [searchAddress, setSearchAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fetch address when coordinates change or on initial load
  useEffect(() => {
    // Fetch the address for the current coordinates
    fetchAddressFromCoordinates(coordinates[1], coordinates[0]);
  }, [coordinates]);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return; // wait for container to be available
    
    try {
      // Initialize map
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: coordinates,
        zoom: zoom
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
      
      // Update zoom state when map is zoomed
      map.current.on('zoom', () => {
        if (map.current) {
          setZoom(map.current.getZoom());
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
  }, []);
  
  // Function to fetch address from coordinates using OpenStreetMap Nominatim API
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    fetchIgnAddress(lat, lng);
    setIsLoadingAddress(true);
    setAddress("");
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress("No address found for this location");
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress("Failed to fetch address information");
    } finally {
      setIsLoadingAddress(false);
    }
  };
  
  // Function to copy coordinates to clipboard
  const copyCoordinates = () => {
    const coordString = `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
    navigator.clipboard.writeText(coordString)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch(err => {
        console.error('Failed to copy coordinates: ', err);
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };
  
  // Function to copy address to clipboard
  const copyAddress = () => {
    if (!address) return;
    
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopyAddressSuccess("Copied!");
        setTimeout(() => setCopyAddressSuccess(""), 2000);
      })
      .catch(err => {
        console.error('Failed to copy address: ', err);
        setCopyAddressSuccess("Failed to copy");
        setTimeout(() => setCopyAddressSuccess(""), 2000);
      });
  };
  
  // Function to fetch address from coordinates using DataGouv (api-adresse.data.gouv.fr) API
  const fetchIgnAddress = async (lat: number, lng: number) => {
    // Validate coordinates before making the API call
    if (!isValidCoordinate(lat, lng)) {
      setIgnAddress("Invalid coordinates for French territory");
      return;
    }
    
    setIsLoadingIgnAddress(true);
    setIgnAddress("");
    
    try {
      // Format coordinates to 6 decimal places to avoid precision issues
      const formattedLng = parseFloat(lng.toFixed(6));
      const formattedLat = parseFloat(lat.toFixed(6));
      
      // Check if coordinates are within reasonable bounds for France
      if (!isWithinFranceBounds(formattedLat, formattedLng)) {
        setIgnAddress("Location outside of French territory");
        setIsLoadingIgnAddress(false);
        return;
      }
      
      const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${formattedLng}&lat=${formattedLat}`);
      
      if (response.status === 400) {
        // Handle 400 Bad Request specifically
        setIgnAddress("Location not supported by French geocoding service");
        setIsLoadingIgnAddress(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`DataGouv Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.features && data.features.length > 0 && data.features[0].properties && data.features[0].properties.label) {
        setIgnAddress(data.features[0].properties.label);
      } else {
        setIgnAddress("No address found (DataGouv)");
      }
    } catch (error) {
      console.error('Error fetching DataGouv address:', error);
      setIgnAddress("Failed to fetch DataGouv address");
    } finally {
      setIsLoadingIgnAddress(false);
    }
  };

  // Function to copy IGN address to clipboard
  const copyIgnAddress = () => {
    if (!ignAddress) return;
    navigator.clipboard.writeText(ignAddress)
      .then(() => {
        setCopyIgnAddressSuccess("Copied!");
        setTimeout(() => setCopyIgnAddressSuccess(""), 2000);
      })
      .catch(err => {
        console.error('Failed to copy IGN address: ', err);
        setCopyIgnAddressSuccess("Failed to copy");
        setTimeout(() => setCopyIgnAddressSuccess(""), 2000);
      });
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
      
      // Use the same API endpoint that works in fetchIgnAddress
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
    }
  };
  
  // Function to search for an address and get coordinates (forward geocoding)
  const searchForAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAddress.trim()) return;
    setShowSuggestions(false);
    
    setIsSearching(true);
    setSearchError("");
    
    try {
      // Use the French government's API for forward geocoding
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(searchAddress)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.features && data.features.length > 0) {
        const firstResult = data.features[0];
        const [lng, lat] = firstResult.geometry.coordinates;
        
        // Update map and marker position
        if (map.current && marker.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 15,
            essential: true
          });
          
          marker.current.setLngLat([lng, lat]);
          setCoordinates([lng, lat]);
          // The reverse geocoding will be triggered by the coordinates change
        }
      } else {
        setSearchError("No results found for this address");
      }
    } catch (error) {
      console.error('Error searching for address:', error);
      setSearchError("Failed to search for address");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Map Coordinate Test</h1>
        
        {/* Address Search Form */}
        <div className="bg-white rounded-xl shadow-xs p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search Address</h2>
          <form onSubmit={searchForAddress} className="space-y-4">
            <div className="relative">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Enter an address to find its location
              </label>
              <input
                type="text"
                id="address"
                value={searchAddress}
                onChange={handleAddressInputChange}
                onFocus={() => searchAddress.length >= 3 && setShowSuggestions(true)}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking on them
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder="e.g. 15 rue de Rivoli, Paris"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-hidden transition-colors"
                disabled={isSearching}
                autoComplete="off"
              />
              
              {/* Address Suggestions */}
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="p-3 text-center text-gray-500">
                      <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-[#4CAF50] rounded-full animate-spin mr-2"></div>
                      Loading suggestions...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul>
                      {/* Rendering address suggestions */}
                      {suggestions.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <div className="font-medium text-gray-800">{suggestion.properties.label}</div>
                          {suggestion.properties.context && (
                            <div className="text-sm text-gray-500">{suggestion.properties.context}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : searchAddress.length >= 3 ? (
                    <div className="p-3 text-center text-gray-500">No suggestions found</div>
                  ) : null}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSearching || !searchAddress.trim()}
              className="w-full bg-[#4CAF50] hover:bg-[#388E3C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isSearching ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                "Find Location"
              )}
            </button>
            
            {searchError && (
              <div className="text-red-500 text-sm mt-2">{searchError}</div>
            )}
          </form>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xs p-4 mb-4">
              <div 
                ref={mapContainer} 
                className="w-full h-[500px] rounded-lg overflow-hidden" 
              />
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Click anywhere on the map or drag the marker to set a location and view its coordinates.
            </p>
          </div>
          
          {/* Coordinate Display */}
          <div>
            <div className="bg-white rounded-xl shadow-xs p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 text-[#4CAF50] mr-2" />
                Pin Coordinates
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Latitude</h3>
                  <p className="text-2xl font-mono">{coordinates[1].toFixed(6)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Longitude</h3>
                  <p className="text-2xl font-mono">{coordinates[0].toFixed(6)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Current Zoom Level</h3>
                  <p className="text-lg font-mono">{zoom.toFixed(2)}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={copyCoordinates}
                    className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {copySuccess || "Copy Coordinates"}
                  </button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Formatted Coordinate String</h3>
                  <p className="font-mono text-sm break-all">
                    {`${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`}
                  </p>
                </div>
                
                {/* Address from OpenStreetMap Reverse Geocoding */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Address (OpenStreetMap)</h3>
                  {isLoadingAddress ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-600">Loading address...</p>
                    </div>
                  ) : address ? (
                    <>
                      <p className="text-sm text-gray-700 mb-3">{address}</p>
                      <button
                        onClick={copyAddress}
                        className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        {copyAddressSuccess || "Copy Address"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Click on the map to see the address</p>
                  )}
                </div>

                {/* Address from IGN (French GeoPlateforme) Reverse Geocoding */}
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Adresse (IGN France)</h3>
                  {isLoadingIgnAddress ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-blue-600">Chargement de l'adresse...</p>
                    </div>
                  ) : ignAddress ? (
                    <>
                      <p className="text-sm text-blue-700 mb-3">{ignAddress}</p>
                      <button
                        onClick={copyIgnAddress}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        {copyIgnAddressSuccess || "Copier l'adresse (IGN)"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-blue-500">Cliquez sur la carte pour voir l'adresse</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
