import { useState, useRef, useCallback } from 'react'

const LANG_MAP = { en: 'en-US', ne: 'ne-NP', hi: 'hi-IN' }

export function useVoice(language = 'ne') {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [supported, setSupported] = useState('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  const recRef = useRef(null)

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    const rec = new SR()
    rec.lang = LANG_MAP[language] || 'ne-NP'
    rec.continuous = true
    rec.interimResults = true

    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(text)
    }

    rec.onerror = () => setIsListening(false)
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

  return { transcript, setTranscript, isListening, supported, start, stop }
}
