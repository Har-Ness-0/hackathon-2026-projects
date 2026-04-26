import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { getDiagnosis } from '../lib/api'
import DiagnosisCard from '../components/DiagnosisCard'
import { ArrowLeft, Share2, Map, RefreshCw, Info, AlertTriangle } from 'lucide-react'

export default function Result() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [diagnosis, setDiagnosis] = useState(location.state?.diagnosis || null)
  const [loading, setLoading] = useState(!diagnosis)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!diagnosis) {
      getDiagnosis(id)
        .then(data => {
          setDiagnosis(data)
          setLoading(false)
        })
        .catch(err => {
          setError('Could not load diagnosis result.')
          setLoading(false)
        })
    }
  }, [id, diagnosis])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Animend Diagnosis',
        text: `My animal was diagnosed with ${diagnosis?.disease}.`,
        url: window.location.href,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (error || !diagnosis) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center min-h-[calc(100vh-64px)] flex flex-col justify-center">
        <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Diagnosis Not Found</h2>
          <p className="text-red-600 font-medium">{error || 'The requested result could not be located.'}</p>
          <button onClick={() => navigate('/')} className="mt-6 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 relative overflow-hidden">
      {/* Decorative Background blob */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors mb-8 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back Home
        </button>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Card */}
          <div className="w-full lg:w-2/3">
            <DiagnosisCard diagnosis={diagnosis} language={diagnosis?.language || 'en'} />
          </div>

          {/* Action Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-24">
            
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-slate-200 text-slate-700 font-bold transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    Share Result
                  </span>
                  <ArrowLeft className="w-4 h-4 rotate-135 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <Link 
                  to={`/map?highlight=${diagnosis?.id || ''}`}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-teal-50 border-2 border-transparent hover:border-teal-200 text-teal-800 font-bold transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <Map className="w-5 h-5 text-teal-600" />
                    View on Outbreak Map
                  </span>
                </Link>

                <Link 
                  to="/diagnose"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800 border-2 border-transparent hover:bg-slate-900 text-white font-bold transition-all shadow-md group mt-2"
                >
                  <span className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5" />
                    Diagnose Another
                  </span>
                </Link>
              </div>
            </div>

            {/* Educational Panel */}
            <div className="bg-indigo-50 rounded-3xl p-6 border-2 border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2.5 rounded-xl flex-shrink-0">
                  <Info className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 mb-1">What happens next?</h4>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    This diagnosis has been securely recorded. If you chose to share location data, it will anonymously help other farmers in your area by updating the local outbreak map.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
