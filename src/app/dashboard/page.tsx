'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus, FileText } from 'lucide-react'
import Button from '../components/ui/Button'
import SearchInput from '../components/ui/SearchInput'
import SheetCard from '../components/ui/SheetCard'
import CreateSheetModal from '../components/ui/CreateSheetModal'
import EditSheetModal from '../components/ui/EditSheetModal'

interface ExpenseSheet {
  id: string
  name: string
  created_at: string
  expense_count?: number
  total_amount?: number
  is_pinned?: boolean
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [sheets, setSheets] = useState<ExpenseSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSheet, setEditingSheet] = useState<ExpenseSheet | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/auth')
      return
    }

    fetchSheets()
  }, [user, authLoading, router])

  const fetchSheets = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('expense_sheets')
        .select(`
          id,
          name,
          created_at,
          is_pinned,
          expenses (
            id,
            amount
          )
        `)
        .eq('user_id', user.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      // Process the data to include counts and totals
      const processedSheets = data?.map(sheet => ({
        id: sheet.id,
        name: sheet.name,
        created_at: sheet.created_at,
        is_pinned: sheet.is_pinned || false,
        expense_count: sheet.expenses?.length || 0,
        total_amount: sheet.expenses?.reduce((sum: number, expense: any) =>
          sum + parseFloat(expense.amount || 0), 0) || 0
      })) || []

      setSheets(processedSheets)
    } catch (error) {
      console.error('Error fetching sheets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSheet = async (name: string) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('expense_sheets')
      .insert({
        user_id: user.id,
        name: name,
        is_pinned: false
      })
      .select()

    if (error) throw error
    fetchSheets()
  }

  const updateSheet = async (sheetId: string, name: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('expense_sheets')
      .update({ name })
      .eq('id', sheetId)
      .eq('user_id', user.id)

    if (error) throw error
    fetchSheets()
  }

  const deleteSheet = async (sheetId: string) => {
    if (!user) throw new Error('User not authenticated')

    // First delete all expenses in the sheet
    await supabase
      .from('expenses')
      .delete()
      .eq('sheet_id', sheetId)
      .eq('user_id', user.id)

    // Then delete the sheet
    const { error } = await supabase
      .from('expense_sheets')
      .delete()
      .eq('id', sheetId)
      .eq('user_id', user.id)

    if (error) throw error
    fetchSheets() // Refresh the list
  }

  const togglePinSheet = async (sheetId: string, currentPinned: boolean) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('expense_sheets')
        .update({ is_pinned: !currentPinned })
        .eq('id', sheetId)
        .eq('user_id', user.id)

      if (error) throw error
      fetchSheets() // Refresh the list
    } catch (error) {
      console.error('Error toggling pin:', error)
    }
  }

  const openSheet = (sheetId: string) => {
    router.push(`/sheet/${sheetId}`)
  }

  const handleEditSheet = (sheet: ExpenseSheet) => {
    setEditingSheet(sheet)
    setShowEditModal(true)
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
    {/* Sidebar TODO: make this a component and make the height sticky*/}
    <aside className="hidden md:flex flex-col w-60 bg-bg-secondary border-r border-border-primary p-4">
      <h2 className="text-xl font-bold text-primary mb-6">TapTrack</h2>
      <nav className="flex-1 space-y-2">
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg-tertiary font-medium text-text-primary">
          Personal
        </button>
        <button
          disabled
          className="w-full text-left px-3 py-2 rounded-lg font-medium text-text-secondary"
        >
          Shared (Coming soon)
        </button>
      </nav>
      <div className="mt-auto space-y-2">
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg-tertiary text-text-primary">
          Profile
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg-tertiary text-text-primary">
          Logout
        </button>
      </div>
    </aside>

    {/* Main Content + Quick Stats */}
    <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Center content (Sheets) */}
      <div className="md:col-span-2">
        {/* Search + Button */}
        <div className="flex items-center justify-between mb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search sheet"
            className="w-full max-w-xs"
          />
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="secondary"
          >
            <Plus size={16}/>
            Add new sheet
          </Button>
        </div>

        <h2 className="text-lg font-semibold text-text-primary mb-3">
          My Sheets {searchQuery && `(${getFilteredSheets().length} found)`}
        </h2>

        {/* Sheets List */}
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

      {/* Quick Stats */}
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
                  ₱{sheets.reduce((sum, sheet) => sum + (sheet.total_amount || 0), 0).toFixed(2)}
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