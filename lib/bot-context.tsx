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
  autoReply?: boolean
  collectLeads?: boolean
  handoffEnabled?: boolean
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

export function BotProvider({ children }: { children: ReactNode }) {
  const [bots, setBots] = useState<BotData[]>([])
  const [activeBot, setActiveBotState] = useState<BotData | null>(null)

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
    setBots(prev => {
      const remaining = prev.filter(bot => bot.id !== id)
      // Switch to first bot if active bot is deleted
      if (activeBot?.id === id) {
        setActiveBotState(remaining[0] || null)
      }
      return remaining
    })
    // Simulate API call here later
    console.log('[BotContext] Bot deleted:', id)
  }, [activeBot?.id])

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
