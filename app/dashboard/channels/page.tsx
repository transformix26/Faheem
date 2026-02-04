'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle, Clock, Plus, Link2, Unlink } from 'lucide-react'
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

interface BotStatus {
  id: string
  name: string
  platform: string
  status: 'connected' | 'pending' | 'disconnected'
  icon: string
}

export default function ChannelsPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const { activeBot } = useBotContext()
  const isRTL = language === 'ar'
  const [showAddChannelDialog, setShowAddChannelDialog] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const platforms = [
    { id: 'facebook', name: 'Facebook Messenger', icon: 'FB', color: 'from-blue-500 to-blue-600' },
    { id: 'whatsapp', name: 'WhatsApp Business', icon: 'WA', color: 'from-green-500 to-green-600' },
    { id: 'instagram', name: 'Instagram DM', icon: 'IG', color: 'from-pink-500 to-purple-600' },
    { id: 'website', name: 'Website Widget', icon: 'WB', color: 'from-gray-600 to-gray-700' },
  ]

  const defaultChannels: BotStatus[] = useMemo(() => [
    {
      id: '1',
      name: t('channels.connected') + ' - Facebook',
      platform: 'Facebook',
      status: 'connected',
      icon: 'FB',
    },
    {
      id: '2',
      name: t('channels.pending') + ' - WhatsApp',
      platform: 'WhatsApp',
      status: 'pending',
      icon: 'WA',
    },
    {
      id: '3',
      name: t('channels.disconnected') + ' - Website',
      platform: 'Website',
      status: 'disconnected',
      icon: 'WB',
    },
  ], [t])

  const channels = useMemo(() => {
    if (!activeBot || !activeBot.channels.length) {
      return defaultChannels
    }
    return activeBot.channels.map((channel, idx) => ({
      id: `${idx}`,
      name: channel,
      platform: 'Custom',
      status: 'connected' as const,
      icon: 'CH',
    }))
  }, [activeBot, defaultChannels])

  const [bots, setBots] = useState<BotStatus[]>(defaultChannels)

  useEffect(() => {
    setBots(channels)
  }, [channels, activeBot])

  const getStatusConfig = (status: string) => {
    const statusLabels = {
      connected: t('channels.connected'),
      pending: t('channels.pending'),
      disconnected: t('channels.disconnected'),
    }

    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          label: statusLabels.connected,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        }
      case 'pending':
        return {
          icon: Clock,
          label: statusLabels.pending,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        }
      default:
        return {
          icon: MessageCircle,
          label: statusLabels.disconnected,
          color: 'text-secondary',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Page Header */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold text-foreground mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('channels.title')}
          </h1>
          <p className={`text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('channels.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => setShowAddChannelDialog(true)}
          className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Plus className="w-4 h-4" />
          {t('channels.add_channel')}
        </Button>
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
          {/* Current Bot Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-border p-6 mb-8"
          >
            <h2 className={`text-lg font-bold text-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('channels.current_bot')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className={`text-sm text-secondary mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('channels.bot_name')}
                </p>
                <p className={`text-xl font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{activeBot.name}</p>
              </div>
              <div>
                <p className={`text-sm text-secondary mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('channels.status')}
                </p>
                <div className={`flex items-center gap-2 ${isRTL ? 'justify-start' : 'justify-start'}`}>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-xl font-bold text-green-600">
                    {t('channels.connected')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bots List */}
          <div>
            <h2 className={`text-lg font-bold text-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('channels.all_channels')}
            </h2>
            <div className="grid gap-4">
              {bots.map((bot, idx) => {
                const statusConfig = getStatusConfig(bot.status)
                const StatusIcon = statusConfig.icon
                return (
                  <motion.div
                    key={bot.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-white rounded-lg border-2 p-6 transition-all hover:shadow-md ${statusConfig.borderColor}`}
                  >
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-4 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-sm">
                          {bot.icon}
                        </div>
                        <div>
                          <h3 className={`font-bold text-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>{bot.name}</h3>
                          <p className={`text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{bot.platform}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bgColor} ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                          <span className={`font-medium text-sm ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={bot.status === 'connected' ? (isRTL ? 'فصل' : 'Disconnect') : (isRTL ? 'اتصال' : 'Connect')}
                        >
                          {bot.status === 'connected' ? <Unlink className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-6"
      >
        <h3 className={`font-bold text-foreground mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('channels.note')}
        </h3>
        <p className={`text-secondary text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('channels.note_text')}
        </p>
      </motion.div>

      {/* Add Channel Dialog */}
      <Dialog open={showAddChannelDialog} onOpenChange={setShowAddChannelDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link2 className="w-5 h-5" />
              {t('channels.add_channel')}
            </DialogTitle>
            <DialogDescription>
              {isRTL ? 'اختر منصة للاتصال بها' : 'Choose a platform to connect'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${selectedPlatform === platform.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold text-sm mx-auto mb-2`}>
                    {platform.icon}
                  </div>
                  <p className="font-medium text-foreground text-sm text-center">{platform.name}</p>
                </button>
              ))}
            </div>

            {selectedPlatform && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                    {isRTL ? 'اسم القناة' : 'Channel Name'}
                  </label>
                  <Input
                    placeholder={isRTL ? 'بوت الدعم الفني' : 'Support Bot'}
                    className={`mt-1.5 ${isRTL ? 'text-right' : ''}`}
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                    {isRTL ? 'معرف الصفحة/الحساب' : 'Page/Account ID'}
                  </label>
                  <Input
                    placeholder="123456789"
                    className={`mt-1.5 ${isRTL ? 'text-right' : ''}`}
                  />
                </div>
              </motion.div>
            )}
          </div>
          <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
            <Button variant="outline" onClick={() => {
              setShowAddChannelDialog(false)
              setSelectedPlatform(null)
            }}>
              {t('action.cancel')}
            </Button>
            <Button
              onClick={() => {
                setShowAddChannelDialog(false)
                setSelectedPlatform(null)
              }}
              disabled={!selectedPlatform}
            >
              {isRTL ? 'اتصال' : 'Connect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
