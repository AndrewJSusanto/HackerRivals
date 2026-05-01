import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const LOGIN_POINTS = 25

export default function SetUsername() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Already has a username — skip straight to home
  if (user?.username) {
    navigate('/', { replace: true })
    return null
  }

  const valid = /^[a-zA-Z0-9_]{3,20}$/.test(username)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/user/username', { userId: user.id, username })
      login(data.user)
      navigate('/', { replace: true, state: { firstLogin: true } })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set username')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Choose your handle</h1>
        <p className="text-slate-400 text-sm mt-2">
          This is what the leaderboard will show — pick something good.
        </p>
        {user?.name && (
          <p className="text-slate-600 text-xs mt-1">Registered as: {user.name}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm select-none">@</span>
          <input
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(null) }}
            placeholder="hackerman99"
            maxLength={20}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-green-500 font-mono"
          />
        </div>

        <p className={`text-xs text-center transition-colors ${
          username.length === 0 ? 'text-slate-600'
          : valid ? 'text-green-500'
          : 'text-red-400'
        }`}>
          {username.length === 0
            ? '3–20 characters · letters, numbers, underscores'
            : valid
            ? `@${username.toLowerCase()} looks good`
            : 'Letters, numbers and underscores only (3–20 chars)'}
        </p>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={!valid || loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? 'Saving...' : `Claim @${username.toLowerCase() || 'handle'} · +${LOGIN_POINTS} pts`}
        </button>
      </form>
    </div>
  )
}
