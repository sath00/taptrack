'use client'

import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppShellProps {
  children: ReactNode
  title: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onLogout: () => void
  isLoggingOut: boolean
  onAddSheet?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
  searchPlaceholder?: string
}

export default function AppShell({
  children,
  title,
  searchQuery,
  onSearchChange,
  onLogout,
  isLoggingOut,
  onAddSheet,
  showAddButton = true,
  addButtonLabel,
  searchPlaceholder,
}: AppShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="h-screen bg-disabled md:flex overflow-hidden">
      <Sidebar isLoggingOut={isLoggingOut} onLogout={onLogout} />
      <Sidebar
        mobile
        mobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        isLoggingOut={isLoggingOut}
        onLogout={onLogout}
      />
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-h-0">
        <Topbar
          title={title}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onAddSheet={onAddSheet}
          showAddButton={showAddButton}
          addButtonLabel={addButtonLabel}
          searchPlaceholder={searchPlaceholder}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
