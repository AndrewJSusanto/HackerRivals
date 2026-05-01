import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Trophy, ZoomIn, ZoomOut, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useMyRank } from '../hooks/useMyRank'
import LeaderboardDrawer from '../components/LeaderboardDrawer'
import Objectives from '../components/Objectives'

const LOGIN_POINTS = 25

export default function Home() {
  const { user } = useAuth()
  const { rank, points } = useMyRank(user.id)
  const { state } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)
  const [showWelcome, setShowWelcome] = useState(!!state?.firstLogin)
  const mapRef = useRef(null)

  // Clear location state so refresh doesn't re-show the banner
  useEffect(() => {
    if (state?.firstLogin) window.history.replaceState({}, '')
  }, [])

  const zoomMap = (delta) => setMapZoom(z => Math.min(3, Math.max(1, z + delta)))

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-56px)]">

        {showWelcome && (
          <div className="mx-4 mt-4 flex items-center justify-between bg-green-900/40 border border-green-600 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-green-300">Welcome, {user.name}!</p>
              <p className="text-xs text-green-500 mt-0.5">+{LOGIN_POINTS} pts for joining the hunt</p>
            </div>
            <button onClick={() => setShowWelcome(false)} className="text-green-600 hover:text-green-400 p-1">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <div>
            <h1 className="text-lg font-bold leading-tight">{user.name}</h1>
            {user.team && <p className="text-xs text-slate-500">{user.team}</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-500">Points</p>
              <p className="text-lg font-bold text-green-400 leading-tight">{points ?? user.total_points ?? 0}</p>
            </div>
            {rank && (
              <div className="text-right">
                <p className="text-xs text-slate-500">Rank</p>
                <p className="text-lg font-bold text-yellow-400 leading-tight">#{rank}</p>
              </div>
            )}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-yellow-400 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Trophy size={16} />
              Board
            </button>
          </div>
        </div>

        {/* Event Map */}
        <div className="relative mx-4 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
          <div
            ref={mapRef}
            className="overflow-auto"
            style={{ maxHeight: '42vh' }}
          >
            <img
              src="/event-map.png"
              alt="Event map"
              draggable={false}
              style={{
                transform: `scale(${mapZoom})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease',
                width: '100%',
                display: 'block',
              }}
              onError={e => { e.target.style.display = 'none' }}
            />
            {/* Placeholder shown when map image isn't loaded yet */}
            <MapPlaceholder />
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-2 right-2 flex flex-col gap-1">
            <button
              onClick={() => zoomMap(0.5)}
              className="bg-black/60 hover:bg-black/80 text-white rounded-lg p-1.5 backdrop-blur-sm"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => zoomMap(-0.5)}
              className="bg-black/60 hover:bg-black/80 text-white rounded-lg p-1.5 backdrop-blur-sm"
            >
              <ZoomOut size={16} />
            </button>
          </div>

          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-xs text-slate-300 px-2 py-1 rounded-lg">
            Event Map
          </div>
        </div>

        {/* Objectives */}
        <div className="flex-1 px-4 pt-5 pb-6">
          <Objectives />
        </div>

      </div>

      <LeaderboardDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

function MapPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-600 pointer-events-none">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <span className="text-xs">Place event-map.png in /public</span>
    </div>
  )
}
