import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    language: "en",
    emergencyContacts: []
  });
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    api.get("/auth/profile").then((r) => setProfile(r.data)).catch(() => {});
  }, []);

  const save = async () => {
    try {
      const { data } = await api.put("/auth/profile", profile);
      setProfile(data);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setProfile({
      ...profile,
      emergencyContacts: [...(profile.emergencyContacts || []), newContact]
    });
    setNewContact({ name: "", phone: "" });
    setShowAddContact(false);
  };

  const removeContact = (index) => {
    const updated = profile.emergencyContacts.filter((_, i) => i !== index);
    setProfile({ ...profile, emergencyContacts: updated });
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* User Info */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-xl font-bold">{user?.name}</p>
            <p className="text-slate-300">{user?.email}</p>
            {user?.role === "admin" && (
              <span className="mt-1 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-semibold">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div>
          <p className="text-lg font-bold">Contact details</p>
          <p className="text-sm text-slate-400">Used by responders during emergencies.</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-300">Mobile number</label>
            <input
              className="mt-1 w-full rounded-lg bg-white/10 p-2"
              value={profile.mobile || ""}
              placeholder="+91 ..."
              onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Address</label>
            <textarea
              className="mt-1 w-full rounded-lg bg-white/10 p-2"
              value={profile.address || ""}
              placeholder="Your address"
              rows={3}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Preferred language</label>
            <select
              className="mt-1 w-full rounded-lg bg-white/10 p-2"
              value={profile.language || "en"}
              onChange={(e) => setProfile({ ...profile, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold">Emergency contacts</p>
            <p className="text-sm text-slate-400">People we'll notify in case of an SOS alert.</p>
          </div>
          <button
            onClick={() => setShowAddContact(!showAddContact)}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm"
          >
            + Add
          </button>
        </div>

        {showAddContact && (
          <div className="glass rounded-xl p-4 space-y-2">
            <input
              className="w-full rounded-lg bg-white/10 p-2"
              placeholder="Contact name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <input
              className="w-full rounded-lg bg-white/10 p-2"
              placeholder="Phone number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <button onClick={addContact} className="w-full rounded-lg bg-blue-600 px-4 py-2">
              Add Contact
            </button>
          </div>
        )}

        {(!profile.emergencyContacts || profile.emergencyContacts.length === 0) ? (
          <p className="text-slate-400">No emergency contacts added yet.</p>
        ) : (
          profile.emergencyContacts.map((c, i) => (
            <div key={i} className="glass rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-slate-300">{c.phone}</p>
              </div>
              <button onClick={() => removeContact(i)} className="text-red-400 text-sm">Remove</button>
            </div>
          ))
        )}
      </div>

      {/* Save Button */}
      <button onClick={save} className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white">
        Save changes
      </button>

      {/* Logout */}
      <div className="glass rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-slate-300">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm text-red-400"
        >
          → Log out
        </button>
      </div>
    </div>
  );
}