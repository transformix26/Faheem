'use client'

import { motion } from 'framer-motion'
import { Hero } from '@/components/home/hero'
import { Features } from '@/components/home/features'
import { TrustedCustomers } from '@/components/home/trusted-customers'
import { CTA } from '@/components/home/cta'
import { Pricing } from '@/components/home/pricing'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-background"
    >
      <Hero />
      <Features />
      <TrustedCustomers />
      {!isAuthenticated && <Pricing />}
      <CTA />
    </motion.main>
  )
}
