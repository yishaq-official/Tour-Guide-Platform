import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2, MapPin, Layers, Navigation, Crosshair, Satellite } from 'lucide-react';

// Fix for default marker icons in React Leaflet with Vite
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Custom marker icon with clear visibility
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container">
        <div class="marker-pulse"></div>
        <div class="marker-main">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 23C7 16 3 11.5 3 7.5C3 3.5 7 0 12 0C17 0 21 3.5 21 7.5C21 11.5 17 16 12 23Z" fill="#F59E0B" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="7.5" r="3" fill="white"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48],
  });
};

// Utility component to handle map resizing when container size changes
function ResizeHandler({ isExpanded }: { isExpanded: boolean }) {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isExpanded, map]);
  return null;
}

// Component to fly to location when coordinates change
function FlyToLocation({ lat, lng, trigger }: { lat: number; lng: number; trigger: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [lat, lng, trigger, map]);
  return null;
}

export function MapWidget({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [flyTrigger, setFlyTrigger] = useState(0);

  useEffect(() => {
    (async () => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
      });
    })();
  }, []);

  const handleReturnToLocation = () => {
    setFlyTrigger(prev => prev + 1);
  };

  const wrapperClasses = isExpanded
    ? "fixed inset-0 z-[1000] w-full h-full bg-white shadow-2xl"
    : "relative w-full h-72 md:h-96 rounded-3xl overflow-hidden shadow-xl border border-amber-100/50 group";

  return (
    <div className={wrapperClasses}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={16} 
        scrollWheelZoom={isExpanded}
        zoomControl={false}
        className="w-full h-full"
      >
        <ResizeHandler isExpanded={isExpanded} />
        <FlyToLocation lat={lat} lng={lng} trigger={flyTrigger} />
        <ZoomControl position="bottomright" />
        
        {/* Default to Satellite view for clarity */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer 
            checked 
            name="Satellite"
          >
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer 
            name="Street Map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        <Marker 
          position={[lat, lng]} 
          icon={createCustomIcon()}
        >
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-gray-900">{name}</span>
              </div>
              <div className="text-xs text-gray-500">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Clickable location badge - top left */}
      <button
        onClick={handleReturnToLocation}
        className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group/badge cursor-pointer max-w-[calc(100%-120px)]"
        title="Click to return to location"
      >
        <MapPin className="w-4 h-4 text-amber-600 group-hover/badge:scale-110 transition-transform duration-300 shrink-0" />
        <span className="text-sm font-medium text-gray-700 group-hover/badge:text-amber-700 truncate transition-colors">
          {name}
        </span>
        <Crosshair className="w-3.5 h-3.5 text-gray-400 group-hover/badge:text-amber-600 opacity-0 group-hover/badge:opacity-100 transition-all duration-300 shrink-0" />
      </button>

      {/* Satellite indicator - top right */}
      <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-amber-100 pointer-events-none flex items-center gap-1.5">
        <Satellite className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-medium text-gray-600 hidden sm:inline">Satellite</span>
      </div>

      {/* Toggle Button - bottom right with extra margin */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute bottom-8 right-4 z-[500] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-amber-100 text-gray-700 hover:text-amber-600 hover:bg-amber-50 hover:shadow-xl transition-all duration-300 flex items-center justify-center group/btn"
        title={isExpanded ? "Minimize map" : "Maximize map"}
      >
        {isExpanded ? (
          <Minimize2 className="w-5 h-5 group-hover/btn:scale-90 transition-transform duration-300" />
        ) : (
          <Maximize2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
        )}
        <span className="ml-2 text-sm font-medium hidden sm:inline">
          {isExpanded ? 'Minimize' : 'Expand'}
        </span>
      </button>

      {/* Return to location button (expanded mode) - bottom left */}
      {isExpanded && (
        <button
          onClick={handleReturnToLocation}
          className="absolute bottom-8 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group/return"
          title="Return to exact location"
        >
          <Navigation className="w-5 h-5 text-amber-600 group-hover/return:rotate-45 transition-transform duration-300" />
          <span className="text-sm font-medium text-gray-700 group-hover/return:text-amber-700">
            Return to Location
          </span>
        </button>
      )}

      {/* Coordinates badge - top right when expanded */}
      {isExpanded && (
        <div className="absolute top-6 right-6 z-[400] bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-amber-100 pointer-events-none">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-mono text-gray-600">
              {lat.toFixed(4)}°, {lng.toFixed(4)}°
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.custom-marker) {
          position: relative;
          width: 36px;
          height: 48px;
        }
        
        :global(.marker-container) {
          position: relative;
          width: 36px;
          height: 48px;
          cursor: pointer;
        }
        
        :global(.marker-main) {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
          animation: bounce 2s infinite;
        }
        
        :global(.marker-main svg) {
          display: block;
          width: 36px;
          height: 36px;
          margin: 0 auto;
        }
        
        :global(.marker-pulse) {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: rgba(245, 158, 11, 0.5);
          border-radius: 50%;
          animation: pulse 2s infinite;
          z-index: 1;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: translateX(-50%) scale(0.5);
            opacity: 0.7;
          }
          100% {
            transform: translateX(-50%) scale(2.5);
            opacity: 0;
          }
        }
        
        :global(.leaflet-popup-content-wrapper) {
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        :global(.leaflet-popup-content) {
          margin: 12px 16px;
        }
        
        :global(.leaflet-control-layers) {
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(251, 191, 36, 0.3) !important;
        }
        
        :global(.leaflet-control-layers-toggle) {
          width: 36px !important;
          height: 36px !important;
        }
        
        :global(.leaflet-bar) {
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(251, 191, 36, 0.3) !important;
        }
        
        :global(.leaflet-bar a) {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          transition: all 0.3s ease;
        }
        
        :global(.leaflet-bar a:hover) {
          background: #fef3c7 !important;
          color: #f59e0b !important;
        }
        
        :global(.leaflet-control-zoom) {
          margin-bottom: 80px !important;
        }
        
        :global(.leaflet-control-attribution) {
          margin-bottom: 80px !important;
          margin-right: 4px !important;
          font-size: 10px !important;
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(4px) !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          max-width: calc(100% - 80px) !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
      `}</style>
    </div>
  );
}