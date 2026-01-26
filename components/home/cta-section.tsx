'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-bold text-foreground text-balance">
            جاهز تحسّن خدمة عملائك؟
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            ابدأ مع فهيم اليوم وشوف النتايج بنفسك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-white text-lg px-8">
                ابدأ التجربة المجانية
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              تواصل معنا
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
