import { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const STATUS_STEPS = [
  { key: "requested",  label: "Request Sent",       icon: "✅" },
  { key: "assigned",   label: "Ambulance Assigned",  icon: "🚑" },
  { key: "on_the_way", label: "On the Way",          icon: "🚦" },
  { key: "reached",    label: "Reached",             icon: "🏥" },
];

export default function AmbulanceTracker({ location }) {
  const [ambStatus, setAmbStatus]   = useState("idle"); // idle | loading | assigned
  const [ambData, setAmbData]       = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate status progression after assignment
  useEffect(() => {
    if (ambStatus !== "assigned") return;
    if (currentStep >= STATUS_STEPS.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, 3000); // advance every 3 seconds

    return () => clearTimeout(timer);
  }, [ambStatus, currentStep]);

  const requestAmbulance = async () => {
    setAmbStatus("loading");
    try {
      const { data } = await api.post("/ambulance/request", {
        location: location || { lat: 12.9716, lng: 77.5946 },
      });
      setAmbData(data);
      setAmbStatus("assigned");
      setCurrentStep(0);
      toast.success(`Ambulance ${data.ambulanceId} assigned!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
      setAmbStatus("idle");
    }
  };

  const reset = () => {
    setAmbStatus("idle");
    setAmbData(null);
    setCurrentStep(0);
  };

  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 space-y-4">
      <p className="text-red-400 font-bold text-base">🚑 Ambulance Service</p>

      {/* Idle */}
      {ambStatus === "idle" && (
        <button
          onClick={requestAmbulance}
          className="w-full rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 transition-all py-3 text-white font-bold text-sm"
        >
          🚑 Request Ambulance
        </button>
      )}

      {/* Loading */}
      {ambStatus === "loading" && (
        <div className="text-center py-4">
          <div className="inline-block w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-slate-300 text-sm">Finding nearest ambulance…</p>
        </div>
      )}

      {/* Assigned */}
      {ambStatus === "assigned" && ambData && (
        <div className="space-y-4">

          {/* Ambulance Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Ambulance ID</p>
              <p className="text-white font-bold text-sm">{ambData.ambulanceId}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Distance</p>
              <p className="text-orange-400 font-bold text-sm">{ambData.distance} km</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">ETA</p>
              <p className="text-green-400 font-bold text-sm">{ambData.eta} mins</p>
            </div>
          </div>

          {/* Driver message */}
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
            <p className="text-blue-300 text-sm">🧑‍✈️ Driver is on the way from <span className="text-white font-semibold">{ambData.location}</span></p>
          </div>

          {/* Status Timeline */}
          <div className="space-y-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Status Timeline</p>
            {STATUS_STEPS.map((step, idx) => (
              <div key={step.key} className="flex items-center gap-3">
                {/* Circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all ${
                  idx <= currentStep
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-slate-500"
                }`}>
                  {idx <= currentStep ? step.icon : "○"}
                </div>
                {/* Label */}
                <p className={`text-sm transition-all ${
                  idx === currentStep
                    ? "text-white font-bold"
                    : idx < currentStep
                    ? "text-green-400"
                    : "text-slate-500"
                }`}>
                  {step.label}
                  {idx === currentStep && (
                    <span className="ml-2 text-xs text-yellow-400 animate-pulse">● Live</span>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${((currentStep + 1) / STATUS_STEPS.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-right">
            {Math.round(((currentStep + 1) / STATUS_STEPS.length) * 100)}% complete
          </p>

          <button onClick={reset} className="w-full rounded-xl bg-slate-700 hover:bg-slate-600 py-2 text-sm text-slate-200">
            🔄 Cancel / Reset
          </button>
        </div>
      )}
    </div>
  );
}