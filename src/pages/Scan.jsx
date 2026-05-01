import { useState } from 'react'
import QRScanner from '../components/QRScanner'
import ChallengeModal from '../components/ChallengeModal'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Scan() {
  const { user, login } = useAuth()
  const [status, setStatus] = useState('idle') // idle | scanning | processing | pair | error
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [pairResult, setPairResult] = useState(null)
  const [error, setError] = useState(null)

  const reset = () => {
    setStatus('idle')
    setError(null)
    setPairResult(null)
  }

  const handleScan = async (raw) => {
    if (status === 'processing') return
    setStatus('processing')
    try {
      const { data } = await api.post('/scan', { token: raw, userId: user.id })

      if (data.type === 'pair') {
        setPairResult(data)
        setStatus('pair')
      } else {
        // booth / quiz / photo — all go through the modal
        setActiveChallenge(data)
        setStatus('idle')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid QR code')
      setStatus('error')
    }
  }

  const handleModalComplete = (result) => {
    // Optimistically update the user's points in session
    if (result.passed && result.points > 0) {
      login({ ...user, total_points: (user.total_points ?? 0) + result.points })
    }
    setActiveChallenge(null)
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold">Scan QR Code</h1>
        <p className="text-slate-500 text-sm mt-0.5">Point at a booth or another attendee's badge</p>
      </div>

      {(status === 'idle' || status === 'scanning') && (
        <QRScanner onScan={handleScan} onStart={() => setStatus('scanning')} />
      )}

      {status === 'processing' && (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Reading code...</p>
        </div>
      )}

      {status === 'pair' && pairResult && (
        <div className="bg-green-900/30 border border-green-600 rounded-2xl p-5 text-center space-y-1">
          <p className="text-slate-400 text-sm">Paired with</p>
          <p className="text-xl font-bold">@{pairResult.partner.name}</p>
          {pairResult.partner.team && (
            <p className="text-slate-500 text-sm">{pairResult.partner.team}</p>
          )}
          <p className="text-3xl font-bold text-green-400 pt-2">+{pairResult.points} pts</p>
          <p className="text-slate-400 text-sm">both of you earned this</p>
          <button
            onClick={reset}
            className="mt-4 w-full bg-green-500 text-black font-semibold py-3 rounded-xl"
          >
            Scan Another
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-900/30 border border-red-600 rounded-2xl p-5 text-center space-y-3">
          <p className="text-red-400">{error}</p>
          <button onClick={reset} className="bg-slate-700 px-6 py-2 rounded-xl text-sm">
            Try Again
          </button>
        </div>
      )}

      <ManualEntry onSubmit={handleScan} />

      {activeChallenge && (
        <ChallengeModal
          challenge={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onComplete={handleModalComplete}
        />
      )}
    </div>
  )
}

function ManualEntry({ onSubmit }) {
  const [code, setCode] = useState('')
  return (
    <div>
      <p className="text-slate-600 text-xs mb-2 text-center">Or enter code manually</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="BOOTH-CODE"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500"
        />
        <button
          onClick={() => { onSubmit(code); setCode('') }}
          disabled={!code}
          className="bg-green-500 text-black font-semibold px-4 py-2.5 rounded-xl disabled:opacity-40"
        >
          Go
        </button>
      </div>
    </div>
  )
}
