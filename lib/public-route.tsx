'use client'

import React from "react"
import { useAuth } from './auth-context'
import { useLanguage } from './language-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function withPublicRoute<P extends object>(
    Component: React.ComponentType<P>
) {
    return function PublicRoute(props: P) {
        const { user, isLoading, hasAuthHint } = useAuth()
        const { t } = useLanguage()
        const router = useRouter()
        // Track if the user was ALREADY authenticated when they first hit this page
        const wasAuthenticatedOnMount = React.useRef(!!user || hasAuthHint)

        useEffect(() => {
            if ((!isLoading && user) || hasAuthHint) {
                // Only show the Toast if they were already logged in when the page loaded
                // This prevents the toast from appearing immediately after a successful login() call
                if (wasAuthenticatedOnMount.current) {
                    toast.error(t('auth.already_logged_in'))
                }
                router.replace('/dashboard')
            }
        }, [user, isLoading, router, hasAuthHint, t])

        if (isLoading || hasAuthHint) {
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
