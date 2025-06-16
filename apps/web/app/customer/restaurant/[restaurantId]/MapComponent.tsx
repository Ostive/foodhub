"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
}

export default function MapComponent({
  latitude,
  longitude,
  zoom = 15,
  height = "200px"
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    if (map.current) return;
    
    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [longitude, latitude],
        zoom: zoom
      });

      // Add navigation controls
      if (map.current) {
        map.current.addControl(new maplibregl.NavigationControl());
      }

      // Add error handling
      if (map.current) {
        map.current.on('error', (e: any) => {
          console.error('Map error:', e);
        });
      }

      // Add marker
      if (map.current) {
        map.current.on('load', () => {
          console.log('Map loaded successfully');
          if (map.current) {
            new maplibregl.Marker({ color: "#4CAF50" })
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
        });
      }
    } catch (error) {
      console.error('Error creating map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className="bg-white rounded-xl shadow-xs p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
      <div 
        ref={mapContainer} 
        className="h-[200px] w-full rounded-lg overflow-hidden relative"
        style={{ height }}
      />
    </div>
  );
}
