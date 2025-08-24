'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus, FileText, LogOut } from 'lucide-react'
import Button from '../components/ui/Button'


interface ExpenseSheet {
  id: string
  name: string
  created_at: string
  expense_count?: number
  total_amount?: number
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [sheets, setSheets] = useState<ExpenseSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewSheet, setShowNewSheet] = useState(false)
  const [newSheetName, setNewSheetName] = useState('')
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
          expenses (
            id,
            amount
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Process the data to include counts and totals
      const processedSheets = data?.map(sheet => ({
        id: sheet.id,
        name: sheet.name,
        created_at: sheet.created_at,
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

  const createSheet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newSheetName.trim()) return

    try {
      const { data, error } = await supabase
        .from('expense_sheets')
        .insert({
          user_id: user.id,
          name: newSheetName.trim()
        })
        .select()

      if (error) throw error

      setNewSheetName('')
      setShowNewSheet(false)
      fetchSheets() // Refresh the list
    } catch (error) {
      console.error('Error creating sheet:', error)
    }
  }

  const openSheet = (sheetId: string) => {
    router.push(`/input?sheet=${sheetId}`)
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
    <div className="min-h-screen bg-bg-tertiary">
      {/* Header */}
      {/* <div className="bg-bg-primary shadow-sm border-b border-border-primary">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">My Sheets</h1>
          <button
            onClick={signOut}
            className="p-2 text-icon-secondary hover:text-text-primary transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div> */}

      <div className="max-w-lg mx-auto p-4">
        {/* Create New Sheet Button */}
        <button
          onClick={() => setShowNewSheet(true)}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 mb-6 shadow-amber"
        >
          <Plus size={20} />
          New Sheet
        </button>

        {/* New Sheet Form */}
        {showNewSheet && (
          <div className="bg-bg-primary rounded-lg shadow-md border border-border-primary p-4 mb-6">
            <form onSubmit={createSheet} className="space-y-4">
              <input
                type="text"
                placeholder="Sheet name (e.g., Personal, Business)"
                value={newSheetName}
                onChange={(e) => setNewSheetName(e.target.value)}
                className="form-input w-full px-4 py-3 rounded-lg"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 rounded-lg font-medium transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewSheet(false)
                    setNewSheetName('')
                  }}
                  className="btn-outline flex-1 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sheets List */}
        <div className="space-y-3">
          {sheets.length === 0 ? (
            <div className="bg-bg-primary rounded-lg shadow-sm border border-border-primary p-8 text-center">
              <FileText size={48} className="mx-auto text-icon-disabled mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No sheets yet</h3>
              <p className="text-text-secondary">Create your first expense sheet to get started</p>
            </div>
          ) : (
            sheets.map((sheet) => (
              <div
                key={sheet.id}
                onClick={() => openSheet(sheet.id)}
                className="interactive bg-bg-primary rounded-lg shadow-sm border border-border-primary p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary">{sheet.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                      <span>{sheet.expense_count} expenses</span>
                      <span className="text-success font-semibold">₱{sheet.total_amount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <p className="text-xs text-text-tertiary mt-1">
                      Created {new Date(sheet.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-icon-secondary" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        {sheets.length > 0 && (
          <div className="bg-bg-primary rounded-lg shadow-sm border border-border-primary p-4 mt-6">
            <h3 className="font-medium text-text-primary mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-bg-secondary rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {sheets.length}
                </div>
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
    </div>
  )
}