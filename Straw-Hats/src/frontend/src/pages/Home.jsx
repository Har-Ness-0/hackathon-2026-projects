import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Brain,
  Map as MapIcon,
  Stethoscope,
} from "lucide-react";
import { useTranslation } from "../lib/i18n";

export default function Home({ lang = "ne" }) {
  const t = useTranslation(lang);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 animate-in fade-in duration-700">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-teal-100 rounded-3xl mb-6">
          <Stethoscope className="w-10 h-10 text-teal-600" />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          {t("app_tagline")}
        </h1>

        <div className="flex justify-center gap-2 flex-wrap mb-6">
          <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full">
            AI for farmers
          </span>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
            🤖 AI-Powered health coordination
          </span>
        </div>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          Take a photo, describe the symptoms, and get an instant AI diagnosis
          for your livestock.
        </p>

        <Link
          to="/diagnose"
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-5 text-xl font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-2xl shadow-xl shadow-teal-500/30 transition-all hover:scale-105 active:scale-95"
        >
          {t("diagnose_now")}
          <ArrowRight className="ml-2 w-6 h-6" />
        </Link>

        <div className="mt-6">
          <Link to="/map" className="text-teal-600 font-bold hover:underline">
            View Live Outbreak Map
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            1. Take a Photo
          </h3>
          <p className="text-slate-500">
            Capture a clear picture of the sick animal or the affected area.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center relative">
          <div className="hidden sm:block absolute top-1/2 -left-4 w-8 border-t-2 border-dashed border-slate-300"></div>
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            2. AI Diagnosis
          </h3>
          <p className="text-slate-500">
            Our AI analyzes the image and symptoms in under 30 seconds.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center relative">
          <div className="hidden sm:block absolute top-1/2 -left-4 w-8 border-t-2 border-dashed border-slate-300"></div>
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            3. Track Outbreaks
          </h3>
          <p className="text-slate-500">
            Cases are mapped securely to warn nearby farmers.
          </p>
        </div>
      </div>
    </div>
  );
}
