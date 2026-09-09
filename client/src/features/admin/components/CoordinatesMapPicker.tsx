import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

function initLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
}

function MapEventsHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export interface CoordinatesMapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export function CoordinatesMapPicker({ lat, lng, onChange }: CoordinatesMapPickerProps) {
  useEffect(() => {
    initLeafletIcons();
  }, []);

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative z-10">
      <MapContainer
        center={[lat || 9.03, lng || 38.74]}
        zoom={6}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat && lng && <Marker position={[lat, lng]} />}
        <MapEventsHandler onChange={onChange} />
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[400] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-gray-700 shadow border border-gray-150">
        CLICK ON THE MAP TO SET COORDINATES
      </div>
    </div>
  );
}
