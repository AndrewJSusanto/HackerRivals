import { getClient, INDICES, awardPoints, awardPairing } from './lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { token, userId } = req.body
  if (!token || !userId) return res.status(400).json({ error: 'token and userId required' })

  // Self-scan guard
  const client = getClient()
  const scanner = await client.get({ index: INDICES.USERS, id: userId })
  if (scanner._source.qr_token === token) {
    return res.status(400).json({ error: "That's your own badge!" })
  }

  // --- Try user badge (pairing) first ---
  const userMatch = await client.search({
    index: INDICES.USERS,
    query: { term: { qr_token: token } },
    size: 1,
  })

  if (userMatch.hits.hits.length > 0) {
    const target = userMatch.hits.hits[0]
    const targetId = target._id

    // Prevent scanning the same person twice
    if (scanner._source.paired_users?.includes(targetId)) {
      return res.status(409).json({ error: `You already paired with ${target._source.name}` })
    }

    const PAIR_POINTS = 50
    await awardPairing(userId, targetId, PAIR_POINTS)

    return res.json({
      type: 'pair',
      points: PAIR_POINTS,
      message: `Paired with ${target._source.name}!`,
      partner: { id: targetId, name: target._source.name, team: target._source.team },
    })
  }

  // --- Try challenge code ---
  const challengeMatch = await client.search({
    index: INDICES.CHALLENGES,
    query: { term: { code: token } },
    size: 1,
  })

  if (!challengeMatch.hits.hits.length) {
    return res.status(404).json({ error: 'Unknown QR code' })
  }

  const challenge = challengeMatch.hits.hits[0]
  const cid = challenge._id
  const { type, points, title } = challenge._source

  if (scanner._source.completed_challenges?.includes(cid)) {
    return res.status(409).json({ error: 'Already completed this challenge' })
  }

  // Booth resolves instantly; quiz/photo need the frontend flow
  if (type === 'booth') {
    await awardPoints(userId, cid, 'booth', points)
    return res.json({ type: 'booth', points, message: `${title} — checked in!`, challengeId: cid })
  }

  res.json({ type, challengeId: cid, title })
}
