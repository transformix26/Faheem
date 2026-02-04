'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'

  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-b from-background to-primary/10 border-t border-border mt-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt={t('brand.name')} className="w-8 h-8 rounded" />
              <span className="text-xl font-bold">{t('brand.name')}</span>
            </div>
            <p className={`text-muted-foreground text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('brand.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-bold text-foreground mb-4">{t('footer.quick_links')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-bold text-foreground mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#terms" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-bold text-foreground mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@faheem.com" className="text-muted-foreground hover:text-primary transition-colors">
                  support@faheem.com
                </a>
              </li>
              <li className="text-muted-foreground">
                +20 XXX XXXX XXX
              </li>
            </ul>
          </div>
        </div>

        <div className={`border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <p>&copy; {currentYear} {t('brand.name')}. {t('footer.rights')}</p>
          <div className={`flex gap-6 mt-4 md:mt-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <a href="#twitter" className="hover:text-primary transition-colors">
              {t('footer.twitter')}
            </a>
            <a href="#facebook" className="hover:text-primary transition-colors">
              {t('footer.facebook')}
            </a>
            <a href="#linkedin" className="hover:text-primary transition-colors">
              {t('footer.linkedin')}
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
