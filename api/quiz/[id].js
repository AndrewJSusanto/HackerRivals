import { getClient, INDICES } from '../lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { id } = req.query
  const client = getClient()

  const doc = await client.get({ index: INDICES.CHALLENGES, id })
  if (!doc.found || doc._source.type !== 'quiz') {
    return res.status(404).json({ error: 'Quiz not found' })
  }

  const { title, description, questions, points } = doc._source

  // Strip correct answers before sending to client
  const sanitized = questions.map(({ prompt, options }) => ({ prompt, options }))

  res.json({ id, title, description, points, questions: sanitized })
}
