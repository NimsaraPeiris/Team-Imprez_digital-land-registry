"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiPostJson, apiFetch } from "@/lib/api"

interface User {
  id: string
  phone: string
  name?: string
  email?: string
  requesterType?: string
  registrationOffice?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (userData: User) => void
  logout: () => void
  authenticate: (payload: any) => Promise<boolean>
  getAuthHeaders: () => { Authorization?: string }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Check for existing authentication on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth")
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      setIsAuthenticated(true)
      setUser(authData.user || null)
    }
  }, [])

  const login = (userData: User) => {
    setIsAuthenticated(true)
    setUser(userData)
    // Persist authentication state but keep token if already present
    const existing = localStorage.getItem("auth")
    let token = null
    if (existing) {
      try {
        token = JSON.parse(existing).token
      } catch (e) {
        token = null
      }
    }
    localStorage.setItem("auth", JSON.stringify({ user: userData, token }))
  }

  const authenticate = async (payload: any): Promise<boolean> => {
    // payload is either { email } or { id, phone, otp }
    try {
      const res = await apiPostJson("/user/auth/login", payload)
      if (!res.ok) return false
      const body = await res.json()
      const token = body.access_token

      // Persist token immediately so apiFetch will attach it for subsequent requests
      localStorage.setItem("auth", JSON.stringify({ user: null, token }))

      // Attempt to fetch current user profile from backend using apiFetch (reads token from storage)
      try {
        const meResp = await apiFetch("/user/auth/me")
        if (meResp.ok) {
          const me = await meResp.json()
          // persist user + token
          localStorage.setItem("auth", JSON.stringify({ user: me, token }))
          setUser(me)
        }
      } catch (err) {
        // ignore; keep token persisted and user null
        console.warn("Failed to fetch user profile after login", err)
      }

      setIsAuthenticated(true)
      return true
    } catch (e) {
      console.error("Authentication failed", e)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("auth")
  }

  const getAuthToken = () => {
    const existing = localStorage.getItem("auth")
    if (!existing) return null
    try {
      return JSON.parse(existing).token
    } catch (e) {
      return null
    }
  }

  const getAuthHeaders = () => {
    const token = getAuthToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout, authenticate, getAuthHeaders }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
