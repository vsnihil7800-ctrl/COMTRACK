import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import MapPanel from "../components/MapPanel";
import SkeletonCard from "../components/SkeletonCard";

export default function AmbulancePage() {
  const [nearby, setNearby] = useState([]);
  const [services, setServices] = useState(null);
  const [booking, setBooking] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [pickup, setPickup] = useState("Current Location");
  const [destination, setDestination] = useState("");
  const [emergencyType, setEmergencyType] = useState("Medical");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("book");

  useEffect(() => {
    Promise.all([
      api.get("/ambulance/nearby"),
      api.get("/ambulance/nearby-services"),
      api.get("/ambulance/my")
    ])
      .then(([a, s, b]) => {
        setNearby(a.data);
        setServices(s.data);
        setMyBookings(b.data.items || []);
      })
      .catch(() => toast.error("Failed to load ambulance data"))
      .finally(() => setLoading(false));
  }, []);

  const book = async () => {
    try {
      const { data } = await api.post("/ambulance/book", {
        emergencyType,
        pickup: { address: pickup, lat: 13.0827, lng: 80.2707 },
        destination: { address: destination || "Nearest Hospital", lat: 13.095, lng: 80.289 }
      });
      setBooking(data);
      setMyBookings(prev => [data, ...prev]);
      toast.success("Ambulance booked successfully");
      setActiveTab("bookings");
    } catch {
      toast.error("Booking failed");
    }
  };

  const mapMarkers = useMemo(() => {
    const fromAmbulance = nearby.slice(0, 5).map((a) => ({
      id: a._id,
      lat: a.location?.lat || 13.0827 + Math.random() * 0.02,
      lng: a.location?.lng || 80.2707 + Math.random() * 0.02,
      label: `${a.driverName} (${a.vehicleNumber})`
    }));
    const fromServices = services
      ? [...services.hospitals, ...services.policeStations, ...services.fireStations].map((s, idx) => ({
          id: `svc-${idx}`,
          lat: s.lat,
          lng: s.lng,
          label: s.name
        }))
      : [];
    return fromAmbulance.concat(fromServices);
  }, [nearby, services]);

  const statusColor = (status) => {
    if (status === "assigned") return "bg-blue-500";
    if (status === "on_the_way") return "bg-yellow-500";
    if (status === "completed") return "bg-green-500";
    return "bg-slate-500";
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Ambulance Booking + Live Tracking</h1>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("book")}
          className={`rounded-lg px-4 py-2 font-semibold ${activeTab === "book" ? "bg-green-600 text-white" : "glass"}`}
        >
          Book Ambulance
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`rounded-lg px-4 py-2 font-semibold ${activeTab === "bookings" ? "bg-blue-600 text-white" : "glass"}`}
        >
          My Bookings ({myBookings.length})
        </button>
      </div>

      {/* Book Tab */}
      {activeTab === "book" && (
        <>
          <div className="glass rounded-2xl p-4 space-y-3">
            <select
              className="w-full rounded-lg bg-white/10 p-2"
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
            >
              {["Medical", "Accident", "Fire", "Other"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              className="w-full rounded-lg bg-white/10 p-2"
              value={pickup}
              placeholder="Pickup location"
              onChange={(e) => setPickup(e.target.value)}
            />
            <input
              className="w-full rounded-lg bg-white/10 p-2"
              value={destination}
              placeholder="Destination (optional)"
              onChange={(e) => setDestination(e.target.value)}
            />
            <button onClick={book} className="w-full rounded-lg bg-brand-success px-4 py-2 font-semibold">
              Book Ambulance
            </button>
          </div>
          <MapPanel
            center={[13.0827, 80.2707]}
            markers={mapMarkers}
            polyline={[[13.0827, 80.2707], [13.09, 80.285]]}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {loading && [1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}
            {!loading && nearby.map((a) => (
              <div key={a._id} className="glass rounded-xl p-4">
                <p className="font-semibold">{a.driverName}</p>
                <p>{a.vehicleNumber}</p>
                <p>ETA: {a.etaMinutes} min</p>
                <p>Distance: {a.distanceKm} km</p>
                <p>Estimate: ₹{a.priceEstimate}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* My Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My Bookings</h2>
            <p className="text-slate-300 text-sm">All your ambulance requests in one place</p>
          </div>
          {myBookings.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center text-slate-400">
              No bookings yet. Book your first ambulance!
            </div>
          ) : (
            myBookings.map((b) => (
              <div key={b._id} className="glass rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">{b.emergencyType}</p>
                  <span className={`${statusColor(b.status)} rounded-full px-3 py-1 text-xs font-semibold capitalize`}>
                    {b.status?.replace("_", " ")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Pickup</p>
                    <p className="font-semibold">{b.pickupAddress || b.pickup?.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Destination</p>
                    <p className="font-semibold">{b.destinationAddress || b.destination?.address}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <p className="text-sm text-slate-300">
                    {b.distanceKm} km · ETA {b.etaMinutes} min · ₹{b.priceEstimate} · {new Date(b.createdAt).toLocaleString()}
                  </p>
                  <button className="rounded-lg border border-white/20 px-4 py-2 text-sm">
                    Track →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}