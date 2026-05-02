import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { socket } from "../services/socket";

export function AboutPage() {
  return <Page title="About COMTRACK" body="Built to reduce emergency response time and simplify public assistance." />;
}
export function FeaturesPage() {
  return <Page title="Features" body="Ambulance booking, complaint intelligence, SOS alerts, realtime notifications, and role-based operations." />;
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mode, setMode] = useState("link");

  const requestReset = async () => {
    await api.post("/auth/forgot-password", { email, mode });
    toast.success("Reset instructions sent");
  };
  const verifyOtp = async () => {
    await api.post("/auth/verify-otp", { email, otp });
    toast.success("OTP verified");
  };
  const reset = async () => {
    await api.post("/auth/reset-password", { email, otp: mode === "otp" ? otp : undefined, token: mode === "link" ? token : undefined, newPassword });
    toast.success("Password updated");
  };

  return (
    <section className="glass space-y-3 rounded-2xl p-6">
      <h1 className="text-3xl font-bold">Forgot Password</h1>
      <input className="w-full rounded-lg bg-white/10 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select className="w-full rounded-lg bg-white/10 p-2" value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="link">Email link</option>
        <option value="otp">OTP</option>
      </select>
      <button onClick={requestReset} className="rounded-lg bg-white px-3 py-2 text-slate-900">Send Reset</button>
      {mode === "otp" ? (
        <>
          <input className="w-full rounded-lg bg-white/10 p-2" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp} className="rounded-lg bg-slate-200 px-3 py-2 text-slate-900">Verify OTP</button>
        </>
      ) : (
        <input className="w-full rounded-lg bg-white/10 p-2" placeholder="Reset token from email link" value={token} onChange={(e) => setToken(e.target.value)} />
      )}
      <input
        type="password"
        className="w-full rounded-lg bg-white/10 p-2"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={reset} className="rounded-lg bg-brand-success px-3 py-2">Reset Password</button>
    </section>
  );
}
export function NotificationsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/notifications").then((r) => setItems(r.data)).catch(() => {});
    const onNotification = (payload) => {
      setItems((prev) => [
        {
          _id: `${Date.now()}`,
          title: payload.title || "Update",
          message: payload.message || "",
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    };
    socket.on("notification", onNotification);
    return () => socket.off("notification", onNotification);
  }, []);
  return (
    <section className="glass rounded-2xl p-6">
      <h1 className="mb-3 text-3xl font-bold">Notifications</h1>
      <div className="space-y-2">
        {items.map((x) => (
          <div key={x._id} className="rounded-xl bg-white/5 p-3">
            <p className="font-semibold">{x.title}</p>
            <p className="text-sm text-slate-300">{x.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export function Error404Page() {
  return <Page title="404" body="The page you requested does not exist." />;
}

function Page({ title, body }) {
  return (
    <section className="glass rounded-2xl p-6">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="text-slate-300">{body}</p>
    </section>
  );
}
