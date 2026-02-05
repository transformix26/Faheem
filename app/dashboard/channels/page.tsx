'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, Link2, Plus, Check, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useBotContext } from '@/lib/bot-context'
import { Button } from '@/components/ui/button'

export default function ChannelsPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const { activeBot } = useBotContext()
  const isRTL = language === 'ar'

  // Define the 3 platforms with their brand styling
  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook Messenger',
      icon: 'FB',
      color: 'bg-[#1877F2]',
      textColor: 'text-[#1877F2]',
      borderColor: 'border-[#1877F2]/20',
      hoverColor: 'hover:border-[#1877F2]/50'
    },
    {
      id: 'instagram',
      name: 'Instagram DM',
      icon: 'IG',
      color: 'bg-gradient-to-tr from-[#FF0069] to-[#C13584]',
      textColor: 'text-[#C13584]',
      borderColor: 'border-[#C13584]/20',
      hoverColor: 'hover:border-[#C13584]/50'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: 'WA',
      color: 'bg-[#25D366]',
      textColor: 'text-[#25D366]',
      borderColor: 'border-[#25D366]/20',
      hoverColor: 'hover:border-[#25D366]/50'
    },
  ]

  // Determine which platform is connected
  const connectedPlatformId = useMemo(() => {
    if (!activeBot || !activeBot.channels || activeBot.channels.length === 0) return null
    const channelName = activeBot.channels[0].toLowerCase()
    if (channelName.includes('whatsapp')) return 'whatsapp'
    if (channelName.includes('instagram')) return 'instagram'
    if (channelName.includes('facebook')) return 'facebook'
    // Default fallback if unknown name but connected, maybe default to first? 
    // Or return null if no match. Let's assume WhatsApp as common default for now if ambiguous
    return 'facebook'
  }, [activeBot])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-start">
            {t('channels.title')}
          </h1>
          <p className="text-secondary text-start">
            {t('channels.subtitle')}
          </p>
        </div>
      </div>

      {!activeBot ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-dashed border-border p-12 text-center"
        >
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link2 className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {t('sidebar.no_bot')}
          </h3>
          <p className="text-secondary mb-6 max-w-sm mx-auto">
            {t('settings.no_bot_desc')}
          </p>
          <Button variant="default" className="gap-2" onClick={() => router.push('/dashboard/bots/new')}>
            <Plus className="w-4 h-4" />
            {t('sidebar.new_bot')}
          </Button>
        </motion.div>
      ) : (
        <>
          {/* 3 Buttons / Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {platforms.map((platform, idx) => {
              const isConnected = connectedPlatformId === platform.id

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative group bg-white rounded-xl border-2 p-6 transition-all duration-300 ${isConnected
                    ? `${platform.borderColor} shadow-lg scale-[1.02]`
                    : 'border-border hover:border-primary/20 hover:shadow-md opacity-70 hover:opacity-100'
                    }`}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-700">{t('channels.connected')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        <span className="text-xs font-medium text-slate-500">{t('channels.disconnected')}</span>
                      </div>
                    )}
                  </div>

                  {/* Icon & Details */}
                  <div className="flex flex-col items-center text-center mt-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm mb-4 ${platform.color}`}>
                      {platform.icon}
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {platform.name}
                    </h3>

                    {isConnected ? (
                      <p className="text-sm text-green-600 font-medium flex items-center gap-1 justify-center">
                        <Check className="w-3.5 h-3.5" />
                        {t('channels.connected')}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
                        <X className="w-3.5 h-3.5" />
                        {t('channels.disconnected')}
                      </p>
                    )}
                  </div>

                  {/* Visual Indicator of "Selected" logic */}
                  {isConnected && (
                    <div className={`absolute inset-0 border-2 rounded-xl pointer-events-none ${platform.borderColor.replace('/20', '/50')}`} />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-primary/5 border border-primary/10 rounded-lg p-6 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground text-start">
                {t('channels.note')}
              </h3>
            </div>
            <p className="text-secondary text-sm leading-relaxed text-start">
              {t('channels.note_text')}
            </p>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
