import { useCamera } from '../hooks/useCamera'
import { Camera, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function CameraCapture({ onCapture }) {
  const { videoRef, canvasRef, capturedImage, preview, error, startCamera, capture, reset, stream } = useCamera()
  const firedRef = useRef(false)

  useEffect(() => {
    if (capturedImage && preview && !firedRef.current) {
      firedRef.current = true
      onCapture(capturedImage, preview)
    }
  }, [capturedImage, preview])

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    firedRef.current = true
    onCapture(file, URL.createObjectURL(file))
  }

  if (capturedImage) {
    return (
      <div className="flex flex-col items-center gap-6 animate-in slide-in-from-right-4 duration-300">
        <h2 className="text-2xl font-bold text-slate-800">Photo Captured</h2>
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border-4 border-white">
          <img src={preview} className="w-full h-auto object-cover aspect-4/3" alt="Captured" />
        </div>
        <button 
          onClick={() => { firedRef.current = false; reset() }} 
          className="flex items-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors py-2 px-4 rounded-full hover:bg-slate-100"
        >
          <RefreshCw className="w-5 h-5" />
          Retake Photo
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 text-center">Take a Photo</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center">
          {error}
        </div>
      )}
      
      <div className={`relative w-full aspect-4/3 bg-slate-900 rounded-2xl overflow-hidden shadow-inner ${stream ? 'block' : 'hidden'}`}>
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      {!stream ? (
        <div className="flex gap-4">
          <button 
            onClick={startCamera} 
            className="flex-1 flex flex-col items-center justify-center gap-3 bg-teal-500 hover:bg-teal-600 text-white py-8 rounded-2xl transition-colors shadow-md active:scale-[0.98]"
          >
            <Camera className="w-8 h-8" />
            <span className="font-semibold text-lg">Use Camera</span>
          </button>
          
          <label className="flex-1 flex flex-col items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-700 py-8 rounded-2xl cursor-pointer transition-colors shadow-sm active:scale-[0.98]">
            <ImageIcon className="w-8 h-8 text-slate-500" />
            <span className="font-semibold text-lg">Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <button 
          onClick={capture} 
          className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-5 rounded-2xl text-xl font-bold shadow-lg hover:bg-teal-700 transition-colors active:scale-[0.98]"
        >
          <Camera className="w-6 h-6" />
          Capture Now
        </button>
      )}
    </div>
  )
}
