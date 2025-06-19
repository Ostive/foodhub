/**
 * Geocoding service using the French government API (API Adresse)
 * Documentation: https://adresse.data.gouv.fr/api-doc/adresse
 */

export interface GeocodingResult {
  type: string;
  version: string;
  features: Feature[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
}

export interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    id?: string;
    name?: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    city: string;
    context: string;
    type: string;
    importance: number;
    street?: string;
  };
}

/**
 * Geocode an address using the French government API
 * @param address The address to geocode
 * @returns A promise that resolves to the geocoding result with coordinates
 */
export async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address);
    
    // Make request to the API Adresse
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodedAddress}&limit=1`);
    
    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }
    
    const data: GeocodingResult = await response.json();
    
    // Check if we have results
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].geometry.coordinates;
      return { latitude, longitude };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}
