import { useVoice } from '../hooks/useVoice'
import { Mic, MicOff, Type, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function VoiceInput({ language, value, onChange, onSubmit }) {
  const { transcript, isListening, start, stop, supported } = useVoice(language)
  const [isTypingMode, setIsTypingMode] = useState(false)

  // Sync voice transcript to local state
  useEffect(() => {
    if (transcript && transcript.trim()) {
      onChange(transcript)
    }
  }, [transcript])

  const toggleRecording = () => {
    if (isListening) stop()
    else start()
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 text-center">Describe Symptoms</h2>

      {!supported && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm border border-yellow-200">
          Voice input is not supported in this browser. Please type the symptoms below.
        </div>
      )}

      {supported && !isTypingMode && (
        <div className="flex flex-col items-center gap-6 py-4">
          <button
            onClick={toggleRecording}
            className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 shadow-xl ${
              isListening 
                ? 'bg-red-500 scale-110 shadow-red-500/50' 
                : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30 active:scale-95'
            }`}
          >
            {isListening ? (
              <>
                <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></div>
                <MicOff className="w-12 h-12 text-white relative z-10" />
              </>
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>
          <p className={`font-medium text-lg ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
            {isListening ? 'Listening...' : 'Tap to Speak'}
          </p>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none rounded-t-2xl"></div>
        <textarea
          value={value}
          onChange={e => {
            onChange(e.target.value)
            setIsTypingMode(true)
          }}
          placeholder="e.g. My buffalo has blisters on its mouth..."
          className="w-full h-40 p-5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:ring-0 resize-none text-lg text-slate-800 shadow-inner bg-slate-50"
        />
      </div>

      <div className="flex gap-4">
        {supported && (
          <button 
            onClick={() => setIsTypingMode(!isTypingMode)}
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium"
          >
            {isTypingMode ? <Mic className="w-5 h-5" /> : <Type className="w-5 h-5" />}
          </button>
        )}
        <button
          onClick={() => { stop(); onSubmit() }}
          disabled={!value.trim()}
          className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          Diagnose Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
