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
  const { activeBot } = useBotContext()
  const isRTL = language === 'ar'
  
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [botSettings, setBotSettings] = useState({
    name: activeBot?.name || '',
    description: activeBot?.description || '',
    instructions: activeBot?.instructions || '',
    isActive: activeBot?.status === 'active',
    autoReply: true,
    collectLeads: true,
    handoffEnabled: true,
  })

  const handleSave = () => {
    setIsEditing(false)
    // API call would go here
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
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t('action.cancel')}
                </Button>
                <Button onClick={handleSave} className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Save className="w-4 h-4" />
                  {t('action.save')}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
              <div>
                <label className={`text-sm font-medium text-secondary ${isRTL ? 'text-right block' : ''}`}>
                  {isRTL ? 'الوصف' : 'Description'}
                </label>
                {isEditing ? (
                  <Input 
                    value={botSettings.description}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, description: e.target.value }))}
                    className={`mt-1.5 ${isRTL ? 'text-right' : ''}`}
                  />
                ) : (
                  <p className={`text-foreground mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{activeBot.description}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bot Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-border p-6"
          >
            <h2 className={`text-lg font-bold text-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('settings.bot_instructions')}
            </h2>
            {isEditing ? (
              <Textarea 
                value={botSettings.instructions}
                onChange={(e) => setBotSettings(prev => ({ ...prev, instructions: e.target.value }))}
                className={`min-h-[120px] ${isRTL ? 'text-right' : ''}`}
                placeholder={isRTL ? 'أدخل تعليمات البوت...' : 'Enter bot instructions...'}
              />
            ) : (
              <p className={`text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                {activeBot.instructions || t('settings.no_instructions')}
              </p>
            )}
          </motion.div>

          {/* Bot Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-border p-6"
          >
            <h2 className={`text-lg font-bold text-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'إعدادات البوت' : 'Bot Settings'}
            </h2>
            <div className="space-y-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className={`font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('settings.bot_status')}
                  </p>
                  <p className={`text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'تفعيل أو إيقاف البوت' : 'Enable or disable the bot'}
                  </p>
                </div>
                <Switch 
                  checked={botSettings.isActive}
                  onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, isActive: checked }))}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className={`font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'الرد التلقائي' : 'Auto Reply'}
                  </p>
                  <p className={`text-sm text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'رد تلقائي على الرسائل الجديدة' : 'Auto respond to new messages'}
                  </p>
                </div>
                <Switch 
                  checked={botSettings.autoReply}
                  onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, autoReply: checked }))}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
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
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
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
              className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
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
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-border p-12 text-center"
        >
          <SettingsIcon className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            {t('settings.no_bot')}
          </h3>
          <p className="text-secondary mb-6">
            {t('settings.no_bot_desc')}
          </p>
          <Button className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
          <AlertDialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
            <AlertDialogCancel>{t('action.cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('action.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
