import { useEffect, useState } from 'react'
import { getAllDiagnoses } from '../lib/api'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar } from 'lucide-react'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllDiagnoses().then(data => {
      setHistory(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Recent Diagnoses</h1>
      
      {history.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <p className="text-slate-500 text-lg mb-4">No diagnoses yet.</p>
          <Link to="/diagnose" className="text-teal-600 font-bold hover:underline">
            Tap Diagnose Now to get started
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map(item => (
            <Link 
              to={`/result/${item.id}`} 
              key={item.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                {item.image_url ? (
                  <img src={item.image_url} className="w-16 h-16 rounded-xl object-cover" alt="" />
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                    {item.animal_type === 'cattle' ? '🐮' : item.animal_type === 'poultry' ? '🐔' : '🐐'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{item.disease}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <span className="capitalize">{item.animal_type}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-teal-500 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
