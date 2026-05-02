import { useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import MapPanel from "../components/MapPanel";

const types = ["medical", "fire", "crime", "accident", "women_safety", "natural_disaster"];

export default function SOSPage() {
  const [emergencyType, setEmergencyType] = useState("medical");
  const [silentMode, setSilentMode] = useState(false);
  const [status, setStatus] = useState("");
  const [position, setPosition] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const sendSOS = async () => {
    navigator.geolocation.getCurrentPosition(
      async (geo) => {
        const { latitude, longitude } = geo.coords;
        setPosition([latitude, longitude]);
        const { data } = await api.post("/sos/create", {
          emergencyType,
          silentMode,
          evidenceUrl,
          locationName: "Current GPS",
          location: { lat: latitude, lng: longitude, address: "Live GPS" }
        });
        setStatus(data.status);
        toast.success("SOS alert dispatched");
      },
      () => toast.error("Location permission required")
    );
  };

  const uploadEvidence = async () => {
    if (!evidence) return;
    const fd = new FormData();
    fd.append("file", evidence);
    const { data } = await api.post("/sos/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    setEvidenceUrl(data.url);
    toast.success("Evidence uploaded");
  };

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-4xl font-bold">SOS Emergency</h1>
      <button onClick={sendSOS} className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-red-600 text-4xl font-black shadow-2xl">
        SOS
      </button>
      <div className="mx-auto max-w-xl glass rounded-xl p-4">
        <select className="w-full rounded-lg bg-white/10 p-2" value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)}>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
        <label className="mt-3 block text-left">
          <input type="checkbox" checked={silentMode} onChange={(e) => setSilentMode(e.target.checked)} /> Silent emergency mode
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          className="mt-3 w-full rounded-lg bg-white/10 p-2"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setEvidence(file || null);
            if (file?.type.startsWith("image/")) setEvidencePreview(URL.createObjectURL(file));
          }}
        />
        <button onClick={uploadEvidence} className="mt-3 rounded-lg bg-white px-3 py-2 text-slate-900">Upload Evidence</button>
        {evidencePreview && <img src={evidencePreview} alt="evidence preview" className="mt-3 max-h-44 rounded-lg object-cover" />}
        <p className="mt-3 text-sm text-slate-300">Timeline: Alert Sent → Responder Assigned → Help On The Way → Resolved</p>
      </div>
      {position && <MapPanel center={position} markers={[{ id: "me", lat: position[0], lng: position[1], label: "Your live location" }]} />}
      {status && <p className="text-brand-success">Current status: {status}</p>}
    </div>
  );
}
