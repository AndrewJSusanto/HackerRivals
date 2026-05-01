import { useState, useEffect } from 'react'
import api from '../lib/api'

export function useChallenges() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/challenges')
      .then(r => setChallenges(r.data.challenges))
      .finally(() => setLoading(false))
  }, [])

  return { challenges, loading }
}
