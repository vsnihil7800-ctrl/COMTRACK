import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h1 className="text-3xl font-bold">Welcome {user?.name}</h1>
        <p className="text-slate-300">Role: {user?.role}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Active Ambulance Bookings", "/ambulance"],
          ["Complaint Tickets", "/complaints/track"],
          ["SOS Alert History", "/sos"],
          ["Notifications Center", "/notifications"]
        ].map(([label, href]) => (
          <Link key={label} to={href} className="glass rounded-xl p-4">{label}</Link>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-xl p-4">Recent Activity</div>
        <div className="glass rounded-xl p-4">Mini Map Summary</div>
      </section>
    </div>
  );
}
