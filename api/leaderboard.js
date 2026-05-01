import { getClient, INDICES } from './lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const size = parseInt(req.query.size) || 50
  const client = getClient()

  const result = await client.search({
    index: INDICES.USERS,
    size,
    sort: [{ total_points: 'desc' }],
    _source: ['name', 'team', 'total_points'],
  })

  const entries = result.hits.hits.map(hit => ({
    id: hit._id,
    name: hit._source.name,
    team: hit._source.team,
    total_points: hit._source.total_points,
  }))

  res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=10')
  res.json({ entries, total: result.hits.total.value })
}
