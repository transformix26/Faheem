'use client'

import { motion } from 'framer-motion'

const companies = [
  { name: 'Arkan', id: 1 },
  { name: 'Badreldin', id: 2 },
  { name: 'Reviv', id: 3 },
  { name: 'Helwan', id: 4 },
  { name: 'NextGen', id: 5 },
  { name: 'ProTech', id: 6 },
]

export default function TrustedBySection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl font-bold text-foreground mb-12 text-balance"
        >
          عملاء في كل مصر واثقين في فهيم
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {companies.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex items-center justify-center p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-border"
            >
              <span className="font-semibold text-foreground/70 text-center text-sm">
                {company.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
