import { useState, useEffect, useRef, useCallback } from 'react'
import { X, CheckCircle2, XCircle, RefreshCw, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function ChallengeModal({ challenge, onClose, onComplete }) {
  // challenge: { type, challengeId, title, description, points }
  const { user } = useAuth()
  const [phase, setPhase] = useState('loading') // loading | ready | submitting | result
  const [data, setData] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (challenge.type === 'quiz') {
      api.get(`/quiz/${challenge.challengeId}`)
        .then(r => { setData(r.data); setPhase('ready') })
    } else {
      // booth and photo have enough data from the scan response
      setData(challenge)
      setPhase('ready')
    }
  }, [challenge])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={phase === 'result' ? onClose : undefined} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-slate-900 rounded-t-2xl border-t border-slate-700 max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800 shrink-0">
          <div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${typeColor(challenge.type)}`}>
              {typeLabel(challenge.type)}
            </span>
            <h2 className="font-bold text-base mt-0.5">{challenge.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {phase === 'loading' && <Spinner />}

          {phase === 'ready' && challenge.type === 'booth' && (
            <BoothView
              data={data}
              userId={user.id}
              challengeId={challenge.challengeId}
              onSubmit={(r) => { setResult(r); setPhase('result') }}
              onLoading={() => setPhase('submitting')}
            />
          )}

          {phase === 'ready' && challenge.type === 'quiz' && (
            <QuizView
              data={data}
              userId={user.id}
              onSubmit={(r) => { setResult(r); setPhase('result') }}
              onLoading={() => setPhase('submitting')}
            />
          )}

          {phase === 'ready' && challenge.type === 'photo' && (
            <PhotoView
              data={data}
              userId={user.id}
              challengeId={challenge.challengeId}
              onSubmit={(r) => { setResult(r); setPhase('result') }}
              onLoading={() => setPhase('submitting')}
            />
          )}

          {phase === 'submitting' && <Spinner label="Submitting..." />}

          {phase === 'result' && (
            <ResultView
              result={result}
              onClose={() => { onComplete(result); onClose() }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Booth ────────────────────────────────────────────────────────────────────

function BoothView({ data, userId, challengeId, onSubmit, onLoading }) {
  const [error, setError] = useState(null)

  const checkin = async () => {
    onLoading()
    try {
      const { data: r } = await api.post('/booth/checkin', { userId, challengeId })
      onSubmit({ passed: true, points: r.points, message: r.message })
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed')
      onSubmit({ passed: false, points: 0, message: err.response?.data?.error || 'Check-in failed' })
    }
  }

  return (
    <div className="p-5 space-y-4">
      {data.description && <p className="text-slate-400 text-sm">{data.description}</p>}
      <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
        <span className="text-slate-400 text-sm">Points on check-in</span>
        <span className="text-green-400 font-bold font-mono">+{data.points}</span>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        onClick={checkin}
        className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-4 rounded-xl text-base transition-colors"
      >
        Check In
      </button>
    </div>
  )
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

function QuizView({ data, userId, onSubmit, onLoading }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])

  const q = data?.questions?.[step]
  const chosen = answers[step]
  const isLast = step === (data?.questions?.length ?? 1) - 1

  const advance = async () => {
    if (!isLast) { setStep(s => s + 1); return }
    onLoading()
    try {
      const { data: r } = await api.post('/quiz/submit', {
        quizId: data.id,
        userId,
        answers,
      })
      onSubmit({
        passed: r.correct > 0,
        points: r.points,
        message: `${r.correct}/${r.total} correct`,
        perfect: r.perfect,
      })
    } catch (err) {
      onSubmit({ passed: false, points: 0, message: 'Submission failed' })
    }
  }

  if (!q) return <Spinner />

  return (
    <div className="p-5 space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-green-400 h-1.5 rounded-full transition-all"
            style={{ width: `${((step + 1) / data.questions.length) * 100}%` }}
          />
        </div>
        <span className="text-slate-500 text-xs shrink-0">{step + 1}/{data.questions.length}</span>
      </div>

      <p className="font-semibold text-base leading-snug">{q.prompt}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setAnswers(a => { const n = [...a]; n[step] = i; return n })}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
              chosen === i
                ? 'border-green-500 bg-green-900/30 text-green-300'
                : 'border-slate-700 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={advance}
        disabled={chosen === undefined}
        className="w-full bg-green-500 disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-colors"
      >
        {isLast ? 'Submit' : 'Next'}
      </button>
    </div>
  )
}

// ─── Photo ────────────────────────────────────────────────────────────────────

function PhotoView({ data, userId, challengeId, onSubmit, onLoading }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [photoPhase, setPhotoPhase] = useState('idle') // idle | live | captured
  const [capturedImg, setCapturedImg] = useState(null)
  const [error, setError] = useState(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      setPhotoPhase('live')
    } catch {
      setError('Camera access denied')
    }
  }, [])

  const capture = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    setCapturedImg(canvas.toDataURL('image/jpeg', 0.85))
    streamRef.current?.getTracks().forEach(t => t.stop())
    setPhotoPhase('captured')
  }

  const retake = () => { setCapturedImg(null); setPhotoPhase('idle') }

  const submit = async () => {
    onLoading()
    try {
      const { data: r } = await api.post('/vision', { userId, challengeId, image: capturedImg })
      onSubmit({ passed: r.passed, points: r.points, message: r.message })
    } catch (err) {
      onSubmit({ passed: false, points: 0, message: 'Submission failed' })
    }
  }

  return (
    <div className="p-5 space-y-4">
      {data.description && <p className="text-slate-400 text-sm">{data.description}</p>}

      {photoPhase === 'idle' && (
        <button
          onClick={startCamera}
          className="w-full bg-slate-800 border border-slate-700 py-10 rounded-xl flex flex-col items-center gap-2 text-slate-400 hover:border-slate-500 transition-colors"
        >
          <Camera size={28} />
          <span className="text-sm">Open Camera</span>
        </button>
      )}

      <div className={photoPhase === 'live' ? 'block space-y-3' : 'hidden'}>
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
        <button onClick={capture} className="w-full bg-white text-black font-semibold py-3 rounded-xl">
          Take Photo
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {photoPhase === 'captured' && capturedImg && (
        <div className="space-y-3">
          <img src={capturedImg} alt="captured" className="w-full rounded-xl" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button onClick={retake} className="flex-1 border border-slate-600 py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
              <RefreshCw size={14} /> Retake
            </button>
            <button onClick={submit} className="flex-1 bg-green-500 text-black font-semibold py-3 rounded-xl text-sm">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Result ───────────────────────────────────────────────────────────────────

function ResultView({ result, onClose }) {
  return (
    <div className="p-5 flex flex-col items-center gap-3 text-center py-10">
      {result.passed
        ? <CheckCircle2 size={48} className="text-green-400" />
        : <XCircle size={48} className="text-red-400" />
      }
      <p className="font-semibold text-lg">{result.message}</p>
      {result.passed && (
        <p className="text-3xl font-bold text-green-400">+{result.points} pts</p>
      )}
      {result.perfect && (
        <p className="text-yellow-400 text-sm">Perfect score! 🏆</p>
      )}
      <button
        onClick={onClose}
        className={`mt-2 w-full font-semibold py-3 rounded-xl ${result.passed ? 'bg-green-500 text-black' : 'bg-slate-700 text-white'}`}
      >
        {result.passed ? 'Awesome!' : 'Try Another'}
      </button>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-7 h-7 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  )
}

function typeLabel(type) {
  return { booth: 'Booth Check-in', quiz: 'Quiz', photo: 'Photo Challenge' }[type] ?? type
}

function typeColor(type) {
  return { booth: 'text-blue-400', quiz: 'text-purple-400', photo: 'text-orange-400' }[type] ?? 'text-slate-400'
}
