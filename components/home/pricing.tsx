'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function Pricing() {
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
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      id="pricing"
      className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4"
        >
          {t('pricing.title')}
        </motion.h2>

        <p className="text-center text-secondary mb-12 md:mb-16 text-sm md:text-base">
          {t('pricing.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-lg p-6 md:p-8 transition-transform ${plan.highlighted
                ? 'bg-primary text-white border-2 border-primary shadow-lg md:scale-105'
                : 'bg-white border border-border'
                }`}
            >
              <h3 className={`text-xl md:text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                {t(plan.nameKey)}
              </h3>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/80' : 'text-secondary'}`}>
                {t(plan.descKey)}
              </p>

              <div className="mb-6">
                <span className={`text-3xl md:text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                  {plan.price ? plan.price : t(plan.priceKey)}
                </span>
                {plan.price && (
                  <span className={plan.highlighted ? 'text-white/80' : 'text-secondary'}>
                    {t('pricing.per_month')}
                  </span>
                )}
              </div>

              <Link
                href="/register"
                className={`block w-full py-3 rounded-lg font-medium text-center text-sm md:text-base transition-all mb-8 ${plan.highlighted
                  ? 'bg-white text-primary hover:bg-gray-100'
                  : 'bg-primary text-white hover:opacity-90'
                  }`}
              >
                {t('pricing.trial_cta')}
              </Link>

              <ul className="space-y-3">
                {plan.featureKeys.map((featureKey, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm md:text-base">
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
      </div>
    </motion.section>
  )
}
