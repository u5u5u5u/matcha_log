"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapView.module.scss";

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
    <div className={styles.container}>
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        className={styles.map}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]}>
          <Popup>{shop}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
