import { Link, NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

export default function Navbar({ dark, setDark, lang, setLang }) {
  const nav = [
    ["Home", "/"],
    ["Features", "/features"],
    ["Dashboard", "/dashboard"],
    ["Complaints", "/complaints"],
    ["SOS", "/sos"]
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="font-bold tracking-wide text-white">COMTRACK</Link>
        <nav className="hidden items-center gap-5 md:flex">
          {nav.map(([label, href]) => (
            <NavLink key={href} to={href} className="text-sm text-slate-200 hover:text-white">
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "en" ? "ta" : "en")} className="glass rounded-full px-3 py-1 text-xs">
            {lang.toUpperCase()}
          </button>
          <button onClick={() => setDark((v) => !v)} className="glass rounded-full p-2">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
