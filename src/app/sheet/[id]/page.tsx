'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { expensesApi } from '@/lib/api/expenses'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Download, Edit2, Trash2 } from 'lucide-react'
import type { ExpenseSheet, Expense } from '@/lib/api/types'

interface CategoryTotal {
  category: string
  total: number
  count: number
}

export default function SheetDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const sheetId = params.id as string

  const [sheet, setSheet] = useState<ExpenseSheet | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date')
  const [editingExpense, setEditingExpense] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/signin')
      return
    }

    fetchSheetData()
  }, [user, authLoading, router, sheetId])

  const fetchSheetData = async () => {
    if (!user || !sheetId) return

    try {
      // Fetch sheet info
      const sheetData = await expensesApi.getSheet(sheetId)
      setSheet(sheetData)

      // Fetch expenses
      const expensesData = await expensesApi.getExpenses(sheetId)
      setExpenses(expensesData)

    } catch (error) {
      console.error('Error fetching sheet data:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const deleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      await expensesApi.deleteExpense(expenseId)
      // Remove from local state
      setExpenses(expenses.filter(e => e.id !== expenseId))
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Failed to delete expense')
    }
  }

  const getFilteredExpenses = () => {
    let filtered = expenses

    if (filter !== 'all') {
      filtered = filtered.filter(expense => expense.category === filter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount
        case 'category':
          return a.category.localeCompare(b.category)
        case 'date':
        default:
          return new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime()
      }
    })

    return filtered
  }

  const getCategoryTotals = (): CategoryTotal[] => {
    const totals = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { total: 0, count: 0 }
      }
      acc[expense.category].total += expense.amount
      acc[expense.category].count += 1
      return acc
    }, {} as Record<string, { total: number; count: number }>)

    return Object.entries(totals)
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count
      }))
      .sort((a, b) => b.total - a.total)
  }

  const getTotalAmount = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'To be paid':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pending reimbursement':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const exportToCSV = () => {
    if (expenses.length === 0) return

    const headers = ['Date', 'Name', 'Category', 'Amount', 'Status']
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => [
        expense.expense_date,
        `"${expense.name}"`,
        expense.category,
        expense.amount,
        expense.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${sheet?.name || 'expenses'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const filteredExpenses = getFilteredExpenses()
  const categoryTotals = getCategoryTotals()
  const uniqueCategories = Array.from(new Set(expenses.map(e => e.category)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{sheet?.name}</h1>
                <p className="text-sm text-gray-600">
                  {expenses.length} expenses • ₱{getTotalAmount().toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Export to CSV"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => router.push(`/input?sheet=${sheetId}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
            <p className="text-2xl font-bold text-gray-900">₱{getTotalAmount().toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-600">Number of Items</h3>
            <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-600">Top Category</h3>
            <p className="text-lg font-bold text-gray-900">
              {categoryTotals.length > 0 ? categoryTotals[0].category : 'None'}
            </p>
            <p className="text-sm text-gray-600">
              {categoryTotals.length > 0 ? `₱${categoryTotals[0].total.toFixed(2)}` : ''}
            </p>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="date">Date (Newest first)</option>
                <option value="amount">Amount (Highest first)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryTotals.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Category Breakdown</h3>
            <div className="space-y-2">
              {categoryTotals.map((categoryTotal) => (
                <div key={categoryTotal.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">{categoryTotal.category}</span>
                    <span className="text-sm text-gray-500">({categoryTotal.count} items)</span>
                  </div>
                  <span className="font-medium text-gray-900">₱{categoryTotal.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h3 className="font-medium text-gray-900">
              Expenses {filter !== 'all' && `• ${filter}`}
              <span className="text-sm text-gray-500 ml-2">({filteredExpenses.length} items)</span>
            </h3>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No expenses found</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-blue-500 hover:text-blue-600"
                >
                  Show all expenses
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{expense.name}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{expense.category}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₱{expense.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingExpense(expense.id)}
                            className="p-1 text-gray-400 hover:text-blue-500"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
