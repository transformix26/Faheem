'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Bot, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useBotContext } from '@/lib/bot-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function NewBotPage() {
    const { t, language } = useLanguage()
    const { bots, createBot, setActiveBot } = useBotContext()
    const router = useRouter()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const isRTL = language === 'ar'

    const handleCreate = async () => {
        if (!name.trim()) return
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))

        const newBot = {
            id: `bot-${Date.now()}`,
            name: name,
            description: '',
            status: 'inactive' as const,
            instructions: '',
            knowledge: [],
            channels: [],
            messageCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
        }

        createBot(newBot)
        setActiveBot(newBot)
        router.push('/dashboard')
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto py-10"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {isRTL ? 'رجوع' : 'Back'}
            </button>

            <Card className="border-border shadow-lg">
                <CardHeader className="text-center pb-8 border-b border-border/50 bg-muted/20">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{isRTL ? 'إنشاء بوت جديد' : 'Create New Bot'}</CardTitle>
                    <CardDescription>
                        {isRTL ? 'أدخل اسم البوت الخاص بك للبدء' : 'Enter your bot name to get started'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            {isRTL ? 'اسم البوت' : 'Bot Name'}
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isRTL ? 'مثال: بوت المساعدة' : 'e.g., Support Bot'}
                            className="h-12 text-lg"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            onClick={handleCreate}
                            disabled={!name.trim() || loading}
                            className="flex-1 h-12 text-base font-bold gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Plus className="w-5 h-5" />
                            )}
                            {isRTL ? 'إنشاء البوت' : 'Create Bot'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 h-12 text-base"
                        >
                            {isRTL ? 'إلغاء' : 'Cancel'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
