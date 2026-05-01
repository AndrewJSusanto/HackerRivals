import { Client } from '@elastic/elasticsearch'

let _client = null

export function getClient() {
  if (!_client) {
    _client = new Client({
      node: process.env.ELASTIC_URL,
      auth: { apiKey: process.env.ELASTIC_API_KEY },
    })
  }
  return _client
}

export const INDICES = {
  USERS: 'hackerrivals-users',
  CHALLENGES: 'hackerrivals-challenges',
  EVENTS: 'hackerrivals-events',
}

export async function ensureIndices() {
  const client = getClient()

  const indices = [
    {
      index: INDICES.USERS,
      mappings: {
        properties: {
          name: { type: 'keyword' },
          username: { type: 'keyword' },   // chosen display handle for Kibana
          emoji: { type: 'keyword' },
          email: { type: 'keyword' },
          team: { type: 'keyword' },
          qr_token: { type: 'keyword' },
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
    {
      index: INDICES.EVENTS,
      mappings: {
        properties: {
          user_id: { type: 'keyword' },
          username: { type: 'keyword' },   // denormalized — Kibana aggregates on this
          team: { type: 'keyword' },
          challenge_id: { type: 'keyword' },
          challenge_type: { type: 'keyword' },
          points_earned: { type: 'integer' },
          score: { type: 'float' },
          timestamp: { type: 'date' },
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

// Fetch the display identity fields needed to denormalize into events
async function getUserIdentity(client, userId) {
  const doc = await client.get({
    index: INDICES.USERS,
    id: userId,
    _source: ['username', 'emoji', 'name', 'team'],
  })
  const handle = doc._source.username || doc._source.name
  const emoji = doc._source.emoji
  return {
    username: emoji ? `${emoji} ${handle}` : handle,
    team: doc._source.team || '',
  }
}

export async function awardPoints(userId, challengeId, challengeType, points, extra = {}) {
  const client = getClient()
  const identity = await getUserIdentity(client, userId)

  await client.index({
    index: INDICES.EVENTS,
    document: {
      user_id: userId,
      username: identity.username,
      team: identity.team,
      challenge_id: challengeId,
      challenge_type: challengeType,
      points_earned: points,
      timestamp: new Date(),
      ...extra,
    }
  })

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
}

export async function awardPairing(scannerId, targetId, points) {
  const client = getClient()
  const [scannerIdentity, targetIdentity] = await Promise.all([
    getUserIdentity(client, scannerId),
    getUserIdentity(client, targetId),
  ])

  const pairKey = [scannerId, targetId].sort().join('::')

  // One event per user so Kibana can aggregate each individually
  await Promise.all([
    client.index({
      index: INDICES.EVENTS,
      document: {
        user_id: scannerId,
        username: scannerIdentity.username,
        team: scannerIdentity.team,
        challenge_type: 'pair',
        partner_id: targetId,
        pair_key: pairKey,
        points_earned: points,
        timestamp: new Date(),
      }
    }),
    client.index({
      index: INDICES.EVENTS,
      document: {
        user_id: targetId,
        username: targetIdentity.username,
        team: targetIdentity.team,
        challenge_type: 'pair',
        partner_id: scannerId,
        pair_key: pairKey,
        points_earned: points,
        timestamp: new Date(),
      }
    }),
  ])

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
}
