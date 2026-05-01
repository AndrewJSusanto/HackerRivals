import { randomUUID } from 'crypto'
import { getClient, INDICES, awardPoints } from '../lib/elastic.js'

const LOGIN_POINTS = 25
const LOGIN_SENTINEL = '__first_login__'
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, emoji } = req.body
  if (!username) return res.status(400).json({ error: 'username required' })

  if (!USERNAME_RE.test(username)) {
    return res.status(400).json({ error: 'Username must be 3–20 characters: letters, numbers, underscores only' })
  }

  const client = getClient()
  const handle = username.toLowerCase()

  // Uniqueness check
  const taken = await client.search({
    index: INDICES.USERS,
    query: { term: { username: handle } },
    size: 1,
  })
  if (taken.hits.hits.length) {
    return res.status(409).json({ error: 'Username already taken' })
  }

  const id = randomUUID()
  const qr_token = `HR-${id.slice(0, 8).toUpperCase()}`

  await client.index({
    index: INDICES.USERS,
    id,
    document: {
      username: handle,
      emoji: emoji || '🚀',
      qr_token,
      total_points: 0,
      completed_challenges: [],
      created_at: new Date(),
    },
  })

  // getUserIdentity reads username+emoji from the doc we just created
  await awardPoints(id, LOGIN_SENTINEL, 'login', LOGIN_POINTS)

  const updated = await client.get({ index: INDICES.USERS, id })
  res.status(201).json({ user: { id, ...updated._source } })
}
