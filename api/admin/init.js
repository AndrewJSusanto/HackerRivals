import { ensureIndices } from '../lib/elastic.js'

function isAdmin(req) {
  return req.headers['x-admin-key'] === process.env.ADMIN_KEY
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    await ensureIndices()
    res.json({ ok: true, message: 'Indices created (or already exist)' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
