import { Link, NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { copy } from "../utils/translations";

export default function Navbar({ dark, setDark, lang, setLang }) {
  const t = copy[lang] || copy["en"];

  const nav = [
    [t.home || "Home", "/"],
    [t.features || "Features", "/features"],
    [t.dashboard || "Dashboard", "/dashboard"],
    [t.complaints || "Complaints", "/complaints"],
    [t.sos || "SOS", "/sos"],
    [t.profile || "Profile", "/profile"]
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="font-bold tracking-wide text-white">
          COMTRACK
        </Link>

        <nav className="flex items-center gap-5">
          {nav.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-slate-300 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="glass rounded-full px-3 py-1 text-xs bg-slate-800 text-white border border-white/20"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="ml">മലയാളം</option>
            <option value="mr">मराठी</option>
            <option value="bn">বাংলা</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="ur">اردو</option>
          </select>
          <button
            onClick={() => setDark((v) => !v)}
            className="glass rounded-full p-2"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}