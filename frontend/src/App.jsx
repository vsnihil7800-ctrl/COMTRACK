import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api, setAuthToken } from "./api";

function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
    admin_code: "",
  });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            admin_code: form.role === "admin" ? form.admin_code : undefined,
          }
        : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed");
    }
  };

  return (
    <div className="container">
      <h1>COMTRACK</h1>
      <p>Community and emergency response tracker</p>
      <form onSubmit={submit} className="card">
        {isRegister && (
          <>
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="citizen">Citizen</option>
              <option value="admin">Admin</option>
            </select>
            {form.role === "admin" && (
              <input
                placeholder="Admin Registration Code"
                value={form.admin_code}
                onChange={(e) => setForm({ ...form, admin_code: e.target.value })}
                required
              />
            )}
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
        <button type="button" className="ghost" onClick={() => setIsRegister((v) => !v)}>
          {isRegister ? "Have account? Login" : "No account? Register"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

function Dashboard({ session, onLogout }) {
  const [summary, setSummary] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [message, setMessage] = useState("");

  const [bookingForm, setBookingForm] = useState({
    patient_name: "",
    location: "",
    emergency_level: "medium",
    notes: "",
  });
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    description: "",
    category: "Civic",
  });
  const [sosLocation, setSosLocation] = useState("");

  const isAdmin = useMemo(() => session.role === "admin", [session.role]);

  const fetchAll = async () => {
    const [{ data: summaryData }, { data: bookingData }, { data: complaintData }] = await Promise.all([
      api.get("/dashboard/summary"),
      api.get("/ambulance/my-bookings"),
      api.get("/complaints/my"),
    ]);
    setSummary(summaryData);
    setMyBookings(bookingData);
    setMyComplaints(complaintData);

    if (isAdmin) {
      const { data } = await api.get("/admin/overview");
      setAdminData(data);
    }
  };

  useEffect(() => {
    fetchAll().catch(() => setMessage("Failed to load dashboard data"));
  }, []);

  const submitBooking = async (event) => {
    event.preventDefault();
    await api.post("/ambulance/book", bookingForm);
    setMessage("Ambulance booking placed successfully");
    setBookingForm({ patient_name: "", location: "", emergency_level: "medium", notes: "" });
    await fetchAll();
  };

  const submitComplaint = async (event) => {
    event.preventDefault();
    await api.post("/complaints", complaintForm);
    setMessage("Complaint submitted");
    setComplaintForm({ title: "", description: "", category: "Civic" });
    await fetchAll();
  };

  const sendSOS = async (event) => {
    event.preventDefault();
    await api.post("/sos", { location: sosLocation, message: "Urgent SOS request" });
    setMessage("SOS alert sent to authorities");
    setSosLocation("");
    await fetchAll();
  };

  const updateComplaintStatus = async (complaintId, statusValue) => {
    await api.patch(`/admin/complaints/${complaintId}/status?status_value=${statusValue}`);
    setMessage("Complaint status updated");
    await fetchAll();
  };

  return (
    <div className="container wide">
      <div className="topbar">
        <div>
          <h2>Welcome, {session.name}</h2>
          <p>Role: {session.role}</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </div>

      {message && <div className="success">{message}</div>}
      {summary && (
        <div className="grid">
          <div className="card"><strong>Users</strong><span>{isAdmin && adminData ? adminData.totals.users : "N/A"}</span></div>
          <div className="card"><strong>Ambulance Bookings</strong><span>{summary.stats.ambulance_bookings}</span></div>
          <div className="card"><strong>Complaints</strong><span>{summary.stats.complaints}</span></div>
          <div className="card"><strong>SOS Alerts</strong><span>{summary.stats.sos_alerts}</span></div>
        </div>
      )}

      <div className="split">
        <form className="card" onSubmit={submitBooking}>
          <h3>Ambulance Booking</h3>
          <input
            placeholder="Patient Name"
            value={bookingForm.patient_name}
            onChange={(e) => setBookingForm({ ...bookingForm, patient_name: e.target.value })}
            required
          />
          <input
            placeholder="Location"
            value={bookingForm.location}
            onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
            required
          />
          <select
            value={bookingForm.emergency_level}
            onChange={(e) => setBookingForm({ ...bookingForm, emergency_level: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <textarea
            placeholder="Notes"
            value={bookingForm.notes}
            onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
          />
          <button type="submit">Book Ambulance</button>
        </form>

        <form className="card" onSubmit={submitComplaint}>
          <h3>Complaint System</h3>
          <input
            placeholder="Complaint Title"
            value={complaintForm.title}
            onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Describe your issue"
            value={complaintForm.description}
            onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={complaintForm.category}
            onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
          />
          <button type="submit">Submit Complaint</button>
        </form>

        <form className="card" onSubmit={sendSOS}>
          <h3>SOS Alert</h3>
          <input
            placeholder="Current Location"
            value={sosLocation}
            onChange={(e) => setSosLocation(e.target.value)}
            required
          />
          <button type="submit" className="danger">Trigger SOS</button>
          <p className="muted">Use only for real emergencies.</p>
        </form>
      </div>

      <div className="split">
        <div className="card">
          <h3>My Ambulance Bookings</h3>
          {myBookings.map((item) => (
            <div key={item.id} className="listItem">
              <strong>{item.patient_name}</strong>
              <span>{item.location} - {item.emergency_level}</span>
              <small>Status: {item.status}</small>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>My Complaints</h3>
          {myComplaints.map((item) => (
            <div key={item.id} className="listItem">
              <strong>{item.title}</strong>
              <span>{item.category}</span>
              <small>Status: {item.status}</small>
            </div>
          ))}
        </div>
      </div>

      {isAdmin && adminData && (
        <div className="card">
          <h3>Admin Panel</h3>
          <p>Total Users: {adminData.totals.users}</p>
          <p>Total Complaints: {adminData.totals.complaints}</p>
          <h4>Recent Complaints</h4>
          {adminData.recent_complaints.map((item) => (
            <div key={item.id} className="listItem">
              <strong>{item.title}</strong>
              <span>{item.status}</span>
              <div className="row">
                <button onClick={() => updateComplaintStatus(item.id, "in_progress")}>In Progress</button>
                <button onClick={() => updateComplaintStatus(item.id, "resolved")}>Resolved</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("comtrack_session");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    setAuthToken(session?.access_token);
    if (session) {
      localStorage.setItem("comtrack_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("comtrack_session");
    }
  }, [session]);

  return (
    <Routes>
      <Route path="/auth" element={session ? <Navigate to="/" replace /> : <AuthPage onLogin={setSession} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute token={session?.access_token}>
            <Dashboard session={session} onLogout={() => setSession(null)} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={session ? "/" : "/auth"} replace />} />
    </Routes>
  );
}
