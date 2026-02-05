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
          router.replace('/login')
        } else if (requireOnboarding && !user.hasCompletedOnboarding) {
          router.replace('/onboarding')
        }
      }
    }, [user, isLoading, router, requireOnboarding])

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

/**
 * withOnboardingRoute:
 * 1. If not logged in -> redirect to /login
 * 2. If logged in AND completed onboarding -> redirect to /dashboard
 * 3. Otherwise -> allow access to Onboarding page
 */
export function withOnboardingRoute<P extends object>(
  Component: React.ComponentType<P>
) {
  return function OnboardingRoute(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.replace('/login')
        } else if (user.hasCompletedOnboarding) {
          // If already done, don't show "not authorized", just go to dashboard
          router.replace('/dashboard')
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

    // Only allow if logged in and NOT completed onboarding
    if (!user || user.hasCompletedOnboarding) return null

    return <Component {...props} />
  }
}
