import { Stethoscope } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function LoadingSpinner() {
  const messages = [
    'Analysing your photo...',
    'Running AI diagnosis...',
    'Checking against disease database...',
    'Preparing your results...'
  ]
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx(i => (i + 1) % messages.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white px-4">
      <div className="bg-teal-500 p-6 rounded-3xl animate-pulse mb-8 shadow-[0_0_40px_rgba(13,148,136,0.5)]">
        <Stethoscope className="w-16 h-16" />
      </div>
      
      {/* Progress Bar Track */}
      <div className="w-full max-w-xs bg-slate-700 h-2 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-teal-400 rounded-full animate-[loading_6s_ease-in-out_forwards]" 
             style={{ width: '0%' }} 
        />
      </div>

      <h2 className="text-xl font-medium text-center animate-fade-in transition-all duration-300">
        {messages[msgIdx]}
      </h2>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          30% { width: 40%; }
          60% { width: 75%; }
          100% { width: 95%; }
        }
      `}</style>
    </div>
  )
}
