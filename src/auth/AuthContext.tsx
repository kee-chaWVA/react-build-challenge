import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/user'
import { clearSession, getSession, storeSession } from './session'
import { users } from '../data/users'
import { clearToken, storeToken, createToken } from './token'
import { AUTH_LOGOUT_EVENT } from './event'

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
    const sessionId = getSession()
    
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

  useEffect(() => {
    const handleLogout = () => {
      logout()
    }
    window.addEventListener(
      AUTH_LOGOUT_EVENT,
      handleLogout
    )
    return () => {
      window.removeEventListener(
        AUTH_LOGOUT_EVENT,
        handleLogout
      )
    }
  }, [])
  
  const login = (user: User) => {
    const token = createToken()
    setUser(user)
    storeSession(String(user.id))
    storeToken(token)
  }

  const logout = () => {
    setUser(null)
    clearSession()
    clearToken()
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
