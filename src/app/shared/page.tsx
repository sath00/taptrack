'use client'

import { useMemo, useState } from 'react'
import { FileText, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AppShell from '../components/layout/AppShell'
import { withAuth } from '../components/auth/withAuth'

interface SharedSheetPlaceholder {
  id: string
  name: string
  members: number
  updated: string
}

const PLACEHOLDER_SHARED_SHEETS: SharedSheetPlaceholder[] = [
  { id: 's-1', name: 'Apartment Utilities', members: 3, updated: 'Feb 20, 2026' },
  { id: 's-2', name: 'Team Outing Budget', members: 6, updated: 'Feb 17, 2026' },
  { id: 's-3', name: 'Family Groceries', members: 4, updated: 'Feb 11, 2026' },
]

function SharedPage() {
  const { signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSheets = useMemo(() => {
    if (!searchQuery.trim()) return PLACEHOLDER_SHARED_SHEETS

    return PLACEHOLDER_SHARED_SHEETS.filter((sheet) =>
      sheet.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <AppShell
      title="Shared"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      showAddButton={false}
      searchPlaceholder="Search shared sheets..."
    >
      <div className="p-4 sm:p-6 space-y-6">
        <div className="bg-primary border border-border-primary rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-secondary uppercase">Shared Sheets</p>
          <p className="text-4xl font-bold mt-2 text-text-primary">{filteredSheets.length}</p>
          <p className="text-sm text-tertiary mt-2">Placeholder list for now. Collaboration sync will be connected next.</p>
        </div>

        <div className="space-y-4">
          {filteredSheets.map((sheet) => (
            <article
              key={sheet.id}
              className="bg-primary rounded-2xl border border-border-primary p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-brand-light flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-text-primary truncate">{sheet.name}</h3>
                  <p className="text-secondary mt-1">{sheet.members} collaborators</p>
                  <p className="text-sm text-tertiary mt-1">Last modified: {sheet.updated}</p>
                </div>
                <div className="shrink-0 w-9 h-9 rounded-xl bg-brand-light/60 flex items-center justify-center">
                  <FileText size={16} className="text-primary" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

export default withAuth(SharedPage)
