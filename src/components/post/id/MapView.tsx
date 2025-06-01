"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({
  lat,
  lng,
  shop,
}: {
  lat: number;
  lng: number;
  shop: string;
}) {
  if (!lat || !lng) return null;
  return (
    <div
      style={{
        height: 240,
        width: "100%",
        margin: "16px 0",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]}>
          <Popup>{shop}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
