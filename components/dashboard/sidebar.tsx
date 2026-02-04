'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { useBotContext } from '@/lib/bot-context'
import {
  MessageCircle,
  Settings,
  BarChart3,
  Inbox,
  LogOut,
  ChevronDown,
  TowerControl,
  Plus,
  X,
  Menu,
  User as UserIcon
} from 'lucide-react'

export function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeBotOpen, setActiveBotOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isRTL, setIsRTL] = useState(true)
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const { activeBot, bots, setActiveBot, createBot } = useBotContext()
  const router = useRouter()
  const pathname = usePathname()

  // Update RTL state when language changes
  useEffect(() => {
    setIsRTL(language === 'ar')
  }, [language])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleAddBot = () => {
    router.push('/dashboard/bots/new')
  }

  const handleBotSelect = (bot: typeof activeBot) => {
    if (bot) {
      setActiveBot(bot)
      setActiveBotOpen(false)
      setSidebarOpen(false)
    }
  }

  const navItems = [
    { href: '/dashboard', label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: MessageCircle },
    { href: '/dashboard/inbox', label: language === 'ar' ? 'الصندوق الوارد' : 'Inbox', icon: Inbox },
    { href: '/dashboard/knowledge', label: language === 'ar' ? 'قاعدة المعرفة' : 'Knowledge Base', icon: BarChart3 },
    { href: '/dashboard/channels', label: language === 'ar' ? 'القنوات' : 'Channels', icon: TowerControl },
    { href: '/dashboard/settings', label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-[72px] z-30 xl:hidden p-2 hover:bg-muted rounded-lg transition-colors ${isRTL ? 'left-4' : 'right-4'
          }`}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 xl:hidden"
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          [isRTL ? 'right' : 'left']: sidebarOpen ? 0 : '-100%',
        }}
        transition={{ duration: 0.3 }}
        className={`fixed xl:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'
          } w-72 sm:w-80 bg-white ${isRTL ? 'border-l' : 'border-r'
          } border-border z-40 xl:z-0 flex flex-col overflow-y-auto top-0`}
      >
        {/* Mobile Close Button - Header */}
        <div className="xl:hidden p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <span className="font-semibold text-lg">{t('sidebar.menu')}</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-3 sm:p-4 border-b border-border">
          <motion.button
            whileHover={{ backgroundColor: '#F1F5F9' }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors hover:bg-muted"
          >
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
              {user?.firstName.charAt(0).toUpperCase()}
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'} min-w-0`}>
              <div className="font-medium text-foreground text-xs sm:text-sm truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-secondary truncate">{user?.email}</div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-secondary transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''
                }`}
            />
          </motion.button>

          {/* User Dropdown Menu */}
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 space-y-1"
            >
              <button
                onClick={handleLogout}
                className={`w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors gap-2 ${isRTL ? 'justify-start' : 'justify-start'}`}
              >
                <LogOut className="w-4 h-4" />
                {t('sidebar.logout')}
              </button>
            </motion.div>
          )}
        </div>

        {/* Active Bot Section */}
        <div className="p-3 sm:p-4 border-b border-border">
          <div
            className={`text-xs font-semibold text-secondary uppercase mb-2 sm:mb-3 ${isRTL ? 'text-right' : 'text-left'
              }`}
          >
            {t('sidebar.active_bot')}
          </div>
          <motion.button
            whileHover={{ backgroundColor: '#F1F5F9' }}
            onClick={() => setActiveBotOpen(!activeBotOpen)}
            className={`w-full flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm ${isRTL ? 'flex-row-reverse' : ''
              }`}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeBot?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            <span
              className={`flex-1 font-medium text-foreground truncate mx-2 ${isRTL ? 'text-right' : 'text-left'
                }`}
            >
              {activeBot?.name || t('sidebar.no_bot')}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-secondary transition-transform flex-shrink-0 ${activeBotOpen ? 'rotate-180' : ''
                }`}
            />
          </motion.button>

          {/* Bot Dropdown */}
          {activeBotOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 space-y-1 max-h-40 sm:max-h-48 overflow-y-auto"
            >
              {bots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => handleBotSelect(bot)}
                  className={`w-full px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors flex items-center ${isRTL ? 'flex-row-reverse' : ''
                    } ${activeBot?.id === bot.id
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-muted'
                    }`}
                >
                  <span className="truncate flex-1">{bot.name}</span>
                  {activeBot?.id === bot.id && (
                    <div className="w-2 h-2 rounded-full bg-white flex-shrink-0 mx-2" />
                  )}
                </button>
              ))}
            </motion.div>
          )}

        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 sm:p-4 space-y-1">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm ${isRTL ? 'flex-row-reverse' : ''
                    } ${isActive
                      ? 'bg-primary text-white'
                      : 'text-secondary hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Footer Spacing */}
        <div
          className={`p-2 sm:p-4 border-t border-border text-center text-xs text-secondary ${isRTL ? 'text-right' : 'text-left'
            }`}
        >
          © 2024 Faheem
        </div>
      </motion.aside>
      {/* Mobile Menu Button - Moved to bottom to avoid duplication with layout header if present, or keep as is if layout doesn't have one. 
          Actually, the layout probably has a header. The user said "when I open sidebar... no icon to close". 
          So removing the trigger button from here is not what we want, just adding the close button INSIDE the sidebar.
       */}
    </>
  )
}
