import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    emergencyContacts: [],
    language: "en",
    darkMode: true
  });
  useEffect(() => {
    api.get("/auth/profile").then((r) => setProfile(r.data)).catch(() => {});
  }, []);
  const save = async () => {
    const { data } = await api.put("/auth/profile", profile);
    setProfile(data);
  };
  return (
    <section className="glass rounded-2xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Profile Settings</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {["name", "mobile", "email", "address"].map((key) => (
          <input
            key={key}
            className="rounded-lg bg-white/10 p-2"
            value={profile[key] || ""}
            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
            placeholder={key}
          />
        ))}
      </div>
      <button className="mt-4 rounded-lg bg-white px-4 py-2 text-slate-900" onClick={save}>Save Profile</button>
    </section>
  );
}
