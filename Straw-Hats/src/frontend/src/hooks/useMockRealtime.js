import { useEffect, useState } from 'react'
import { getAllDiagnoses } from '../lib/api'

export function useRealtimeDiagnoses() {
  const [diagnoses, setDiagnoses] = useState([])

  useEffect(() => {
    // Initial fetch
    getAllDiagnoses().then(data => setDiagnoses(data || []))

    // Listen to custom mock event
    const handleNewDiagnosis = (event) => {
      setDiagnoses(prev => [event.detail, ...prev])
    }

    window.addEventListener('mock-diagnosis-added', handleNewDiagnosis)

    return () => {
      window.removeEventListener('mock-diagnosis-added', handleNewDiagnosis)
    }
  }, [])

  return diagnoses
}
