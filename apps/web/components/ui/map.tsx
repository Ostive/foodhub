"use client";

import { useEffect, useRef } from "react";
import { cn } from "../lib/utils.js";

interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  latitude: number;
  longitude: number;
  zoom?: number;
  markerColor?: string;
  height?: string;
  width?: string;
}

export function Map({
  latitude,
  longitude,
  zoom = 15,
  markerColor = "#FF0000",
  height = "400px",
  width = "100%",
  className,
  ...props
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const marker = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeMap = async () => {
      // Dynamically import maplibre-gl to avoid SSR issues
      const maplibregl = (await import("maplibre-gl")).default;
      
      if (mapContainer.current && !mapInstance.current) {
        mapInstance.current = new maplibregl.Map({
          container: mapContainer.current,
          style: "https://demotiles.maplibre.org/style.json", // Free tile source
          center: [longitude, latitude],
          zoom: zoom,
        });

        // Add navigation controls
        mapInstance.current.addControl(new maplibregl.NavigationControl());

        // Add marker
        marker.current = new maplibregl.Marker({ color: markerColor })
          .setLngLat([longitude, latitude])
          .addTo(mapInstance.current);
      }
    };

    initializeMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude, zoom, markerColor]);

  return (
    <div
      ref={mapContainer}
      className={cn("relative rounded-md overflow-hidden", className)}
      style={{ height, width }}
      {...props}
    />
  );
}
