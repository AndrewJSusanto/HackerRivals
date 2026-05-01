import { randomUUID } from 'crypto'
import { getClient, INDICES } from '../lib/elastic.js'

// In production, protect this with a proper admin token check
function isAdmin(req) {
  return req.headers['x-admin-key'] === process.env.ADMIN_KEY
}

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') return createChallenge(req, res)
  if (req.method === 'GET') return listChallenges(req, res)
  return res.status(405).end()
}

async function createChallenge(req, res) {
  const { type, title, description, points, code, questions, keywords, min_pairings } = req.body

  if (!type || !title || !points) return res.status(400).json({ error: 'type, title, points required' })

  const id = randomUUID()
  const qr_value = code || `HR-CHALLENGE-${id.slice(0, 8).toUpperCase()}`

  const doc = {
    type,
    title,
    description: description || '',
    code: qr_value,
    points: Number(points),
    questions: type === 'quiz' ? questions : [],
    keywords: type === 'photo' ? (keywords || '').split(',').map(k => k.trim()) : [],
    min_pairings: type === 'social' ? Math.max(1, Number(min_pairings) || 1) : 0,
    active: true,
    created_at: new Date(),
  }

  try {
    const client = getClient()
    await client.index({ index: INDICES.CHALLENGES, id, document: doc })
    res.status(201).json({ id, qr_value, ...doc })
  } catch (err) {
    console.error('ES index error:', err?.meta?.body ?? err?.message ?? err)
    res.status(500).json({ error: 'Failed to save challenge', detail: err?.meta?.body?.error ?? err?.message })
  }
}

async function listChallenges(req, res) {
  try {
    const client = getClient()
    const result = await client.search({
      index: INDICES.CHALLENGES,
      size: 100,
      sort: [{ created_at: 'desc' }],
    })
    res.json(result.hits.hits.map(h => ({ id: h._id, ...h._source })))
  } catch (err) {
    console.error('ES search error:', err?.meta?.body ?? err?.message ?? err)
    res.status(500).json({ error: 'Failed to list challenges', detail: err?.meta?.body?.error ?? err?.message })
  }
}
