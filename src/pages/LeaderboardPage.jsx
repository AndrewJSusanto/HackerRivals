import { Trophy } from 'lucide-react'

const KIBANA_URL = import.meta.env.VITE_KIBANA_LEADERBOARD_URL

export default function LeaderboardPage() {
  if (!KIBANA_URL) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4 text-slate-600 px-6 text-center">
        <Trophy size={40} />
        <p>Set <code className="text-slate-500">VITE_KIBANA_LEADERBOARD_URL</code> to display the live leaderboard.</p>
      </div>
    )
  }

  return (
    <iframe
      src={KIBANA_URL}
      title="Live Leaderboard"
      className="w-full border-0 bg-slate-950"
      style={{ height: 'calc(100vh - 56px)' }}
      allow="fullscreen"
    />
  )
}
