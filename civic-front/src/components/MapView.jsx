// src/components/MapView.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon path (Leaflet + CRA)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function MapView({ issues, onMarkerClick }) {
  // choose center: first issue coords or fallback
  const first = issues && issues.find((i) => i.coords && i.coords.coordinates);
  const center = first
    ? [first.coords.coordinates[1], first.coords.coordinates[0]]
    : [12.97, 77.59]; // fallback to some default (adjust to your city)

  // Only show markers with coords
  const markers = (issues || []).filter((i) => i.coords && i.coords.coordinates);

  return (
    <div style={{ height: 500, width: "100%", marginBottom: 16 }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          // OpenStreetMap tiles (no API key)
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        {markers.map((issue) => {
          const [lng, lat] = issue.coords.coordinates;
          return (
            <Marker
              key={issue._id}
              position={[lat, lng]}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(issue),
              }}
            >
              <Popup>
                <div style={{ maxWidth: 220 }}>
                  <strong>{issue.title}</strong>
                  <div style={{ fontSize: 12, color: "#333" }}>{issue.category}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{issue.location}</div>
                  <div style={{ marginTop: 6 }}>
                    <em>{issue.status}</em>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
