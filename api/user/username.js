import { getClient, INDICES, awardPoints } from '../lib/elastic.js'

const LOGIN_POINTS = 25
const LOGIN_SENTINEL = '__first_login__'
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, username } = req.body
  if (!userId || !username) return res.status(400).json({ error: 'userId and username required' })

  if (!USERNAME_RE.test(username)) {
    return res.status(400).json({ error: 'Username must be 3–20 characters: letters, numbers, underscores only' })
  }

  const client = getClient()

  // Uniqueness check
  const taken = await client.search({
    index: INDICES.USERS,
    query: { term: { username: username.toLowerCase() } },
    size: 1,
  })
  if (taken.hits.hits.length && taken.hits.hits[0]._id !== userId) {
    return res.status(409).json({ error: 'Username already taken' })
  }

  // Save username (lowercased for consistency)
  await client.update({
    index: INDICES.USERS,
    id: userId,
    doc: { username: username.toLowerCase() },
  })

  // Award login points now that we have a display name to attach to the event
  await awardPoints(userId, LOGIN_SENTINEL, 'login', LOGIN_POINTS)

  // Return updated user
  const updated = await client.get({ index: INDICES.USERS, id: userId })
  res.status(200).json({ user: { id: userId, ...updated._source } })
}
