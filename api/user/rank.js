import { getClient, INDICES } from '../lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { userId } = req.query
  if (!userId) return res.status(400).json({ error: 'userId required' })

  const client = getClient()

  const user = await client.get({ index: INDICES.USERS, id: userId, _source: ['total_points'] })
  if (!user.found) return res.status(404).json({ error: 'User not found' })

  // Count users with strictly more points
  const above = await client.count({
    index: INDICES.USERS,
    query: { range: { total_points: { gt: user._source.total_points } } },
  })

  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10')
  res.json({ rank: above.count + 1, points: user._source.total_points })
}
