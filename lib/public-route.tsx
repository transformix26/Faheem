'use client'

import React from "react"
import { useAuth } from './auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function withPublicRoute<P extends object>(
    Component: React.ComponentType<P>
) {
    return function PublicRoute(props: P) {
        const { user, isLoading } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading && user) {
                router.replace('/dashboard')
            }
        }, [user, isLoading, router])

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            )
        }

        if (user) return null

        return <Component {...props} />
    }
}
