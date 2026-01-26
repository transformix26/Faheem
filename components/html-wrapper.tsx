'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/language-context'

export function HtmlWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      const htmlElement = document.documentElement
      
      // Update direction and language
      htmlElement.dir = language === 'ar' ? 'rtl' : 'ltr'
      htmlElement.lang = language
      
      // Force style recalculation
      htmlElement.style.direction = language === 'ar' ? 'rtl' : 'ltr'
      
      // Add class for CSS-based styling if needed
      htmlElement.classList.toggle('rtl', language === 'ar')
      htmlElement.classList.toggle('ltr', language === 'en')
    }
  }, [language, mounted])

  return <>{children}</>
}
