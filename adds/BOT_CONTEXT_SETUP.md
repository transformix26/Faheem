# Bot Context - Global State Management

## Overview
البيانات الخاصة بالـ Bot تُدار من خلال `BotContext` الذي يوفر حالة عالمية (Global State) لكل التطبيق.

## الهيكل الأساسي

### BotData Interface
\`\`\`typescript
{
  id: string              // معرف فريد للـ Bot
  name: string           // اسم الـ Bot
  description: string    // وصف الـ Bot
  status: 'active' | 'inactive' | 'training'  // حالة الـ Bot
  instructions: string   // التعليمات الرئيسية
  knowledge: string[]    // قائمة معارف الـ Bot
  channels: string[]     // القنوات المتصلة
  messageCount: number   // عدد الرسائل
  createdAt: string     // تاريخ الإنشاء
}
\`\`\`

## كيفية الاستخدام

### استيراد البيانات في أي مكون
\`\`\`typescript
'use client'

import { useBotContext } from '@/lib/bot-context'

export function MyComponent() {
  const { activeBot, bots, setActiveBot, updateBot } = useBotContext()
  
  // استخدم البيانات والدوال هنا
}
\`\`\`

### الدوال المتاحة

1. **setActiveBot(bot: BotData)**
   - تبديل الـ Bot النشط
   - تحديث البيانات في جميع المكونات فوراً

2. **createBot(bot: BotData)**
   - إنشاء Bot جديد
   - يُضاف تلقائياً للقائمة

3. **updateBot(id: string, updates: Partial<BotData>)**
   - تحديث بيانات Bot معين
   - يتم تحديث البيانات في الـ ActiveBot إن كان مختاراً

4. **deleteBot(id: string)**
   - حذف Bot من القائمة
   - إذا كان مختاراً، يتم التبديل للـ Bot الأول

5. **refreshBots()**
   - إعادة تحميل البيانات من API (للاستخدام المستقبلي)

## ربط API

عند ربط API مستقبلاً، اتبع الخطوات التالية:

### 1. تعديل دالة refreshBots في /lib/bot-context.tsx
\`\`\`typescript
const refreshBots = useCallback(async () => {
  try {
    const response = await fetch('/api/bots')
    const data = await response.json()
    setBots(data)
    if (data.length > 0 && !activeBot) {
      setActiveBotState(data[0])
    }
  } catch (error) {
    console.error('Failed to fetch bots:', error)
  }
}, [activeBot])
\`\`\`

### 2. إضافة API route في /app/api/bots/route.ts
\`\`\`typescript
export async function GET() {
  // يُرجع قائمة الـ Bots من Database
}

export async function POST(request: Request) {
  // إنشاء Bot جديد
}
\`\`\`

### 3. إضافة حماية RLS إذا كنت تستخدم Supabase
تأكد من أن المستخدم يمكنه الوصول فقط لـ Bots الخاصة به.

## مسار البيانات

\`\`\`
الكود الحالي (State Based):
┌─────────────────┐
│  BotContext     │ (MOCK DATA)
│  - bots[]       │
│  - activeBot    │
└────────┬────────┘
         │
    ┌────▼────────────┐
    │  Sidebar        │ (يستخدم البيانات)
    │  Dashboard      │ (يعرض البيانات)
    │  Other Pages    │ (تحديثات تلقائية)
    └─────────────────┘

مسار API المستقبلي:
┌──────────────┐
│   Database   │
└────┬─────────┘
     │
  ┌──▼──────────────┐
  │  API Routes     │ (/api/bots/*)
  └────┬────────────┘
       │
   ┌───▼──────────────┐
   │  BotContext      │
   │  - refreshBots() │
   │  - updateBot()   │
   └────┬─────────────┘
        │
   ┌────▼────────────┐
   │  Components     │ (تحديثات فورية)
   └─────────────────┘
\`\`\`

## النقاط المهمة

✅ **Clean Flow**: جميع البيانات تمر عبر Context واحد
✅ **Single Source of Truth**: بيانات واحدة لكل Bot
✅ **Real-time Updates**: تحديثات فورية على جميع الصفحات
✅ **API Ready**: البنية جاهزة للربط مع Backend بسهولة

## مثال عملي: تحديث البيانات عند تبديل الـ Bot

\`\`\`typescript
// في الـ Sidebar
const { activeBot, setActiveBot } = useBotContext()

const handleBotSelect = (bot) => {
  setActiveBot(bot)  // تحديث البيانات في Context
  // سيتم تحديث Dashboard تلقائياً!
}
\`\`\`

\`\`\`typescript
// في الـ Dashboard
const { activeBot } = useBotContext()

// عند أي تغيير في activeBot، Dashboard يُحدّث تلقائياً
useEffect(() => {
  // البيانات تتغير تلقائياً
  console.log('Bot changed:', activeBot.name)
}, [activeBot])
\`\`\`
