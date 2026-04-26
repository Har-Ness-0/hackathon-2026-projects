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
  const accumulatedRef = useRef('')

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    setTranscript('') 
    accumulatedRef.current = ''

    const rec = new SR()
    rec.lang = LANG_MAP[language] || 'en-US'
    rec.continuous = false 
    rec.interimResults = true

    rec.onresult = (e) => {
      const segment = e.results[0][0].transcript
      if (e.results[0].isFinal) {
        accumulatedRef.current += segment + ' '
        setTranscript(accumulatedRef.current)
      } else {
        setTranscript(accumulatedRef.current + segment)
      }
    }

    rec.onerror = (e) => {
      console.error("Speech recognition error:", e.error)
      setIsListening(false)
    }

    rec.onend = () => {
      if (recRef.current && isListening) {
        try {
          recRef.current.start()
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
          setIsListening(false)
        }
      } else {
        setIsListening(false)
      }
    }
    
    try {
      rec.start()
      recRef.current = rec
      setIsListening(true)
    } catch (err) {
      console.error("Failed to start speech recognition:", err)
    }
  }, [language, isListening])

  const stop = useCallback(() => {
    const rec = recRef.current
    recRef.current = null 
    if (rec) {
      rec.stop()
    }
    setIsListening(false)
  }, [])

  // Stop recording ONLY when language changes so next tap uses correct language
  useEffect(() => {
    if (isListening) {
      setTimeout(() => stop(), 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return { transcript, setTranscript, isListening, supported, start, stop }
}
