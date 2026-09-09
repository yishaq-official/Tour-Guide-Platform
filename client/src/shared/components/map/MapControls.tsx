import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * Utility component to handle map resizing when container size changes
 */
export function ResizeHandler({ isExpanded }: { isExpanded: boolean }) {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isExpanded, map]);
  return null;
}

/**
 * Component to smoothly fly to location when coordinates or trigger changes
 */
export function FlyToLocation({ lat, lng, trigger }: { lat: number; lng: number; trigger: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [lat, lng, trigger, map]);
  return null;
}
