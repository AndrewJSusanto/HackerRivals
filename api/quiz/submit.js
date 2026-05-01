import { getClient, INDICES, awardPoints } from '../lib/elastic.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { quizId, userId, answers } = req.body

  const client = getClient()
  const doc = await client.get({ index: INDICES.CHALLENGES, id: quizId })
  if (!doc.found) return res.status(404).json({ error: 'Quiz not found' })

  const { questions, points } = doc._source

  // Check if already completed
  const user = await client.get({ index: INDICES.USERS, id: userId })
  if (user._source.completed_challenges.includes(quizId)) {
    return res.status(409).json({ error: 'Already submitted' })
  }

  let correct = 0
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].answer) correct++
  }

  const fraction = correct / questions.length
  const earned = Math.round(points * fraction)
  const perfect = fraction === 1

  await awardPoints(userId, quizId, 'quiz', earned, { score: fraction })

  res.json({ correct, total: questions.length, points: earned, perfect })
}
