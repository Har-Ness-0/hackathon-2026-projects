import { useSearchParams } from 'react-router-dom'
import OutbreakMap from '../components/OutbreakMap'

export default function MapPage() {
  const [searchParams] = useSearchParams()
  const highlightId = searchParams.get('highlight') || undefined

  return (
    <div className="bg-slate-50">
      <OutbreakMap highlightId={highlightId} />
    </div>
  )
}
