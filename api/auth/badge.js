import { getClient, INDICES } from '../lib/elastic.js'

const LOGIN_SENTINEL = '__first_login__'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'token required' })

  const client = getClient()

  const result = await client.search({
    index: INDICES.USERS,
    query: { term: { qr_token: token } },
    size: 1,
  })

  if (!result.hits.hits.length) {
    return res.status(404).json({ error: 'Badge not recognised — check with an organiser' })
  }

  const hit = result.hits.hits[0]
  const firstLogin = !hit._source.completed_challenges?.includes(LOGIN_SENTINEL)

  res.json({ user: { id: hit._id, ...hit._source }, firstLogin })
}
