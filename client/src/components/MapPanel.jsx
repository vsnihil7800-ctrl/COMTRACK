import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

const defaultPos = [13.0827, 80.2707];

export default function MapPanel({ center = defaultPos, markers = [], polyline = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/20">
      <MapContainer center={center} zoom={13} className="h-72 w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
        {polyline.length > 1 && <Polyline positions={polyline} color="#22c55e" />}
      </MapContainer>
    </div>
  );
}
