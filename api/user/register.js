import { randomUUID } from 'crypto'
import { getClient, INDICES } from '../lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, team } = req.body
  if (!name || !email) return res.status(400).json({ error: 'name and email required' })

  const client = getClient()

  // Prevent duplicate emails
  const existing = await client.search({
    index: INDICES.USERS,
    query: { term: { email } },
    size: 1,
  })
  if (existing.hits.hits.length > 0) {
    const doc = existing.hits.hits[0]
    return res.json({ user: { id: doc._id, ...doc._source } })
  }

  const id = randomUUID()
  const qr_token = `HR-${id.slice(0, 8).toUpperCase()}`
  const user = {
    name,
    email,
    team: team || '',
    qr_token,
    total_points: 0,
    completed_challenges: [],
    created_at: new Date(),
  }

  await client.index({ index: INDICES.USERS, id, document: user })

  res.status(201).json({ user: { id, ...user } })
}
