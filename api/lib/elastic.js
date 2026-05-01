import { Client } from '@elastic/elasticsearch'

let _client = null

export function getClient() {
  if (!_client) {
    _client = new Client({
      node: process.env.ELASTIC_URL,
      auth: { apiKey: process.env.ELASTIC_API_KEY },
      requestTimeout: 10000,
      maxRetries: 1,
    })
  }
  return _client
}

export const INDICES = {
  USERS: 'hackerrivals-users',
  CHALLENGES: 'hackerrivals-challenges',
}

export async function ensureIndices() {
  const client = getClient()

  const indices = [
    {
      index: INDICES.USERS,
      mappings: {
        properties: {
          username: { type: 'keyword' },
          emoji: { type: 'keyword' },
          qr_token: { type: 'keyword' },
          team: { type: 'keyword' },
          total_points: { type: 'integer' },
          completed_challenges: { type: 'keyword' },
          paired_users: { type: 'keyword' },
          created_at: { type: 'date' },
        }
      }
    },
    {
      index: INDICES.CHALLENGES,
      mappings: {
        properties: {
          type: { type: 'keyword' },
          title: { type: 'text' },
          description: { type: 'text' },
          code: { type: 'keyword' },
          points: { type: 'integer' },
          questions: { type: 'object', enabled: false },
          keywords: { type: 'keyword' },
          active: { type: 'boolean' },
          created_at: { type: 'date' },
        }
      }
    },
  ]

  for (const { index, mappings } of indices) {
    const exists = await client.indices.exists({ index })
    if (!exists) {
      await client.indices.create({ index, mappings })
    }
  }
}

function logEvent(type, data) {
  // Structured JSON log — Vercel captures stdout and can forward to Elastic
  console.log(JSON.stringify({ '@timestamp': new Date(), type, ...data }))
}

export async function awardPoints(userId, challengeId, challengeType, points, extra = {}) {
  const client = getClient()

  await client.update({
    index: INDICES.USERS,
    id: userId,
    script: {
      source: `
        ctx._source.total_points += params.points;
        if (!ctx._source.completed_challenges.contains(params.cid)) {
          ctx._source.completed_challenges.add(params.cid);
        }
      `,
      params: { points, cid: challengeId },
    }
  })

  logEvent('points_awarded', { userId, challengeId, challengeType, points, ...extra })
}

export async function awardPairing(scannerId, targetId, points) {
  const client = getClient()
  const pairKey = [scannerId, targetId].sort().join('::')

  const pairScript = {
    source: `
      ctx._source.total_points += params.points;
      if (ctx._source.paired_users == null) ctx._source.paired_users = [];
      if (!ctx._source.paired_users.contains(params.otherId)) {
        ctx._source.paired_users.add(params.otherId);
      }
    `,
  }

  await Promise.all([
    client.update({
      index: INDICES.USERS,
      id: scannerId,
      script: { ...pairScript, params: { points, otherId: targetId } },
    }),
    client.update({
      index: INDICES.USERS,
      id: targetId,
      script: { ...pairScript, params: { points, otherId: scannerId } },
    }),
  ])

  logEvent('pairing', { scannerId, targetId, pairKey, points })
}
