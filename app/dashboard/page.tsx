'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { MessageCircle, BarChart3, Users, TrendingUp, Clock, Zap, Plus, Bot } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useBotContext } from '@/lib/bot-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const { activeBot, bots, createBot, setActiveBot } = useBotContext()
  const isRTL = language === 'ar'
  const [showCreateBotDialog, setShowCreateBotDialog] = useState(false)
  const router = useRouter()

  const stats = useMemo(() => [
    {
      label: t('dashboard.daily_chats'),
      value: activeBot ? `${activeBot.messageCount}` : '245',
      change: '+12%',
      icon: MessageCircle,
      color: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: t('dashboard.customer_satisfaction'),
      value: activeBot?.status === 'active' ? '94%' : '0%',
      change: '+5%',
      icon: BarChart3,
      color: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: t('dashboard.active_users'),
      value: activeBot?.channels.length ? `${activeBot.channels.length} channels` : '1,342',
      change: '+8%',
      icon: Users,
      color: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: t('dashboard.growth'),
      value: activeBot?.knowledge.length ? `${activeBot.knowledge.length} items` : '+23%',
      change: 'knowledge base',
      icon: TrendingUp,
      color: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-600',
    },
  ], [activeBot, language, t])

  const chartData = useMemo(() => [
    {
      label: t('dashboard.response_time'),
      value: '2.5 min',
      icon: Clock,
      stat: '8%',
    },
    {
      label: t('dashboard.performance'),
      value: '94%',
      icon: Zap,
      stat: '2%+',
    },
  ], [t])


  if (bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Bot className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {isRTL ? 'مرحباً بك في فهيم' : 'Welcome to Faheem'}
        </h2>
        <p className="text-secondary max-w-md mb-8">
          {isRTL
            ? 'ابدأ بإنشاء أول بوت ذكي لك لمساعدتك في التواصل مع عملائك بشكل أفضل.'
            : 'Start by creating your first smart bot to help you better communicate with your customers.'}
        </p>
        <Button onClick={() => router.push('/dashboard/bots/new')} size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          {isRTL ? 'إنشاء بوت جديد' : 'Create New Bot'}
        </Button>

      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Page Header */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-2xl md:text-4xl font-bold text-foreground mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {activeBot ? activeBot.name : t('dashboard.title')}
          </h1>
          <p className={`text-secondary text-sm md:text-base ${isRTL ? 'text-right' : 'text-left'}`}>
            {activeBot ? activeBot.description : t('dashboard.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/bots/new')}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('sidebar.new_bot')}
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-lg p-4 md:p-6 border border-border hover:shadow-md transition-shadow`}
            >
              <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-lg bg-white/50 ${stat.iconColor}`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className={`text-xl md:text-3xl font-bold text-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {stat.value}
              </p>
              <p className={`text-xs md:text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                {stat.label}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {chartData.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="bg-white rounded-lg border border-border p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground text-sm md:text-base">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded">
                  {item.stat}
                </span>
              </div>
              <p className={`text-2xl md:text-3xl font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                {item.value}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Distribution and Activity Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg border border-border p-4 md:p-6 hover:shadow-md transition-shadow"
        >
          <h3 className={`text-lg md:text-xl font-bold text-foreground mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('dashboard.distribution')}
          </h3>
          <div className="space-y-4">
            <div>
              <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-secondary">{t('dashboard.complete')}</span>
                <span className="text-sm font-semibold text-foreground">78%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
            <div>
              <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-secondary">{t('dashboard.incomplete')}</span>
                <span className="text-sm font-semibold text-foreground">15%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
            <div>
              <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-secondary">{t('dashboard.pending')}</span>
                <span className="text-sm font-semibold text-foreground">7%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg border border-border p-4 md:p-6 hover:shadow-md transition-shadow"
        >
          <h3 className={`text-lg md:text-xl font-bold text-foreground mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('dashboard.activity')}
          </h3>
          <div className="text-center py-8 text-secondary">
            <p className="text-sm">{t('dashboard.charts_soon')}</p>
          </div>
        </motion.div>
      </div>

    </motion.div>
  )
}
