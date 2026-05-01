import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import BadgeLogin from './pages/BadgeLogin'
import SetUsername from './pages/SetUsername'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Quiz from './pages/Quiz'
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
          {/* Demo flow — scan demo QR → create identity on the spot */}
          <Route path="/login" element={<Login />} />

          {/* Real-world flow — scan pre-assigned badge QR → auto-login */}
          <Route path="/badge-login" element={<BadgeLogin />} />
          <Route path="/set-username" element={<ProtectedRoute><SetUsername /></ProtectedRoute>} />

          <Route element={<Layout />}>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
