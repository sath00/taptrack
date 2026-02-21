'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Plus, FileText } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import SheetCard from '../components/ui/SheetCard'
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
  const togglePinSheet = async (sheetId: string, currentPinned: boolean) => {
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
    <div className="min-h-screen bg-bg-tertiary flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-bg-secondary border-r border-border-primary p-4">
        <h2 className="text-xl font-bold text-primary mb-6">TapTrack</h2>
        <nav className="flex-1 space-y-2">
          <Button
            variant="ghost"
            fullWidth
            className="!justify-start !px-3 !py-2 font-medium text-text-primary"
          >
            Personal
          </Button>
          <Button
            disabled
            variant="ghost"
            fullWidth
            className="!justify-start !px-3 !py-2 font-medium text-text-secondary"
          >
            Shared (Coming soon)
          </Button>
        </nav>
        <div className="mt-auto space-y-2">
          <Button
            variant="ghost"
            fullWidth
            className="!justify-start !px-3 !py-2 text-text-primary"
          >
            Profile
          </Button>
          <Button
            onClick={handleLogout}
            loading={isLoggingOut}
            variant="ghost"
            fullWidth
            className="!justify-start !px-3 !py-2 text-text-primary"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="md:col-span-2">
          {/* Search + Button */}
          <div className="flex items-center justify-between mb-4">
            <Input
              variant="search"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search sheet"
              size="sm"
            />
            <Button onClick={() => setShowCreateModal(true)} variant="primary">
              <Plus size={16} />
              Add new sheet
            </Button>
          </div>

          <h2 className="text-lg font-semibold text-text-primary mb-3">
            My Sheets {searchQuery && `(${getFilteredSheets().length} found)`}
          </h2>

          {/* Sheets list */}
          <div className="space-y-4">
            {getFilteredSheets().length === 0 ? (
              <div className="bg-bg-primary rounded-lg shadow-sm border border-border-primary p-8 text-center">
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
                    variant="ghost"
                    className="mt-3"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              getFilteredSheets().map((sheet) => (
                <SheetCard
                  key={sheet.id}
                  id={sheet.id}
                  name={sheet.name}
                  expenseCount={sheet.expense_count || 0}
                  totalAmount={sheet.total_amount || 0}
                  createdAt={sheet.created_at}
                  isPinned={sheet.is_pinned || false}
                  onClick={() => openSheet(sheet.id)}
                  onEdit={() => handleEditSheet(sheet)}
                  onTogglePin={() => togglePinSheet(sheet.id, sheet.is_pinned || false)}
                />
              ))
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div>
          {sheets.length > 0 && (
            <div className="bg-bg-primary rounded-lg shadow-sm border border-border-primary p-4">
              <h3 className="font-medium text-text-primary mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary">{sheets.length}</div>
                  <div className="text-sm text-text-secondary">Total Sheets</div>
                </div>
                <div className="p-3 bg-bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    ₱{sheets.reduce((sum, s) => sum + (s.total_amount || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-text-secondary">Total Expenses</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

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
    </div>
  )
}

export default withAuth(Dashboard)
