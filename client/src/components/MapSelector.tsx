import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

// Fix for default marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface MapSelectorProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

// Component to handle map clicks
function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  latitude,
  longitude,
  onLocationSelect,
  className = "",
}) => {
  // Default ke Jayapura, Papua jika tidak ada koordinat
  const defaultCenter: [number, number] = [-2.5489, 140.7182];
  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    latitude && longitude ? [latitude, longitude] : defaultCenter
  );

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Handle position change
  useEffect(() => {
    if (position) {
      onLocationSelect(position[0], position[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]); // Only trigger when position changes, not when onLocationSelect changes

  // Get current GPS location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        setMapCenter(newPos);
        setGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Tidak dapat mengambil lokasi GPS. Pastikan izin lokasi diaktifkan."
        );
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline h-4 w-4 mr-1" />
          Lokasi GPS (Klik pada peta atau gunakan GPS)
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={gettingLocation}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Navigation
            className={`h-4 w-4 mr-1 ${gettingLocation ? "animate-spin" : ""}`}
          />
          {gettingLocation ? "Mendapatkan..." : "Gunakan GPS Saya"}
        </button>
      </div>

      {/* Coordinate Display */}
      {position && (
        <div className="flex gap-4 text-sm bg-blue-50 p-3 rounded-md">
          <div>
            <span className="font-medium text-gray-700">Latitude:</span>
            <span className="ml-2 text-blue-700 font-mono">
              {position[0].toFixed(6)}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Longitude:</span>
            <span className="ml-2 text-blue-700 font-mono">
              {position[1].toFixed(6)}
            </span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        className="rounded-lg overflow-hidden border-2 border-gray-300 shadow-md"
        style={{ height: "400px" }}
      >
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <LayersControl position="topright">
            {/* OpenStreetMap Layer */}
            <LayersControl.BaseLayer checked name="Peta Vector (OpenStreetMap)">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            {/* Satellite Layer (Esri World Imagery) */}
            <LayersControl.BaseLayer name="Peta Satelit (Esri)">
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>

            {/* Topo Map Layer */}
            <LayersControl.BaseLayer name="Peta Topografi">
              <TileLayer
                attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            {/* Hybrid Layer (Satellite + Labels) */}
            <LayersControl.BaseLayer name="Peta Hybrid (Satelit + Label)">
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                opacity={0.4}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      <p className="text-xs text-gray-500 italic">
        💡 Klik pada peta untuk memilih lokasi, atau gunakan tombol "Gunakan GPS
        Saya" untuk mendapatkan lokasi saat ini. Anda dapat mengubah layer peta
        menggunakan kontrol di kanan atas.
      </p>
    </div>
  );
};

export default MapSelector;
