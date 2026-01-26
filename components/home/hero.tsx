'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              {t('hero.title_start')} <span className="text-primary">5</span> {t('hero.title_end')}
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-lg text-balance">
              {t('hero.description')}
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-white text-base md:text-lg px-6 md:px-8 w-full sm:w-auto">
                {t('hero.cta')}
              </Button>
            </Link>
          </motion.div>

          {/* Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black rounded-2xl shadow-xl overflow-hidden border border-border"
          >
            <div className="bg-gradient-to-r from-primary to-primary-hover p-4 md:p-6 text-white flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-base md:text-lg">
                ف
              </div>
              <div>
                <div className="font-semibold text-sm md:text-base">{t('hero.assistant_name')}</div>
                <div className="text-xs md:text-sm text-white/80">{t('hero.online')}</div>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4 min-h-48 md:min-h-64 flex flex-col justify-center bg-white">
              {/* Received Message */}
              <div className="flex justify-start">
                <div className="bg-slate-100 text-foreground px-3 md:px-4 py-2 rounded-2xl rounded-tl-none max-w-xs text-sm md:text-base">
                  {t('hero.greeting')}
                </div>
              </div>

              {/* Sent Message */}
              <div className="flex justify-end">
                <div className="bg-primary text-white px-3 md:px-4 py-2 rounded-2xl rounded-tr-none max-w-xs text-sm md:text-base">
                  {t('hero.user_message')}
                </div>
              </div>

              {/* Received Message */}
              <div className="flex justify-start">
                <div className="bg-slate-100 text-foreground px-3 md:px-4 py-2 rounded-2xl rounded-tl-none max-w-xs text-sm md:text-base">
                  {t('hero.bot_response')}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 md:p-4 border-t border-border">
              <div className="text-foreground/50 text-xs md:text-sm">{t('hero.input_placeholder')}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
