import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

/**
 * Ensures Leaflet's default marker icons are properly resolved in Vite
 */
export function initLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
}

/**
 * Creates custom animated marker icon with pulse effect
 */
export const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-marker",
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
