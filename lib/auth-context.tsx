'use client'

import { createContext, useContext } from 'react'

// -------- TYPES --------

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  hasCompletedOnboarding: boolean
  planId?: string
  createdAt?: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

export interface AuthContextType {
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
  hasAuthHint?: boolean
}

// -------- CONTEXT --------

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// -------- HOOK --------

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
