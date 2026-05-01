import { useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Camera as CameraIcon, RefreshCw } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Camera() {
  const { challengeId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [phase, setPhase] = useState('idle') // idle | live | captured | submitting | result
  const [capturedImg, setCapturedImg] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [challenge, setChallenge] = useState(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      setPhase('live')

      // Fetch challenge details
      const { data } = await api.get(`/challenge/${challengeId}`)
      setChallenge(data)
    } catch {
      setError('Camera access denied')
    }
  }, [challengeId])

  const capture = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setCapturedImg(dataUrl)
    streamRef.current?.getTracks().forEach(t => t.stop())
    setPhase('captured')
  }

  const submit = async () => {
    setPhase('submitting')
    try {
      const { data } = await api.post('/vision', {
        userId: user.id,
        challengeId,
        image: capturedImg,
      })
      setResult(data)
      setPhase('result')
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed')
      setPhase('captured')
    }
  }

  const retake = () => {
    setCapturedImg(null)
    setPhase('idle')
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Photo Challenge</h1>
      {challenge && <p className="text-slate-400 text-sm">{challenge.description}</p>}

      {phase === 'idle' && (
        <button
          onClick={startCamera}
          className="w-full bg-green-500 text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2"
        >
          <CameraIcon size={20} /> Open Camera
        </button>
      )}

      <div className={phase === 'live' ? 'block' : 'hidden'}>
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
        <button onClick={capture} className="w-full mt-4 bg-white text-black font-semibold py-4 rounded-xl">
          Take Photo
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {phase === 'captured' && capturedImg && (
        <div className="space-y-3">
          <img src={capturedImg} alt="captured" className="w-full rounded-xl" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button onClick={retake} className="flex-1 border border-slate-600 py-3 rounded-xl flex items-center justify-center gap-2">
              <RefreshCw size={16} /> Retake
            </button>
            <button onClick={submit} className="flex-1 bg-green-500 text-black font-semibold py-3 rounded-xl">
              Submit
            </button>
          </div>
        </div>
      )}

      {phase === 'submitting' && (
        <div className="flex flex-col items-center py-12 gap-3">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Analyzing image...</p>
        </div>
      )}

      {phase === 'result' && result && (
        <div className={`rounded-xl p-5 text-center border ${result.passed ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
          <p className="text-3xl mb-2">{result.passed ? '✅' : '❌'}</p>
          <p className="font-semibold">{result.message}</p>
          {result.passed && <p className="text-green-400 text-xl font-bold mt-2">+{result.points} pts</p>}
          <button onClick={() => navigate('/')} className="mt-4 bg-slate-700 px-6 py-2 rounded-lg">
            Back to Home
          </button>
        </div>
      )}
    </div>
  )
}
