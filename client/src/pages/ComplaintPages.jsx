import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import SkeletonCard from "../components/SkeletonCard";

export function ComplaintSubmitPage() {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    description: "",
    category: "",
    priority: "medium"
  });
  const [ticket, setTicket] = useState(null);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/complaints/create", { ...form, photoUrl: uploadUrl, mediaType: media?.type });
    setTicket(data.ticketId);
    toast.success("Complaint submitted successfully");
  };
  const upload = async () => {
    if (!media) return;
    const fd = new FormData();
    fd.append("file", media);
    const { data } = await api.post("/complaints/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    setUploadUrl(data.url);
    toast.success("File uploaded");
  };
  return (
    <section className="glass rounded-2xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Complaint Submission</h1>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        {["fullName", "mobile", "email", "address", "city", "category"].map((k) => (
          <input key={k} className="rounded-lg bg-white/10 p-2" placeholder={k} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <textarea className="rounded-lg bg-white/10 p-2 md:col-span-2" placeholder="Complaint Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
          <button type="button" onClick={upload} className="mt-2 rounded-lg bg-slate-200 px-3 py-2 text-slate-900">Upload Image</button>
          {preview && <img src={preview} alt="complaint preview" className="mt-3 max-h-44 rounded-lg object-cover" />}
        </div>
        <button className="rounded-lg bg-white p-2 text-slate-900 md:col-span-2">Submit Complaint</button>
      </form>
      {ticket && <p className="mt-3 text-brand-success">Ticket generated: {ticket}</p>}
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
      {items.map((c) => (
        <div key={c._id} className="glass rounded-xl p-4">
          <p className="font-semibold">{c.ticketId} - {c.category}</p>
          <p>Status: {c.status}</p>
          <p>Department: {c.aiDepartment}</p>
        </div>
      ))}
    </section>
  );
}
