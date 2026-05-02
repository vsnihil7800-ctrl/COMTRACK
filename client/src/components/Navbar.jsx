import { Link, NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { copy } from "../utils/translations";

export default function Navbar({ dark, setDark, lang, setLang }) {
  const t = copy[lang] || copy["en"];
  
  const nav = [
    [t.home, "/"],
    [t.features, "/features"],
    [t.dashboard, "/dashboard"],
    [t.complaints, "/complaints"],
    [t.sos, "/sos"],
    [t.profile, "/profile"]
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
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="glass rounded-full px-3 py-1 text-xs bg-slate-800 text-white border border-white/20"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="kn">Kannada</option>
            <option value="te">Telugu</option>
            <option value="ml">Malayalam</option>
            <option value="mr">Marathi</option>
            <option value="bn">Bengali</option>
            <option value="pa">Punjabi</option>
            <option value="ur">Urdu</option>
            <option value="or">Odia</option>
            <option value="as">Assamese</option>
            <option value="bho">Bhojpuri</option>
            <option value="ks">Kashmiri</option>
          </select>
          <button onClick={() => setDark((v) => !v)} className="glass rounded-full p-2">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}