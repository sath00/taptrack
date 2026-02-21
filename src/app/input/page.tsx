'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { expensesApi } from '@/lib/api/expenses'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { ExpenseSheet, Expense } from '@/lib/api/types'
import { Button, Input, Select } from '../components/ui'

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
      router.push('/signin')
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
      const data = await expensesApi.getSheets()
      setSheets(data)

      // If no sheet selected and we have sheets, select the first one
      if (!selectedSheetId && data.length > 0) {
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
      const data = await expensesApi.getRecentExpenses(sheetId, 5)
      setRecentExpenses(data)
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
      await expensesApi.createExpense({
        sheet: parseInt(selectedSheetId),
        name: name.trim(),
        category,
        amount: parseFloat(amount),
        status,
        expense_date: new Date().toISOString().split('T')[0]
      })

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

    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Error: Failed to add expense')
      }
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
      <div className="min-h-screen bg-disabled flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (sheets.length === 0) {
    return (
      <div className="min-h-screen bg-disabled flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-medium text-primary mb-4">No Sheets Available</h2>
          <p className="text-secondary mb-6">Create a sheet first to start adding expenses</p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-disabled">
      {/* Header */}
      <div className="bg-primary shadow-sm border-b border-border-primary">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            size="sm"
            className="!p-2"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-primary">Quick Add</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Sheet Selector */}
        {sheets.length > 1 && (
          <div className="mb-6">
            <Select
              label="Sheet"
              value={selectedSheetId}
              onChange={(value) => {
                setSelectedSheetId(value)
                fetchRecentExpenses(value)
              }}
              className="py-3"
            >
              {sheets.map((sheet) => (
                <option key={sheet.id} value={sheet.id}>
                  {sheet.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Quick Input Form */}
        <div className="bg-primary rounded-lg shadow-sm border border-border-primary p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              inputRef={nameInputRef}
              type="text"
              placeholder="Expense name (e.g., lunch, tricycle fare)"
              value={name}
              onChange={setName}
              className="text-lg"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                value={category}
                onChange={setCategory}
                className="py-3"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount"
                value={amount}
                onChange={setAmount}
                className="text-lg"
                required
              />
            </div>

            <Select
              value={status}
              onChange={setStatus}
              className="py-3"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </Select>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              className="py-4 text-lg"
            >
              Add Expense
            </Button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message.includes('✓')
                ? 'bg-success/15 text-success'
                : 'bg-error/15 text-error'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        {recentExpenses.length > 0 && (
          <div className="bg-primary rounded-lg shadow-sm border border-border-primary p-4">
            <h3 className="font-medium text-primary mb-3">Recent Expenses</h3>
            <div className="space-y-2">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  onClick={() => handleQuickAdd(expense)}
                  className="flex items-center justify-between p-3 bg-tertiary rounded-lg cursor-pointer hover:bg-hover transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-primary">{expense.name}</div>
                    <div className="text-sm text-secondary">
                      {expense.category} • {expense.status}
                    </div>
                  </div>
                  <div className="text-lg font-medium text-primary">
                    ₱{expense.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-tertiary mt-3 text-center">
              Tap any expense to quickly add it again
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
