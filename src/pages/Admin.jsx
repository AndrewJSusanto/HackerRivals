import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import api from '../lib/api'

const CHALLENGE_TYPES = ['booth', 'quiz', 'photo', 'social']

export default function Admin() {
  const [activeTab, setActiveTab] = useState('demo')
  const [form, setForm] = useState({
    type: 'booth',
    title: '',
    description: '',
    points: 100,
    code: '',
    questions: [{ prompt: '', options: ['', '', '', ''], answer: 0 }],
    keywords: '',
    min_pairings: 1,
  })
  const [created, setCreated] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('hr_admin_key') || '')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/admin/challenge', form)
      setCreated(data)
      setToast({ type: 'success', message: `Challenge "${data.title}" created` })
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Failed to create challenge' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4">
      {toast && (
        <div
          role="status"
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-[fadeIn_0.2s_ease-out] ${
            toast.type === 'success'
              ? 'bg-green-500 text-black border-green-400'
              : 'bg-red-500 text-white border-red-400'
          }`}
        >
          {toast.message}
        </div>
      )}
      <h1 className="text-xl font-bold">Admin Panel</h1>

      <div className="flex gap-2 items-center">
        <input
          type="password"
          placeholder="Admin key"
          value={adminKey}
          onChange={e => setAdminKey(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono"
        />
        <button
          onClick={() => {
            sessionStorage.setItem('hr_admin_key', adminKey)
            setToast({ type: 'success', message: 'Admin key saved for this session' })
          }}
          disabled={!adminKey}
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-sm"
        >
          Save
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['demo', 'create', 'qr'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-300'}`}
          >
            {{ demo: 'Demo QR', create: 'Create Challenge', qr: 'View QRs' }[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'demo' && <DemoQR />}

      {activeTab === 'create' && (
        <form onSubmit={handleCreate} className="space-y-4">
          <select
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
          >
            {CHALLENGE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>

          {['title', 'description'].map(field => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
              required
            />
          ))}

          <input
            type="number"
            placeholder="Points"
            value={form.points}
            onChange={e => setForm(f => ({ ...f, points: Number(e.target.value) }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
          />

          {form.type === 'booth' && (
            <input
              type="text"
              placeholder="Booth code (e.g. BOOTH-01)"
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            />
          )}

          {form.type === 'photo' && (
            <input
              type="text"
              placeholder="Keywords for image recognition (comma-separated)"
              value={form.keywords}
              onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            />
          )}

          {form.type === 'social' && (
            <div className="space-y-2">
              <label className="block text-sm text-slate-400">
                Number of attendees the user must scan to complete this objective
              </label>
              <input
                type="number"
                min={1}
                placeholder="Min attendees to scan"
                value={form.min_pairings}
                onChange={e => setForm(f => ({ ...f, min_pairings: Math.max(1, Number(e.target.value) || 1) }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
              />
              <p className="text-xs text-slate-500">
                No QR code needed — completion fires automatically when the user has paired with at least this many attendees.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-black font-semibold py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Challenge'}
          </button>
        </form>
      )}

      {created && (
        <div className="bg-slate-900 rounded-xl p-4 space-y-3 text-center">
          <p className="text-green-400 font-semibold">Challenge created!</p>
          <div className="bg-white p-3 rounded-xl inline-block">
            <QRCodeSVG value={created.qr_value} size={160} />
          </div>
          <p className="text-sm text-slate-400 font-mono">{created.qr_value}</p>
        </div>
      )}
    </div>
  )
}

function DemoQR() {
  const loginUrl = `${window.location.origin}/login`

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-slate-400 text-sm text-center">
        Print or display this QR at your event.<br />
        Scanning it opens the join screen directly.
      </p>

      <div className="bg-white p-5 rounded-2xl shadow-lg" id="demo-qr-svg">
        <QRCodeSVG value={loginUrl} size={200} />
      </div>

      <p className="text-xs text-slate-500 font-mono break-all text-center px-4">{loginUrl}</p>

      <div className="flex gap-3 w-full">
        <button
          onClick={() => navigator.clipboard.writeText(loginUrl)}
          className="flex-1 border border-slate-600 text-slate-300 py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors"
        >
          Copy URL
        </button>
        <button
          onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(loginUrl)}`, '_blank')}
          className="flex-1 bg-green-500 text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-green-400 transition-colors"
        >
          Download PNG
        </button>
      </div>
    </div>
  )
}
