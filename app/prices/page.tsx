'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { withProtectedRoute } from '@/lib/protected-route'

function PricingPage() {
  const { t } = useLanguage()

  const plans = [
    {
      nameKey: 'pricing.trial',
      priceKey: 'pricing.free',
      descKey: 'pricing.trial_desc',
      featureKeys: ['pricing.messages_100', 'pricing.agents_1', 'pricing.platform_1', 'pricing.basic_support'],
      highlighted: false,
    },
    {
      nameKey: 'pricing.starter',
      price: '800',
      descKey: 'pricing.starter_desc',
      featureKeys: ['pricing.messages_1k', 'pricing.agents_3', 'pricing.platform_3', 'pricing.advanced_analytics', 'pricing.priority_support'],
      highlighted: true,
    },
    {
      nameKey: 'pricing.pro',
      price: '3,200',
      descKey: 'pricing.pro_desc',
      featureKeys: ['pricing.messages_5k', 'pricing.agents_10', 'pricing.platform_unlimited', 'pricing.custom_analytics', 'pricing.custom_support', 'pricing.custom_integrations'],
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-primary text-white border-2 border-primary shadow-2xl transform md:scale-105'
                  : 'bg-white border border-border hover:shadow-lg'
              }`}
            >
              <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                {t(plan.nameKey)}
              </h3>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/80' : 'text-secondary'}`}>
                {t(plan.descKey)}
              </p>

              <div className="mb-8">
                <span className={`text-3xl sm:text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                  {plan.price ? plan.price : t(plan.priceKey)}
                </span>
                {plan.price && (
                  <span className={plan.highlighted ? 'text-white/80' : 'text-secondary'}>
                    {t('pricing.per_month')}
                  </span>
                )}
              </div>

              <Link
                href="/dashboard"
                className={`block w-full py-3 rounded-lg font-semibold text-center text-sm sm:text-base transition-all mb-8 ${
                  plan.highlighted
                    ? 'bg-white text-primary hover:bg-gray-100'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                {t('pricing.trial_cta')}
              </Link>

              <ul className="space-y-4">
                {plan.featureKeys.map((featureKey, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm sm:text-base">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-primary'}`} />
                    <span className={plan.highlighted ? 'text-white' : 'text-foreground'}>
                      {t(featureKey)}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ or additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 md:mt-20 bg-white rounded-2xl border border-border p-6 sm:p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-block px-6 sm:px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Sales
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default withProtectedRoute(PricingPage, true)
