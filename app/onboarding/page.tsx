'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { CheckCircle } from 'lucide-react'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    companyName: '',
    useCase: '',
    botLanguages: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const { completeOnboarding, user } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()
  const isRTL = language === 'ar'

  const languages = ['English', 'العربية', 'Français', 'Español', 'Deutsch']
  const useCases = [
    { id: 'customer-support', label: t('onboarding.usecase.support'), icon: '📞' },
    { id: 'sales', label: t('onboarding.usecase.sales'), icon: '💼' },
    { id: 'education', label: t('onboarding.usecase.education'), icon: '📚' },
    { id: 'healthcare', label: t('onboarding.usecase.healthcare'), icon: '⚕️' },
    { id: 'ecommerce', label: t('onboarding.usecase.ecommerce'), icon: '🛍️' },
    { id: 'other', label: t('onboarding.usecase.other'), icon: '✨' },
  ]

  const handleLanguageToggle = (lang: string) => {
    setPreferences(prev => ({
      ...prev,
      botLanguages: prev.botLanguages.includes(lang)
        ? prev.botLanguages.filter(l => l !== lang)
        : [...prev.botLanguages, lang],
    }))
  }

  const handleNext = () => {
    if (step === 1 && !preferences.companyName.trim()) {
      return
    }
    if (step === 2 && !preferences.useCase) {
      return
    }
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      await completeOnboarding(preferences)
      router.push('/dashboard')
    } catch (err) {
      console.error('Failed to complete onboarding:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 px-6 py-12"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src="/logo.png" alt="FAHEEM" className="w-12 h-12 rounded-lg mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('onboarding.welcome')} {user?.firstName}</h1>
          <p className="text-secondary">{t('onboarding.subtitle')}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 flex justify-between items-center">
          {[1, 2, 3].map(s => (
            <motion.div
              key={s}
              className="flex flex-col items-center flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: s * 0.1 }}
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${step >= s
                    ? 'bg-primary text-white'
                    : 'bg-border text-secondary'
                  }`}
                whileInView={{ scale: 1.1 }}
              >
                {step > s ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  s
                )}
              </motion.div>
              <span className="text-xs text-secondary">
                {s === 1 ? t('onboarding.step.company') : s === 2 ? t('onboarding.step.usecase') : t('onboarding.step.languages')}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          {/* Step 1: Company Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('onboarding.company.title')}</h2>
                <p className="text-secondary">{t('onboarding.company.subtitle')}</p>
              </div>
              <input
                type="text"
                value={preferences.companyName}
                onChange={(e) => setPreferences(prev => ({ ...prev, companyName: e.target.value }))}
                className="input-field text-lg"
                placeholder={t('onboarding.company.placeholder')}
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Use Case */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('onboarding.usecase.title')}</h2>
                <p className="text-secondary">{t('onboarding.usecase.subtitle')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {useCases.map(useCase => (
                  <motion.button
                    key={useCase.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreferences(prev => ({ ...prev, useCase: useCase.id }))}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${preferences.useCase === useCase.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="text-2xl mb-2">{useCase.icon}</div>
                    <div className="text-sm font-medium text-foreground">{useCase.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Languages */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('onboarding.languages.title')}</h2>
                <p className="text-secondary">{t('onboarding.languages.subtitle')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {languages.map(lang => (
                  <motion.button
                    key={lang}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageToggle(lang)}
                    className={`p-4 rounded-lg border-2 font-medium transition-all ${preferences.botLanguages.includes(lang)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-foreground hover:border-primary/50'
                      }`}
                  >
                    {lang}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mt-8 justify-between"
          >
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('onboarding.prev')}
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !preferences.companyName.trim()) ||
                  (step === 2 && !preferences.useCase)
                }
                className="px-8 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('onboarding.next')}
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                disabled={loading}
                className="px-8 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('onboarding.finishing') : t('onboarding.finish')}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
