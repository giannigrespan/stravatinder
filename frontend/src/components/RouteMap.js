import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#E05D34') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Map center updater component
const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Dark mode tile layer
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const RouteMap = ({ 
  route, 
  height = '300px',
  interactive = true,
  showMarkers = true 
}) => {
  const startPoint = route?.start_point;
  const endPoint = route?.end_point;
  const waypoints = route?.waypoints || [];

  // Calculate center and bounds
  const allPoints = [
    startPoint,
    endPoint,
    ...waypoints
  ].filter(p => p && p.lat && p.lng);

  const center = allPoints.length > 0 
    ? [allPoints[0].lat, allPoints[0].lng]
    : [42.8333, 12.8333]; // Default: Italy center

  // Create polyline path
  const polylinePath = allPoints.map(p => [p.lat, p.lng]);

  return (
    <div style={{ height, width: '100%' }} className="rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
      >
        <TileLayer url={DARK_TILE_URL} attribution={ATTRIBUTION} />
        <MapCenterUpdater center={center} />

        {/* Route polyline */}
        {polylinePath.length > 1 && (
          <Polyline 
            positions={polylinePath} 
            color="#E05D34" 
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Start marker */}
        {showMarkers && startPoint && startPoint.lat && (
          <Marker 
            position={[startPoint.lat, startPoint.lng]} 
            icon={createCustomIcon('#10B981')}
          >
            <Popup>
              <div className="text-sm">
                <strong>Partenza</strong><br />
                {startPoint.name || 'Punto di partenza'}
              </div>
            </Popup>
          </Marker>
        )}

        {/* End marker */}
        {showMarkers && endPoint && endPoint.lat && (
          <Marker 
            position={[endPoint.lat, endPoint.lng]} 
            icon={createCustomIcon('#EF4444')}
          >
            <Popup>
              <div className="text-sm">
                <strong>Arrivo</strong><br />
                {endPoint.name || 'Punto di arrivo'}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Waypoint markers */}
        {showMarkers && waypoints.map((wp, index) => (
          wp.lat && wp.lng && (
            <Marker 
              key={index}
              position={[wp.lat, wp.lng]} 
              icon={createCustomIcon('#FACC15')}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Waypoint {index + 1}</strong><br />
                  {wp.name || `Punto ${index + 1}`}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export const RouteMapPicker = ({ 
  value, 
  onChange,
  height = '300px'
}) => {
  const mapRef = useRef(null);
  const [marker, setMarker] = React.useState(value);

  const handleMapClick = (e) => {
    const newPoint = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      name: ''
    };
    setMarker(newPoint);
    onChange && onChange(newPoint);
  };

  return (
    <div style={{ height, width: '100%' }} className="rounded-xl overflow-hidden">
      <MapContainer
        ref={mapRef}
        center={marker ? [marker.lat, marker.lng] : [42.8333, 12.8333]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
      >
        <TileLayer url={DARK_TILE_URL} attribution={ATTRIBUTION} />
        <MapClickHandler onClick={handleMapClick} />
        
        {marker && marker.lat && (
          <Marker 
            position={[marker.lat, marker.lng]} 
            icon={createCustomIcon()}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newPos = e.target.getLatLng();
                const newPoint = { lat: newPos.lat, lng: newPos.lng, name: marker.name || '' };
                setMarker(newPoint);
                onChange && onChange(newPoint);
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

// Helper component for map click events
const MapClickHandler = ({ onClick }) => {
  const map = useMap();
  
  useEffect(() => {
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, onClick]);
  
  return null;
};

export const MiniRouteMap = ({ route }) => {
  return (
    <RouteMap 
      route={route} 
      height="150px" 
      interactive={false} 
      showMarkers={false}
    />
  );
};
