import { useState, useRef, useCallback } from 'react'

export function useCamera() {
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access requires HTTPS or is not supported in this browser.')
      }
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.play().catch(e => console.error(e))
      }
    } catch (err) {
      setError(err.message || 'Camera permission denied')
    }
  }, [])

  const capture = useCallback(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
      setCapturedImage(file)
      setPreview(URL.createObjectURL(blob))
      stopCamera()
    }, 'image/jpeg', 0.85)
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
    }
  }, [stream])

  const reset = () => {
    setCapturedImage(null)
    setPreview(null)
    setError(null)
  }

  return { videoRef, canvasRef, capturedImage, preview, error, startCamera, capture, stopCamera, reset, stream }
}
