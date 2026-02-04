'use client'

import React from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { withProtectedRoute } from '@/lib/protected-route'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full overflow-hidden">
        <div className="flex-1 w-full">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 pt-24 sm:pt-20 md:pt-16 lg:pt-12 xl:pt-8 w-full min-h-full">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default withProtectedRoute(DashboardLayout, true)
