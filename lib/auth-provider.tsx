'use client'

import React, { useState, useEffect, useCallback } from 'react'
import api, { setModuleAccessToken } from './axios'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'
import { useLanguage } from './language-context'
import { AuthContext, User, RegisterData } from './auth-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const { t } = useLanguage()

    // High-speed session hint for Guest Route protection
    const [hasAuthHint, setHasAuthHint] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('faheem_user') !== null
        }
        return false
    })

    // [1] LOGOUT
    const logout = useCallback(() => {
        setUser(null)
        setAccessToken(null)
        setModuleAccessToken(null)
        localStorage.removeItem('faheem_user')
        // We don't remove 'faheem_onboarding_done_*' here to keep it persistent for testing
        setHasAuthHint(false)

        api.post('/api/auth/logout').catch(() => { });

        toast.info(t('auth.logged_out'))
    }, [t])

    // [2] REFRESH & RESTORATION
    const decodeUser = useCallback((token: string): User => {
        const decoded: any = jwtDecode(token)
        const email = decoded.email
        const isDoneLocally = localStorage.getItem(`faheem_onboarding_done_${email}`) === 'true'

        return {
            id: decoded.userId || decoded.sub || decoded.id,
            email: email,
            firstName: decoded.firstName || 'User',
            lastName: decoded.lastName || '',
            phoneNumber: decoded.phoneNumber || '',
            hasCompletedOnboarding: isDoneLocally ||
                decoded.hasCompletedOnboarding === true ||
                decoded.onboardingCompleted === true ||
                decoded.onboarding_completed === true,
            planId: decoded.currentPlanId,
            createdAt: decoded.createdAt || new Date().toISOString(),
        }
    }, [])

    const refreshToken = useCallback(async () => {
        try {
            const response = await api.post('/api/auth/refresh');

            if (response.data.status === 'success') {
                const newToken = response.data.data.accessToken
                const userData = decodeUser(newToken)

                setAccessToken(newToken)
                setModuleAccessToken(newToken)
                setUser(userData)
                setHasAuthHint(true)
                localStorage.setItem('faheem_user', JSON.stringify(userData))
                return true
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                return false
            }
            throw error
        }
        return false
    }, [decodeUser])

    const initialized = React.useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        const initializeAuth = async () => {
            try {
                const stored = localStorage.getItem('faheem_user')
                if (stored) {
                    try {
                        const parsedUser = JSON.parse(stored)
                        if (localStorage.getItem(`faheem_onboarding_done_${parsedUser.email}`) === 'true') {
                            parsedUser.hasCompletedOnboarding = true
                        }
                        setUser(parsedUser)
                    } catch (e) { }
                }

                const success = await refreshToken()
                if (success === false) {
                    setModuleAccessToken(null)
                    setAccessToken(null)
                    setUser(null)
                    setHasAuthHint(false)
                    localStorage.removeItem('faheem_user')
                }
            } catch (error) {
                console.log('[Auth] Initialization deferred due to network/server error');
            } finally {
                setIsLoading(false)
            }
        }
        initializeAuth()
    }, [refreshToken])

    // [3] LOGIN
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { status, data } = response.data;

            if (status !== 'success' || !data.accessToken) {
                throw new Error(data?.message || t('login.error'));
            }

            const userData = decodeUser(data.accessToken)

            setAccessToken(data.accessToken)
            setModuleAccessToken(data.accessToken)
            setUser(userData)
            setHasAuthHint(true)
            localStorage.setItem('faheem_user', JSON.stringify(userData))

            toast.success(t('auth.welcome_back'))
        } catch (err: any) {
            const handleJSendError = (errorObj: any) => {
                const resp = errorObj.response?.data
                let msg = ''
                if (resp) {
                    if (resp.status === 'fail' && resp.data) {
                        msg = resp.data.message || Object.values(resp.data)[0] as string
                    } else if (resp.status === 'error') {
                        msg = resp.message
                    }
                }
                if (!msg) msg = errorObj.message || t('auth.login_failed')
                if (msg.toLowerCase().includes('user') && msg.toLowerCase().includes('exist')) return t('error.user_not_found')
                if (msg.toLowerCase().includes('password')) return t('error.incorrect_password')
                return msg
            }
            const message = handleJSendError(err)
            toast.error(message)
            throw new Error(message);
        } finally {
            setIsLoading(false)
        }
    }

    // [4] REGISTER (MOCKED)
    const register = async (formData: RegisterData) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockAccessToken = 'mock_access_token'
            const mockUser: User = {
                id: 'mock-user',
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                hasCompletedOnboarding: false,
                createdAt: new Date().toISOString()
            }

            localStorage.removeItem(`faheem_onboarding_done_${formData.email}`)

            setAccessToken(mockAccessToken)
            setModuleAccessToken(mockAccessToken)
            setUser(mockUser)
            setHasAuthHint(true)
            localStorage.setItem('faheem_user', JSON.stringify(mockUser))

            toast.success(t('auth.account_created'))
        } catch (err: any) {
            toast.error(t('auth.register_failed'))
            throw new Error(t('auth.register_failed'));
        } finally {
            setIsLoading(false)
        }
    }

    const completeOnboarding = async (preferences: unknown) => {
        if (!user) throw new Error('No user logged in')
        setIsLoading(true)
        const toastId = toast.loading(t('auth.onboarding_saving'))
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            localStorage.setItem(`faheem_onboarding_done_${user.email}`, 'true')
            const updatedUser = { ...user, hasCompletedOnboarding: true }
            setUser(updatedUser)
            localStorage.setItem('faheem_user', JSON.stringify(updatedUser))
            toast.success(t('auth.onboarding_complete'), { id: toastId })
        } catch (err: any) {
            toast.error(t('auth.onboarding_failed'), { id: toastId })
            throw new Error(t('auth.onboarding_failed'))
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
                hasAuthHint,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
