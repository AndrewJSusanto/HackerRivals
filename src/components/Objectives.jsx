import { CheckCircle2, Circle, QrCode, Camera, BookOpen } from 'lucide-react'
import { useChallenges } from '../hooks/useChallenges'
import { useAuth } from '../context/AuthContext'

const TYPE_META = {
  booth:  { icon: QrCode,    label: 'Booth',  color: 'text-blue-400' },
  quiz:   { icon: BookOpen,  label: 'Quiz',   color: 'text-purple-400' },
  photo:  { icon: Camera,    label: 'Photo',  color: 'text-orange-400' },
}

export default function Objectives() {
  const { user } = useAuth()
  const { challenges, loading } = useChallenges()

  const completed = new Set(user?.completed_challenges ?? [])
  const groups = ['booth', 'quiz', 'photo']

  if (loading) {
    return (
      <div className="space-y-2 px-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-800/60 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  const doneCount = challenges.filter(c => completed.has(c.id)).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Objectives</h2>
        <span className="text-xs text-slate-500">{doneCount}/{challenges.length} done</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-1">
        <div
          className="bg-green-400 h-1 rounded-full transition-all duration-500"
          style={{ width: challenges.length ? `${(doneCount / challenges.length) * 100}%` : '0%' }}
        />
      </div>

      {groups.map(type => {
        const items = challenges.filter(c => c.type === type)
        if (!items.length) return null
        const { icon: Icon, label, color } = TYPE_META[type]

        return (
          <div key={type}>
            <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 ${color}`}>
              <Icon size={12} />
              {label}
            </div>
            <div className="space-y-1.5">
              {items.map(c => {
                const done = completed.has(c.id)
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors
                      ${done ? 'bg-slate-800/40' : 'bg-slate-800/80'}`}
                  >
                    {done
                      ? <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                      : <Circle size={18} className="text-slate-600 shrink-0" />
                    }
                    <span className={`flex-1 text-sm ${done ? 'line-through text-slate-500' : ''}`}>
                      {c.title}
                    </span>
                    <span className={`text-xs font-mono font-semibold shrink-0 ${done ? 'text-slate-600' : 'text-green-400'}`}>
                      {done ? 'done' : `+${c.points}`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
