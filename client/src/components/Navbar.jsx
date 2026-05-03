import { Link, NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { copy } from "../utils/translations";

export default function Navbar({ dark, setDark, lang, setLang }) {
  const t = copy[lang] || copy["en"];

  const nav = [
    ["Home", "/"],
    ["Features", "/features"],
    ["Dashboard", "/dashboard"],
    ["Complaints", "/complaints"],
    ["SOS", "/sos"],
    ["Profile", "/profile"]
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
      <div className="container-app flex h-16 items-center justify-between">

        <Link to="/" className="font-bold tracking-wide text-white">
          COMTRACK
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {nav.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              style={({ isActive }) => ({
                color: isActive ? "#ffffff" : "#cbd5e1",
                fontSize: "14px",
                fontWeight: "500",
                textDecoration: "none"
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              borderRadius: "999px",
              padding: "4px 12px",
              fontSize: "12px",
              background: "#1e293b",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
          </select>
          <button
            onClick={() => setDark((v) => !v)}
            style={{
              borderRadius: "999px",
              padding: "8px",
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              color: "white"
            }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

      </div>
    </header>
  );
}