import { BaseApiClient } from './base'
import {
  ExpenseSheet,
  SheetStats,
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  CategoryExpense
} from './types'

export class ExpensesApiClient extends BaseApiClient {
  // Expense Sheet endpoints
  async getSheets(search = ''): Promise<ExpenseSheet[]> {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return this.request<ExpenseSheet[]>(`/sheets/${params}`)
  }

  async getSheet(id: string): Promise<ExpenseSheet> {
    return this.request<ExpenseSheet>(`/sheets/${id}/`)
  }

  async createSheet(name: string): Promise<ExpenseSheet> {
    return this.request<ExpenseSheet>('/sheets/', {
      method: 'POST',
      body: JSON.stringify({ name, is_pinned: false })
    })
  }

  async updateSheet(id: string, name: string): Promise<ExpenseSheet> {
    return this.request<ExpenseSheet>(`/sheets/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ name })
    })
  }

  async deleteSheet(id: string): Promise<void> {
    return this.request(`/sheets/${id}/`, {
      method: 'DELETE'
    })
  }

  async togglePinSheet(id: string): Promise<ExpenseSheet> {
    return this.request<ExpenseSheet>(`/sheets/${id}/toggle_pin/`, {
      method: 'POST'
    })
  }

  async getSheetStats(): Promise<SheetStats> {
    return this.request<SheetStats>('/sheets/stats/')
  }

  // Expense endpoints
  async getExpenses(sheetId: string | null = null): Promise<Expense[]> {
    const params = sheetId ? `?sheet_id=${sheetId}` : ''
    return this.request<Expense[]>(`/expenses/${params}`)
  }

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    return this.request<Expense>('/expenses/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateExpense(id: string, data: UpdateExpenseData): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  async deleteExpense(id: string): Promise<void> {
    return this.request(`/expenses/${id}/`, {
      method: 'DELETE'
    })
  }

  async getRecentExpenses(sheetId: string, limit = 5): Promise<Expense[]> {
    return this.request<Expense[]>(`/expenses/recent/?sheet_id=${sheetId}&limit=${limit}`)
  }

  async getExpensesByCategory(sheetId: string | null = null): Promise<CategoryExpense[]> {
    const params = sheetId ? `?sheet_id=${sheetId}` : ''
    return this.request<CategoryExpense[]>(`/expenses/by_category/${params}`)
  }
}

export const expensesApi = new ExpensesApiClient()