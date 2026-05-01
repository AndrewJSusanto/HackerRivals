import { useEffect, useRef } from 'react'
import { X, Trophy } from 'lucide-react'

const KIBANA_URL = import.meta.env.VITE_KIBANA_LEADERBOARD_URL

export default function LeaderboardDrawer({ open, onClose }) {
  const drawerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 z-40 flex flex-col
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800 shrink-0">
          <h2 className="font-bold flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" /> Leaderboard
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {KIBANA_URL
            ? (
              <iframe
                src={KIBANA_URL}
                title="Live Leaderboard"
                className="w-full h-full border-0 bg-slate-950"
                allow="fullscreen"
              />
            )
            : <KibanaPlaceholder />
          }
        </div>
      </div>
    </>
  )
}

function KibanaPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-600 px-6 text-center">
      <Trophy size={32} />
      <p className="text-sm">Set <code className="text-slate-500">VITE_KIBANA_LEADERBOARD_URL</code> in your env to embed the Kibana dashboard here.</p>
    </div>
  )
}
