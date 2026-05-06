import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import SkeletonCard from "../components/SkeletonCard";

// ── Static category → authority mapping
const contactMap = {
  garbage:       { name: "Sanitation Supervisor",      phone: "9871234560" },
  street_light:  { name: "Municipal Lighting Officer", phone: "9765432100" },
  water_leakage: { name: "Water Supply Officer",       phone: "9123456780" },
  sewage:        { name: "Drainage Inspector",         phone: "9654321098" },
  road_damage:   { name: "Road Inspector",             phone: "9876543210" },
  pothole:       { name: "Road Inspector",             phone: "9876543210" },
  electricity:   { name: "Electricity Board Officer",  phone: "9988776655" },
  public_safety: { name: "Public Safety Officer",      phone: "9432109876" },
};

export function ComplaintSubmitPage() {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    description: "",
    category: "",
    priority: "medium",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [contact, setContact] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    setForm({ ...form, category: val });
    setContact(contactMap[val] || null);
  };

  const upload = async () => {
    if (!media) return toast.error("Please select a file first");
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", media);
      const { data } = await api.post("/complaints/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadUrl(data.url);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.description) return toast.error("Please enter a description");
    try {
      setSubmitting(true);
      const { data } = await api.post("/complaints/create", {
        ...form,
        assignedTo: contact?.name || "",
        contactNumber: contact?.phone || "",
        photoUrl: uploadUrl,
        mediaType: media?.type,
      });
      setTicket(data.ticketId);
      toast.success("Complaint submitted & authority notified!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="glass rounded-2xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Complaint Submission</h1>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">

        {["fullName", "mobile", "email", "address", "city"].map((k) => (
          <input
            key={k}
            className="rounded-lg bg-white/10 p-2"
            placeholder={k}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        ))}

        <select
          className="rounded-lg bg-white/10 p-2"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          <option value="garbage">Garbage</option>
          <option value="street_light">Street Light</option>
          <option value="water_leakage">Water Leakage</option>
          <option value="sewage">Sewage</option>
          <option value="road_damage">Road Damage</option>
          <option value="pothole">Pothole</option>
          <option value="electricity">Electricity</option>
          <option value="public_safety">Public Safety</option>
        </select>

        {contact && (
          <div className="md:col-span-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm">
            <p className="text-slate-300">
              <span className="font-semibold text-white">Assigned To: </span>
              {contact.name}
            </p>
            <p className="text-slate-300 mt-1">
              <span className="font-semibold text-white">Contact Number: </span>
              <span className="text-orange-400 font-mono">{contact.phone}</span>
            </p>
          </div>
        )}

        <textarea
          className="rounded-lg bg-white/10 p-2 md:col-span-2"
          placeholder="Complaint Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="md:col-span-2">
          <input
            type="file"
            accept="image/*"
            className="w-full rounded-lg bg-white/10 p-2"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setMedia(file || null);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
          <button
            type="button"
            onClick={upload}
            disabled={uploading}
            className="mt-2 rounded-lg bg-slate-200 px-3 py-2 text-slate-900 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          {uploadUrl && <p className="mt-1 text-xs text-green-400">✓ Image uploaded</p>}
          {preview && (
            <img src={preview} alt="complaint preview" className="mt-3 max-h-44 rounded-lg object-cover" />
          )}
        </div>

        <button
          className="rounded-lg bg-white p-2 text-slate-900 md:col-span-2 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit & Notify Authority"}
        </button>
      </form>
      {ticket && <p className="mt-3 text-green-400">✓ Ticket generated: {ticket}</p>}
    </section>
  );
}

export function ComplaintTrackingPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/complaints/my")
      .then((r) => setItems(r.data.items || []))
      .catch(() => toast.error("Unable to load complaints"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Complaint Tracking</h1>
      {loading && [1, 2, 3].map((k) => <SkeletonCard key={k} />)}
      {!loading && items.length === 0 && (
        <p className="text-slate-400">No complaints found.</p>
      )}
      {items.map((c) => (
        <div key={c._id} className="glass rounded-xl p-4">
          <p className="font-semibold">{c.ticketId} - {c.category}</p>
          <p>Status: <span className="text-yellow-400">{c.status}</span></p>
          <p>Department: {c.aiDepartment}</p>
          {c.assignedTo && (
            <p>Assigned To: <span className="text-blue-300">{c.assignedTo}</span>
              {c.contactNumber && (
                <span className="ml-2 text-orange-400 font-mono text-sm">({c.contactNumber})</span>
              )}
            </p>
          )}
          <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </section>
  );
}