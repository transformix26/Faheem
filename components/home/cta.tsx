'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  const { t } = useLanguage()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary-dark"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6 md:space-y-8"
        >
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            {t('cta.title')}
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed text-balance">
            {t('cta.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 md:pt-8">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              {t('cta.button_primary')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/prices"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white rounded-lg font-bold text-base sm:text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              {t('cta.button_secondary')}
            </Link>
          </div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="pt-4 md:pt-8"
          >
            <p className="text-white/80 text-sm md:text-base">
              {t('cta.no_credit_card')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
