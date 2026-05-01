import { useState, useEffect } from 'react'
import api from '../lib/api'

export function useMyRank(userId, pollInterval = 10000) {
  const [rank, setRank] = useState(null)
  const [points, setPoints] = useState(null)

  useEffect(() => {
    if (!userId) return
    const fetch = () =>
      api.get(`/user/rank?userId=${userId}`)
        .then(r => { setRank(r.data.rank); setPoints(r.data.points) })
        .catch(() => {})

    fetch()
    const t = setInterval(fetch, pollInterval)
    return () => clearInterval(t)
  }, [userId, pollInterval])

  return { rank, points }
}
