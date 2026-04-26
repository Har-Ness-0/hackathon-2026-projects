import { useEffect, useState } from 'react'
import { getAllDiagnoses } from '../lib/api'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Globe } from 'lucide-react'

const ANIMAL_EMOJI = {
  cattle:  '🐄', goat:   '🐐', sheep:  '🐑',
  poultry: '🐔', pig:    '🐷', horse:  '🐴',
  donkey:  '🫏', rabbit: '🐰', fish:   '🐟',
  duck:    '🦆', other:  '🐾',
}

const SEVERITY_COLORS = {
  low:      'bg-green-100 text-green-700',
  medium:   'bg-yellow-100 text-yellow-700',
  high:     'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

export function recordDiagnosisId(id) {
  const existing = JSON.parse(
    sessionStorage.getItem('animend_session_ids') || '[]'
  )
  if (!existing.includes(id)) {
    sessionStorage.setItem(
      'animend_session_ids',
      JSON.stringify([...existing, id])
    )
  }
}

export default function History() {
  const [allDiagnoses, setAllDiagnoses] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showAll,   setShowAll]   = useState(false)

  useEffect(() => {
    getAllDiagnoses().then(data => {
      setAllDiagnoses(data || [])
      setLoading(false)
    })
  }, [])

  const sessionIds = JSON.parse(
    sessionStorage.getItem('animend_session_ids') || '[]'
  )
  const history = showAll
    ? allDiagnoses
    : allDiagnoses.filter(d => sessionIds.includes(d.id))

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 
                        border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          {showAll ? 'All Diagnoses' : 'My Diagnoses'}
        </h1>
        <button
          onClick={() => setShowAll(s => !s)}
          className="flex items-center gap-2 text-sm font-bold 
                     text-teal-600 hover:text-teal-800 
                     bg-teal-50 px-4 py-2 rounded-xl 
                     transition-colors border border-teal-100"
        >
          <Globe className="w-4 h-4" />
          {showAll ? 'Show Mine' : 'Show All'}
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border-2 
                        border-dashed border-slate-200 text-center">
          <p className="text-slate-500 text-lg mb-4">
            No diagnoses yet.
          </p>
          <Link 
            to="/diagnose" 
            className="text-teal-600 font-bold hover:underline"
          >
            Tap Diagnose Now to get started
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map(item => (
            <Link
              to={`/result/${item.id}`}
              key={item.id}
              className="bg-white p-5 rounded-2xl shadow-sm 
                         border border-slate-100 flex items-center 
                         justify-between hover:shadow-md 
                         transition-shadow group"
            >
              <div className="flex items-center gap-4">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    className="w-16 h-16 rounded-xl object-cover" 
                    alt="" 
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded-xl 
                                  flex items-center justify-center 
                                  text-2xl">
                    {ANIMAL_EMOJI[item.animal_type] || '🐾'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">
                    {item.disease}
                  </h3>
                  <div className="flex items-center gap-3 text-sm 
                                  text-slate-500 font-medium flex-wrap">
                    <span className="capitalize">{item.animal_type}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {item.severity && (
                      <span className={`px-2 py-0.5 rounded-lg text-xs 
                                       font-bold ${
                        SEVERITY_COLORS[item.severity] || 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {item.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 
                                    group-hover:text-teal-500 
                                    transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
