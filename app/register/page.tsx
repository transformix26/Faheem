'use client'

import React from "react"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth, type RegisterData } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()
  const isRTL = language === 'ar'

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError(t('register.error.first_name'))
      return false
    }
    if (!formData.lastName.trim()) {
      setError(t('register.error.last_name'))
      return false
    }
    if (!formData.email.trim()) {
      setError(t('register.error.email'))
      return false
    }
    if (!formData.phoneNumber.trim()) {
      setError(t('register.error.phone'))
      return false
    }
    if (formData.password.length < 8) {
      setError(t('register.error.password_length'))
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.error.password_match'))
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const registerData: RegisterData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      }
      await register(registerData)
      router.push('/onboarding')
    } catch (err) {
      setError(t('register.error.general'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
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
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('register.title')}</h1>
          <p className="text-secondary">{t('register.subtitle')}</p>
        </div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-lg space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* First & Last Name Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="label-text">{t('register.first_name')}</label>
              <div className="relative">
                <User className={`absolute top-3.5 w-5 h-5 text-secondary pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field ${isRTL ? 'pr-12 text-right' : 'pl-12'}`}
                  placeholder={isRTL ? 'عمر' : 'Omar'}
                  required
                />
              </div>
            </div>
            <div className="form-group mb-0">
              <label className="label-text">{t('register.last_name')}</label>
              <div className="relative">
                <User className={`absolute top-3.5 w-5 h-5 text-secondary pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${isRTL ? 'pr-12 text-right' : 'pl-12'}`}
                  placeholder={isRTL ? 'أحمد' : 'Ahmed'}
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants} className="form-group">
            <label className="label-text">{t('register.email')}</label>
            <div className="relative">
              <Mail className={`absolute top-3.5 w-5 h-5 text-secondary pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${isRTL ? 'pr-12 text-right' : 'pl-12'}`}
                placeholder="example@example.com"
                required
              />
            </div>
          </motion.div>

          {/* Phone Field */}
          <motion.div variants={itemVariants} className="form-group">
            <label className="label-text">{t('register.phone')}</label>
            <div className="relative">
              <Phone className={`absolute top-3.5 w-5 h-5 text-secondary pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`input-field ${isRTL ? 'pr-12 text-right' : 'pl-12'}`}
                placeholder="+20123456789"
                required
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="form-group">
            <label className="label-text">{t('register.password')}</label>
            <div className="relative">
              <Lock className={`absolute top-3.5 w-5 h-5 text-secondary pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-field ${isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12'}`}
                placeholder="********"
                minLength={8}
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
            <p className="text-xs text-secondary mt-2">{t('register.password_hint')}</p>
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div variants={itemVariants} className="form-group">
            <label className="label-text">{t('register.confirm_password')}</label>
            <div className="relative">
              <Lock className={`absolute top-3.5 w-5 h-5 text-secondary pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field ${isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12'}`}
                placeholder="********"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute top-3.5 text-secondary hover:text-foreground transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>

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
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? t('register.loading') : t('register.submit')}
          </motion.button>

          {/* Login Link */}
          <motion.p variants={itemVariants} className="text-center text-secondary text-sm">
            {t('register.has_account')}{' '}
            <Link href="/login" className="text-primary font-medium hover:opacity-80 transition-opacity">
              {t('register.sign_in')}
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  )
}
