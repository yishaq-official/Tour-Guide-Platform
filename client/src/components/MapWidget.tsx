import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2 } from 'lucide-react';

// Fix for default marker icons in React Leaflet with Vite
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Utility component to handle map resizing when container size changes
function ResizeHandler({ isExpanded }: { isExpanded: boolean }) {
  const map = useMap();
  useEffect(() => {
    // Invalidate size after a short delay to allow CSS to apply
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 50);
    return () => clearTimeout(timeout);
  }, [isExpanded, map]);
  return null;
}

export function MapWidget({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      // Fix leaflet's default icon path issues with bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
      });
    })();
  }, []);

  const wrapperClasses = isExpanded
    ? "fixed inset-0 z-[100] w-full h-full bg-white"
    : "relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm border border-gray-100 z-0";

  return (
    <div className={wrapperClasses}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={13} 
        scrollWheelZoom={isExpanded} // Only allow scroll zoom when expanded
        className="w-full h-full"
      >
        <ResizeHandler isExpanded={isExpanded} />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        <Marker position={[lat, lng]}>
          <Popup>
            <span className="font-semibold">{name}</span>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute bottom-6 left-6 z-[400] bg-white p-2.5 rounded-xl shadow-lg border border-gray-200 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-all flex items-center justify-center group"
        title={isExpanded ? "Minimize map" : "Maximize map"}
      >
        {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
