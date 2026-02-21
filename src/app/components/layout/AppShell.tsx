'use client'

import { ReactNode } from 'react'
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
  return (
    <div className="h-screen bg-disabled md:flex overflow-hidden">
      <Sidebar isLoggingOut={isLoggingOut} onLogout={onLogout} />

      <main className="flex-1 flex flex-col min-h-0">
        <Topbar
          title={title}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onAddSheet={onAddSheet}
          showAddButton={showAddButton}
          addButtonLabel={addButtonLabel}
          searchPlaceholder={searchPlaceholder}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
