import { getClient, INDICES } from '../lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { userId, top } = req.query
  if (!userId) return res.status(400).json({ error: 'userId required' })

  const client = getClient()

  const user = await client.get({ index: INDICES.USERS, id: userId, _source: ['total_points'] })
  if (!user.found) return res.status(404).json({ error: 'User not found' })

  const above = await client.count({
    index: INDICES.USERS,
    query: { range: { total_points: { gt: user._source.total_points } } },
  })

  const payload = { rank: above.count + 1, points: user._source.total_points }

  const topN = Math.max(0, Math.min(50, parseInt(top, 10) || 0))
  if (topN > 0) {
    const result = await client.search({
      index: INDICES.USERS,
      size: topN,
      sort: [{ total_points: 'desc' }],
      _source: ['username', 'emoji', 'total_points'],
    })
    payload.top = result.hits.hits
      .filter((h) => h._source.username)
      .map((h) => ({
        id: h._id,
        username: h._source.username,
        emoji: h._source.emoji,
        total_points: h._source.total_points || 0,
      }))
  }

  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10')
  res.json(payload)
}
