import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { LanguageProvider } from '@/lib/language-context'
import { BotProvider } from '@/lib/bot-context'
import { HtmlWrapper } from '@/components/html-wrapper'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['latin', 'arabic'],
  variable: '--font-tajawal',
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'فهيم | FAHEEM',
  description: 'Your AI Bot Management Platform',
  generator: 'Omar Fahem'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased flex flex-col min-h-screen">
        <LanguageProvider>
          <HtmlWrapper>
            <AuthProvider>
              <BotProvider>
                <Navbar />
                <div className="flex-1">
                  {children}
                </div>
                <Footer />
              </BotProvider>
            </AuthProvider>
          </HtmlWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
