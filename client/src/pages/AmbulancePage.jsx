import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import MapPanel from "../components/MapPanel";
import SkeletonCard from "../components/SkeletonCard";

export default function AmbulancePage() {
  const [nearby, setNearby] = useState([]);
  const [services, setServices] = useState(null);
  const [booking, setBooking] = useState(null);
  const [pickup, setPickup] = useState("Current Location");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/ambulance/nearby"), api.get("/ambulance/nearby-services")])
      .then(([a, s]) => {
        setNearby(a.data);
        setServices(s.data);
      })
      .catch(() => toast.error("Failed to load ambulance data"))
      .finally(() => setLoading(false));
  }, []);

  const book = async () => {
    const { data } = await api.post("/ambulance/book", {
      pickup: { address: pickup, lat: 13.0827, lng: 80.2707 },
      destination: { address: "Optional destination", lat: 13.095, lng: 80.289 }
    });
    setBooking(data);
    toast.success("Ambulance booked successfully");
  };

  const mapMarkers = useMemo(() => {
    const fromAmbulance = nearby.slice(0, 5).map((a) => ({
      id: a._id,
      lat: a.location?.lat || 13.0827 + Math.random() * 0.02,
      lng: a.location?.lng || 80.2707 + Math.random() * 0.02,
      label: `${a.driverName} (${a.vehicleNumber})`
    }));
    const fromServices =
      services
        ? [...services.hospitals, ...services.policeStations, ...services.fireStations].map((s, idx) => ({
            id: `svc-${idx}`,
            lat: s.lat,
            lng: s.lng,
            label: s.name
          }))
        : [];
    return fromAmbulance.concat(fromServices);
  }, [nearby, services]);

  const bookingPolyline = useMemo(() => {
    if (!booking?.routePolyline) return [];
    return booking.routePolyline
      .split(";")
      .map((pair) => pair.split(",").map(Number))
      .filter((arr) => arr.length === 2 && !Number.isNaN(arr[0]) && !Number.isNaN(arr[1]));
  }, [booking]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Ambulance Booking + Live Tracking</h1>
      <div className="glass rounded-2xl p-4">
        <p>Workflow: Enter Location → Find Nearest Ambulance → Confirm Booking → Track Live</p>
        <input className="mt-3 w-full rounded-lg bg-white/10 p-2" value={pickup} onChange={(e) => setPickup(e.target.value)} />
        <button onClick={book} className="mt-3 rounded-lg bg-brand-success px-4 py-2">Book Ambulance</button>
      </div>
      <MapPanel
        center={bookingPolyline[0] || [13.0827, 80.2707]}
        markers={mapMarkers}
        polyline={bookingPolyline.length > 1 ? bookingPolyline : [[13.0827, 80.2707], [13.09, 80.285]]}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {loading && [1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}
        {!loading && nearby.map((a) => (
          <div key={a._id} className="glass rounded-xl p-4">
            <p className="font-semibold">{a.driverName}</p>
            <p>{a.vehicleNumber}</p>
            <p>ETA: {a.etaMinutes} min</p>
            <p>Distance: {a.distanceKm} km</p>
            <p>Estimate: Rs. {a.priceEstimate}</p>
          </div>
        ))}
      </div>
      {booking && (
        <div className="glass rounded-2xl p-4">
          <p className="font-semibold">Booking Status: {booking.status}</p>
          <p>Live map marker and route line shown above with predicted ETA.</p>
        </div>
      )}
    </div>
  );
}
