import { motion } from "framer-motion";
import { Link, useOutletContext } from "react-router-dom";
import { copy } from "../utils/translations";

const problemCards = [
  {
    title: "Ambulance Problems",
    points: ["Hard to find ambulance quickly", "No ETA system", "No live tracking", "No nearest unit detection"]
  },
  {
    title: "Complaint Problems",
    points: ["Wrong department chosen", "Delays in civic complaint resolution", "No tracking system"]
  },
  {
    title: "Emergency Problems",
    points: ["Difficult to explain live location", "No instant alert system", "No nearby support guidance"]
  }
];

export default function HomePage() {
  const { lang } = useOutletContext();
  const t = copy[lang];
  return (
    <div className="space-y-16">
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-5xl font-extrabold">{t.brand}</h1>
          <p className="text-2xl text-slate-200">{t.subtitle}</p>
          <p className="text-slate-300">{t.heroDescription}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="rounded-xl bg-white px-4 py-2 text-slate-900">{t.getStarted}</Link>
            <Link to="/sos" className="rounded-xl bg-brand-emergency px-4 py-2">{t.emergencySOS}</Link>
            <Link to="/ambulance" className="rounded-xl bg-brand-success px-4 py-2">{t.bookAmbulance}</Link>
            <Link to="/complaints" className="rounded-xl bg-blue-600 px-4 py-2 text-white">File Complaint</Link>
          </div>
        </div>
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-4">
  <div className="relative h-72 rounded-xl overflow-hidden">
    <iframe
      src="https://www.openstreetmap.org/export/embed.html?bbox=80.2307%2C12.9716%2C80.2907%2C13.0827&layer=mapnik&marker=13.0827%2C80.2707"
      className="w-full h-full rounded-xl border-0"
      title="Live Map"
    />
    <div className="absolute top-2 left-2 glass rounded-lg px-3 py-1 text-xs font-semibold">
      🔴 Live Emergency Map
    </div>
    <motion.div
      animate={{ x: [0, 60, 0], y: [0, -20, 0] }}
      transition={{ repeat: Infinity, duration: 4 }}
      className="absolute bottom-8 left-8 text-2xl"
    >
      🚑
    </motion.div>
    <motion.div
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="absolute top-8 right-8 text-2xl"
    >
      🆘
    </motion.div>
  </div>
  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
    <div className="glass rounded-lg p-2">
      <p className="text-green-400 font-bold text-lg">12</p>
      <p className="text-slate-300">Ambulances</p>
    </div>
    <div className="glass rounded-lg p-2">
      <p className="text-red-400 font-bold text-lg">3</p>
      <p className="text-slate-300">Active SOS</p>
    </div>
    <div className="glass rounded-lg p-2">
      <p className="text-blue-400 font-bold text-lg">47</p>
      <p className="text-slate-300">Complaints</p>
    </div>
  </div>
</motion.div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {problemCards.map((item) => (
          <motion.div key={item.title} whileHover={{ y: -6 }} className="glass rounded-2xl p-5">
            <h3 className="mb-3 text-lg font-semibold">{item.title}</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {item.points.map((p) => <li key={p}>- {p}</li>)}
            </ul>
          </motion.div>
        ))}
      </section>
      <p className="text-center text-slate-300">
        COMTRACK solves all these issues using one integrated intelligent platform.
      </p>

      <section className="grid gap-4 md:grid-cols-5">
        {["Under 2 Min Response Goal", "24/7 Emergency Availability", "100% Real-Time Tracking", "3-in-1 Integrated System", "Thousands of Citizens Supported"].map(
          (s) => (
            <div key={s} className="glass rounded-xl p-4 text-center text-sm">{s}</div>
          )
        )}
      </section>
    </div>
  );
}
