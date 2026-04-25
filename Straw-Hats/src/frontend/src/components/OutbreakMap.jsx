import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { getAllDiagnoses, getOutbreaks } from '../lib/api'

const SEVERITY_COLORS = {
  low: '#16A34A', 
  medium: '#D97706', 
  high: '#EA580C', 
  critical: '#DC2626'
}

export default function OutbreakMap({ highlightId }) {
  const [diagnoses, setDiagnoses] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fetch diagnoses from real API
    getAllDiagnoses().then(data => setDiagnoses(data || []))
    getOutbreaks().then(data => setOutbreaks(data || []))
  }, [])

  const withCoords = diagnoses.filter(d => d.lat && d.lng)

  if (!mounted) return null

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      {/* Alert Banner Layer */}
      {outbreaks.length > 0 && (
        <div className="absolute top-4 inset-x-4 z-[400] flex flex-col gap-2 pointer-events-none">
          {outbreaks.map((ob, i) => (
            <div key={i} className="bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg border-2 border-red-500/50 flex items-start gap-3 animate-in slide-in-from-top duration-500 max-w-md mx-auto w-full pointer-events-auto">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold">OUTBREAK ALERT</p>
                <p className="text-red-100 text-sm">{ob.count} cases of {ob.disease} in {ob.region} in the last 48 hours.</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map Layer */}
      <MapContainer 
        center={[27.7172, 85.3240]} // Default to Nepal
        zoom={7}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {withCoords.map(d => (
          <CircleMarker
            key={d.id}
            center={[d.lat, d.lng]}
            radius={d.id === highlightId ? 18 : 10}
            pathOptions={{
              color: SEVERITY_COLORS[d.severity] || '#64748B',
              fillColor: SEVERITY_COLORS[d.severity] || '#64748B',
              fillOpacity: 0.6,
              weight: d.id === highlightId ? 4 : 2,
            }}
          >
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-1 min-w-[150px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="capitalize text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {d.animal_type}
                  </span>
                  <span className="text-xs font-bold ml-auto" style={{ color: SEVERITY_COLORS[d.severity] }}>
                    {d.severity?.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{d.disease}</h4>
                <p className="text-xs text-slate-500">{d.created_at ? new Date(d.created_at).toLocaleDateString() : ''}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
