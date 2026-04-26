import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_MAP = { en: 'en-US', ne: 'ne-NP', hi: 'hi-IN' }

export function useVoice(language = 'ne') {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [supported] = useState(() => {
    return typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 
       'webkitSpeechRecognition' in window)
  })
  const recRef = useRef(null)

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    const rec = new SR()
    rec.lang = LANG_MAP[language] || 'en-US'
    rec.continuous = true
    rec.interimResults = true

    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(text)
    }

    rec.onerror = (e) => {
      console.error("Speech recognition error:", e.error)
      if (e.error === 'not-allowed') {
        alert("Microphone access was denied. Please check your browser permissions.")
      }
      setIsListening(false)
    }
    rec.onend = () => setIsListening(false)
    rec.start()
    recRef.current = rec
    setIsListening(true)
  }, [language])

  const stop = useCallback(() => {
    if (recRef.current) {
      recRef.current.stop()
    }
    setIsListening(false)
  }, [])

  // Stop recording when language changes so next tap uses correct language
  useEffect(() => {
    if (isListening) {
      setTimeout(() => stop(), 0)
    }
  }, [language, isListening, stop])

  return { transcript, setTranscript, isListening, supported, start, stop }
}
