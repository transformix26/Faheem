'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, Shield, Calendar, Edit2, X, Save } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { withProtectedRoute } from '@/lib/protected-route'
import { useState } from 'react'

function ProfilePage() {
    const { language, t } = useLanguage()
    const { user, updateUser } = useAuth()
    const isRTL = language === 'ar'

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || '',
    })

    if (!user) return null

    const handleSave = () => {
        updateUser(formData)
        setIsEditing(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto space-y-8"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-2xl border border-border shadow-sm">
                <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                    {user.firstName.charAt(0).toUpperCase()}
                </div>
                <div className={`flex-1 text-center md:text-start ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                        {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-secondary flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                    </p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    {t('profile.edit')}
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            {t('profile.personal_info')}
                        </CardTitle>
                        <CardDescription>
                            {t('profile.personal_info_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm text-secondary block mb-1">{t('profile.first_name')}</label>
                            <p className="font-medium">{user.firstName}</p>
                        </div>
                        <div>
                            <label className="text-sm text-secondary block mb-1">{t('profile.last_name')}</label>
                            <p className="font-medium">{user.lastName}</p>
                        </div>
                        <div>
                            <label className="text-sm text-secondary block mb-1">{t('profile.phone')}</label>
                            <p className="font-medium">{user.phoneNumber || t('profile.not_provided')}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            {t('profile.security')}
                        </CardTitle>
                        <CardDescription>
                            {t('profile.security_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium">{t('profile.status')}</p>
                                    <p className="text-xs text-secondary">{t('profile.active')}</p>
                                </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                {t('profile.verified')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 p-3">
                            <Calendar className="w-5 h-5 text-secondary" />
                            <div>
                                <p className="text-sm font-medium">{t('profile.join_date')}</p>
                                <p className="text-xs text-secondary">
                                    {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
                                        month: 'long',
                                        year: 'numeric'
                                    }).format(new Date(user.createdAt || Date.now()))}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Settings Shortcut */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-bold text-lg">{t('profile.bot_settings')}</h3>
                    <p className="text-sm text-secondary">
                        {t('profile.bot_settings_desc')}
                    </p>
                </div>
                <Link href="/dashboard/settings">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        {t('profile.go_to_settings')}
                    </Button>
                </Link>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditing(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                                <h3 className="text-xl font-bold text-foreground">
                                    {t('profile.edit')}
                                </h3>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-secondary" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('profile.first_name')}</label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('profile.last_name')}</label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('profile.phone')}</label>
                                    <Input
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-muted/10 border-t border-border flex gap-3">
                                <Button onClick={handleSave} className="flex-1 gap-2">
                                    <Save className="w-4 h-4" />
                                    {t('profile.save_changes')}
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                                    {t('action.cancel')}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default withProtectedRoute(ProfilePage)
