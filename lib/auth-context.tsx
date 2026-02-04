'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  hasCompletedOnboarding: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  completeOnboarding: (preferences: unknown) => Promise<void>
  refreshAccessToken: () => Promise<void>
  updateUser: (updatedUser: Partial<User>) => void
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user data exists in localStorage
        const stored = localStorage.getItem('faheem_user')
        if (stored) {
          const userData = JSON.parse(stored)
          setUser(userData)

          // Try to refresh the access token using the refresh token from HttpOnly cookie
          await refreshToken()
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        localStorage.removeItem('faheem_user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      // Call refresh endpoint - refresh token is automatically sent via HttpOnly cookie
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Include cookies in request
      })

      if (response.ok) {
        const data = await response.json()
        // Access token is returned in response body (not stored in cookie)
        setAccessToken(data.accessToken)
      } else if (response.status === 401) {
        // Refresh token expired or invalid
        logout()
      }
    } catch (error) {
      console.error('[v0] Token refresh failed:', error)
      // Don't logout on network error, just clear the access token
      setAccessToken(null)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // POST to login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()

      // Store user data in memory and localStorage
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phoneNumber: data.user.phoneNumber,
        hasCompletedOnboarding: data.user.hasCompletedOnboarding,
      }

      setUser(userData)
      localStorage.setItem('faheem_user', JSON.stringify(userData))

      // Store access token in memory only (NOT in localStorage)
      setAccessToken(data.accessToken)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const responseData = await response.json()

      const newUser: User = {
        id: responseData.user.id,
        email: responseData.user.email,
        firstName: responseData.user.firstName,
        lastName: responseData.user.lastName,
        phoneNumber: responseData.user.phoneNumber,
        hasCompletedOnboarding: false,
      }

      setUser(newUser)
      localStorage.setItem('faheem_user', JSON.stringify(newUser))
      setAccessToken(responseData.accessToken)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem('faheem_user')

    // Call logout endpoint to clear refresh token cookie
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error)
  }

  const completeOnboarding = async (preferences: unknown) => {
    if (!user) throw new Error('No user logged in')

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(preferences),
      })

      if (!response.ok) throw new Error('Onboarding failed')

      const updatedUser = { ...user, hasCompletedOnboarding: true }
      setUser(updatedUser)
      localStorage.setItem('faheem_user', JSON.stringify(updatedUser))
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAccessToken = useCallback(async () => {
    await refreshToken()
  }, [refreshToken])

  const updateUser = (updatedUserData: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...updatedUserData }
    setUser(updatedUser)
    localStorage.setItem('faheem_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        accessToken,
        login,
        register,
        logout,
        completeOnboarding,
        refreshAccessToken,
        updateUser,
      }}
    >
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
