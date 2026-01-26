'use client'

import React from "react"

import { useAuth } from './auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  requireOnboarding = false
) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push('/login')
        } else if (requireOnboarding && !user.hasCompletedOnboarding) {
          router.push('/onboarding')
        }
      }
    }, [user, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user) return null
    if (requireOnboarding && !user.hasCompletedOnboarding) return null

    return <Component {...props} />
  }
}
