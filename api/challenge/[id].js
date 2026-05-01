import { getClient, INDICES } from '../lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { id } = req.query
  const client = getClient()

  const doc = await client.get({ index: INDICES.CHALLENGES, id })
  if (!doc.found) return res.status(404).json({ error: 'Challenge not found' })

  const { type, title, description, points } = doc._source
  res.json({ id, type, title, description, points })
}
