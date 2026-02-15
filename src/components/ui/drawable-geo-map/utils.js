import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// German localization for leaflet-draw
export const GERMAN_DRAW_STRINGS = {
    draw: {
        handlers: {
            polygon: {
                tooltip: {
                    start: 'Klicken um mit dem Zeichnen zu beginnen.',
                    cont: 'Klicken um weitere Punkte hinzuzuf\u00FCgen.',
                    end: 'Auf den ersten Punkt klicken um das Polygon zu schlie\u00DFen.'
                }
            }
        }
    }
};

/**
 * Calculate polygon area in square meters
 */
export const calculateArea = (coordinates) => {
    if (!coordinates || coordinates.length < 3) return 0;

    const latToMeters = 111320;
    const lngToMeters = 111320 * Math.cos(47.7 * Math.PI / 180);

    let area = 0;
    const n = coordinates.length;

    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const xi = coordinates[i][1] * lngToMeters;
        const yi = coordinates[i][0] * latToMeters;
        const xj = coordinates[j][1] * lngToMeters;
        const yj = coordinates[j][0] * latToMeters;
        area += xi * yj;
        area -= xj * yi;
    }

    return Math.abs(area / 2);
};

/**
 * Format area for display
 */
export const formatArea = (areaM2) => {
    if (areaM2 >= 1000000) {
        return `${(areaM2 / 1000000).toFixed(2)} km\u00B2`;
    } else if (areaM2 >= 10000) {
        return `${(areaM2 / 10000).toFixed(2)} ha`;
    } else {
        return `${Math.round(areaM2).toLocaleString('de-DE')} m\u00B2`;
    }
};
