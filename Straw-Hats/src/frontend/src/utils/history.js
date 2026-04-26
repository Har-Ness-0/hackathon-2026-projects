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
