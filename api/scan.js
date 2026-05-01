import { getClient, INDICES, awardPairing, awardPoints } from './lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { token, userId } = req.body
  if (!token || !userId) return res.status(400).json({ error: 'token and userId required' })

  const client = getClient()
  const scanner = await client.get({ index: INDICES.USERS, id: userId })

  if (scanner._source.qr_token === token) {
    return res.status(400).json({ error: "That's your own badge!" })
  }

  // --- User badge → pairing ---
  const userMatch = await client.search({
    index: INDICES.USERS,
    query: { term: { qr_token: token } },
    size: 1,
  })

  if (userMatch.hits.hits.length > 0) {
    const target = userMatch.hits.hits[0]
    const targetId = target._id

    if (!scanner._source.username) {
      return res.status(403).json({ error: 'Set your username before pairing' })
    }
    if (!target._source.username) {
      return res.status(403).json({ error: `${target._source.name} hasn't set their username yet` })
    }
    if (scanner._source.paired_users?.includes(targetId)) {
      return res.status(409).json({ error: `You already paired with @${target._source.username}` })
    }

    const PAIR_POINTS = 50
    await awardPairing(userId, targetId, PAIR_POINTS)

    const [scannerCompleted, targetCompleted] = await Promise.all([
      checkSocialChallenges(userId),
      checkSocialChallenges(targetId),
    ])

    return res.json({
      type: 'pair',
      points: PAIR_POINTS,
      message: `Paired with @${target._source.username}!`,
      partner: { id: targetId, name: target._source.username, team: target._source.team },
      completedChallenges: scannerCompleted,
      partnerCompletedChallenges: targetCompleted,
    })
  }

  // --- Challenge QR ---
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
  const { type, title, description, points } = challenge._source

  if (scanner._source.completed_challenges?.includes(cid)) {
    return res.status(409).json({ error: 'Already completed this challenge' })
  }

  // All challenge types now return to the frontend for modal handling —
  // no points are awarded at scan time
  res.json({ type, challengeId: cid, title, description, points })
}

async function checkSocialChallenges(userId) {
  const client = getClient()
  const user = await client.get({ index: INDICES.USERS, id: userId })
  const pairCount = user._source.paired_users?.length || 0
  const completed = user._source.completed_challenges || []

  const result = await client.search({
    index: INDICES.CHALLENGES,
    size: 50,
    query: { bool: { must: [{ term: { type: 'social' } }, { term: { active: true } }] } },
  })

  const newlyCompleted = []
  for (const hit of result.hits.hits) {
    const cid = hit._id
    const min = hit._source.min_pairings || 1
    if (completed.includes(cid)) continue
    if (pairCount >= min) {
      await awardPoints(userId, cid, 'social', hit._source.points)
      newlyCompleted.push({ id: cid, title: hit._source.title, points: hit._source.points })
    }
  }
  return newlyCompleted
}
