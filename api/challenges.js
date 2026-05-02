import { getClient, INDICES } from './lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const client = getClient()

  const result = await client.search({
    index: INDICES.CHALLENGES,
    size: 100,
    query: { term: { active: true } },
    sort: [{ type: 'asc' }, { points: 'desc' }],
    _source: ['type', 'title_en', 'title_fr', 'description_en', 'description_fr', 'points', 'code'],
  })

  const challenges = result.hits.hits.map(h => ({
    id: h._id,
    type: h._source.type,
    title: h._source.title,
    description: h._source.description,
    points: h._source.points,
  }))

  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
  res.json({ challenges })
}
