import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useCachedRequest } from "../hooks/useCachedRequest";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const qs = filters.startDate || filters.endDate ? `?startDate=${filters.startDate || ""}&endDate=${filters.endDate || ""}` : "";
  const { data: cachedReports } = useCachedRequest(`admin_reports_${qs}`, `/admin/reports${qs}`, 20000);
  const [reports, setReports] = useState(cachedReports || null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (cachedReports) setReports(cachedReports);
  }, [cachedReports]);

  useEffect(() => {
    Promise.all([api.get(`/admin/reports${qs}`), api.get("/admin/complaints")])
      .then(([r1, r2]) => {
        setReports(r1.data);
        setComplaints(r2.data);
      })
      .catch(() => toast.error("Unable to load admin analytics"));
  }, [qs]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="glass flex flex-wrap items-end gap-3 rounded-xl p-4">
        <div>
          <label className="mb-1 block text-xs text-slate-300">Start date</label>
          <input type="date" value={filters.startDate} onChange={(e) => setFilters((x) => ({ ...x, startDate: e.target.value }))} className="rounded-lg bg-white/10 p-2" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-300">End date</label>
          <input type="date" value={filters.endDate} onChange={(e) => setFilters((x) => ({ ...x, endDate: e.target.value }))} className="rounded-lg bg-white/10 p-2" />
        </div>
        <button className="rounded-lg bg-slate-200 px-3 py-2 text-slate-900" onClick={() => setFilters({ startDate: "", endDate: "" })}>
          Reset
        </button>
      </div>
      {reports && (
        <div className="grid gap-3 md:grid-cols-4">
          {Object.entries(reports.totals).map(([k, v]) => (
            <div key={k} className="glass rounded-xl p-4">{k}: {v}</div>
          ))}
        </div>
      )}
      <div className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-xl font-semibold">Analytics</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="mb-2 text-sm">Complaints by category</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={(reports?.complaintsByCategory || []).map((x) => ({ name: x._id || "unknown", count: x.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="mb-2 text-sm">Daily ambulance bookings</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={(reports?.dailyBookings || []).map((x) => ({ date: x._id, count: x.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="mb-2 text-sm">SOS alerts by location</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={(reports?.sosByLocation || []).map((x) => ({ name: x._id || "Unknown", value: x.count }))} dataKey="value" nameKey="name" outerRadius={80} fill="#e11d48" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="mb-2 text-sm">User growth</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={(reports?.userGrowth || []).map((x) => ({ date: x._id, count: x.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-slate-300">Average response time: {Number(reports?.avgResponseTime || 0).toFixed(1)} min</p>
          </div>
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-xl font-semibold">Complaints Management</h2>
        <div className="space-y-2">
          {complaints.slice(0, 10).map((c) => (
            <div key={c._id} className="rounded-lg bg-white/5 p-3">
              {c.ticketId} | {c.category} | {c.status} | {c.aiDepartment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
