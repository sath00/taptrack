'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Plus, Check, X } from 'lucide-react'

interface ExpenseSheet {
  id: string
  name: string
}

interface Expense {
  id: string
  name: string
  category: string
  amount: number
  status: string
  expense_date: string
  created_at: string
}

const CATEGORIES = [
  'Food', 'Transportation', 'Pets', 'Skincare', 'Shopping',
  'Bills', 'Entertainment', 'Health', 'Other'
]

const STATUSES = ['Paid', 'To be paid', 'Pending reimbursement']

export default function InputPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('Paid')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Sheet and expenses state
  const [sheets, setSheets] = useState<ExpenseSheet[]>([])
  const [selectedSheetId, setSelectedSheetId] = useState<string>('')
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth')
      return
    }

    fetchSheets()
  }, [user, authLoading, router])

  useEffect(() => {
    // Get sheet ID from URL params
    const sheetId = searchParams.get('sheet')
    if (sheetId) {
      setSelectedSheetId(sheetId)
      fetchRecentExpenses(sheetId)
    }
  }, [searchParams])

  useEffect(() => {
    // Auto-focus name input
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [])

  const fetchSheets = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('expense_sheets')
        .select('id, name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSheets(data || [])

      // If no sheet selected and we have sheets, select the first one
      if (!selectedSheetId && data && data.length > 0) {
        setSelectedSheetId(data[0].id)
        fetchRecentExpenses(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching sheets:', error)
    }
  }

  const fetchRecentExpenses = async (sheetId: string) => {
    if (!user || !sheetId) return

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('sheet_id', sheetId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentExpenses(data || [])
    } catch (error) {
      console.error('Error fetching recent expenses:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedSheetId || !name.trim() || !amount) return

    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          sheet_id: selectedSheetId,
          name: name.trim(),
          category,
          amount: parseFloat(amount),
          status,
          expense_date: new Date().toISOString().split('T')[0]
        })
        .select()

      if (error) throw error

      // Clear form
      setName('')
      setAmount('')
      setMessage('✓ Expense added!')

      // Refresh recent expenses
      fetchRecentExpenses(selectedSheetId)

      // Auto-focus back to name input
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus()
        }
      }, 100)

      // Clear success message after 2 seconds
      setTimeout(() => setMessage(''), 2000)

    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (expense: Expense) => {
    setName(expense.name)
    setCategory(expense.category)
    setStatus(expense.status)
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (sheets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">No Sheets Available</h2>
          <p className="text-gray-600 mb-6">Create a sheet first to start adding expenses</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Quick Add</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Sheet Selector */}
        {sheets.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sheet
            </label>
            <select
              value={selectedSheetId}
              onChange={(e) => {
                setSelectedSheetId(e.target.value)
                fetchRecentExpenses(e.target.value)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {sheets.map((sheet) => (
                <option key={sheet.id} value={sheet.id}>
                  {sheet.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Input Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                ref={nameInputRef}
                type="text"
                placeholder="Expense name (e.g., lunch, tricycle fare)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {STATUSES.map((stat) => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message.includes('✓')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        {recentExpenses.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-medium text-gray-900 mb-3">Recent Expenses</h3>
            <div className="space-y-2">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  onClick={() => handleQuickAdd(expense)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{expense.name}</div>
                    <div className="text-sm text-gray-600">
                      {expense.category} • {expense.status}
                    </div>
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    ₱{expense.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Tap any expense to quickly add it again
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
