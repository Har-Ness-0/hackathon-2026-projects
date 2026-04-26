import { useTranslation } from '../lib/i18n'
import { Info } from 'lucide-react'

const SEVERITY_STYLES = {
  low:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'LOW' },
  medium:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'MEDIUM' },
  high:     { bg: 'bg-orange-100', text: 'text-orange-700', label: 'HIGH' },
  critical: { bg: 'bg-red-100',    text: 'text-red-700',    label: 'CRITICAL' },
}

export default function DiagnosisCard({ diagnosis, language = 'en' }) {
  const t = useTranslation(language)

  // Null-safe — never crash if diagnosis has missing fields
  if (!diagnosis) return null

  const s = SEVERITY_STYLES[diagnosis.severity] || SEVERITY_STYLES.medium

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Animend Diagnosis',
        text: `My animal was diagnosed with ${diagnosis.disease || 'Unknown'} (${diagnosis.severity || 'unknown'} severity).`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="max-w-lg mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Severity Banner */}
        <div className={`${s.bg} ${s.text} px-6 py-4 flex items-center justify-between`}>
          <span className="font-extrabold text-lg tracking-wide">{s.label} SEVERITY</span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-bold">
              {diagnosis.confidence ?? 0}% Confidence
            </span>
            <div className="w-24 h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all 
                           duration-1000 ease-out"
                style={{ width: `${diagnosis.confidence ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Row */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 leading-tight mb-1">
                {diagnosis.disease || 'Unknown Disease'}
              </h1>
              <p className="text-slate-500 font-medium capitalize flex items-center gap-2">
                {diagnosis.animal_type || 'animal'}
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>
                {diagnosis.created_at ? new Date(diagnosis.created_at).toLocaleDateString() : 'Today'}
              </p>
            </div>
            {diagnosis.image_url && (
              <img 
                src={diagnosis.image_url} 
                alt="Animal thumbnail" 
                className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-slate-100 flex-shrink-0"
              />
            )}
          </div>

          {/* Immediate Action */}
          {diagnosis.immediate_action && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5 shadow-sm">
              <h3 className="text-red-800 font-bold text-sm tracking-wide uppercase mb-2">DO THIS RIGHT NOW</h3>
              <p className="text-red-900 font-medium leading-relaxed">{diagnosis.immediate_action}</p>
            </div>
          )}

          {/* Details */}
          <div className="space-y-5">
            {diagnosis.description && (
              <div>
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">What is this?</h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">{diagnosis.description}</p>
              </div>
            )}
            
            {diagnosis.treatment && (
              <div>
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Treatment</h3>
                <div className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl whitespace-pre-line">
                  {diagnosis.treatment}
                </div>
              </div>
            )}

            {diagnosis.prevention && (
              <div>
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Prevention</h3>
                <div className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl whitespace-pre-line">
                  {diagnosis.prevention}
                </div>
              </div>
            )}
          </div>

          {/* Warning Badges */}
          {(diagnosis.vet_required === true || diagnosis.zoonotic_risk === true) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {diagnosis.vet_required === true && (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  VET REQUIRED
                </span>
              )}
              {diagnosis.zoonotic_risk === true && (
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold">
                  ⚠️ RISK TO HUMANS
                </span>
              )}
            </div>
          )}

          {/* Vision Model Agreement Badge */}
          {diagnosis.vision_model_agreement !== null && 
           diagnosis.vision_model_agreement !== undefined && (
            <div className={`flex items-center gap-2.5 p-3 rounded-xl 
                             text-sm font-medium border ${
              diagnosis.vision_model_agreement
                ? 'bg-teal-50 border-teal-100 text-teal-700'
                : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
              <span className="text-base flex-shrink-0">
                {diagnosis.vision_model_agreement ? '✓' : '⚡'}
              </span>
              <span>
                {diagnosis.vision_model_agreement
                  ? 'Vision model and AI reasoning are in agreement'
                  : 'AI reasoning overrode the visual classifier — symptom description weighted higher'}
              </span>
            </div>
          )}

          {/* Zoonotic Risk Explanation */}
          {diagnosis.zoonotic_risk === true && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4">
              <h3 className="text-orange-800 font-bold text-sm">⚠️ Zoonotic Disease — Risk to Humans</h3>
              <p className="text-orange-700 text-sm mt-1">
                This disease can spread from animals to humans. Wash hands thoroughly after handling this animal. Avoid contact with bodily fluids. Keep children away. Seek medical advice if you develop symptoms.
              </p>
            </div>
          )}

          {/* AI Disclaimer */}
          <div className="bg-slate-100 rounded-xl p-4 border-t border-slate-200 mt-4 pt-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 italic">
              ⚠️ Disclaimer: This AI-generated result is for informational purposes only and is not a substitute for professional veterinary advice. Always consult a licensed veterinarian before administering treatment.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
