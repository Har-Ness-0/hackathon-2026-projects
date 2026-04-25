import { Link } from "react-router-dom";
import { Stethoscope, Map, Globe } from "lucide-react";

export default function Navbar({ lang = "ne", setLang }) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-teal-500 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                Animend
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center bg-slate-50 rounded-full p-1 border border-slate-200">
              <Globe className="w-4 h-4 text-slate-400 ml-2 mr-1" />
              <select
                value={lang}
                onChange={(e) => setLang?.(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none py-1 pr-4 rounded-r-full appearance-none cursor-pointer"
              >
                <option value="ne">नेपाली</option>
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
            <Link
              to="/map"
              className="text-slate-500 hover:text-teal-600 font-medium flex items-center gap-1"
            >
              <Map className="h-5 w-5" />
              <span className="hidden sm:inline">Outbreak Map</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
