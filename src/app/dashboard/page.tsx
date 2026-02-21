'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Plus, FileText, Pin, Edit2 } from 'lucide-react'
import Button from '../components/ui/Button'
import AppShell from '../components/layout/AppShell'
import CreateSheetModal from '../components/ui/CreateSheetModal'
import EditSheetModal from '../components/ui/EditSheetModal'
import { expensesApi } from '@/lib/api/expenses'
import { withAuth } from '../components/auth/withAuth'

interface ExpenseSheet {
  id: string
  name: string
  created_at: string
  expense_count?: number
  total_amount?: number
  is_pinned?: boolean
}

function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [sheets, setSheets] = useState<ExpenseSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSheet, setEditingSheet] = useState<ExpenseSheet | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/signin')
      return
    }
    fetchSheets()
  }, [user, authLoading, router])

  // ✅ Fetch sheets using your new API
  const fetchSheets = async () => {
    if (!user) return
    try {
      const data = await expensesApi.getSheets(searchQuery)
      setSheets(data)
    } catch (error) {
      console.error('Error fetching sheets:', error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Create sheet
  const createSheet = async (name: string) => {
    if (!user) throw new Error('User not authenticated')
    try {
      await expensesApi.createSheet(name)
      fetchSheets()
    } catch (error) {
      console.error('Error creating sheet:', error)
    }
  }

  // ✅ Update sheet
  const updateSheet = async (sheetId: string, name: string) => {
    try {
      await expensesApi.updateSheet(sheetId, name)
      fetchSheets()
    } catch (error) {
      console.error('Error updating sheet:', error)
    }
  }

  // ✅ Delete sheet
  const deleteSheet = async (sheetId: string) => {
    try {
      await expensesApi.deleteSheet(sheetId)
      fetchSheets()
    } catch (error) {
      console.error('Error deleting sheet:', error)
    }
  }

  // ✅ Toggle pin
  const togglePinSheet = async (sheetId: string) => {
    try {
      await expensesApi.togglePinSheet(sheetId)
      fetchSheets()
    } catch (error) {
      console.error('Error toggling pin:', error)
    }
  }

  const openSheet = (sheetId: string) => router.push(`/sheet/${sheetId}`)
  const handleEditSheet = (sheet: ExpenseSheet) => {
    setEditingSheet(sheet)
    setShowEditModal(true)
  }
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getFilteredSheets = () => {
    if (!searchQuery.trim()) return sheets
    return sheets.filter(sheet =>
      sheet.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredSheets = getFilteredSheets()
  const totalSheets = sheets.length
  const totalExpenses = sheets.reduce((sum, sheet) => sum + (sheet.total_amount || 0), 0)
  const totalItems = sheets.reduce((sum, sheet) => sum + (sheet.expense_count || 0), 0)
  const totalPinned = sheets.filter((sheet) => !!sheet.is_pinned).length
  const recentPersonalSheets = filteredSheets.slice(0, 4)
  const recentSharedSheets = [
    { id: 'shared-1', name: 'Team Groceries', updated: 'Feb 19, 2026' },
    { id: 'shared-2', name: 'Apartment Utilities', updated: 'Feb 17, 2026' },
  ]

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-bg-tertiary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AppShell
      title="Dashboard"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onAddSheet={() => setShowCreateModal(true)}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
    >
      <div className="p-4 sm:p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-primary border border-border-primary rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold tracking-wide text-secondary uppercase">Total Sheets</p>
              <p className="text-4xl font-bold mt-2 text-text-primary">{totalSheets}</p>
            </div>
            <div className="bg-primary border border-border-primary rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold tracking-wide text-secondary uppercase">Total Expenses</p>
              <p className="text-4xl font-bold mt-2 text-primary">₱{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-primary border border-border-primary rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold tracking-wide text-secondary uppercase">Total Items</p>
              <p className="text-4xl font-bold mt-2 text-text-primary">{totalItems}</p>
            </div>
            <div className="bg-primary border border-border-primary rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold tracking-wide text-secondary uppercase">Pinned</p>
              <p className="text-4xl font-bold mt-2 text-text-primary">{totalPinned}</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-text-primary">Recent Personal Sheets</h2>

          {/* Sheets list */}
          <div className="space-y-4">
            {recentPersonalSheets.length === 0 ? (
              <div className="bg-primary rounded-2xl border border-border-primary p-8 text-center">
                <FileText size={48} className="mx-auto text-icon-disabled mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {searchQuery ? 'No sheets found' : 'No sheets yet'}
                </h3>
                <p className="text-text-secondary">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Create your first expense sheet to get started'}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery('')}
                    variant="text"
                    className="mt-3"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              recentPersonalSheets.map((sheet) => (
                <article
                  key={sheet.id}
                  className={`bg-primary rounded-2xl border p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                    sheet.is_pinned ? 'border-brand' : 'border-border-primary'
                  }`}
                  onClick={() => openSheet(sheet.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 sm:gap-4 min-w-0">
                      <div className="shrink-0 w-11 h-11 rounded-2xl bg-brand-light flex items-center justify-center">
                        <FileText size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-2xl font-semibold text-text-primary truncate flex items-center gap-2">
                          {sheet.name}
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        </h3>
                        <p className="text-xl text-secondary">
                          {sheet.expense_count || 0} expenses
                          <span className="ml-4 font-semibold text-primary">
                            ₱{(sheet.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </p>
                        <p className="text-sm text-tertiary mt-1">
                          Last modified: {new Date(sheet.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant={sheet.is_pinned ? 'text' : 'text'}
                        size="sm"
                        aria-label="Toggle pin"
                        className={`!p-2 !min-w-0 ${sheet.is_pinned ? '!text-primary' : '!text-secondary hover:!text-primary'}`}
                        onClick={() => togglePinSheet(sheet.id)}
                      >
                        <Pin size={16} className={sheet.is_pinned ? 'fill-current' : ''} />
                      </Button>
                      <Button
                        variant="text"
                        size="sm"
                        aria-label="Edit sheet"
                        className="!p-2 !min-w-0"
                        onClick={() => handleEditSheet(sheet)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="text"
                        size="sm"
                        aria-label="Quick add expense"
                        className="!p-2 !min-w-0"
                        onClick={() => router.push(`/input?sheet=${sheet.id}`)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <h2 className="text-2xl font-semibold text-text-primary">Recent Shared Sheets</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {recentSharedSheets.map((sheet) => (
              <article
                key={sheet.id}
                className="bg-primary rounded-2xl border border-border-primary p-4 sm:p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-11 h-11 rounded-2xl bg-brand-light flex items-center justify-center">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-text-primary truncate">{sheet.name}</h3>
                    <p className="text-sm text-secondary mt-1">Shared workspace sheet</p>
                    <p className="text-sm text-tertiary mt-1">Last modified: {sheet.updated}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
      </div>

      {/* Modals */}
      <CreateSheetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createSheet}
      />
      <EditSheetModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingSheet(null)
        }}
        onSubmit={(name) => updateSheet(editingSheet!.id, name)}
        onDelete={() => deleteSheet(editingSheet!.id)}
        currentName={editingSheet?.name || ''}
      />
    </AppShell>
  )
}

export default withAuth(Dashboard)
