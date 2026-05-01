import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import QRScanner from '../components/QRScanner'
import api from '../lib/api'

export default function BadgeLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('scan') // scan | loading | error
  const [error, setError] = useState(null)

  const handleScan = async (token) => {
    setPhase('loading')
    try {
      const { data } = await api.post('/auth/badge', { token })
      login(data.user)
      navigate(data.firstLogin ? '/set-username' : '/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Badge not recognised')
      setPhase('error')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8 max-w-sm mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-400">HackerRivals</h1>
        <p className="text-slate-400 mt-2 text-sm">Scan the QR on your badge to begin</p>
      </div>

      {phase === 'scan' && (
        <div className="w-full">
          <QRScanner onScan={handleScan} />
        </div>
      )}

      {phase === 'loading' && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verifying badge...</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="w-full space-y-4 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => { setPhase('scan'); setError(null) }}
            className="bg-slate-800 border border-slate-600 px-6 py-2 rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      <p className="text-slate-600 text-xs">
        No badge?{' '}
        <Link to="/login" className="text-green-500 hover:text-green-400 underline">
          Join as a demo user
        </Link>
      </p>
    </div>
  )
}
