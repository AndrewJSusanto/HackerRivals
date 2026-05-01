import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hr_user')
    if (!stored || stored === 'undefined') return null
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem('hr_user')
      return null
    }
  })

  const login = (userData) => {
    if (!userData) return
    localStorage.setItem('hr_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('hr_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
