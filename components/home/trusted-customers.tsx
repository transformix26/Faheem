'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'

export function TrustedCustomers() {
  const { t } = useLanguage()

  const customers = [
    { name: 'Tech Corp', logo: '🏢' },
    { name: 'Digital Hub', logo: '💼' },
    { name: 'Cloud Solutions', logo: '☁️' },
    { name: 'Smart Systems', logo: '⚙️' },
    { name: 'Future Tech', logo: '🚀' },
    { name: 'Data Analytics', logo: '📊' },
  ]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-border"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            {t('trusted.title')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-foreground/70">
            {t('trusted.subtitle')}
          </p>
        </motion.div>

        {/* Customers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
          {customers.map((customer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-muted hover:bg-primary/10 transition-colors"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">
                {customer.logo}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground text-center">
                {customer.name}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
          {[
            { number: '500+', label: t('trusted.companies') },
            { number: '100K+', label: t('trusted.conversations') },
            { number: '99.9%', label: t('trusted.uptime') },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="text-center p-4 sm:p-6"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <p className="text-sm sm:text-base text-foreground/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
