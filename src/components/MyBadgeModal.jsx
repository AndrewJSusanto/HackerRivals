import { useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Users } from 'lucide-react'

export default function MyBadgeModal({ open, onClose, user }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-5 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-2"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Your Badge</p>
          <p className="text-2xl font-bold mt-1">
            {user.emoji} @{user.username}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl mx-auto w-fit">
          <QRCodeSVG value={user.qr_token} size={220} level="H" />
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Users size={16} />
            <span className="text-sm font-semibold">+50 pts each when paired</span>
          </div>
          <p className="text-xs text-slate-500">
            Show this to a teammate. When they scan it from their Scan tab, you both score points.
          </p>
          <p className="text-xs text-slate-600 font-mono pt-1">{user.qr_token}</p>
        </div>
      </div>
    </div>
  )
}
