import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Result from "./pages/Result";
import MapPage from "./pages/Map";
import History from "./pages/History";
import Navbar from "./components/Navbar";

export default function App() {
  const [lang, setLang] = useState(
    () => localStorage.getItem("animend_lang") || "ne",
  );

  useEffect(() => {
    localStorage.setItem("animend_lang", lang);
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar lang={lang} setLang={setLang} />
      <Routes>
        <Route path="/" element={<Home lang={lang} />} />
        <Route path="/diagnose" element={<Diagnose lang={lang} />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
