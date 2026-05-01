import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Quiz() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/quiz/${id}`).then(r => {
      setQuiz(r.data)
      setLoading(false)
    })
  }, [id])

  const selectAnswer = (idx) => {
    const next = [...answers]
    next[step] = idx
    setAnswers(next)
  }

  const advance = async () => {
    if (step < quiz.questions.length - 1) {
      setStep(s => s + 1)
    } else {
      setSubmitting(true)
      try {
        const { data } = await api.post(`/quiz/submit`, {
          quizId: id,
          userId: user.id,
          answers,
        })
        setResult(data)
      } finally {
        setSubmitting(false)
      }
    }
  }

  if (loading) return <Loader />

  if (result) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <p className="text-5xl">{result.perfect ? '🏆' : '✅'}</p>
        <h2 className="text-2xl font-bold">{result.correct}/{quiz.questions.length} Correct</h2>
        <p className="text-green-400 text-xl font-bold">+{result.points} pts</p>
        <button onClick={() => navigate('/')} className="bg-green-500 text-black font-semibold px-8 py-3 rounded-xl mt-2">
          Back to Home
        </button>
      </div>
    )
  }

  const q = quiz.questions[step]
  const chosen = answers[step]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">{quiz.title}</span>
        <span className="text-slate-500 text-sm">{step + 1}/{quiz.questions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div
          className="bg-green-400 h-1.5 rounded-full transition-all"
          style={{ width: `${((step + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <h2 className="text-lg font-semibold">{q.prompt}</h2>

      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selectAnswer(i)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
              chosen === i
                ? 'border-green-500 bg-green-900/30 text-green-300'
                : 'border-slate-700 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <span className="font-mono text-slate-500 mr-3">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={advance}
        disabled={chosen === undefined || submitting}
        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-colors"
      >
        {step < quiz.questions.length - 1 ? 'Next' : submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}

function Loader() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
