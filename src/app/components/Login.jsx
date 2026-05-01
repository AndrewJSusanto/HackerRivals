import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const EMOJIS = [
  '🚀','💻','🤖','🧠','⚡','🔥','🏆','👑','🦄','🐉',
  '💡','🎯','🛸','🔬','🎮','🕹️','🧬','⚔️','🦾','🐍',
  '🦊','🐺','🦁','🐯','😈','🧙','🥷','👾','🌟','🧊',
]

export default function Login() {
  const { login } = useAuth()
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const valid = /^[a-zA-Z0-9_]{3,20}$/.test(username)
  const displayName = `${emoji} ${username.toLowerCase() || 'yourhandle'}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          emoji 
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create user')
      }
      
      const { user } = await response.json()
      login(user)
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-6 pt-12 gap-7 max-w-sm mx-auto">

      {/* Branding */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-400 tracking-tight">HackerRivals</h1>
        <p className="text-slate-400 text-sm mt-2">Hackathon Scavenger Hunt</p>
      </div>

      {/* Live preview */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl py-4 text-center">
        <p className="text-xs text-slate-500 mb-1">Your leaderboard name</p>
        <p className="text-3xl font-bold tracking-tight">{displayName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Emoji grid */}
        <div>
          <p className="text-xs font-medium text-slate-400 mb-2">Pick your emoji</p>
          <div className="grid grid-cols-10 gap-1.5">
            {EMOJIS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-xl p-1 rounded-lg transition-all ${
                  emoji === e
                    ? 'bg-green-500/20 ring-1 ring-green-500 scale-110'
                    : 'hover:bg-slate-700'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Username */}
        <div>
          <p className="text-xs font-medium text-slate-400 mb-2">Choose a handle</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 select-none">@</span>
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
          <p className={`text-xs mt-1.5 transition-colors ${
            username.length === 0 ? 'text-slate-600'
            : valid ? 'text-green-500'
            : 'text-red-400'
          }`}>
            {username.length === 0
              ? '3–20 chars · letters, numbers, underscores'
              : valid ? `${emoji} ${username.toLowerCase()} is available — maybe`
              : 'Letters, numbers and underscores only (3–20 chars)'}
          </p>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={!valid || loading}
          className="w-full bg-green-500 hover:bg-green-400 active:bg-green-600 disabled:opacity-40 text-black font-bold py-4 rounded-2xl text-base transition-colors"
        >
          {loading ? 'Joining...' : 'Join the Hunt →'}
        </button>
      </form>

      <p className="text-slate-600 text-xs text-center pb-4">
        Have an event badge? <span className="text-green-500">Scan it here</span>
      </p>
    </div>
  )
}
