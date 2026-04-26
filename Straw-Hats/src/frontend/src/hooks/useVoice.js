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
  const finalTranscriptRef = useRef('')

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    finalTranscriptRef.current = ''
    setTranscript('') // Clear previous session's text

    const rec = new SR()
    rec.lang = LANG_MAP[language] || 'en-US'
    rec.continuous = true
    rec.interimResults = true

    rec.onresult = (e) => {
      let interimTranscript = ''
      let newFinalTranscript = ''

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const transcriptSegment = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          newFinalTranscript += transcriptSegment
        } else {
          interimTranscript += transcriptSegment
        }
      }

      if (newFinalTranscript) {
        finalTranscriptRef.current += newFinalTranscript
      }
      
      setTranscript(finalTranscriptRef.current + interimTranscript)
    }

    rec.onerror = (e) => {
      console.error("Speech recognition error:", e.error)
      if (e.error === 'not-allowed') {
        alert("Microphone access was denied. Please check your browser permissions.")
      }
      setIsListening(false)
    }
    rec.onend = () => setIsListening(false)
    
    try {
      rec.start()
      recRef.current = rec
      setIsListening(true)
    } catch (err) {
      console.error("Failed to start speech recognition:", err)
    }
  }, [language])

  const stop = useCallback(() => {
    if (recRef.current) {
      recRef.current.stop()
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
