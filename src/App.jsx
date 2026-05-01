import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import BadgeLogin from './pages/BadgeLogin'
import SetUsername from './pages/SetUsername'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Quiz from './pages/Quiz'
import Camera from './pages/Camera'
import LeaderboardPage from './pages/LeaderboardPage'
import Admin from './pages/Admin'
import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<BadgeLogin />} />
          <Route path="/set-username" element={<ProtectedRoute><SetUsername /></ProtectedRoute>} />
          <Route element={<Layout />}>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/camera/:challengeId" element={<ProtectedRoute><Camera /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
