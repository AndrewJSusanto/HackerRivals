import { getClient, INDICES, awardPoints } from '../lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, challengeId } = req.body
  if (!userId || !challengeId) return res.status(400).json({ error: 'userId and challengeId required' })

  const client = getClient()

  const [user, challenge] = await Promise.all([
    client.get({ index: INDICES.USERS, id: userId }),
    client.get({ index: INDICES.CHALLENGES, id: challengeId }),
  ])

  if (!challenge.found || challenge._source.type !== 'booth') {
    return res.status(404).json({ error: 'Booth challenge not found' })
  }
  if (user._source.completed_challenges?.includes(challengeId)) {
    return res.status(409).json({ error: 'Already checked in here' })
  }

  const { points, title } = challenge._source
  await awardPoints(userId, challengeId, 'booth', points)

  res.json({ points, message: `${title} — checked in!` })
}
