'use client'

import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AppShell from '../components/layout/AppShell'
import { withAuth } from '../components/auth/withAuth'

interface PlaceholderSheet {
  id: string
  name: string
  expenses: number
  total: number
  updated: string
}

const PLACEHOLDER_PERSONAL_SHEETS: PlaceholderSheet[] = [
  { id: 'p-1', name: 'February 2026', expenses: 12, total: 4250, updated: 'Feb 21, 2026' },
  { id: 'p-2', name: 'January 2026', expenses: 28, total: 8930.5, updated: 'Jan 31, 2026' },
  { id: 'p-3', name: 'Groceries', expenses: 8, total: 2100, updated: 'Feb 18, 2026' },
  { id: 'p-4', name: 'Travel Fund', expenses: 5, total: 15200, updated: 'Feb 10, 2026' },
]

function PersonalPage() {
  const { signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSheets = useMemo(() => {
    if (!searchQuery.trim()) return PLACEHOLDER_PERSONAL_SHEETS

    return PLACEHOLDER_PERSONAL_SHEETS.filter((sheet) =>
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
      title="Personal"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      showAddButton={false}
      searchPlaceholder="Search personal sheets..."
    >
      <div className="p-4 sm:p-6 space-y-6">
        <div className="bg-primary border border-border-primary rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-secondary uppercase">Personal Sheets</p>
          <p className="text-4xl font-bold mt-2 text-text-primary">{filteredSheets.length}</p>
          <p className="text-sm text-tertiary mt-2">Placeholder list for now. Will be connected to personal sheet API next.</p>
        </div>

        <div className="space-y-4">
          {filteredSheets.map((sheet) => (
            <article
              key={sheet.id}
              className="bg-primary rounded-2xl border border-border-primary p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-brand-light flex items-center justify-center">
                  <FileText size={20} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-text-primary truncate">{sheet.name}</h3>
                  <p className="text-secondary mt-1">
                    {sheet.expenses} expenses
                    <span className="ml-4 font-semibold text-primary">
                      ₱{sheet.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </p>
                  <p className="text-sm text-tertiary mt-1">Last modified: {sheet.updated}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

export default withAuth(PersonalPage)
