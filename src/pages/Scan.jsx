import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRScanner from '../components/QRScanner'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Scan() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle') // idle | scanning | processing | success | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleScan = async (raw) => {
    if (status === 'processing') return
    setStatus('processing')
    try {
      const { data } = await api.post('/scan', { token: raw, userId: user.id })
      setResult(data)
      setStatus('success')

      // Route based on challenge type
      if (data.type === 'quiz') navigate(`/quiz/${data.challengeId}`)
      else if (data.type === 'photo') navigate(`/camera/${data.challengeId}`)
      // booth type is resolved on server, shows points here
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid QR code')
      setStatus('error')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Scan QR Code</h1>
      <p className="text-slate-400 text-sm">Point your camera at a booth or challenge QR code</p>

      {(status === 'idle' || status === 'scanning') && (
        <QRScanner onScan={handleScan} onStart={() => setStatus('scanning')} />
      )}

      {status === 'processing' && (
        <div className="flex flex-col items-center py-12 gap-3">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Processing...</p>
        </div>
      )}

      {status === 'success' && (result?.type === 'booth' || result?.type === 'pair') && (
        <div className="bg-green-900/30 border border-green-500 rounded-xl p-5 text-center space-y-1">
          {result.type === 'pair' && (
            <p className="text-slate-400 text-sm">Paired with</p>
          )}
          {result.type === 'pair' && (
            <p className="text-lg font-bold">{result.partner.name}</p>
          )}
          {result.partner?.team && (
            <p className="text-slate-400 text-sm">{result.partner.team}</p>
          )}
          <p className="text-2xl font-bold text-green-400 pt-1">+{result.points} pts</p>
          <p className="text-slate-300 text-sm">{result.message}</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-3 bg-green-500 text-black font-semibold px-6 py-2 rounded-lg"
          >
            Scan Another
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-900/30 border border-red-500 rounded-xl p-5 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => { setStatus('idle'); setError(null) }}
            className="mt-4 bg-slate-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Manual code entry fallback */}
      <ManualEntry onSubmit={handleScan} />
    </div>
  )
}

function ManualEntry({ onSubmit }) {
  const [code, setCode] = useState('')
  return (
    <div className="mt-4">
      <p className="text-slate-500 text-xs mb-2 text-center">Or enter code manually</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="BOOTH-CODE"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        />
        <button
          onClick={() => { onSubmit(code); setCode('') }}
          disabled={!code}
          className="bg-green-500 text-black font-semibold px-4 py-2 rounded-lg disabled:opacity-40"
        >
          Go
        </button>
      </div>
    </div>
  )
}
