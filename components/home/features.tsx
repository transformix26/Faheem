'use client'

import { motion } from 'framer-motion'
import { BarChart3, Lock, Settings, Users, TowerControl, Signal } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function Features() {
  const { t } = useLanguage()

  const features = [
    {
      icon: BarChart3,
      titleKey: 'features.analytics',
      descKey: 'features.analytics_desc',
    },
    {
      icon: Lock,
      titleKey: 'features.security',
      descKey: 'features.security_desc',
    },
    {
      icon: Settings,
      titleKey: 'features.customization',
      descKey: 'features.customization_desc',
    },
    {
      icon: Users,
      titleKey: 'features.support',
      descKey: 'features.support_desc',
    },
    {
      icon: TowerControl,
      titleKey: 'features.leads',
      descKey: 'features.leads_desc',
    },
    {
      icon: Signal,
      titleKey: 'features.integration',
      descKey: 'features.integration_desc',
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      id="features"
      className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 md:mb-16"
        >
          {t('features.title')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-white">
                  <feature.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t(feature.titleKey)}</h3>
                <p className="text-secondary text-sm md:text-base">{t(feature.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
