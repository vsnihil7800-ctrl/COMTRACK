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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6">
          <p className="mb-4 text-sm text-slate-300">Animated city map visual placeholder</p>
          <div className="relative h-64 rounded-xl bg-slate-900/70">
            <motion.div animate={{ x: [0, 180, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute left-2 top-20 text-2xl">🚑</motion.div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} className="absolute right-8 top-10 text-3xl text-red-500">●</motion.div>
            <div className="absolute bottom-6 left-10 text-xl">📍 ⚠️ 🧯</div>
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
