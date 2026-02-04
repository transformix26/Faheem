'use client'

import React from "react"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { withPublicRoute } from '@/lib/public-route'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()
  const isRTL = language === 'ar'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 px-6 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center"
          >
            <img src="/logo.png" alt={t('brand.name')} className="w-12 h-12 rounded-lg mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('login.welcome_back')}</h1>
          <p className="text-secondary">{t('login.subtitle')}</p>
        </div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-lg space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {/* Email Field */}
          <div className="form-group">
            <label className="label-text">{t('login.email')}</label>
            <div className="relative">
              <Mail className={`absolute top-3.5 w-5 h-5 text-secondary pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field ${isRTL ? 'pr-12 text-right' : 'pl-12'}`}
                placeholder={t('login.email_placeholder')}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="label-text">{t('login.password')}</label>
            <div className="relative">
              <Lock className={`absolute top-3.5 w-5 h-5 text-secondary pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field ${isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12'}`}
                placeholder={t('login.password_placeholder')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-3.5 text-secondary hover:text-foreground transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? t('login.loading') : t('login.submit')}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-center mt-8 space-y-4"
        >
          <p className="text-secondary text-sm">
            {t('login.no_account')}{' '}
            <Link href="/register" className="text-primary font-medium hover:opacity-80 transition-opacity">
              {t('login.create_account')}
            </Link>
          </p>

          {/* Decorative Elements */}
          <div className="flex items-center justify-center gap-2">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-secondary">{t('login.new_here')}</span>
            <div className="h-px bg-border flex-1" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default withPublicRoute(LoginPage)
