import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/ambulance/my").then(r => setBookings(r.data.items || [])).catch(() => {});
    api.get("/complaints/my").then(r => setComplaints(r.data.items || [])).catch(() => {});
    api.get("/notifications").then(r => setNotifications(r.data.items || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="glass rounded-2xl p-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name} 👋</h1>
        <p className="text-slate-300">Role: {user?.role}</p>
      </section>

      {/* Quick Actions */}
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Book Ambulance", href: "/ambulance", color: "bg-green-600" },
          { label: "File Complaint", href: "/complaints", color: "bg-blue-600" },
          { label: "Emergency SOS", href: "/sos", color: "bg-red-600" },
          { label: "Notifications", href: "/notifications", color: "bg-purple-600" },
        ].map(({ label, href, color }) => (
          <Link key={label} to={href} className={`${color} rounded-xl p-4 text-white font-semibold text-center`}>
            {label}
          </Link>
        ))}
      </section>

      {/* My Bookings */}
      <section className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Bookings</h2>
          <Link to="/ambulance" className="text-sm text-blue-400">+ New booking</Link>
        </div>
        {bookings.length === 0 ? (
          <p className="text-slate-400">No bookings yet</p>
        ) : (
          bookings.slice(0, 3).map(b => (
            <div key={b._id} className="glass rounded-xl p-4 mb-3">
              <div className="flex justify-between">
                <p className="font-semibold">{b.emergencyType}</p>
                <span className="text-xs bg-blue-600 rounded-full px-2 py-1">{b.status}</span>
              </div>
              <p className="text-sm text-slate-300">Pickup: {b.pickupAddress}</p>
              <p className="text-sm text-slate-300">Destination: {b.destinationAddress}</p>
            </div>
          ))
        )}
      </section>

      {/* My Complaints */}
      <section className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Complaints</h2>
          <Link to="/complaints" className="text-sm text-blue-400">+ New complaint</Link>
        </div>
        {complaints.length === 0 ? (
          <p className="text-slate-400">No complaints yet</p>
        ) : (
          complaints.slice(0, 3).map(c => (
            <div key={c._id} className="glass rounded-xl p-4 mb-3">
              <div className="flex justify-between">
                <p className="font-semibold">{c.ticketId}</p>
                <span className="text-xs bg-green-600 rounded-full px-2 py-1">{c.status}</span>
              </div>
              <p className="text-sm text-slate-300">{c.category}</p>
            </div>
          ))
        )}
      </section>

      {/* Notifications */}
      <section className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Notifications</h2>
          <Link to="/notifications" className="text-sm text-blue-400">View all</Link>
        </div>
        {notifications.length === 0 ? (
          <p className="text-slate-400">No notifications yet</p>
        ) : (
          notifications.slice(0, 3).map(n => (
            <div key={n._id} className="glass rounded-xl p-4 mb-3">
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-slate-300">{n.message}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}