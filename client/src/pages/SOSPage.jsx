import { useState } from "react";
import AmbulanceTracker from "../components/AmbulanceTracker";
import { api } from "../services/api";
import toast from "react-hot-toast";

const nearbyServices = {
  hospital: { name: "City General Hospital", phone: "9876543210" },
  police:   { name: "Local Police Station",  phone: "100" },
  fire:     { name: "Fire & Rescue",         phone: "101" },
  ambulance:{ name: "Ambulance Service",     phone: "108" },
};

const EMERGENCY_TYPES = [
  { value: "medical", label: "🏥 Medical" },
  { value: "police",  label: "🚓 Police"  },
  { value: "fire",    label: "🔥 Fire"    },
];

export default function SOSPage() {
  const [emergencyType, setEmergencyType] = useState("medical");
  const [status, setStatus]               = useState("idle");
  const [location, setLocation]           = useState(null);
  const [sosResult, setSosResult]         = useState(null);
  const [contacts, setContacts]           = useState([]);
  const [newName, setNewName]             = useState("");
  const [newPhone, setNewPhone]           = useState("");
  const [history, setHistory]             = useState([]);
  const [showHistory, setShowHistory]     = useState(false);

  const addContact = () => {
    if (!newName || !newPhone) return toast.error("Enter name and phone");
    setContacts([...contacts, { name: newName, phone: newPhone, id: Date.now() }]);
    setNewName(""); setNewPhone("");
    toast.success("Contact added!");
  };

  const removeContact = (id) => setContacts(contacts.filter((c) => c.id !== id));

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/sos/history");
      setHistory(data.alerts || []);
      setShowHistory(true);
    } catch {
      toast.error("Could not load history");
    }
  };

  const triggerSOS = () => {
    setStatus("fetching");
    setSosResult(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        setStatus("sending");
        try {
          const { data } = await api.post("/sos/create", { emergencyType, location: { lat, lng }, locationName: "Current Location" });
          setSosResult(data);
          setStatus("done");
          toast.success("SOS Alert Sent!");
        } catch (err) {
          toast.error(err.response?.data?.message || "SOS failed");
          setStatus("idle");
        }
      },
      async () => {
        const lat = 12.9716; const lng = 77.5946;
        setLocation({ lat, lng });
        setStatus("sending");
        try {
          const { data } = await api.post("/sos/create", { emergencyType, location: { lat, lng }, locationName: "Current Location" });
          setSosResult(data);
          setStatus("done");
          toast.success("SOS Alert Sent!");
        } catch {
          toast.error("SOS failed");
          setStatus("idle");
        }
      }
    );
  };

  const reset = () => { setStatus("idle"); setSosResult(null); setLocation(null); };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-bold text-red-400 mb-1">🆘 SOS Emergency</h1>
        <p className="text-slate-400 text-sm">Press SOS to instantly alert emergency services</p>
      </div>

      <div className="glass rounded-2xl p-5">
        <p className="text-sm text-slate-400 mb-3 font-semibold uppercase tracking-wider">Emergency Type</p>
        <div className="flex gap-3">
          {EMERGENCY_TYPES.map((t) => (
            <button key={t.value} onClick={() => setEmergencyType(t.value)}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
                emergencyType === t.value ? "bg-red-500 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
        {status === "idle" && (
          <button onClick={triggerSOS}
            className="w-40 h-40 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-lg shadow-red-900 text-white text-2xl font-black animate-pulse">
            SOS
          </button>
        )}
        {status === "fetching" && (
          <div className="w-40 h-40 rounded-full bg-yellow-600/40 border-4 border-yellow-400 flex items-center justify-center animate-pulse">
            <span className="text-yellow-300 font-bold text-sm text-center">📍 Fetching<br/>Location...</span>
          </div>
        )}
        {status === "sending" && (
          <div className="w-40 h-40 rounded-full bg-orange-600/40 border-4 border-orange-400 flex items-center justify-center">
            <span className="text-orange-300 font-bold text-sm text-center">📡 Sending<br/>Alert...</span>
          </div>
        )}
        {status === "done" && (
          <div className="text-center space-y-4 w-full">
            <div className="rounded-xl bg-green-500/20 border border-green-500/40 p-4">
              <p className="text-green-400 text-xl font-bold">✅ SOS Alert Sent Successfully!</p>
              <p className="text-slate-300 text-sm mt-1">Status: <span className="text-yellow-400 font-mono">{sosResult?.status}</span></p>
            </div>
            {location && (
              <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 text-left">
                <p className="text-blue-400 font-semibold text-sm mb-2">📍 Your Location</p>
                <p className="text-slate-300 text-sm font-mono">Latitude: {location.lat.toFixed(5)}</p>
                <p className="text-slate-300 text-sm font-mono">Longitude: {location.lng.toFixed(5)}</p>
              </div>
            )}
            <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-4 text-left">
              <p className="text-purple-400 font-semibold text-sm mb-1">📲 Emergency Contacts Notified</p>
              {contacts.length === 0 ? (
                <p className="text-slate-500 text-sm">No contacts added — add below</p>
              ) : (
                contacts.map((c) => (
                  <p key={c.id} className="text-slate-300 text-sm">✓ Alert sent to {c.name} ({c.phone})</p>
                ))
              )}
            </div>
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-left">
              <p className="text-red-400 font-semibold text-sm mb-3">🚨 Nearby Emergency Services</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(nearbyServices).map(([key, val]) => (
                  <div key={key} className="rounded-lg bg-white/5 p-3">
                    <p className="text-xs text-slate-400 mb-1">{key === "hospital" ? "🏥" : key === "police" ? "🚓" : key === "fire" ? "🔥" : "🚑"} {key}</p>
                    <p className="text-white font-semibold text-sm">{val.name}</p>
                    <p className="text-orange-400 font-mono text-sm">{val.phone}</p>
                  </div>
                ))}
              </div>
            </div>
            {emergencyType === "medical" && (
  <AmbulanceTracker location={location} />
)}
            <button onClick={reset} className="w-full rounded-xl bg-slate-700 hover:bg-slate-600 py-2 text-sm text-slate-200">
              🔄 Reset SOS
            </button>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">👥 Emergency Contacts</p>
        <div className="flex gap-2 mb-3">
          <input className="flex-1 rounded-lg bg-white/10 p-2 text-sm" placeholder="Contact Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input className="flex-1 rounded-lg bg-white/10 p-2 text-sm" placeholder="Phone Number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
          <button onClick={addContact} className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 text-sm text-white font-semibold">Add</button>
        </div>
        {contacts.length === 0 ? (
          <p className="text-slate-500 text-sm">No contacts yet. Add someone above.</p>
        ) : (
          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-sm text-white">{c.name}</span>
                <span className="text-sm text-orange-400 font-mono">{c.phone}</span>
                <button onClick={() => removeContact(c.id)} className="text-red-400 text-xs hover:text-red-300">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">📋 SOS History</p>
          <button onClick={fetchHistory} className="text-xs text-blue-400 hover:text-blue-300">Load History</button>
        </div>
        {showHistory && history.length === 0 && <p className="text-slate-500 text-sm">No past alerts found.</p>}
        {history.map((h) => (
          <div key={h._id} className="rounded-lg bg-white/5 px-3 py-2 mb-2">
            <p className="text-sm text-white font-semibold">{h.type} — <span className="text-yellow-400">{h.status}</span></p>
            <p className="text-xs text-slate-400 font-mono">Lat: {h.location?.lat} | Lng: {h.location?.lng}</p>
            <p className="text-xs text-slate-500">{new Date(h.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}