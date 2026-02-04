'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Plus, Edit2, Save, Trash2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useBotContext } from '@/lib/bot-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function SettingsPage() {
  const { language, t } = useLanguage()
  const { activeBot, updateBot, deleteBot } = useBotContext()
  const isRTL = language === 'ar'

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [botSettings, setBotSettings] = useState({
    name: activeBot?.name || '',
    isActive: activeBot?.status === 'active',
    autoReply: true,
    collectLeads: true,
    handoffEnabled: true,
  })

  // Sync settings when activeBot changes
  useState(() => {
    if (activeBot) {
      setBotSettings({
        name: activeBot.name,
        isActive: activeBot.status === 'active',
        autoReply: true,
        collectLeads: true,
        handoffEnabled: true,
      })
    }
  })

  const handleSave = () => {
    if (activeBot) {
      updateBot(activeBot.id, {
        name: botSettings.name,
        status: botSettings.isActive ? 'active' : 'inactive',
        autoReply: botSettings.autoReply,
        collectLeads: botSettings.collectLeads,
        handoffEnabled: botSettings.handoffEnabled,
      })
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (activeBot) {
      deleteBot(activeBot.id)
      setShowDeleteDialog(false)
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold text-foreground mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('settings.title')}
          </h1>
          <p className={`text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
            {activeBot
              ? `${t('settings.manage')} - ${activeBot.name}`
              : t('settings.manage')
            }
          </p>
        </div>
        {activeBot && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t('action.cancel')}
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  {t('action.save')}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit2 className="w-4 h-4" />
                {t('action.edit')}
              </Button>
            )}
          </div>
        )}
      </div>

      {activeBot ? (
        <div className="grid gap-6">
          {/* Bot Name & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-border p-6"
          >
            <h2 className={`text-lg font-bold text-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'معلومات البوت' : 'Bot Information'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium text-secondary ${isRTL ? 'text-right block' : ''}`}>
                  {t('channels.bot_name')}
                </label>
                {isEditing ? (
                  <Input
                    value={botSettings.name}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, name: e.target.value }))}
                    className={`mt-1.5 ${isRTL ? 'text-right' : ''}`}
                  />
                ) : (
                  <p className={`text-foreground mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{activeBot.name}</p>
                )}
              </div>
            </div>
          </motion.div>


          {/* Bot Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-border p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              {isRTL ? 'إعدادات البوت' : 'Bot Settings'}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'البوت نشط (رد تلقائي)' : 'Bot Status (Auto Reply)'}
                  </p>
                  <p className={`text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'تفعيل أو إيقاف الردود التلقائية للبوت' : 'Enable or disable auto responses for the bot'}
                  </p>
                </div>
                <Switch
                  checked={botSettings.isActive}
                  onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, isActive: checked }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'جمع العملاء المحتملين' : 'Collect Leads'}
                  </p>
                  <p className={`text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'جمع معلومات العملاء المحتملين' : 'Collect potential customer information'}
                  </p>
                </div>
                <Switch
                  checked={botSettings.collectLeads}
                  onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, collectLeads: checked }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'التحويل للوكيل' : 'Agent Handoff'}
                  </p>
                  <p className={`text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'تحويل المحادثات المعقدة للوكيل البشري' : 'Transfer complex conversations to human agent'}
                  </p>
                </div>
                <Switch
                  checked={botSettings.handoffEnabled}
                  onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, handoffEnabled: checked }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </motion.div>

          {/* Bot Status & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-border p-6"
          >
            <h2 className={`text-lg font-bold text-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'معلومات إضافية' : 'Additional Information'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className={`text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('settings.created_date')}
                </p>
                <p className={`font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {activeBot.createdAt}
                </p>
              </div>
              <div>
                <p className={`text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'عدد الرسائل' : 'Message Count'}
                </p>
                <p className={`font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {activeBot.messageCount}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-50 rounded-lg border border-red-200 p-6"
          >
            <h2 className={`text-lg font-bold text-red-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'منطقة الخطر' : 'Danger Zone'}
            </h2>
            <p className={`text-sm text-red-600 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'حذف البوت نهائياً. هذا الإجراء لا يمكن التراجع عنه.' : 'Permanently delete this bot. This action cannot be undone.'}
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2 text-white"
            >
              <Trash2 className="w-4 h-4" />
              {isRTL ? 'حذف البوت' : 'Delete Bot'}
            </Button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-dashed border-border p-12 text-center"
        >
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <SettingsIcon className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {t('settings.no_bot')}
          </h3>
          <p className="text-secondary mb-6 max-w-sm mx-auto">
            {t('settings.no_bot_desc')}
          </p>
          <Button variant="default" className="gap-2" onClick={() => window.location.href = '/dashboard/bots/new'}>
            <Plus className="w-4 h-4" />
            {t('sidebar.new_bot')}
          </Button>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL
                ? 'سيتم حذف هذا البوت نهائياً مع جميع بياناته. لا يمكن التراجع عن هذا الإجراء.'
                : 'This will permanently delete this bot and all its data. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('action.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('action.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
