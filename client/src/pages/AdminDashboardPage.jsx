import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import toast from "react-hot-toast";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a78bfa"];

const StatCard = ({ label, value, icon }) => (
  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{value}</p>
    </div>
    <span style={{ fontSize: 28 }}>{icon}</span>
  </div>
);

const TABS = ["Overview", "Complaints", "SOS", "Bookings", "Users"];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("Overview");
  const [reports, setReports] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  const qs = filters.startDate || filters.endDate
    ? `?startDate=${filters.startDate}&endDate=${filters.endDate}` : "";

  useEffect(() => {
    Promise.all([
      api.get(`/admin/reports${qs}`),
      api.get("/admin/complaints"),
      api.get("/admin/users")
    ])
      .then(([r1, r2, r3]) => {
        setReports(r1.data);
        setComplaints(r2.data);
        setUsers(r3.data);
      })
      .catch(() => toast.error("Unable to load admin data"));
  }, [qs]);

  const totals = reports?.totals || {};

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "32px 24px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>Manage citizens, complaints, alerts, and bookings.</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 10, padding: 4, marginBottom: 24, width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14,
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? "#111827" : "#6b7280",
            boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none"
          }}>{t}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "Overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <StatCard label="Users" value={totals.users ?? "—"} icon="👥" />
            <StatCard label="Complaints" value={totals.complaints ?? "—"} icon="⚠️" />
            <StatCard label="SOS Alerts" value={totals.sos ?? "—"} icon="🔔" />
            <StatCard label="Bookings" value={totals.bookings ?? "—"} icon="🚑" />
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Complaints by category</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={(reports?.complaintsByCategory || []).map(x => ({ name: x._id || "unknown", count: x.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Complaints by status</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={(reports?.complaintsByStatus || []).map(x => ({ name: x._id || "unknown", value: x.count }))}
                    dataKey="value" nameKey="name" outerRadius={80}>
                    {(reports?.complaintsByStatus || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Bookings trend (14 days)</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={(reports?.dailyBookings || []).map(x => ({ date: x._id, count: x.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>SOS by type</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={(reports?.sosByLocation || []).map(x => ({ name: x._id || "unknown", count: x.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Response Time */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Response time (minutes)</p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>From booking creation to completion.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {["Average", "P50", "P90"].map(label => (
                <div key={label} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 20px" }}>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>{label}</p>
                  <p style={{ fontSize: 28, fontWeight: 700 }}>{Number(reports?.avgResponseTime || 0).toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Complaints Tab */}
      {tab === "Complaints" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                {["Ticket ID", "Category", "Status", "Department", "User"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, color: "#6b7280", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={c._id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600 }}>{c.ticketId}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{c.category}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: c.status === "resolved" ? "#dcfce7" : "#fef9c3", color: c.status === "resolved" ? "#16a34a" : "#ca8a04", padding: "2px 10px", borderRadius: 99, fontSize: 12 }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{c.aiDepartment || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{c.user?.name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {tab === "Users" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                {["Name", "Email", "Role", "Joined"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, color: "#6b7280", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{u.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: u.role === "admin" ? "#dbeafe" : "#f3f4f6", color: u.role === "admin" ? "#1d4ed8" : "#374151", padding: "2px 10px", borderRadius: 99, fontSize: 12 }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SOS Tab */}
      {tab === "SOS" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
          <p style={{ color: "#6b7280" }}>SOS alerts overview coming from reports data.</p>
          <div style={{ marginTop: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={(reports?.sosByLocation || []).map(x => ({ name: x._id || "unknown", count: x.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === "Bookings" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
          <p style={{ color: "#6b7280" }}>Ambulance bookings trend.</p>
          <div style={{ marginTop: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={(reports?.dailyBookings || []).map(x => ({ date: x._id, count: x.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}