import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitDiagnosis } from "../lib/api";
import AnimalSelector from "../components/AnimalSelector";
import CameraCapture from "../components/CameraCapture";
import VoiceInput from "../components/VoiceInput";
import LoadingSpinner from "../components/LoadingSpinner";
import { Stethoscope, ShieldCheck, Zap } from "lucide-react";
import { recordDiagnosisId } from './History'

const diagnoseCopy = {
  en: {
    title: "AI-Powered Diagnosis",
    subtitle:
      "Follow the simple steps to capture symptoms and get an instant, accurate analysis of your animal's health.",
    secure: "Private & Secure",
    secureSub: "Your data is safe with us",
    instant: "Instant Results",
    instantSub: "Analysis under 30 seconds",
    continuePhoto: "Continue to Photo",
    continueAudio: "Continue to Audio",
    back: "Back",
  },
  ne: {
    title: "AI-संचालित निदान",
    subtitle:
      "सरल चरणहरू पूरा गर्नुहोस् र तपाईंको पशुको स्वास्थ्यको तुरुन्त विश्लेषण प्राप्त गर्नुहोस्।",
    secure: "निजी र सुरक्षित",
    secureSub: "तपाईंको डाटा सुरक्षित छ",
    instant: "छिटो नतिजा",
    instantSub: "३० सेकेन्डभित्र विश्लेषण",
    continuePhoto: "फोटो चरणमा जानुहोस्",
    continueAudio: "अडियो चरणमा जानुहोस्",
    back: "फिर्ता",
  },
  hi: {
    title: "AI-संचालित निदान",
    subtitle:
      "सरल चरण पूरे करें और अपने पशु के स्वास्थ्य का तुरंत विश्लेषण प्राप्त करें।",
    secure: "निजी और सुरक्षित",
    secureSub: "आपका डेटा सुरक्षित है",
    instant: "तुरंत परिणाम",
    instantSub: "30 सेकंड में विश्लेषण",
    continuePhoto: "फोटो चरण पर जाएं",
    continueAudio: "ऑडियो चरण पर जाएं",
    back: "वापस",
  },
};

export default function Diagnose({ lang = "ne" }) {
  const navigate = useNavigate();
  const copy = diagnoseCopy[lang] || diagnoseCopy.en;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    animalType: null,
    image: null,
    symptoms: "",
    language: lang,
    lat: null,
    lng: null,
  });

  useEffect(() => {
    setForm((f) => ({ ...f, language: lang }));
  }, [lang]);

  // Get GPS on mount silently
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setForm((f) => ({
            ...f,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })),
        () => {},
      );
    }
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const result = await submitDiagnosis(form);
      recordDiagnosisId(result.id)
      navigate(`/result/${result.id}`, { state: { diagnosis: result } });
    } catch (err) {
      const msg = err?.response?.data?.detail 
        || err?.message 
        || 'Diagnosis failed. Please try again.'
      setError(msg)
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left Sidebar - Visuals & Context */}
        <div className="lg:w-1/3 flex flex-col justify-between bg-gradient-to-br from-teal-500 to-teal-700 rounded-[2.5rem] p-8 lg:p-10 text-white shadow-xl lg:sticky lg:top-24 h-full lg:min-h-[500px]">
          <div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
              {copy.title}
            </h2>
            <p className="text-teal-50 text-lg leading-relaxed mb-8 opacity-90">
              {copy.subtitle}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="bg-teal-400/30 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-teal-100" />
              </div>
              <div>
                <h4 className="font-bold text-white">{copy.secure}</h4>
                <p className="text-sm text-teal-100">{copy.secureSub}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="bg-teal-400/30 p-3 rounded-xl">
                <Zap className="w-6 h-6 text-teal-100" />
              </div>
              <div>
                <h4 className="font-bold text-white">{copy.instant}</h4>
                <p className="text-sm text-teal-100">{copy.instantSub}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Form Steps */}
        <div className="lg:w-2/3 flex flex-col justify-center">
          {/* Progress Bar */}
          <div className="flex gap-3 mb-10 max-w-xl mx-auto w-full">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2.5 rounded-full transition-colors duration-500 ${
                  step >= s ? "bg-teal-500 shadow-sm" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <div className="max-w-xl mx-auto w-full flex-1">
            {step === 1 && (
              <div className="animate-in fade-in duration-500">
                <AnimalSelector
                  value={form.animalType}
                  onChange={(v) => {
                    setForm((f) => ({ ...f, animalType: v }));
                  }}
                />
                {form.animalType && (
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-8 bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-900 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    {copy.continuePhoto}
                  </button>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in duration-500">
                <CameraCapture
                  onCapture={(file, _previewUrl) => {
                    setForm((f) => ({ ...f, image: file }));
                  }}
                />
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors"
                  >
                    {copy.back}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.image}
                    className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50 hover:bg-slate-900 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98] disabled:active:scale-100 disabled:hover:shadow-none"
                  >
                    {copy.continueAudio}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in duration-500">
                <VoiceInput
                  language={form.language}
                  value={form.symptoms}
                  onChange={(v) => setForm((f) => ({ ...f, symptoms: v }))}
                  onSubmit={handleSubmit}
                />
                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors"
                >
                  {copy.back}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center animate-in slide-in-from-bottom-4 shadow-sm font-medium">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
