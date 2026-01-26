'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface BotData {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'training'
  instructions: string
  knowledge: string[]
  channels: string[]
  messageCount: number
  createdAt: string
}

export interface BotContextType {
  activeBot: BotData | null
  bots: BotData[]
  setActiveBot: (bot: BotData) => void
  createBot: (bot: BotData) => void
  updateBot: (id: string, updates: Partial<BotData>) => void
  deleteBot: (id: string) => void
  refreshBots: () => void
}

const BotContext = createContext<BotContextType | undefined>(undefined)

// Mock data - will be replaced with API calls later
const MOCK_BOTS: BotData[] = [
  {
    id: 'bot-1',
    name: 'Bot 1',
    description: 'Customer Support Bot',
    status: 'active',
    instructions: 'Help customers with their questions and solve problems.',
    knowledge: [
      'Main Instructions - 1/20/2024',
      'Return Policy - 1/19/2024'
    ],
    channels: ['Email', 'WhatsApp', 'Telegram'],
    messageCount: 1240,
    createdAt: '2024-01-15'
  },
  {
    id: 'bot-2',
    name: 'Bot 2',
    description: 'Sales Assistant',
    status: 'inactive',
    instructions: 'Assist customers with product information and sales.',
    knowledge: ['Product Catalog', 'Pricing Information'],
    channels: ['Website Chat'],
    messageCount: 856,
    createdAt: '2024-01-10'
  }
]

export function BotProvider({ children }: { children: ReactNode }) {
  const [bots, setBots] = useState<BotData[]>(MOCK_BOTS)
  const [activeBot, setActiveBotState] = useState<BotData | null>(MOCK_BOTS[0])

  const setActiveBot = useCallback((bot: BotData) => {
    setActiveBotState(bot)
    // Simulate API call here later
    console.log('[BotContext] Active bot changed to:', bot.name)
  }, [])

  const createBot = useCallback((bot: BotData) => {
    setBots(prev => [...prev, bot])
    // Simulate API call here later
    console.log('[BotContext] Bot created:', bot.name)
  }, [])

  const updateBot = useCallback((id: string, updates: Partial<BotData>) => {
    setBots(prev =>
      prev.map(bot =>
        bot.id === id ? { ...bot, ...updates } : bot
      )
    )
    // Update active bot if it's the one being edited
    if (activeBot?.id === id) {
      setActiveBotState(prev => prev ? { ...prev, ...updates } : null)
    }
    // Simulate API call here later
    console.log('[BotContext] Bot updated:', id)
  }, [activeBot?.id])

  const deleteBot = useCallback((id: string) => {
    setBots(prev => prev.filter(bot => bot.id !== id))
    // Switch to first bot if active bot is deleted
    if (activeBot?.id === id) {
      const remaining = bots.filter(bot => bot.id !== id)
      setActiveBotState(remaining[0] || null)
    }
    // Simulate API call here later
    console.log('[BotContext] Bot deleted:', id)
  }, [activeBot?.id, bots])

  const refreshBots = useCallback(() => {
    // This will fetch from API later
    console.log('[BotContext] Refreshing bots from API...')
  }, [])

  const value: BotContextType = {
    activeBot,
    bots,
    setActiveBot,
    createBot,
    updateBot,
    deleteBot,
    refreshBots
  }

  return (
    <BotContext.Provider value={value}>
      {children}
    </BotContext.Provider>
  )
}

export function useBotContext() {
  const context = useContext(BotContext)
  if (context === undefined) {
    throw new Error('useBotContext must be used within a BotProvider')
  }
  return context
}
