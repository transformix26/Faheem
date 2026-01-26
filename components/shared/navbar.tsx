'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell, Plus, Search, LogOut, Settings, ChevronDown, Globe, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'

export function Navbar() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleCreateNew = () => {
    if (isAuthenticated) {
      router.push('/dashboard/knowledge')
    }
  }

  const handleLanguageChange = (newLang: 'ar' | 'en') => {
    setLanguage(newLang)
    setLanguageOpen(false)
    // Reload page to apply language changes
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isAuthenticated) {
      router.push('/prices')
    } else {
      // If on home page, scroll to pricing
      if (window.location.pathname === '/') {
        const pricingSection = document.getElementById('pricing')
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // If on another page, go to home#pricing
        router.push('/#pricing')
      }
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-border sticky top-0 z-40 w-full"
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between w-full">
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img src="/logo.png" alt={t('brand.name')} className="w-8 h-8 rounded" />
            <span className="text-base sm:text-lg font-bold text-primary hidden sm:inline whitespace-nowrap">
              {t('brand.name')}
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-foreground font-medium hover:text-primary transition-colors text-sm"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/#pricing"
              onClick={handlePricingClick}
              className="text-foreground font-medium hover:text-primary transition-colors text-sm"
            >
              {t('nav.pricing')}
            </Link>
          </nav>
        </div>

        {/* Right Side: Actions and User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Button - Visible only on small screens */}
          <button
            className="md:hidden p-2 text-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Language Toggle */}
          <div className="hidden md:block relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguageOpen(!languageOpen)}
              className="p-2 text-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title={t('sidebar.language')}
            >
              <Globe className="w-5 h-5" />
            </motion.button>

            {languageOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute mt-2 w-40 bg-white border border-border rounded-lg shadow-lg z-50 ${language === 'ar' ? 'left-0' : 'right-0'
                  }`}
              >
                <button
                  onClick={() => handleLanguageChange('ar')}
                  className={`w-full text-right px-4 py-3 text-sm transition-colors rounded-t-lg flex items-center justify-end gap-2 ${language === 'ar'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                    }`}
                >
                  {language === 'ar' && <div className="w-2 h-2 bg-white rounded-full" />}
                  العربية
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full text-right px-4 py-3 text-sm transition-colors rounded-b-lg flex items-center justify-end gap-2 ${language === 'en'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                    }`}
                >
                  {language === 'en' && <div className="w-2 h-2 bg-white rounded-full" />}
                  English
                </button>
              </motion.div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              {/* Search Bar - Dashboard only */}
              <div className="hidden md:flex flex-1 max-w-sm mx-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-secondary" />
                  <input
                    type="text"
                    placeholder={t('nav.search')}
                    className="w-full pl-10 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Create New Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                className="hidden md:flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors font-medium text-xs md:text-sm flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">{t('nav.create')}</span>
              </motion.button>

              {/* Notification Bell */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 text-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute mt-2 w-80 max-w-[85vw] bg-white border border-border rounded-lg shadow-lg z-50 ${language === 'ar' ? '-left-20 sm:left-0' : '-right-20 sm:right-0'
                      }`}
                  >
                    <div className="p-4 border-b border-border font-medium text-foreground">
                      {t('nav.notifications')}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 text-center text-secondary text-sm">
                        {t('nav.no_notifications')}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-secondary" />
                </motion.button>

                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute mt-2 w-64 bg-white border border-border rounded-lg shadow-lg z-50 ${language === 'ar' ? 'left-0' : 'right-0'
                      }`}
                  >
                    <div className="p-4 border-b border-border">
                      <p className="text-xs text-secondary">{t('nav.email')}</p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        {t('nav.settings')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-primary font-medium hover:opacity-80 transition-opacity text-sm"
              >
                {t('nav.login')}
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg p-4 md:hidden flex flex-col gap-4 z-50"
          >
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-muted rounded-lg font-medium">{t('nav.home')}</Link>
              <Link href="/#pricing" onClick={(e) => { handlePricingClick(e); setMobileMenuOpen(false); }} className="px-4 py-2 hover:bg-muted rounded-lg font-medium">{t('nav.pricing')}</Link>
              {!isAuthenticated ? (
                <>
                  <div className="h-px bg-border my-2" />
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-muted rounded-lg text-primary">{t('nav.login')}</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 bg-primary text-white rounded-lg text-center mt-2">{t('nav.register')}</Link>
                </>
              ) : (
                <>
                  <div className="h-px bg-border my-2" />
                  <div className="px-4 text-xs text-muted-foreground">{user?.email}</div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-muted rounded-lg">{t('dashboard.title')}</Link>
                  <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-muted rounded-lg">{t('nav.settings')}</Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-start flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex gap-2 mt-2 pt-4 border-t border-border">
              <button onClick={() => handleLanguageChange('ar')} className={`flex-1 py-2 rounded-lg text-sm ${language === 'ar' ? 'bg-primary text-white' : 'bg-muted'}`}>العربية</button>
              <button onClick={() => handleLanguageChange('en')} className={`flex-1 py-2 rounded-lg text-sm ${language === 'en' ? 'bg-primary text-white' : 'bg-muted'}`}>English</button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
