import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/user'
import { SESSION_KEY } from './session'
import { users } from '../data/users'

type AuthContextType = {
  isAuthenticated: boolean,
  isInitialized: boolean,
  user: User | null,
  login: (user: User) => void,
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [ user, setUser ] = useState<User | null >(null)
  const [ isInitialized, setIsInitialized ] = useState<boolean>(false)
  
  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    
    if (sessionId) {
      const existingUser = users.find(
        (u) => String(u.id) === sessionId
      )
  
      if (existingUser) {
        setUser(existingUser)
      }
    }
  
    setIsInitialized(true)
  }, [])
  
  const login = (user: User) => {
    setUser(user)
    localStorage.setItem(SESSION_KEY, String(user.id))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: user !== null, isInitialized, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
